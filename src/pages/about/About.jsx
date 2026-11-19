
import { Link } from "react-router-dom";
import SiteFrame from "../../components/SiteFrame";

export default function About() {
  const gold = [
    {
      title: "24 Karat",
      purity: "99.9% GOLD",
      description:
        "The purest form of gold, admired for its rich natural colour and exceptional purity. Its softness makes it less suitable for many everyday jewellery designs.",
    },
    {
      title: "22 Karat",
      purity: "91.6% GOLD",
      description:
        "Celebrated for its warm golden appearance, 22-karat gold is traditionally used in beautifully crafted gold jewellery.",
    },
    {
      title: "18 Karat",
      purity: "75% GOLD",
      description:
        "A beautiful balance of gold and strength. 18-karat gold is a popular choice for fine jewellery and diamond settings.",
    },
  ];

  const diamonds = [
    {
      title: "Cut",
      description:
        "The way a diamond's facets interact with light determines its brilliance, sparkle and overall beauty.",
    },
    {
      title: "Colour",
      description:
        "Colour describes how colourless a white diamond appears, generally graded from D to Z.",
    },
    {
      title: "Clarity",
      description:
        "Clarity refers to the natural internal characteristics and surface features within a diamond.",
    },
    {
      title: "Carat",
      description:
        "Carat measures diamond weight. One carat equals 200 milligrams, although weight and visible size are not the same.",
    },
  ];

  return (
    <main className="w-full bg-[#491225]">
      <SiteFrame>
        <div className="bg-[#F5E8D5] text-[#491225] overflow-hidden">

          {/* INTRO */}
          <section className="px-6 md:px-14 lg:px-24 pt-28 pb-24 md:pt-40 md:pb-36">
            <div className="max-w-7xl mx-auto">

              <p className="text-[10px] tracking-[5px] uppercase text-[#8B7276] mb-9">
                A World of Elegance · VÉLUNE
              </p>

              <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-[110px] leading-[0.95] font-normal">
                Beauty,
                <span className="block ml-8 md:ml-32 italic">
                  made timeless.
                </span>
              </h1>

              <div className="mt-14 md:mt-20 grid md:grid-cols-2 gap-8 items-end">
                <p className="font-serif text-2xl md:text-3xl leading-snug max-w-lg">
                  Jewellery is not simply worn. It becomes part of
                  the moments we remember.
                </p>

                <p className="text-sm leading-8 text-[#72515A] max-w-md md:ml-auto">
                  At VÉLUNE, we celebrate the enduring beauty of gold
                  and diamonds through jewellery that reflects
                  individuality, elegance and personal expression.
                </p>
              </div>
            </div>
          </section>

          {/* BRAND STORY */}
          <section className="px-6 md:px-14 lg:px-24 pb-28 md:pb-40">
            <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-10 md:gap-12 items-center">

              <div className="md:col-span-7">
                <img
                  src="/images/about-jwellery.jpg"
                  alt="Elegant gold and diamond jewellery"
                  className="w-full h-[420px] md:h-[680px] object-cover"
                />
              </div>

              <div className="md:col-span-5 md:pl-8 lg:pl-12">
                <p className="text-[10px] tracking-[4px] uppercase text-[#8B7276] mb-8">
                  The VÉLUNE Story
                </p>

                <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.02] font-normal mb-9">
                  An expression
                  <span className="block italic">
                    of you.
                  </span>
                </h2>

                <p className="text-sm leading-8 text-[#72515A] mb-6">
                  VÉLUNE was created with a passion for fine jewellery
                  and the belief that every piece should hold meaning.
                  Our collections bring together the warm glow of gold
                  and the captivating sparkle of diamonds.
                </p>

                <p className="text-sm leading-8 text-[#72515A] mb-10">
                  From everyday elegance to life's most memorable
                  occasions, we celebrate designs that complement
                  your personal style and remain beautiful beyond
                  passing trends.
                </p>

                <Link
                  to="/collections"
                  className="inline-block bg-[#491225] text-[#F5E8D5] px-9 py-4 text-[10px] tracking-[2px] uppercase hover:bg-[#350B19] transition"
                >
                  Explore Jewellery
                </Link>
              </div>
            </div>
          </section>

          {/* GOLD */}
          <section className="bg-[#491225] text-[#F5E8D5] px-6 md:px-14 lg:px-24 py-24 md:py-36">
            <div className="max-w-7xl mx-auto">

              <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-end mb-16 md:mb-24">

                <div>
                  <p className="text-[10px] tracking-[4px] uppercase text-[#C4A9AF] mb-8">
                    The Art of Gold
                  </p>

                  <h2 className="font-serif text-6xl md:text-7xl lg:text-8xl font-normal leading-none">
                    Golden
                    <span className="block italic">heritage.</span>
                  </h2>
                </div>

                <p className="text-sm leading-8 text-[#E5D5D8] max-w-md">
                  Gold has been treasured across generations for its
                  natural beauty, rarity and lasting appeal. Its purity
                  is measured in karats, with each variation offering
                  its own characteristics.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {gold.map((item, index) => (
                  <div
                    key={item.title}
                    className={`p-8 md:p-10 min-h-[310px] flex flex-col justify-between ${
                      index === 1
                        ? "bg-[#F5E8D5] text-[#491225]"
                        : "bg-[#5A2033] text-[#F5E8D5]"
                    }`}
                  >
                    <div>
                      <p className={`text-[10px] tracking-[3px] mb-8 ${
                        index === 1 ? "text-[#8B7276]" : "text-[#D8C3C7]"
                      }`}>
                        {item.purity}
                      </p>

                      <h3 className="font-serif text-4xl md:text-5xl mb-5">
                        {item.title}
                      </h3>
                    </div>

                    <p className={`text-sm leading-8 ${
                      index === 1 ? "text-[#72515A]" : "text-[#E5D5D8]"
                    }`}>
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-[10px] leading-6 text-[#C4A9AF] mt-8">
                Gold purity should be verified through the appropriate
                hallmark or purity documentation.
              </p>
            </div>
          </section>

          {/* DIAMONDS */}
          <section className="px-6 md:px-14 lg:px-24 py-28 md:py-40">
            <div className="max-w-7xl mx-auto">

              <div className="grid md:grid-cols-2 gap-12 md:gap-20 mb-16 md:mb-24 items-end">

                <div>
                  <p className="text-[10px] tracking-[4px] uppercase text-[#8B7276] mb-8">
                    The Art of Diamonds
                  </p>

                  <h2 className="font-serif text-6xl md:text-7xl lg:text-8xl leading-none font-normal">
                    A natural
                    <span className="block italic">brilliance.</span>
                  </h2>
                </div>

                <p className="text-sm leading-8 text-[#72515A] max-w-md">
                  Every diamond tells a story through its unique
                  characteristics. The four Cs provide a recognised
                  way to understand its quality, beauty and value.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {diamonds.map((item, index) => (
                  <div
                    key={item.title}
                    className="bg-[#EFE0CE] p-8 md:p-11 min-h-[220px]"
                  >
                    <div className="flex items-start justify-between gap-4 mb-8">
                      <h3 className="font-serif text-4xl md:text-5xl">
                        {item.title}
                      </h3>

                      <span className="font-serif italic text-2xl text-[#A78A83]">
                        {["I", "II", "III", "IV"][index]}
                      </span>
                    </div>

                    <p className="text-sm leading-8 text-[#72515A] max-w-lg">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* BRAND VALUES */}
          <section className="bg-[#EBDCC9] px-6 md:px-14 lg:px-24 py-24 md:py-32">
            <div className="max-w-7xl mx-auto">

              <p className="text-[10px] tracking-[4px] uppercase text-[#8B7276] mb-8">
                What We Believe In
              </p>

              <h2 className="font-serif text-5xl md:text-7xl leading-tight font-normal mb-16">
                The values behind
                <span className="block italic">every detail.</span>
              </h2>

              <div className="grid md:grid-cols-3 gap-12 md:gap-16">
                <div>
                  <h3 className="font-serif text-3xl mb-5">Quality</h3>
                  <p className="text-sm leading-8 text-[#72515A]">
                    An appreciation for fine materials, gold purity
                    and the characteristics that make jewellery special.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-3xl mb-5">Craftsmanship</h3>
                  <p className="text-sm leading-8 text-[#72515A]">
                    Thoughtful design and attention to detail,
                    bringing together beauty and individuality.
                  </p>
                </div>

                <div>
                  <h3 className="font-serif text-3xl mb-5">Timelessness</h3>
                  <p className="text-sm leading-8 text-[#72515A]">
                    Designs that celebrate personal style and
                    meaningful occasions beyond passing trends.
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* FINAL CALL TO ACTION */}
          <section className="bg-[#491225] text-[#F5E8D5] px-6 md:px-14 lg:px-24 py-28 md:py-40">
            <div className="max-w-4xl mx-auto text-center">

              <p className="text-[10px] tracking-[5px] uppercase text-[#C4A9AF] mb-10">
                Discover VÉLUNE
              </p>

              <h2 className="font-serif text-6xl md:text-8xl leading-[0.98] font-normal mb-10">
                Your story.
                <span className="block italic">Your elegance.</span>
              </h2>

              <p className="text-sm leading-8 text-[#E5D5D8] max-w-xl mx-auto mb-12">
                Discover jewellery that celebrates who you are
                and the moments that make life beautiful.
              </p>

              <Link
                to="/collections"
                className="inline-block bg-[#F5E8D5] text-[#491225] px-12 py-5 text-[10px] tracking-[3px] uppercase hover:bg-white transition"
              >
                View Collections
              </Link>

            </div>
          </section>

        </div>
      </SiteFrame>
    </main>
  );
}
