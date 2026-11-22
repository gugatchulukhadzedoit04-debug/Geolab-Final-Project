import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import { useLanguage } from "../context/LanguageContext";

const HOME_LABELS = {
  en: {
    shopNow: "SHOP NOW",
    storeHighlights: "Store Highlights",
    bundles: "Bundles",
    exploreMore: "Explore more options",
    displateShop: "Displate Shop",
  },
  ka: {
    shopNow: "იყიდე ახლავე",
    storeHighlights: "მაღაზიის რჩეულები",
    bundles: "ნაკრებები",
    exploreMore: "მეტი ვარიანტის ნახვა",
    displateShop: "Displate მაღაზია",
  },
};

// Replace `image` values with local asset imports (e.g. `import slide1 from "../assets/images/..."`)
const HERO_SLIDES = [
  {
    id: 1,
    alt: "Hero Slide 1 Placeholder",
    image: "",
    ctaHref: "#advertiser-1",
  },
  {
    id: 2,
    alt: "Hero Slide 2 Placeholder",
    image: "",
    ctaHref: "#advertiser-2",
  },
  {
    id: 3,
    alt: "Hero Slide 3 Placeholder",
    image: "",
    ctaHref: "#advertiser-3",
  },
  {
    id: 4,
    alt: "Hero Slide 4 Placeholder",
    image: "",
    ctaHref: "#advertiser-4",
  },
];

// Temporary placeholder arrays until you move card data into dedicated files
const STORE_HIGHLIGHTS = [
  { id: "hl-1", title: "Highlight Item 1", price: "$29.99", image: "" },
  { id: "hl-2", title: "Highlight Item 2", price: "$39.99", image: "" },
  { id: "hl-3", title: "Highlight Item 3", price: "$19.99", image: "" },
  { id: "hl-4", title: "Highlight Item 4", price: "$49.99", image: "" },
];

const BUNDLE_ITEMS = [
  { id: "bnd-1", title: "Bundle Pack 1", price: "$59.99", image: "" },
  { id: "bnd-2", title: "Bundle Pack 2", price: "$74.99", image: "" },
  { id: "bnd-3", title: "Bundle Pack 3", price: "$44.99", image: "" },
  { id: "bnd-4", title: "Bundle Pack 4", price: "$89.99", image: "" },
];

const DISPLATE_URL = "https://displate.com/";

const HomePage = () => {
  const { lang } = useLanguage();
  const t = HOME_LABELS[lang];
  const [activeSlide, setActiveSlide] = useState(0);
  const currentSlide = HERO_SLIDES[activeSlide];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="w-full bg-zinc-950 text-zinc-100 pb-16">
      {/* Section #1: Hero Carousel (~420px height, full width) */}
      <section
        aria-label="Featured Hero Carousel"
        className="relative w-full h-[420px] bg-zinc-900 overflow-hidden border-b border-zinc-800"
      >
        {currentSlide.image ? (
          <img
            src={currentSlide.image}
            alt={currentSlide.alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-zinc-500 text-sm tracking-widest uppercase">
            Hero Slide {activeSlide + 1} Image Placeholder
          </div>
        )}

        {/* Subtle dark scrim so the right-side CTA stands out over photos */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black/65 via-black/25 to-transparent" />

        {/* Right-half CTA (~20% from right wall, centered vertically around 50%) */}
        <a
          href={currentSlide.ctaHref}
          className="
            absolute top-1/2 -translate-y-1/2
            right-[8%] sm:right-[14%] md:right-[20%]
            px-6 py-3 rounded-md
            bg-[#27272A]/95 hover:bg-indigo-500
            border border-zinc-600 hover:border-indigo-400
            text-xs sm:text-sm font-bold tracking-widest uppercase text-zinc-100
            shadow-lg transition-colors cursor-pointer
          "
        >
          {t.shopNow}
        </a>

        {/* 4 Manual Navigation Dots at Bottom */}
        <div
          role="tablist"
          aria-label="Hero slide selectors"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10"
        >
          {HERO_SLIDES.map((slide, index) => {
            const isSelected = index === activeSlide;
            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={`Show slide ${index + 1}`}
                onClick={() => setActiveSlide(index)}
                className={`h-3 rounded-full transition-all cursor-pointer ${
                  isSelected
                    ? "w-7 bg-indigo-400"
                    : "w-3 bg-zinc-400/70 hover:bg-zinc-200"
                }`}
              />
            );
          })}
        </div>
      </section>

      {/* Responsive Container: Phone full width, Tablet ~84%, Desktop ~80% */}
      <div className="w-full px-4 sm:px-6 md:w-[84%] md:px-0 lg:w-[80%] mx-auto space-y-14 mt-12">
        {/* Section #2: Store Highlights */}
        <section
          aria-labelledby="store-highlights-heading"
          className="flex flex-col max-h-none lg:max-h-[530px]"
        >
          <h2
            id="store-highlights-heading"
            className="text-2xl sm:text-3xl font-bold tracking-wider uppercase text-zinc-100 mb-6"
          >
            {t.storeHighlights}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 overflow-hidden">
            {STORE_HIGHLIGHTS.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>

          <div className="mt-6 flex justify-start">
            <Link
              to="/games"
              className="text-sm font-semibold tracking-wider text-zinc-200 hover:text-indigo-400 transition-colors"
            >
              {t.exploreMore}
            </Link>
          </div>
        </section>

        {/* Section #3: Bundles */}
        <section
          aria-labelledby="bundles-heading"
          className="flex flex-col max-h-none lg:max-h-[530px]"
        >
          <h2
            id="bundles-heading"
            className="text-2xl sm:text-3xl font-bold tracking-wider uppercase text-zinc-100 mb-6"
          >
            {t.bundles}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 overflow-hidden">
            {BUNDLE_ITEMS.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>

          <div className="mt-6 flex justify-start">
            <Link
              to="/special-offers"
              className="text-sm font-semibold tracking-wider text-zinc-200 hover:text-indigo-400 transition-colors"
            >
              {t.exploreMore}
            </Link>
          </div>
        </section>

        {/* Section #4: Displate Shop Banner (~488px height) */}
        <section
          aria-label="Displate Metal Posters Store"
          className="relative w-full h-[488px] rounded-md overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center"
        >
          {/* Swap in a Displate banner <img> here when ready */}
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 flex items-center justify-center">
            <span className="text-zinc-600 text-xs sm:text-sm tracking-widest uppercase">
              Displate Section Background Placeholder
            </span>
          </div>

          <a
            href={DISPLATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="
              relative z-10 px-7 py-3.5 rounded-md
              bg-[#27272A] hover:bg-indigo-500
              border border-zinc-600 hover:border-indigo-400
              text-sm font-bold tracking-widest uppercase text-zinc-100
              shadow-xl transition-colors cursor-pointer
            "
          >
            {t.displateShop}
          </a>
        </section>
      </div>
    </main>
  );
};

export default HomePage;
