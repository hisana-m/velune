
import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart, ShoppingBag } from "lucide-react";
import { addToCart } from "../../redux/cartSlice";
import { toggleWishlist } from "../../redux/wishlistSlice";
import { formatPrice } from "../../data/products";

const API_URL = "http://localhost:3000";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [stock, setStock] = useState(
    Number(product.stock ?? 0)
  );

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  const isLoggedIn = useSelector(
    (state) => state.auth.isLoggedIn
  );

  // Fetch the latest stock from JSON Server
  useEffect(() => {
    const loadStock = async () => {
      try {
        const response = await fetch(
          `${API_URL}/products/${encodeURIComponent(product.id)}`
        );

        if (!response.ok) {
          throw new Error("Unable to fetch product stock");
        }

        const latestProduct = await response.json();

        setStock(Number(latestProduct.stock ?? 0));
      } catch (error) {
        console.error("Stock loading error:", error);
      }
    };

    loadStock();

    // Refresh stock when the user returns to this page
    window.addEventListener("focus", loadStock);

    return () => {
      window.removeEventListener("focus", loadStock);
    };
  }, [product.id]);

  const isWishlisted = wishlistItems.some(
    (item) => String(item.id) === String(product.id)
  );

  const cartItem = cartItems.find(
    (item) => String(item.id) === String(product.id)
  );

  const cartQuantity = cartItem?.quantity ?? 0;

  const isOutOfStock = stock <= 0;
  const maximumReached = cartQuantity >= stock;

  const checkLogin = () => {
    if (!isLoggedIn) {
      navigate("/login", {
        state: {
          from: location,
          message: "Please login to continue shopping.",
        },
      });

      return false;
    }

    return true;
  };

  // Wishlist
  const handleWishlist = () => {
    if (!checkLogin()) return;

    dispatch(toggleWishlist(product));
  };

  // Add to Bag
  const handleAddToCart = () => {
    if (!checkLogin()) return;

    if (isOutOfStock || maximumReached) return;

    dispatch(
      addToCart({
        ...product,
        stock,
      })
    );
  };

  return (
    <article className="group w-full min-w-0">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-[#F5E8D5]">

        <Link
          to={`/product/${product.id}`}
          className="block h-full w-full"
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
              isOutOfStock ? "opacity-50" : ""
            }`}
          />
        </Link>

        {/* Out of Stock Label */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#491225]/35">
            <span className="bg-[#491225] px-5 py-3 text-xs tracking-[2px] text-[#F5E8D5]">
              OUT OF STOCK
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          aria-pressed={isWishlisted}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#FEF7F2] text-[#491225] transition hover:bg-[#491225] hover:text-[#F5E8D5]"
        >
          <Heart
            size={19}
            strokeWidth={1.5}
            fill={isWishlisted ? "#491225" : "none"}
          />
        </button>

        {/* Add to Bag */}
        {!isOutOfStock && (
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={maximumReached}
            className="absolute bottom-0 left-0 flex w-full translate-y-full items-center justify-center gap-2 bg-[#491225] py-4 text-sm text-[#F5E8D5] transition-transform duration-300 group-hover:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <ShoppingBag size={17} strokeWidth={1.5} />
            {maximumReached ? "Maximum in Bag" : "Add to Bag"}
          </button>
        )}

        {isOutOfStock && (
          <div className="absolute bottom-0 left-0 w-full bg-[#491225] py-4 text-center text-sm text-[#F5E8D5]">
            Out of Stock
          </div>
        )}
      </div>

      {/* Product Name and Price */}
      <Link
        to={`/product/${product.id}`}
        className="block bg-transparent px-2 py-4 text-center transition-opacity hover:opacity-70"
      >
        <h3 className="font-serif text-base font-medium text-[#491225] md:text-lg">
          {product.name}
        </h3>

        <p className="mt-2 text-sm font-medium text-[#491225]">
          {formatPrice(product.price)}
        </p>
      </Link>
    </article>
  );
}
