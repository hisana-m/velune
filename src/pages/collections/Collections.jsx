
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getCategories,
  getProducts,
  formatPrice,
} from "../../data/products";
import SiteFrame from "../../components/SiteFrame";
import { Search, X } from "lucide-react";

export default function Collections() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryFromUrl = searchParams.get("category") || "all";

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const productsPerPage = 12;

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

  // Search Products
  const searchedProducts = products.filter((product) => {
    const search = searchQuery.trim().toLowerCase();

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
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Clear Search
  const clearSearch = () => {
    setSearchQuery("");
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
            <div className="mx-auto max-w-[650px]">
              <div className="flex items-center border-b border-[#491225] py-3 transition focus-within:border-b-2">

                <Search
                  size={19}
                  strokeWidth={1.5}
                  className="mr-4 shrink-0 text-[#491225]"
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search jewellery..."
                  className="w-full bg-transparent text-sm text-[#491225] outline-none placeholder:text-[#806E6D]"
                />

                {searchQuery && (
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

              {searchQuery.trim() && (
                <p className="mt-3 text-xs tracking-wide text-[#806E6D]">
                  Search results for "{searchQuery}"
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

                  {(searchQuery || selectedCategory !== "all") && (
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
