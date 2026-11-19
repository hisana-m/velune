
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Necklaces",
    slug: "necklaces",
    image: "/images/categories/necklaces.jpg",
  },
  {
    name: "Earrings",
    slug: "earrings",
    image: "/images/categories/earrings.jpg",
  },
  {
    name: "Rings",
    slug: "rings",
    image: "/images/categories/rings.jpg",
  },
  {
    name: "Bracelets",
    slug: "bracelets",
    image: "/images/categories/bracelets.jpg",
  },
];

export default function Categories() {
  return (
    <section className="w-full bg-[#F5E8D5] px-5 md:px-10 lg:px-14 pt-16 md:pt-20 pb-16 md:pb-20">
      <div className="max-w-[1200px] mx-auto">

        {/* Heading */}
        <div className="mb-8 md:mb-10">
          <p className="text-[9px] md:text-[10px] tracking-[4px] text-[#8B7276] uppercase mb-3">
            Shop By
          </p>

          <h2 className="font-serif text-4xl md:text-5xl text-[#491225]">
            Categories
          </h2>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">

          {categories.map((category) => (
            <Link
              to={`/collections?category=${category.slug}`}
              key={category.slug}
              className="group block min-w-0"
            >
              {/* Category Image */}
              <div className="aspect-square overflow-hidden bg-[#491225]">
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Category Name */}
              <div className="flex items-center justify-between pt-4">
                <h3 className="font-serif text-base md:text-lg text-[#491225]">
                  {category.name}
                </h3>

                <span className="text-[#491225] transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>
          ))}

        </div>
      </div>
    </section>
  );
}
