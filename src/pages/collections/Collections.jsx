
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  getCategories,
  getProducts,
  formatPrice,
} from "../../data/products";
import SiteFrame from "../../components/SiteFrame";
import { Search, X, ArrowRight } from "lucide-react";

export default function Collections() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryFromUrl = searchParams.get("category") || "all";

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("default");
  const [inputValue, setInputValue] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const searchContainerRef = useRef(null);

  const productsPerPage = 12;

  // Debounce search input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(inputValue);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(handler);
  }, [inputValue]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Load Categories and Products
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const [categoryData, productData] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);

        setCategories(categoryData);
        setProducts(productData);
      } catch (err) {
        setError("Unable to load collections. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Sync Category with URL
  useEffect(() => {
    const category = searchParams.get("category") || "all";

    setSelectedCategory(category);
    setCurrentPage(1);
  }, [searchParams]);

  // 5 Suggestions based on query
  const currentQuery = (debouncedQuery || inputValue).trim().toLowerCase();

  const matchingProducts = currentQuery
    ? products.filter((product) => {
        return (
          product.name?.toLowerCase().includes(currentQuery) ||
          product.category?.toLowerCase().includes(currentQuery)
        );
      })
    : [];

  const suggestions = matchingProducts.slice(0, 5);

  // Search Products for grid
  const searchedProducts = products.filter((product) => {
    const search = debouncedQuery.trim().toLowerCase();
    if (!search) return true;

    return (
      product.name?.toLowerCase().includes(search) ||
      product.category?.toLowerCase().includes(search)
    );
  });

  // Filter Products by Category
  const filteredProducts =
    selectedCategory === "all"
      ? searchedProducts
      : searchedProducts.filter(
          (product) => product.categorySlug === selectedCategory
        );

  // Sort Products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "low-high") {
      return a.price - b.price;
    }

    if (sortOrder === "high-low") {
      return b.price - a.price;
    }

    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const startIndex = (currentPage - 1) * productsPerPage;

  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // Change Category
  const handleCategoryChange = (categorySlug) => {
    setSelectedCategory(categorySlug);
    setCurrentPage(1);

    if (categorySlug === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category: categorySlug });
    }
  };

  // Change Page
  const handlePageChange = (page) => {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Search
  const handleSearch = (value) => {
    setInputValue(value);
    setIsDropdownOpen(Boolean(value.trim()));
  };

  // Clear Search
  const clearSearch = () => {
    setInputValue("");
    setDebouncedQuery("");
    setIsDropdownOpen(false);
    setCurrentPage(1);
  };

  return (
    <main className="w-full bg-[#491225]">
      <SiteFrame>
        <div className="min-h-screen bg-[#F5E8D5] text-[#491225]">

          {/* Page Heading */}
          <section className="px-5 pt-16 pb-10 text-center md:px-10 md:pt-20">
            <p className="text-[10px] uppercase tracking-[4px] text-[#806E6D]">
              VÉLUNE
            </p>

            <h1 className="mt-4 font-serif text-4xl md:text-6xl">
              Our Collections
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#72515A]">
              Explore timeless pieces designed to bring elegance to every moment.
            </p>
          </section>

          {/* Search Bar */}
          <section className="px-5 pb-8 md:px-10 lg:px-14">
            <div ref={searchContainerRef} className="relative mx-auto max-w-[650px]">
              <div className="flex items-center border-b border-[#491225] py-3 transition focus-within:border-b-2">

                <Search
                  size={19}
                  strokeWidth={1.5}
                  className="mr-4 shrink-0 text-[#491225]"
                />

                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => {
                    if (inputValue.trim()) setIsDropdownOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape" || e.key === "Enter") {
                      setIsDropdownOpen(false);
                    }
                  }}
                  placeholder="Search jewellery..."
                  className="w-full bg-transparent text-sm text-[#491225] outline-none placeholder:text-[#806E6D]"
                />

                {inputValue && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    aria-label="Clear search"
                    className="ml-3 shrink-0 text-[#491225] transition hover:opacity-60"
                  >
                    <X size={18} />
                  </button>
                )}

              </div>

              {/* Suggestions Dropdown (5 Suggestions) */}
              {isDropdownOpen && inputValue.trim().length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden border border-[#491225]/20 bg-[#F5E8D5] shadow-2xl">
                  {suggestions.length > 0 ? (
                    <div>
                      <div className="flex items-center justify-between border-b border-[#491225]/15 px-4 py-2 text-[10px] uppercase tracking-[2px] text-[#806E6D]">
                        <span>Suggestions ({suggestions.length})</span>
                        <span>{matchingProducts.length} matching</span>
                      </div>

                      <ul className="divide-y divide-[#491225]/10">
                        {suggestions.map((item) => (
                          <li key={item.id}>
                            <Link
                              to={`/product/${item.id}`}
                              onClick={() => {
                                setIsDropdownOpen(false);
                                setInputValue(item.name);
                                setDebouncedQuery(item.name);
                              }}
                              className="group flex items-center gap-3.5 px-4 py-3 transition duration-150 hover:bg-[#491225] hover:text-[#F5E8D5]"
                            >
                              <div className="h-12 w-12 shrink-0 overflow-hidden bg-white">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                />
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="truncate font-serif text-sm text-[#491225] group-hover:text-[#F5E8D5]">
                                  {item.name}
                                </p>
                                <p className="mt-0.5 text-[10px] uppercase tracking-wider text-[#806E6D] group-hover:text-[#D8C3C7]">
                                  {item.category}
                                </p>
                              </div>

                              <div className="shrink-0 text-right">
                                <span className="text-xs font-semibold text-[#491225] group-hover:text-[#F5E8D5]">
                                  {formatPrice(item.price)}
                                </span>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>

                      {matchingProducts.length > 5 && (
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex w-full items-center justify-between border-t border-[#491225]/15 bg-[#491225]/5 px-4 py-2.5 text-xs text-[#491225] transition hover:bg-[#491225] hover:text-[#F5E8D5]"
                        >
                          <span>See all {matchingProducts.length} results</span>
                          <ArrowRight size={14} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-center text-xs text-[#806E6D]">
                      No jewellery suggestions found for "{inputValue}"
                    </div>
                  )}
                </div>
              )}

              {debouncedQuery.trim() && (
                <p className="mt-3 text-xs tracking-wide text-[#806E6D]">
                  Search results for "{debouncedQuery}"
                </p>
              )}
            </div>
          </section>

          {/* Categories */}
          <section className="px-5 pb-12 md:px-10 lg:px-14">
            <div className="mx-auto max-w-[1200px]">

              <div className="mb-7 flex flex-wrap justify-center gap-3">

                {/* All Products */}
                <button
                  onClick={() => handleCategoryChange("all")}
                  className={`px-5 py-2 text-xs uppercase tracking-[1.5px] transition ${
                    selectedCategory === "all"
                      ? "bg-[#491225] text-[#F5E8D5]"
                      : "border border-[#491225] hover:bg-[#491225] hover:text-[#F5E8D5]"
                  }`}
                >
                  All
                </button>

                {/* Category Buttons */}
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.slug)}
                    className={`px-5 py-2 text-xs uppercase tracking-[1.5px] transition ${
                      selectedCategory === category.slug
                        ? "bg-[#491225] text-[#F5E8D5]"
                        : "border border-[#491225] hover:bg-[#491225] hover:text-[#F5E8D5]"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}

              </div>

              {/* Sort and Product Count */}
              <div className="flex items-center justify-between border-b border-[#491225]/20 pb-5">

                <p className="text-xs tracking-wide text-[#72515A]">
                  {filteredProducts.length} Products
                </p>

                <select
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent px-2 py-2 text-xs text-[#491225] outline-none"
                >
                  <option value="default">Sort: Featured</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                </select>

              </div>

            </div>
          </section>

          {/* Products */}
          <section className="px-5 pb-16 md:px-10 lg:px-14">
            <div className="mx-auto max-w-[1200px]">

              {loading ? (
                <div className="flex min-h-[40vh] items-center justify-center">
                  <p className="text-xs uppercase tracking-[2px]">
                    Loading collections...
                  </p>
                </div>
              ) : error ? (
                <div className="flex min-h-[40vh] items-center justify-center text-center">
                  <p className="text-sm">{error}</p>
                </div>
              ) : paginatedProducts.length === 0 ? (
                <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">

                  <Search size={30} strokeWidth={1} />

                  <p className="font-serif text-2xl">
                    No products found
                  </p>

                  <p className="text-sm text-[#72515A]">
                    Try another name or category.
                  </p>

                  {(debouncedQuery || selectedCategory !== "all") && (
                    <button
                      onClick={() => {
                        clearSearch();
                        handleCategoryChange("all");
                      }}
                      className="mt-2 border border-[#491225] px-6 py-3 text-xs uppercase tracking-[1.5px] transition hover:bg-[#491225] hover:text-[#F5E8D5]"
                    >
                      View All Products
                    </button>
                  )}

                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">

                  {paginatedProducts.map((product) => (
                    <article
                      key={product.id}
                      className="group min-w-0"
                    >

                      {/* Product Image */}
                      <Link
                        to={`/product/${product.id}`}
                        className="block"
                      >
                        <div className="aspect-square overflow-hidden bg-[#F5E8D5]">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        </div>
                      </Link>

                      {/* Product Information */}
                      <Link
                        to={`/product/${product.id}`}
                        className="block bg-[#491225] px-3 py-5 text-center text-[#F5E8D5] transition hover:opacity-95"
                      >
                        <p className="text-[9px] uppercase tracking-[2px] text-[#D8C3C7]">
                          {product.category}
                        </p>

                        <h3 className="mt-2 line-clamp-2 font-serif text-base leading-6 md:text-lg">
                          {product.name}
                        </h3>

                        <p className="mt-3 text-xs tracking-wide">
                          {formatPrice(product.price)}
                        </p>
                      </Link>

                    </article>
                  ))}

                </div>
              )}

              {/* Pagination */}
              {!loading && !error && totalPages > 1 && (
                <div className="mt-14 flex items-center justify-center gap-3">

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`flex h-10 w-10 items-center justify-center text-xs transition ${
                        currentPage === page
                          ? "bg-[#491225] text-[#F5E8D5]"
                          : "border border-[#491225] hover:bg-[#491225] hover:text-[#F5E8D5]"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                </div>
              )}

            </div>
          </section>

        </div>
      </SiteFrame>
    </main>
  );
}
