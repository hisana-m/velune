
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { clearCart } from "../../redux/cartSlice";
import { formatPrice } from "../../data/products";
import { Banknote, CreditCard } from "lucide-react";

const API_URL = "http://localhost:3000";

export default function Checkout() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      setError("Your shopping bag is empty.");
      return;
    }

    setLoading(true);
    setError("");

    // Store updated products so we can restore stock if an error occurs.
    const updatedProducts = [];

    let savedOrder = null;

    try {
      // STEP 1: Get the latest products from JSON Server.
      const productsResponse = await fetch(`${API_URL}/products`);

      if (!productsResponse.ok) {
        throw new Error("Unable to check product availability.");
      }

      const latestProducts = await productsResponse.json();

      // STEP 2: Validate stock for every cart item.
      const productsToUpdate = cartItems.map((cartItem) => {
        const latestProduct = latestProducts.find(
          (product) =>
            String(product.id) === String(cartItem.id)
        );

        if (!latestProduct) {
          throw new Error(
            `${cartItem.name} is no longer available.`
          );
        }

        const availableStock = Number(latestProduct.stock ?? 0);
        const requestedQuantity = Number(cartItem.quantity);

        if (availableStock <= 0) {
          throw new Error(
            `${cartItem.name} is out of stock. Please remove it from your bag.`
          );
        }

        if (requestedQuantity > availableStock) {
          throw new Error(
            `Only ${availableStock} unit(s) of ${cartItem.name} are available. Please update your cart quantity.`
          );
        }

        return {
          product: latestProduct,
          oldStock: availableStock,
          newStock: availableStock - requestedQuantity,
        };
      });

      // STEP 3: Reduce stock in JSON Server.
      for (const item of productsToUpdate) {
        const response = await fetch(
          `${API_URL}/products/${encodeURIComponent(item.product.id)}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              stock: item.newStock,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Unable to update stock for ${item.product.name}.`
          );
        }

        updatedProducts.push(item);
      }

      // STEP 4: Prepare the order.
      const order = {
        customer: formData,
        products: cartItems.map((cartItem) => {
          const updatedProduct = productsToUpdate.find(
            (item) =>
              String(item.product.id) === String(cartItem.id)
          );

          return {
            ...cartItem,
            stock: updatedProduct.newStock,
          };
        }),
        paymentMethod,
        subtotal,
        shipping: 0,
        total: subtotal,
        status: "Pending",
        paymentStatus:
          paymentMethod === "Cash on Delivery"
            ? "Pending"
            : "Awaiting Online Payment",
        createdAt: new Date().toISOString(),
      };

      // STEP 5: Save the order.
      const orderResponse = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      if (!orderResponse.ok) {
        throw new Error("Unable to place your order.");
      }

      savedOrder = await orderResponse.json();

      // STEP 6: Success.
      setOrderId(savedOrder.id);
      setOrderPlaced(true);
      dispatch(clearCart());

    } catch (err) {
      // Restore stock if stock was reduced but order placement failed.
      if (!savedOrder && updatedProducts.length > 0) {
        for (const item of updatedProducts) {
          try {
            await fetch(
              `${API_URL}/products/${encodeURIComponent(item.product.id)}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  stock: item.oldStock,
                }),
              }
            );
          } catch (rollbackError) {
            console.error(
              "Unable to restore product stock:",
              rollbackError
            );
          }
        }
      }

      setError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ORDER SUCCESS
  if (orderPlaced) {
    return (
      <main className="min-h-[75vh] bg-[#F5E8D5] flex items-center justify-center px-5 py-16 text-[#491225]">
        <div className="max-w-xl w-full text-center">
          <div className="w-16 h-16 rounded-full border border-[#491225] flex items-center justify-center mx-auto mb-7 text-3xl">
            ✓
          </div>

          <p className="text-xs tracking-[3px] uppercase mb-4">
            VÉLUNE
          </p>

          <h1 className="font-serif text-4xl md:text-5xl mb-5">
            Thank You for Your Order
          </h1>

          <p className="text-sm text-[#806E6D] leading-7 mb-5">
            Your order has been placed successfully.
            Thank you for choosing VÉLUNE.
          </p>

          <p className="text-sm mb-3">
            Order Number: <strong>#{orderId}</strong>
          </p>

          <p className="text-sm mb-8">
            Payment Method: <strong>{paymentMethod}</strong>
          </p>

          <Link
            to="/collections"
            className="inline-block bg-[#491225] text-[#F5E8D5] px-10 py-4 text-xs tracking-[2px] hover:bg-[#350B19] transition"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </main>
    );
  }

  // EMPTY CART
  if (cartItems.length === 0) {
    return (
      <main className="min-h-[70vh] bg-[#F5E8D5] flex flex-col items-center justify-center px-5 text-center">
        <h1 className="font-serif text-3xl text-[#491225]">
          Your Bag is Empty
        </h1>

        <p className="text-sm text-[#806E6D] mt-3">
          Add your favourite jewellery before checkout.
        </p>

        <Link
          to="/collections"
          className="mt-7 bg-[#491225] text-[#F5E8D5] px-8 py-4 text-xs tracking-[2px]"
        >
          EXPLORE COLLECTION
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5E8D5] text-[#491225] px-5 md:px-12 lg:px-20 py-16">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs tracking-[3px] uppercase mb-3">
          VÉLUNE / Checkout
        </p>

        <h1 className="font-serif text-4xl md:text-5xl mb-12">
          Complete Your Order
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* DELIVERY INFORMATION */}
            <section className="lg:col-span-2">
              <h2 className="font-serif text-2xl mb-7">
                Delivery Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { name: "name", label: "Full Name", type: "text" },
                  { name: "email", label: "Email Address", type: "email" },
                  { name: "phone", label: "Phone Number", type: "tel" },
                  { name: "city", label: "City", type: "text" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-xs tracking-wider mb-2">
                      {field.label}
                    </label>

                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border border-[#491225]/30 px-4 py-3 outline-none focus:border-[#491225]"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <label className="block text-xs tracking-wider mb-2">
                  Delivery Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full bg-transparent border border-[#491225]/30 px-4 py-3 outline-none focus:border-[#491225]"
                />
              </div>

              <div className="mt-5">
                <label className="block text-xs tracking-wider mb-2">
                  Country
                </label>

                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border border-[#491225]/30 px-4 py-3 outline-none focus:border-[#491225]"
                />
              </div>

              {/* PAYMENT METHODS */}
              <div className="border-t border-[#491225]/20 mt-10 pt-8">
                <h2 className="font-serif text-2xl mb-3">
                  Payment Method
                </h2>

                <p className="text-sm text-[#806E6D] mb-6">
                  Choose your preferred payment method.
                </p>

                <div className="space-y-4">

                  {/* CASH ON DELIVERY */}
                  <label
                    className={`flex items-center justify-between gap-4 border p-5 cursor-pointer transition ${
                      paymentMethod === "Cash on Delivery"
                        ? "border-[#491225] bg-white/40"
                        : "border-[#491225]/30"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="payment"
                        value="Cash on Delivery"
                        checked={paymentMethod === "Cash on Delivery"}
                        onChange={(e) =>
                          setPaymentMethod(e.target.value)
                        }
                        className="accent-[#491225] w-4 h-4"
                      />

                      <div>
                        <p className="text-sm font-medium">
                          Cash on Delivery
                        </p>

                        <p className="text-xs text-[#806E6D] mt-1">
                          Pay when your order arrives.
                        </p>
                      </div>
                    </div>

                    <Banknote size={25} strokeWidth={1.4} />
                  </label>

                  {/* ONLINE PAYMENT */}
                  <label
                    className={`flex items-center justify-between gap-4 border p-5 cursor-pointer transition ${
                      paymentMethod === "Online Payment"
                        ? "border-[#491225] bg-white/40"
                        : "border-[#491225]/30"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="payment"
                        value="Online Payment"
                        checked={paymentMethod === "Online Payment"}
                        onChange={(e) =>
                          setPaymentMethod(e.target.value)
                        }
                        className="accent-[#491225] w-4 h-4"
                      />

                      <div>
                        <p className="text-sm font-medium">
                          Online Payment
                        </p>

                        <p className="text-xs text-[#806E6D] mt-1">
                          Pay securely using an online payment gateway.
                        </p>
                      </div>
                    </div>

                    <CreditCard size={25} strokeWidth={1.4} />
                  </label>
                </div>

                {paymentMethod === "Online Payment" && (
                  <p className="text-xs text-[#806E6D] mt-4 leading-6">
                    Online payment gateway integration is required
                    to complete your payment. No payment will be
                    collected by this demo checkout yet.
                  </p>
                )}
              </div>

              {/* ERROR MESSAGE */}
              {error && (
                <p className="text-red-700 text-sm mt-6">
                  {error}
                </p>
              )}

              {/* PLACE ORDER */}
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto mt-8 bg-[#491225] text-[#F5E8D5] px-12 py-4 text-xs tracking-[2px] hover:bg-[#350B19] transition disabled:opacity-50"
              >
                {loading ? "PROCESSING..." : "PLACE ORDER"}
              </button>
            </section>

            {/* ORDER SUMMARY */}
            <aside className="bg-white/40 p-6 md:p-8 h-fit">
              <h2 className="font-serif text-2xl mb-7">
                Order Summary
              </h2>

              <div className="space-y-5">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between gap-4 text-sm"
                  >
                    <div>
                      <p>{item.name}</p>

                      <p className="text-xs text-[#806E6D] mt-1">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <p className="whitespace-nowrap">
                      {formatPrice(
                        Number(item.price) * item.quantity
                      )}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#491225]/20 mt-7 pt-5 space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>

                <div className="border-t border-[#491225]/20 pt-5 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
}
