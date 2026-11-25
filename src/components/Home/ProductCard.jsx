
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

import { addToCart } from "../../redux/cartSlice";
import { toggleWishlist } from "../../redux/wishlistSlice";
import { formatPrice } from "../../data/products";

const API_URL = "http://localhost:3000";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state) => state.auth.user);
  const wishlistItems = useSelector(
    (state) => state.wishlist.items || []
  );
  const cartItems = useSelector(
    (state) => state.cart.items || []
  );

  const [stock, setStock] = useState(Number(product.stock) || 0);
  const [stockLoading, setStockLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  // Fetch latest stock from JSON Server
  useEffect(() => {
    let isMounted = true;

    async function fetchStock() {
      try {
        const response = await fetch(
          `${API_URL}/products/${product.id}`
        );

        if (!response.ok) {
          throw new Error("Unable to fetch product stock");
        }

        const latestProduct = await response.json();

        if (isMounted) {
          setStock(Number(latestProduct.stock) || 0);
        }
      } catch (error) {
        console.error("Stock fetching error:", error);
      } finally {
        if (isMounted) {
          setStockLoading(false);
        }
      }
    }

    fetchStock();

    return () => {
      isMounted = false;
    };
  }, [product.id]);

  // Check wishlist status
  const isWishlisted = wishlistItems.some(
    (item) =>
      String(item.productId ?? item.id) === String(product.id)
  );

  // Find product in cart
  const cartItem = cartItems.find(
    (item) =>
      String(item.productId ?? item.id) === String(product.id)
  );

  const cartQuantity = Number(cartItem?.quantity) || 0;

  const isOutOfStock = !stockLoading && stock <= 0;
  const maximumReached = cartQuantity >= stock;

  // Login check
  const checkLogin = () => {
    if (!user) {
      toast.error("Please log in to continue.");

      navigate("/login", {
        state: { from: location },
      });

      return false;
    }

    return true;
  };

  // Add or remove wishlist
  const handleWishlist = async () => {
    if (!checkLogin()) return;
    if (isWishlistLoading) return;

    try {
      setIsWishlistLoading(true);

      await dispatch(toggleWishlist(product)).unwrap();

      toast.success(
        isWishlisted
          ? "Removed from wishlist"
          : "Added to wishlist"
      );
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : "Unable to update wishlist"
      );
    } finally {
      setIsWishlistLoading(false);
    }
  };

  // Add product to cart
  const handleAddToCart = async () => {
    if (!checkLogin()) return;
    if (isAdding || stockLoading) return;

    if (stock <= 0) {
      toast.error("This product is out of stock.");
      return;
    }

    if (cartQuantity >= stock) {
      toast.error("You have reached the available stock limit.");
      return;
    }

    try {
      setIsAdding(true);

      await dispatch(
        addToCart({
          ...product,
          stock,
        })
      ).unwrap();

      toast.success("Added to bag successfully");
    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : "Unable to add product to bag"
      );
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="group w-full">
      {/* PRODUCT IMAGE */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F5E8D5]">

        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              isOutOfStock ? "opacity-60" : ""
            }`}
          />
        </Link>

        {/* WISHLIST BUTTON */}
        <button
          type="button"
          onClick={handleWishlist}
          disabled={isWishlistLoading}
          aria-label={
            isWishlisted
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
          className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-[#FEF7F2] text-[#491225] transition-all duration-300 hover:bg-[#491225] hover:text-[#FEF7F2] disabled:opacity-50"
        >
          <Heart
            size={19}
            strokeWidth={1.5}
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>

        {/* OUT OF STOCK - SLIDES UP ON HOVER */}
        {isOutOfStock && (
          <div className="absolute bottom-0 left-0 z-20 flex w-full translate-y-full items-center justify-center bg-[#491225] py-4 text-xs uppercase tracking-[0.2em] text-[#F5E8D5] transition-transform duration-300 group-hover:translate-y-0">
            Out of Stock
          </div>
        )}

        {/* ADD TO BAG - SLIDES UP ON HOVER */}
        {!isOutOfStock && (
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={
              stockLoading ||
              isAdding ||
              maximumReached
            }
            className="absolute bottom-0 left-0 z-20 flex w-full translate-y-full items-center justify-center gap-2 bg-[#491225] py-4 text-xs uppercase tracking-[0.2em] text-[#FEF7F2] transition-all duration-300 hover:bg-[#350B19] group-hover:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ShoppingBag size={16} strokeWidth={1.5} />

            {stockLoading
              ? "Checking Stock..."
              : isAdding
                ? "Adding..."
                : maximumReached
                  ? "Maximum Reached"
                  : "Add to Bag"}
          </button>
        )}
      </div>

      {/* PRODUCT DETAILS */}
      <div className="px-2 pt-4 text-center">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-medium tracking-wide text-[#491225] transition-colors duration-300 md:text-base">
            {product.name}
          </h3>
        </Link>

        <p className="mt-2 text-sm tracking-wide text-[#491225]">
          {formatPrice(product.price)}
        </p>
      </div>
    </div>
  );
}
