
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Package, ArrowRight } from "lucide-react";
import { formatPrice } from "../../data/products";

const API_URL = "http://localhost:3000";

export default function Orders() {
  const user = useSelector((state) => state.auth.user);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/orders`);

        if (!response.ok) {
          throw new Error("Failed to load orders.");
        }

        const data = await response.json();

        const userOrders = data.filter((order) => {
          if (order.userId) {
            return String(order.userId) === String(user?.id);
          }

          return (
            order.customer?.email?.toLowerCase() ===
            user?.email?.toLowerCase()
          );
        });

        userOrders.sort(
          (a, b) =>
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
        );

        if (isMounted) {
          setOrders(userOrders);
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
      loadOrders();
    } else {
      setOrders([]);
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <main className="min-h-screen bg-[#F5E8D5] px-5 py-16 text-[#491225] md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#8B7276]">
          Your Account
        </p>

        <h1 className="font-serif text-4xl md:text-5xl">
          My Orders
        </h1>

        <p className="mt-3 text-sm text-[#806E6D]">
          View your purchases and track your orders.
        </p>

        {loading ? (
          <p className="py-20 text-center text-sm">
            Loading your orders...
          </p>
        ) : error ? (
          <p className="py-20 text-center text-sm text-red-700">
            {error}
          </p>
        ) : orders.length === 0 ? (
          <div className="py-24 text-center">
            <Package className="mx-auto mb-5 h-12 w-12" />

            <h2 className="font-serif text-2xl">
              No Orders Yet
            </h2>

            <p className="mt-2 text-sm text-[#806E6D]">
              Your purchases will appear here after checkout.
            </p>

            <Link
              to="/collections"
              className="mt-7 inline-flex bg-[#491225] px-7 py-3 text-xs uppercase tracking-widest text-[#F5E8D5] transition hover:bg-[#350B19]"
            >
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="mt-12 space-y-5">
            {orders.map((order) => {
              const itemCount = (order.products || []).reduce(
                (total, item) =>
                  total + Number(item.quantity || 1),
                0
              );

              return (
                <div
                  key={order.id}
                  className="border border-[#491225]/15 bg-[#FEF7F2] p-5 md:p-7"
                >
                  <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-[#8B7276]">
                        Order Number
                      </p>

                      <h2 className="mt-1 text-lg font-medium">
                        #{order.id}
                      </h2>

                      <p className="mt-2 text-xs text-[#806E6D]">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "Date unavailable"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-widest text-[#8B7276]">
                        Status
                      </p>

                      <p className="mt-2 text-sm font-medium">
                        {order.status || "Pending"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-widest text-[#8B7276]">
                        Items
                      </p>

                      <p className="mt-2 text-sm">
                        {itemCount} {itemCount === 1 ? "item" : "items"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-widest text-[#8B7276]">
                        Total
                      </p>

                      <p className="mt-2 text-lg font-medium">
                        {formatPrice(
                          Number(order.total ?? order.subtotal ?? 0)
                        )}
                      </p>
                    </div>

                    <Link
                      to={`/orders/${order.id}`}
                      className="inline-flex items-center justify-center gap-2 border border-[#491225] px-5 py-3 text-xs uppercase tracking-widest transition hover:bg-[#491225] hover:text-[#F5E8D5]"
                    >
                      View Details
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
