
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../../redux/cartSlice";
import { formatPrice } from "../../data/products";
import SiteFrame from "../../components/SiteFrame";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

export default function Cart() {
  const dispatch = useDispatch();

  const { items, loading, error } = useSelector(
    (state) => state.cart
  );

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const subtotal = items.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

  // Remove product from cart
  const handleRemove = async (item) => {
    try {
      await dispatch(removeFromCart(item.id)).unwrap();

      toast.success("Product removed from your cart!");
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : "Unable to remove product from cart."
      );
    }
  };

  // Increase quantity
  const handleIncrease = async (item) => {
    try {
      await dispatch(increaseQuantity(item.id)).unwrap();

      toast.success("Product quantity increased!");
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : "Unable to increase quantity."
      );
    }
  };

  // Decrease quantity
  const handleDecrease = async (item) => {
    if (item.quantity <= 1) return;

    try {
      await dispatch(decreaseQuantity(item.id)).unwrap();

      toast.success("Product quantity decreased!");
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : "Unable to decrease quantity."
      );
    }
  };

  // Clear entire cart
  const handleClearCart = async () => {
    if (items.length === 0) return;

    try {
      await dispatch(clearCart()).unwrap();

      toast.success("Your shopping bag has been cleared!");
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : "Unable to clear your shopping bag."
      );
    }
  };

  return (
    <SiteFrame>
      <main className="min-h-screen bg-[#F5E8D5] px-5 py-12 text-[#491225] md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">

          <div className="mb-10 text-center">
            <p className="mb-2 text-sm uppercase tracking-[0.3em]">
              Your selection
            </p>

            <h1 className="font-serif text-4xl md:text-5xl">
              Shopping Bag
            </h1>

            <p className="mt-3 text-sm text-[#806E6D]">
              Review your beautiful selections.
            </p>
          </div>

          {error && (
            <p className="mb-6 rounded-lg bg-red-100 p-4 text-sm text-red-700">
              {error}
            </p>
          )}

          {loading && items.length === 0 ? (
            <p className="py-16 text-center">
              Loading your cart...
            </p>
          ) : items.length === 0 ? (
            <div className="border border-[#491225]/20 px-6 py-16 text-center">
              <ShoppingBag className="mx-auto mb-5" size={38} />

              <h2 className="font-serif text-2xl">
                Your bag is empty
              </h2>

              <p className="mt-3 text-sm text-[#806E6D]">
                Discover something special from VÉLUNE.
              </p>

              <Link
                to="/collections"
                className="mt-7 inline-block bg-[#491225] px-8 py-3 text-sm text-[#F5E8D5] transition hover:bg-[#350B19]"
              >
                Explore Collection
              </Link>
            </div>
          ) : (
            <div className="grid gap-10 lg:grid-cols-[1fr_340px]">

              <section className="space-y-5">

                {items.map((item) => {
                  const stock = Number(item.stock || 0);
                  const isOutOfStock = stock <= 0;

                  return (
                    <article
                      key={item.id}
                      className="flex flex-col gap-5 border-b border-[#491225]/20 pb-6 sm:flex-row"
                    >
                      <Link
                        to={`/product/${item.id}`}
                        className="h-36 w-full shrink-0 bg-white sm:w-36"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </Link>

                      <div className="flex flex-1 flex-col justify-between gap-4">

                        <div className="flex justify-between gap-4">
                          <div>
                            <Link
                              to={`/product/${item.id}`}
                              className="font-serif text-xl hover:underline"
                            >
                              {item.name}
                            </Link>

                            <p className="mt-2 text-sm text-[#806E6D]">
                              {formatPrice(item.price)}
                            </p>

                            <p
                              className={`mt-2 text-xs ${
                                isOutOfStock
                                  ? "text-red-700"
                                  : "text-[#806E6D]"
                              }`}
                            >
                              {isOutOfStock
                                ? "Out of stock"
                                : `${stock} available in stock`}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemove(item)}
                            className="h-fit text-[#491225] transition hover:text-red-700"
                            aria-label="Remove product"
                          >
                            <Trash2 size={19} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">

                          <div className="flex items-center border border-[#491225]/30">

                            <button
                              type="button"
                              onClick={() => handleDecrease(item)}
                              disabled={loading || item.quantity <= 1}
                              className="p-2 hover:bg-[#491225]/10 disabled:cursor-not-allowed disabled:opacity-40"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={15} />
                            </button>

                            <span className="min-w-9 text-center text-sm">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleIncrease(item)}
                              disabled={
                                isOutOfStock ||
                                item.quantity >= stock ||
                                loading
                              }
                              className="p-2 hover:bg-[#491225]/10 disabled:cursor-not-allowed disabled:opacity-40"
                              aria-label="Increase quantity"
                            >
                              <Plus size={15} />
                            </button>

                          </div>

                          <p className="font-medium">
                            {formatPrice(
                              Number(item.price) * item.quantity
                            )}
                          </p>

                        </div>
                      </div>
                    </article>
                  );
                })}

                <button
                  type="button"
                  onClick={handleClearCart}
                  disabled={loading}
                  className="text-sm text-[#806E6D] underline hover:text-[#491225] disabled:opacity-50"
                >
                  Clear shopping bag
                </button>

              </section>

              <aside className="h-fit border border-[#491225]/20 p-6">
                <h2 className="font-serif text-2xl">
                  Order Summary
                </h2>

                <div className="mt-7 flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="mt-4 flex justify-between border-t border-[#491225]/20 pt-4 text-sm">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>

                <div className="mt-5 flex justify-between border-t border-[#491225]/20 pt-5 font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <Link
                  to="/checkout"
                  className="mt-7 block bg-[#491225] px-5 py-4 text-center text-sm tracking-wider text-[#F5E8D5] transition hover:bg-[#350B19]"
                >
                  PROCEED TO CHECKOUT
                </Link>

                <Link
                  to="/collections"
                  className="mt-4 block text-center text-sm underline"
                >
                  Continue Shopping
                </Link>
              </aside>

            </div>
          )}
        </div>
      </main>
    </SiteFrame>
  );
}
