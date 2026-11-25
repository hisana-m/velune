
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
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState(
    "Cash on Delivery"
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.price) * Number(item.quantity),
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

    if (!user?.id) {
      setError("Please log in before placing your order.");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your shopping bag is empty.");
      return;
    }

    setLoading(true);
    setError("");

    const updatedProducts = [];
    let savedOrder = null;

    try {
      // STEP 1: Get latest product stock.
      const productsResponse = await fetch(`${API_URL}/products`);

      if (!productsResponse.ok) {
        throw new Error("Unable to check product availability.");
      }

      const latestProducts = await productsResponse.json();

      // STEP 2: Validate stock.
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

        if (
          requestedQuantity <= 0 ||
          requestedQuantity > availableStock
        ) {
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

      // STEP 3: Reduce stock.
      for (const item of productsToUpdate) {
        const response = await fetch(
          `${API_URL}/products/${encodeURIComponent(
            item.product.id
          )}`,
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

      // STEP 4: Prepare order with logged-in user ID.
      const order = {
        userId: user.id,

        customer: {
          ...formData,
        },

        products: cartItems.map((cartItem) => {
          const updatedProduct = productsToUpdate.find(
            (item) =>
              String(item.product.id) === String(cartItem.id)
          );

          return {
            ...cartItem,
            stock: updatedProduct.newStock,
            quantity: Number(cartItem.quantity),
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

      // STEP 5: Save order.
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

      // Clear cart after successful order.
      await dispatch(clearCart()).unwrap();

    } catch (err) {
      // Restore stock if order was not saved.
      if (!savedOrder && updatedProducts.length > 0) {
        for (const item of updatedProducts) {
          try {
            await fetch(
              `${API_URL}/products/${encodeURIComponent(
                item.product.id
              )}`,
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
      <main className="flex min-h-[75vh] items-center justify-center bg-[#F5E8D5] px-5 py-16 text-[#491225]">
        <div className="w-full max-w-xl text-center">
          <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full border border-[#491225] text-3xl">
            ✓
          </div>

          <p className="mb-4 text-xs uppercase tracking-[3px]">
            VÉLUNE
          </p>

          <h1 className="mb-5 font-serif text-4xl md:text-5xl">
            Thank You for Your Order
          </h1>

          <p className="mb-5 text-sm leading-7 text-[#806E6D]">
            Your order has been placed successfully.
            Thank you for choosing VÉLUNE.
          </p>

          <p className="mb-3 text-sm">
            Order Number: <strong>#{orderId}</strong>
          </p>

          <p className="mb-8 text-sm">
            Payment Method: <strong>{paymentMethod}</strong>
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to={`/orders/${orderId}`}
              className="inline-block bg-[#491225] px-8 py-4 text-xs tracking-[2px] text-[#F5E8D5] transition hover:bg-[#350B19]"
            >
              TRACK YOUR ORDER
            </Link>

            <Link
              to="/collections"
              className="inline-block border border-[#491225] px-8 py-4 text-xs tracking-[2px] transition hover:bg-[#491225] hover:text-[#F5E8D5]"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // EMPTY CART
  if (cartItems.length === 0) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#F5E8D5] px-5 text-center">
        <h1 className="font-serif text-3xl text-[#491225]">
          Your Bag is Empty
        </h1>

        <p className="mt-3 text-sm text-[#806E6D]">
          Add your favourite jewellery before checkout.
        </p>

        <Link
          to="/collections"
          className="mt-7 bg-[#491225] px-8 py-4 text-xs tracking-[2px] text-[#F5E8D5]"
        >
          EXPLORE COLLECTION
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5E8D5] px-5 py-16 text-[#491225] md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-xs uppercase tracking-[3px]">
          VÉLUNE / Checkout
        </p>

        <h1 className="mb-12 font-serif text-4xl md:text-5xl">
          Complete Your Order
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">

            {/* DELIVERY INFORMATION */}
            <section className="lg:col-span-2">
              <h2 className="mb-7 font-serif text-2xl">
                Delivery Information
              </h2>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {[
                  {
                    name: "name",
                    label: "Full Name",
                    type: "text",
                  },
                  {
                    name: "email",
                    label: "Email Address",
                    type: "email",
                  },
                  {
                    name: "phone",
                    label: "Phone Number",
                    type: "tel",
                  },
                  {
                    name: "city",
                    label: "City",
                    type: "text",
                  },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="mb-2 block text-xs tracking-wider">
                      {field.label}
                    </label>

                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required
                      className="w-full border border-[#491225]/30 bg-transparent px-4 py-3 outline-none focus:border-[#491225]"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-xs tracking-wider">
                  Delivery Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full border border-[#491225]/30 bg-transparent px-4 py-3 outline-none focus:border-[#491225]"
                />
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-xs tracking-wider">
                  Country
                </label>

                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full border border-[#491225]/30 bg-transparent px-4 py-3 outline-none focus:border-[#491225]"
                />
              </div>

              {/* PAYMENT METHODS */}
              <div className="mt-10 border-t border-[#491225]/20 pt-8">
                <h2 className="mb-3 font-serif text-2xl">
                  Payment Method
                </h2>

                <p className="mb-6 text-sm text-[#806E6D]">
                  Choose your preferred payment method.
                </p>

                <div className="space-y-4">

                  {/* CASH ON DELIVERY */}
                  <label
                    className={`flex cursor-pointer items-center justify-between gap-4 border p-5 transition ${
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
                        className="h-4 w-4 accent-[#491225]"
                      />

                      <div>
                        <p className="text-sm font-medium">
                          Cash on Delivery
                        </p>

                        <p className="mt-1 text-xs text-[#806E6D]">
                          Pay when your order arrives.
                        </p>
                      </div>
                    </div>

                    <Banknote size={25} strokeWidth={1.4} />
                  </label>

                  {/* ONLINE PAYMENT */}
                  <label
                    className={`flex cursor-pointer items-center justify-between gap-4 border p-5 transition ${
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
                        className="h-4 w-4 accent-[#491225]"
                      />

                      <div>
                        <p className="text-sm font-medium">
                          Online Payment
                        </p>

                        <p className="mt-1 text-xs text-[#806E6D]">
                          Pay using an online payment gateway.
                        </p>
                      </div>
                    </div>

                    <CreditCard size={25} strokeWidth={1.4} />
                  </label>
                </div>

                {paymentMethod === "Online Payment" && (
                  <p className="mt-4 text-xs leading-6 text-[#806E6D]">
                    Online payment gateway integration is required
                    to complete your payment. No payment will be
                    collected by this demo checkout yet.
                  </p>
                )}
              </div>

              {/* ERROR MESSAGE */}
              {error && (
                <p className="mt-6 text-sm text-red-700">
                  {error}
                </p>
              )}

              {/* PLACE ORDER */}
              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-full bg-[#491225] px-12 py-4 text-xs tracking-[2px] text-[#F5E8D5] transition hover:bg-[#350B19] disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
              >
                {loading ? "PROCESSING..." : "PLACE ORDER"}
              </button>
            </section>

            {/* ORDER SUMMARY */}
            <aside className="h-fit bg-white/40 p-6 md:p-8">
              <h2 className="mb-7 font-serif text-2xl">
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

                      <p className="mt-1 text-xs text-[#806E6D]">
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

              <div className="mt-7 space-y-4 border-t border-[#491225]/20 pt-5">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>

                <div className="flex justify-between border-t border-[#491225]/20 pt-5 font-semibold">
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
