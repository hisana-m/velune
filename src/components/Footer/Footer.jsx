
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    setMessage("Thank you for your interest in VÉLUNE!");
    setEmail("");
  };

  const footerLinks = [
    {
      title: "Shop",
      links: [
        ["All Jewellery", "/collections"],
        ["Necklaces", "/collections/necklaces"],
        ["Earrings", "/collections/earrings"],
        ["Rings", "/collections/rings"],
        ["Bracelets", "/collections/bracelets"],
      ],
    },
    {
      title: "About",
      links: [
        ["Our Story", "/about"],
        ["Our Craft", "/about#craft"],
        ["Contact Us", "/contact"],
      ],
    },
    {
      title: "Customer Care",
      links: [
        ["FAQs", "/faq"],
        ["Shipping & Delivery", "/shipping"],
        ["Returns & Exchanges", "/returns"],
        ["Care Guide", "/care-guide"],
      ],
    },
  ];

  return (
    <footer className="w-full bg-[#F5E8D5] text-[#491225]">

      {/* Main Footer */}
      <div className="w-full px-5 md:px-12 lg:px-20 pt-10 md:pt-12 pb-8 md:pb-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">

          {/* Brand */}
          <div className="lg:col-span-2 lg:pr-10">

            <a href="/" className="inline-block">
              <h2 className="font-serif text-3xl md:text-4xl tracking-[3px] mb-3">
                VÉLUNE
              </h2>
            </a>

            <p className="text-xs md:text-sm leading-6 max-w-sm text-[#72515A] mb-5">
              Timeless elegance, thoughtfully crafted.
              Discover jewellery that celebrates your
              individuality and makes every moment special.
            </p>

            {/* Newsletter */}
            <p className="text-[9px] tracking-[2.5px] uppercase mb-3">
              Join the VÉLUNE world
            </p>

            <form
              onSubmit={handleSubscribe}
              className="flex max-w-sm border-b border-[#491225]/40"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="min-w-0 flex-1 bg-transparent py-2.5 text-xs outline-none placeholder:text-[#9B7D7D]"
              />

              <button
                type="submit"
                className="text-[9px] tracking-[2px] uppercase hover:opacity-60 transition"
              >
                Join ↗
              </button>
            </form>

            {message && (
              <p className="mt-2 text-xs text-[#72515A]" role="status">
                {message}
              </p>
            )}

            {/* Social Links */}
            <div className="flex gap-5 mt-5">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="text-base hover:opacity-50 transition"
              >
                ◎
              </a>

              <a
                href="mailto:hello@velune.com"
                aria-label="Email VÉLUNE"
                className="text-base hover:opacity-50 transition"
              >
                ✉
              </a>
            </div>

          </div>

          {/* Footer Link Columns */}
          {footerLinks.map((column) => (
            <div key={column.title}>

              <h3 className="text-[10px] tracking-[2px] uppercase font-semibold mb-4">
                {column.title}
              </h3>

              <ul className="space-y-2.5">
                {column.links.map(([name, href]) => (
                  <li key={name}>
                    <a
                      href={href}
                      className="text-xs md:text-sm text-[#72515A] hover:text-[#491225] transition"
                    >
                      {name}
                    </a>
                  </li>
                ))}
              </ul>

            </div>
          ))}

        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-[#491225]/20 px-5 md:px-12 lg:px-20 py-5">

        <div className="flex flex-col md:flex-row items-center justify-between gap-3">

          <p className="text-[11px] text-[#72515A]">
            © 2026 VÉLUNE. All rights reserved.
          </p>

          <p className="text-[9px] tracking-[2px] uppercase text-[#72515A]">
            Elegance in every detail.
          </p>

          <a
            href="/about"
            className="text-[9px] tracking-[2px] uppercase hover:opacity-50 transition"
          >
            Discover VÉLUNE ↗
          </a>

        </div>

      </div>

    </footer>
  );
}
