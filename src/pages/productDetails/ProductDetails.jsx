
import { useEffect, useState } from "react";
import {
  Link,
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { addToCart } from "../../redux/cartSlice";
import { toggleWishlist } from "../../redux/wishlistSlice";
import { formatPrice } from "../../data/products";

import {
  ShoppingBag,
  ArrowLeft,
  Plus,
  Minus,
  Heart,
} from "lucide-react";

import SiteFrame from "../../components/SiteFrame";

const API_URL = "http://localhost:3000";

export default function ProductDetails() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const wishlistItems = useSelector(
    (state) => state.wishlist.items
  );

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  const isLoggedIn = useSelector(
    (state) => state.auth.isLoggedIn
  );

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const [isAdding, setIsAdding] = useState(false);
  const [isUpdatingWishlist, setIsUpdatingWishlist] = useState(false);

  // ---------------- CART INFORMATION ----------------

  const cartItem = cartItems.find(
    (item) => String(item.id) === String(id)
  );

  const cartQuantity = Number(cartItem?.quantity ?? 0);

  // ---------------- STOCK INFORMATION ----------------

  const stock = Number(product?.stock ?? 0);

  const isOutOfStock = stock <= 0;

  const remainingStock = Math.max(
    0,
    stock - cartQuantity
  );

  const maximumReached = remainingStock === 0;

  // ---------------- WISHLIST INFORMATION ----------------

  const isWishlisted = wishlistItems.some(
    (item) => String(item.id) === String(id)
  );

  // ---------------- LOAD PRODUCT ----------------

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/products/${encodeURIComponent(id)}`
        );

        if (!response.ok) {
          throw new Error("Product not found.");
        }

        const data = await response.json();

        if (active) {
          setProduct(data);
          setQuantity(1);
        }
      } catch (error) {
        console.error("Unable to load product:", error);

        if (active) {
          setProduct(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    // Refresh stock when the user returns to the page.
    window.addEventListener("focus", loadProduct);

    return () => {
      active = false;
      window.removeEventListener("focus", loadProduct);
    };
  }, [id]);

  // Keep quantity within the available stock.
  useEffect(() => {
    setQuantity((previous) => {
      if (remainingStock <= 0) return 1;

      return Math.min(
        Math.max(1, previous),
        remainingStock
      );
    });
  }, [remainingStock]);

  // ---------------- LOGIN CHECK ----------------

  const checkLogin = () => {
    if (!isLoggedIn) {
      toast.error("Please log in first.");

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

  // ---------------- ADD TO CART ----------------

  const handleAddToCart = async () => {
    if (!product) return;

    if (!checkLogin()) return;

    if (isAdding) return;

    if (isOutOfStock) {
      toast.error("This product is out of stock.");
      return;
    }

    if (remainingStock <= 0) {
      toast.error("Maximum stock reached.");
      return;
    }

    if (quantity > remainingStock) {
      toast.error(
        `Only ${remainingStock} unit(s) available to add.`
      );
      return;
    }

    setIsAdding(true);

    try {
      await dispatch(
        addToCart({
          product: {
            ...product,
            stock,
          },
          quantity,
        })
      ).unwrap();

      toast.success("Product added to your cart!");

    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Unable to add product to cart."
      );
    } finally {
      setIsAdding(false);
    }
  };

  // ---------------- TOGGLE WISHLIST ----------------

  const handleWishlist = async () => {
    if (!product) return;

    if (!checkLogin()) return;

    if (isUpdatingWishlist) return;

    setIsUpdatingWishlist(true);

    try {
      const wasWishlisted = isWishlisted;

      await dispatch(
        toggleWishlist(product)
      ).unwrap();

      if (wasWishlisted) {
        toast.success("Removed from wishlist!");
      } else {
        toast.success("Added to wishlist!");
      }

    } catch (error) {
      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Unable to update wishlist."
      );
    } finally {
      setIsUpdatingWishlist(false);
    }
  };

  // ---------------- LOADING ----------------

  if (loading) {
    return (
      <main className="bg-[#491225]">
        <SiteFrame>
          <div className="flex min-h-[60vh] items-center justify-center bg-[#F5E8D5] text-[#491225]">
            <p className="text-sm tracking-[2px]">
              Loading product...
            </p>
          </div>
        </SiteFrame>
      </main>
    );
  }

  // ---------------- PRODUCT NOT FOUND ----------------

  if (!product) {
    return (
      <main className="bg-[#491225]">
        <SiteFrame>
          <div className="flex min-h-[60vh] flex-col items-center justify-center bg-[#F5E8D5] px-5 text-center text-[#491225]">
            <h1 className="font-serif text-4xl">
              Product Not Found
            </h1>

            <Link
              to="/collections"
              className="mt-7 border border-[#491225] px-6 py-3 text-xs uppercase tracking-[2px] transition hover:bg-[#491225] hover:text-[#F5E8D5]"
            >
              Back to Collections
            </Link>
          </div>
        </SiteFrame>
      </main>
    );
  }

  // ---------------- PRODUCT DETAILS ----------------

  return (
    <main className="w-full bg-[#491225]">
      <SiteFrame>
        <div className="min-h-screen bg-[#F5E8D5] text-[#491225]">

          {/* Back Navigation */}

          <section className="px-5 pt-10 md:px-10 lg:px-14">
            <div className="mx-auto max-w-[1200px]">
              <Link
                to="/collections"
                className="inline-flex items-center gap-2 text-xs tracking-[1px] transition hover:opacity-60"
              >
                <ArrowLeft size={16} />
                Back to Collections
              </Link>
            </div>
          </section>

          {/* Product Details */}

          <section className="px-5 py-10 md:px-10 md:py-16 lg:px-14">
            <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">

              {/* Product Image */}

              <div className="overflow-hidden bg-[#F5E8D5]">
                <img
                  src={product.image}
                  alt={product.name}
                  className={`aspect-square w-full object-cover ${
                    isOutOfStock ? "opacity-50" : ""
                  }`}
                />

                {isOutOfStock && (
                  <div className="absolute" />
                )}
              </div>

              {/* Product Information */}

              <div className="flex flex-col justify-center py-2">

                <p className="text-[10px] uppercase tracking-[4px] text-[#806E6D]">
                  VÉLUNE COLLECTION
                </p>

                <h1 className="mt-5 font-serif text-3xl leading-tight md:text-5xl">
                  {product.name}
                </h1>

                <p className="mt-5 text-xl font-medium">
                  {formatPrice(product.price)}
                </p>

                {/* Stock Status */}

                <div className="mt-5">
                  {isOutOfStock ? (
                    <p className="inline-block bg-red-100 px-4 py-2 text-xs font-semibold uppercase tracking-[2px] text-red-700">
                      Out of Stock
                    </p>
                  ) : (
                    <p className="text-sm text-[#72515A]">
                      <span className="font-semibold text-green-800">
                        In Stock
                      </span>
                      {" "}— {stock} available
                    </p>
                  )}
                </div>

                <div className="my-7 h-px w-full bg-[#491225]/20" />

                {/* Description */}

                <p className="text-sm leading-8 text-[#72515A]">
                  {product.description}
                </p>

                {/* Category */}

                <div className="mt-6">
                  <p className="text-[10px] uppercase tracking-[2px] text-[#806E6D]">
                    Category
                  </p>

                  <p className="mt-2 text-sm capitalize">
                    {product.category}
                  </p>
                </div>

                {/* Quantity */}

                {!isOutOfStock && (
                  <div className="mt-8">
                    <p className="mb-3 text-[10px] uppercase tracking-[2px]">
                      Quantity
                    </p>

                    <div className="flex w-fit items-center border border-[#491225]">

                      <button
                        type="button"
                        onClick={() =>
                          setQuantity((previous) =>
                            Math.max(1, previous - 1)
                          )
                        }
                        disabled={quantity <= 1}
                        className="flex h-11 w-11 items-center justify-center transition hover:bg-[#491225] hover:text-[#F5E8D5] disabled:opacity-30"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={15} />
                      </button>

                      <span className="flex h-11 w-12 items-center justify-center text-sm">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setQuantity((previous) =>
                            Math.min(
                              remainingStock,
                              previous + 1
                            )
                          )
                        }
                        disabled={
                          quantity >= remainingStock ||
                          remainingStock === 0
                        }
                        className="flex h-11 w-11 items-center justify-center transition hover:bg-[#491225] hover:text-[#F5E8D5] disabled:opacity-30"
                        aria-label="Increase quantity"
                      >
                        <Plus size={15} />
                      </button>

                    </div>

                    {maximumReached && (
                      <p className="mt-3 text-xs text-amber-800">
                        You have already added all available stock to your bag.
                      </p>
                    )}
                  </div>
                )}

                {/* Add to Cart */}

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={
                    isOutOfStock ||
                    remainingStock === 0 ||
                    isAdding
                  }
                  className="mt-7 flex w-full items-center justify-center gap-3 bg-[#491225] px-6 py-4 text-xs uppercase tracking-[2px] text-[#F5E8D5] transition hover:bg-[#350B19] disabled:cursor-not-allowed disabled:bg-[#806E6D]"
                >
                  <ShoppingBag size={17} />

                  {isOutOfStock
                    ? "Out of Stock"
                    : isAdding
                      ? "Adding to Bag..."
                      : remainingStock === 0
                        ? "Maximum Quantity in Bag"
                        : `Add to Bag — ${formatPrice(
                            product.price * quantity
                          )}`}
                </button>

                {/* Wishlist Button */}

                <button
                  type="button"
                  onClick={handleWishlist}
                  disabled={isUpdatingWishlist}
                  className={`mt-3 flex w-full items-center justify-center gap-3 border px-6 py-4 text-xs uppercase tracking-[2px] transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    isWishlisted
                      ? "border-[#491225] bg-[#491225] text-[#F5E8D5]"
                      : "border-[#491225] bg-transparent text-[#491225] hover:bg-[#491225] hover:text-[#F5E8D5]"
                  }`}
                >
                  <Heart
                    size={17}
                    fill={
                      isWishlisted
                        ? "currentColor"
                        : "none"
                    }
                  />

                  {isUpdatingWishlist
                    ? "Updating..."
                    : isWishlisted
                      ? "Remove from Wishlist"
                      : "Add to Wishlist"}
                </button>

                {/* Wishlist Information */}

                {isWishlisted && (
                  <p className="mt-3 text-center text-sm text-[#72515A]">
                    This piece is saved in your wishlist.
                  </p>
                )}

                {/* Continue Shopping */}

                <Link
                  to="/collections"
                  className="mt-5 block text-center text-xs tracking-[1px] underline underline-offset-4 transition hover:opacity-60"
                >
                  Continue Exploring
                </Link>

              </div>
            </div>
          </section>
        </div>
      </SiteFrame>
    </main>
  );
}
