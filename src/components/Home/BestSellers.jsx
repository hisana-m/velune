
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBestSellers } from "../../data/products";
import ProductCard from "./ProductCard";

export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBestSellers() {
      try {
        const data = await getBestSellers();
        setProducts(data);
      } catch (error) {
        console.error("Best sellers error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadBestSellers();
  }, []);

  return (
    <section className="bg-[#F5E8D5] px-5 py-16 md:px-10 md:py-20 lg:px-14">
      <div className="mx-auto max-w-[1200px]">

        {/* Section Heading */}
        <div className="mb-9 flex items-end justify-between">
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[3px] text-[#8B7276]">
              Most Loved
            </p>

            <h2 className="font-serif text-3xl text-[#491225] md:text-4xl">
              Best Sellers
            </h2>
          </div>

          <Link
            to="/collections"
            className="border-b border-[#491225] pb-2 text-[10px] uppercase tracking-[2px] text-[#491225] transition hover:opacity-60"
          >
            View All
          </Link>
        </div>

        {/* Products */}
        {loading ? (
          <p className="py-12 text-center text-sm text-[#491225]">
            Loading products...
          </p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:gap-5 lg:grid-cols-4">
            {products.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-[#491225]">
            No best-selling products available.
          </p>
        )}

      </div>
    </section>
  );
}
