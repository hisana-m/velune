
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlist,
  removeFromWishlist,
} from "../../redux/wishlistSlice";
import { addToCart } from "../../redux/cartSlice";
import { formatPrice } from "../../data/products";
import SiteFrame from "../../components/SiteFrame";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";

export default function Wishlist() {
  const dispatch = useDispatch();

  const {
    items,
    loading,
    error,
  } = useSelector((state) => state.wishlist);

  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleMoveToCart = async (product) => {
    try {
      await dispatch(
        addToCart({
          product,
          quantity: 1,
        })
      ).unwrap();

      await dispatch(removeFromWishlist(product.id)).unwrap();
    } catch (error) {
      // The cart or stock error is displayed below.
      console.error(error);
    }
  };

  return (
    <SiteFrame>
      <main className="min-h-screen bg-[#F5E8D5] px-5 py-12 text-[#491225] md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="mb-2 text-sm uppercase tracking-[0.3em]">
              Your favourites
            </p>
            <h1 className="font-serif text-4xl md:text-5xl">My Wishlist</h1>
            <p className="mt-3 text-sm text-[#806E6D]">
              Pieces you love, all in one place.
            </p>
          </div>

          {error && (
            <p className="mb-6 rounded-lg bg-red-100 p-4 text-sm text-red-700">
              {error}
            </p>
          )}

          {loading && items.length === 0 ? (
            <p className="py-16 text-center">Loading your wishlist...</p>
          ) : items.length === 0 ? (
            <div className="border border-[#491225]/20 px-6 py-16 text-center">
              <Heart className="mx-auto mb-5" size={38} />
              <h2 className="font-serif text-2xl">
                Your wishlist is empty
              </h2>
              <p className="mt-3 text-sm text-[#806E6D]">
                Save the pieces you love and find them here.
              </p>
              <Link
                to="/collections"
                className="mt-7 inline-block bg-[#491225] px-8 py-3 text-sm text-[#F5E8D5] transition hover:bg-[#350B19]"
              >
                Explore Collection
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((product) => {
                const cartItem = cartItems.find(
                  (item) => String(item.id) === String(product.id)
                );

                const stock = Number(product.stock || 0);
                const alreadyInCart = Number(cartItem?.quantity || 0);
                const outOfStock = stock <= alreadyInCart;

                return (
                  <article
                    key={product.id}
                    className="border border-[#491225]/15 bg-[#F5E8D5]"
                  >
                    <div className="relative aspect-square bg-white">
                      <Link to={`/product/${product.id}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </Link>

                      <button
                        onClick={() =>
                          dispatch(removeFromWishlist(product.id))
                        }
                        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center bg-[#F5E8D5] text-[#491225] hover:bg-[#491225] hover:text-[#F5E8D5]"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    <div className="p-5">
                      <Link
                        to={`/product/${product.id}`}
                        className="font-serif text-lg hover:underline"
                      >
                        {product.name}
                      </Link>

                      <p className="mt-2 text-sm">
                        {formatPrice(product.price)}
                      </p>

                      <p
                        className={`mt-2 text-xs ${
                          outOfStock ? "text-red-700" : "text-[#806E6D]"
                        }`}
                      >
                        {outOfStock
                          ? "Out of stock"
                          : `${stock - alreadyInCart} available`}
                      </p>

                      <button
                        onClick={() => handleMoveToCart(product)}
                        disabled={outOfStock || loading}
                        className="mt-5 flex w-full items-center justify-center gap-2 bg-[#491225] px-4 py-3 text-xs tracking-wider text-[#F5E8D5] transition hover:bg-[#350B19] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ShoppingBag size={16} />
                        {outOfStock ? "OUT OF STOCK" : "MOVE TO BAG"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </SiteFrame>
  );
}
