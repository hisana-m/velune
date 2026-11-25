
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Check, Package, ArrowLeft } from "lucide-react";
import { formatPrice } from "../../data/products";

const API_URL = "http://localhost:3000";

const trackingSteps = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
];

export default function OrderDetails() {
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadOrder() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/orders/${id}`);

        if (response.status === 404) {
          throw new Error("Order not found.");
        }

        if (!response.ok) {
          throw new Error("Failed to load order details.");
        }

        const data = await response.json();

        const belongsToUser = data.userId
          ? String(data.userId) === String(user?.id)
          : data.customer?.email?.toLowerCase() ===
            user?.email?.toLowerCase();

        if (!belongsToUser) {
          throw new Error(
            "You do not have permission to view this order."
          );
        }

        if (isMounted) {
          setOrder(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (user?.id || user?.email) {
      loadOrder();
    }

    return () => {
      isMounted = false;
    };
  }, [id, user]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5E8D5] px-5 py-24 text-center text-[#491225]">
        Loading order details...
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-[#F5E8D5] px-5 py-24 text-center text-[#491225]">
        <h1 className="font-serif text-3xl">
          Order Unavailable
        </h1>

        <p className="mt-3 text-sm text-[#806E6D]">
          {error || "Order not found."}
        </p>

        <Link
          to="/orders"
          className="mt-7 inline-flex items-center gap-2 bg-[#491225] px-6 py-3 text-xs uppercase tracking-widest text-[#F5E8D5]"
        >
          <ArrowLeft size={15} />
          My Orders
        </Link>
      </main>
    );
  }

  const status = String(order.status || "Pending").toLowerCase();
  const isCancelled = status === "cancelled";

  const currentStep = trackingSteps.findIndex(
    (step) => step.toLowerCase() === status
  );

  const products = order.products || [];
  const subtotal = Number(order.subtotal || 0);
  const shipping = Number(order.shipping || 0);
  const total = Number(order.total ?? subtotal + shipping);

  return (
    <main className="min-h-screen bg-[#F5E8D5] px-5 py-16 text-[#491225] md:px-12 lg:px-20">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/orders"
          className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#806E6D] hover:text-[#491225]"
        >
          <ArrowLeft size={15} />
          Back to My Orders
        </Link>

        <div className="flex flex-col justify-between gap-4 border-b border-[#491225]/20 pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#8B7276]">
              Order Details
            </p>

            <h1 className="mt-2 font-serif text-4xl">
              Order #{order.id}
            </h1>

            <p className="mt-3 text-sm text-[#806E6D]">
              Placed on{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "Date unavailable"}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-[#8B7276]">
              Order Status
            </p>

            <p className="mt-2 text-lg font-medium">
              {order.status || "Pending"}
            </p>
          </div>
        </div>

        <section className="mt-12 bg-[#FEF7F2] p-6 md:p-8">
          <div className="flex items-center gap-3">
            <Package size={22} />
            <h2 className="font-serif text-2xl">
              Track Your Order
            </h2>
          </div>

          {isCancelled ? (
            <p className="mt-7 border border-red-300 bg-red-50 p-4 text-sm text-red-800">
              This order has been cancelled.
            </p>
          ) : currentStep === -1 ? (
            <p className="mt-7 text-sm text-[#806E6D]">
              Current status: {order.status}. Tracking progress is
              unavailable for this status.
            </p>
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {trackingSteps.map((step, index) => {
                const completed = index <= currentStep;

                return (
                  <div
                    key={step}
                    className="flex flex-col items-center text-center"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                        completed
                          ? "border-[#491225] bg-[#491225] text-[#F5E8D5]"
                          : "border-[#491225]/25 text-[#806E6D]"
                      }`}
                    >
                      {completed ? <Check size={18} /> : index + 1}
                    </div>

                    <p
                      className={`mt-3 text-xs uppercase tracking-wider ${
                        completed
                          ? "font-semibold"
                          : "text-[#806E6D]"
                      }`}
                    >
                      {step}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <section>
            <h2 className="mb-5 font-serif text-2xl">
              Items Ordered
            </h2>

            <div className="space-y-4">
              {products.map((item, index) => (
                <div
                  key={item.id || item.productId || index}
                  className="flex gap-4 border-b border-[#491225]/15 pb-5"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name || "Product"}
                      className="h-24 w-20 bg-[#FEF7F2] object-cover"
                    />
                  )}

                  <div className="flex-1">
                    <h3 className="text-sm font-medium">
                      {item.name || item.title || "Product"}
                    </h3>

                    <p className="mt-2 text-xs text-[#806E6D]">
                      Quantity: {item.quantity || 1}
                    </p>

                    <p className="mt-2 text-sm">
                      {formatPrice(
                        Number(item.price || 0) *
                          Number(item.quantity || 1)
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="space-y-8">
            <section className="bg-[#FEF7F2] p-6">
              <h2 className="font-serif text-2xl">
                Delivery Details
              </h2>

              <div className="mt-5 space-y-2 text-sm">
                <p className="font-medium">
                  {order.customer?.name}
                </p>
                <p>{order.customer?.email}</p>
                <p>{order.customer?.phone}</p>
                <p>{order.customer?.address}</p>
                <p>
                  {[
                    order.customer?.city,
                    order.customer?.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </section>

            <section className="bg-[#FEF7F2] p-6">
              <h2 className="font-serif text-2xl">
                Payment Summary
              </h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-[#806E6D]">
                    Payment Method
                  </span>
                  <span className="text-right">
                    {order.paymentMethod}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-[#806E6D]">
                    Payment Status
                  </span>
                  <span className="text-right">
                    {order.paymentStatus || "Pending"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#806E6D]">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#806E6D]">Shipping</span>
                  <span>{formatPrice(shipping)}</span>
                </div>

                <div className="flex justify-between border-t border-[#491225]/20 pt-4 text-base font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
