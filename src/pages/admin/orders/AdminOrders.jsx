
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Eye, X } from "lucide-react";
import toast from "react-hot-toast";

import {
  fetchAdminOrders,
  updateAdminOrderStatus,
} from "../../../redux/adminOrderSlice";

import { formatPrice } from "../../../data/products";

const orderStatuses = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function AdminOrders() {
  const dispatch = useDispatch();

  const { orders, loading, error } = useSelector(
    (state) => state.adminOrders
  );

  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const handleStatusChange = async (id, status) => {
    try {
      await dispatch(
        updateAdminOrderStatus({ id, status })
      ).unwrap();

      toast.success("Order status updated successfully");

      if (
        selectedOrder &&
        String(selectedOrder.id) === String(id)
      ) {
        setSelectedOrder((previous) => ({
          ...previous,
          status,
        }));
      }
    } catch (error) {
      toast.error(error || "Unable to update order status");
    }
  };

  const sortedOrders = [...orders].sort(
    (a, b) =>
      new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-serif text-[#491225]">
          Order Management
        </h1>

        <p className="mt-2 text-sm text-[#8B7276]">
          View customer orders and update their status.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E9DED4] bg-[#FEF7F2]">
        {loading ? (
          <p className="p-8 text-center text-[#8B7276]">
            Loading orders...
          </p>
        ) : error ? (
          <p className="p-8 text-center text-red-600">{error}</p>
        ) : sortedOrders.length === 0 ? (
          <p className="p-8 text-center text-[#8B7276]">
            No orders available.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-[#491225] text-white">
                <tr>
                  <th className="px-5 py-4">Order ID</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Total</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Details</th>
                </tr>
              </thead>

              <tbody>
                {sortedOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-[#E9DED4] text-[#491225]"
                  >
                    <td className="px-5 py-4">#{order.id}</td>

                    <td className="px-5 py-4">
                      {order.customer?.name || "Customer"}
                    </td>

                    <td className="px-5 py-4">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "—"}
                    </td>

                    <td className="px-5 py-4">
                      {formatPrice(Number(order.total || 0))}
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={order.status || "Pending"}
                        onChange={(event) =>
                          handleStatusChange(
                            order.id,
                            event.target.value
                          )
                        }
                        className="rounded-lg border border-[#D8C3C7] bg-white px-3 py-2 text-xs outline-none"
                      >
                        {orderStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-[#491225] hover:text-[#8B7276]"
                        aria-label="View order details"
                      >
                        <Eye size={19} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-[#FEF7F2] p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-serif text-[#491225]">
                Order #{selectedOrder.id}
              </h2>

              <button
                onClick={() => setSelectedOrder(null)}
                className="text-[#491225]"
                aria-label="Close order details"
              >
                <X size={21} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div>
                <p className="text-[#8B7276]">Customer</p>
                <p className="mt-1 text-[#491225]">
                  {selectedOrder.customer?.name || "Customer"}
                </p>
              </div>

              <div>
                <p className="text-[#8B7276]">Email</p>
                <p className="mt-1 break-all text-[#491225]">
                  {selectedOrder.customer?.email || "—"}
                </p>
              </div>

              <div>
                <p className="text-[#8B7276]">Order Status</p>
                <p className="mt-1 text-[#491225]">
                  {selectedOrder.status || "Pending"}
                </p>
              </div>

              <div>
                <p className="text-[#8B7276]">Total</p>
                <p className="mt-1 text-[#491225]">
                  {formatPrice(Number(selectedOrder.total || 0))}
                </p>
              </div>
            </div>

            <h3 className="mb-3 mt-7 font-semibold text-[#491225]">
              Ordered Products
            </h3>

            <div className="space-y-3">
              {(selectedOrder.products || []).map((item, index) => (
                <div
                  key={item.id || item.productId || index}
                  className="flex items-center justify-between gap-4 rounded-lg bg-[#F5E8D5] p-4 text-sm"
                >
                  <div>
                    <p className="font-medium text-[#491225]">
                      {item.name || item.product?.name || "Product"}
                    </p>

                    <p className="mt-1 text-[#8B7276]">
                      Quantity: {item.quantity || 1}
                    </p>
                  </div>

                  <p className="shrink-0 text-[#491225]">
                    {formatPrice(
                      Number(item.price || item.product?.price || 0) *
                        Number(item.quantity || 1)
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
