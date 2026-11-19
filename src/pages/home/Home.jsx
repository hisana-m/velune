
import heroImage from "../../assets/hero.png";
import waveImage from "../../assets/wave.png";

import Categories from "../../components/Home/Categories";
import BestSellers from "../../components/Home/BestSellers";
import SiteFrame from "../../components/SiteFrame";

export default function Home() {
  return (
    <main className="w-full bg-[#491225]">

      {/* Full-width Hero */}
      <section
        id="home-hero"
        className="relative z-20 w-full"
      >

        {/* Hero Image */}
        <div className="relative w-full h-[580px] md:h-[680px] lg:h-[760px] overflow-hidden bg-[#350B19]">

          <img
            src={heroImage}
            alt="VÉLUNE luxury jewellery"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: "center 85%" }}
          />

        </div>

        {/* Wave at Hero and Categories Boundary */}
        <img
          src={waveImage}
          alt=""
          aria-hidden="true"
          className="absolute left-0 bottom-[-18px] z-30 w-full h-[25px] md:h-[40px] object-fill pointer-events-none"
        />

      </section>

      {/* Complete Burgundy Frame */}
      <SiteFrame>
        <Categories />
        <BestSellers />
      </SiteFrame>

    </main>
  );
}
