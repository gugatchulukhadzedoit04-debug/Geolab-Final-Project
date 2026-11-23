import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { useLanguage } from "../context/LanguageContext";
import { HOME_HIGHLIGHT_ITEMS, BUNDLE_ITEMS } from "../data/storeItems";
import { useCart } from "../context/CartContext";
import heroSlide1 from "../assets/images/hero-slide-1.webp";
import heroSlide2 from "../assets/images/hero-slide-2.webp";
import heroSlide3 from "../assets/images/hero-slide-3.webp";
import heroSlide4 from "../assets/images/hero-slide-4.webp";
import displateBanner from "../assets/images/displate-banner.webp";

const HOME_LABELS = {
  en: {
    shopNow: "SHOP NOW",
    storeHighlights: "Store Highlights",
    bundles: "Bundles",
    exploreMore: "Explore more options",
    displateShop: "Displate Shop",
    dismiss: "Dismiss",
  },
  ka: {
    shopNow: "იყიდე ახლავე",
    storeHighlights: "მაღაზიის რჩეულები",
    bundles: "ნაკრებები",
    exploreMore: "მეტი ვარიანტის ნახვა",
    displateShop: "Displate მაღაზია",
    dismiss: "დახურვა",
  },
};

const HERO_SLIDES = [
  {
    id: 1,
    alt: "Hunt: Showdown 1896",
    image: heroSlide1,
    ctaHref: "/games",
    tag: { en: "OUT NOW", ka: "ხელმისაწვდომია" },
    title: { en: "HUNT: SHOWDOWN 1896", ka: "HUNT: SHOWDOWN 1896" },
    subtitle: {
      en: "Enter a dark, atmospheric world where every gunshot echoes and every bounty comes at a deadly price.",
      ka: "შეაბიჯე ბნელ სამყაროში, სადაც ყოველი გასროლა ისმის და ყოველ ნადავლს თავისი ფასი აქვს.",
    },
  },
  {
    id: 2,
    alt: "Hunt: Showdown 1896 DLCs",
    image: heroSlide2,
    ctaHref: "/dlc",
    tag: { en: "LEGENDARY HUNTERS & GEAR", ka: "ლეგენდარული მონადირეები" },
    title: { en: "EXPAND YOUR ARSENAL", ka: "გააფართოვე არსენალი" },
    subtitle: {
      en: "Unlock new Legendary Hunters, cursed weapons, and exclusive equipment for the bayou and mountains.",
      ka: "გახსენი ახალი ლეგენდარული მონადირეები, იარაღები და უნიკალური აღჭურვილობა.",
    },
  },
  {
    id: 3,
    alt: "Bundles & Special Offers",
    image: heroSlide3,
    ctaHref: "/special-offers",
    tag: { en: "LIMITED BUNDLE DEALS", ka: "სპეციალური შეთავაზებები" },
    title: {
      en: "STARTER & DELUXE EDITIONS",
      ka: "სასტარტო და დელუქს გამოცემები",
    },
    subtitle: {
      en: "Save big on complete game editions, Crysis Remastered Trilogy, and collector soundtrack bundles.",
      ka: "დაზოგე სრულ გამოცემებზე, Crysis Remastered ტრილოგიასა და საუნდტრეკების პაკეტებზე.",
    },
  },
  {
    id: 4,
    alt: "Crysis Remastered Trilogy",
    image: heroSlide4,
    ctaHref: "/games",
    tag: { en: "MAXIMUM ARMOR", ka: "მაქსიმალური ჯავშანი" },
    title: { en: "CRYSIS REMASTERED", ka: "CRYSIS REMASTERED" },
    subtitle: {
      en: "Experience the iconic Nanosuit trilogy rebuilt with enhanced textures, lighting, and high-definition visuals.",
      ka: "გამოსცადე ლეგენდარული ნანოკოსტუმის ტრილოგია გაუმჯობესებული გრაფიკითა და განათებით.",
    },
  },
];

const DISPLATE_URL = "https://displate.com/";

const HomePage = () => {
  const { lang } = useLanguage();
  const t = HOME_LABELS[lang];
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [activeSlide, setActiveSlide] = useState(0);
  const [notice, setNotice] = useState("");
  const currentSlide = HERO_SLIDES[activeSlide];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleBuyNow = (item) => {
    navigate("/account", { state: { buyNowItem: item } });
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    setNotice(
      lang === "ka"
        ? `"${item.title}" დაემატა კალათაში.`
        : `Added "${item.title}" to cart.`,
    );
  };

  return (
    <main className="w-full min-h-screen bg-zinc-950 text-zinc-100 pb-16">
      {/* 1. Hero Section */}
      <section
        aria-label="Featured Store Promotions"
        className="relative w-full h-[370px] sm:h-[450px] lg:h-[520px] overflow-hidden bg-zinc-900 border-b border-zinc-800"
      >
        {currentSlide.image ? (
          <img
            src={currentSlide.image}
            alt={currentSlide.alt}
            className="w-full h-full object-cover object-center transition-opacity duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#27272A] via-zinc-900 to-zinc-950">
            <span className="text-xs sm:text-sm uppercase tracking-[0.25em] text-zinc-500 border border-dashed border-zinc-700 px-6 py-3 rounded">
              {currentSlide.alt}
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/55 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-transparent to-transparent" />

        {/* SHOP NOW Button */}
        <div className="absolute bottom-8 left-6 right-6 sm:bottom-12 sm:left-12 md:left-[10%] md:right-auto max-w-xl z-10 space-y-3 sm:space-y-4">
          <span className="inline-block px-2.5 py-1 rounded bg-[#27272A]/90 border border-indigo-400/50 text-[11px] font-bold tracking-[0.18em] uppercase text-indigo-400">
            {currentSlide.tag[lang]}
          </span>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-wider uppercase text-zinc-100 leading-tight drop-shadow">
            {currentSlide.title[lang]}
          </h1>

          <p className="text-xs sm:text-sm lg:text-base text-zinc-300 leading-relaxed line-clamp-2 sm:line-clamp-3">
            {currentSlide.subtitle[lang]}
          </p>

          <div className="pt-1">
            <Link
              to={currentSlide.ctaHref}
              className="
                inline-block px-7 py-3.5 rounded-md
                bg-[#27272A] hover:bg-indigo-500
                border border-zinc-600 hover:border-indigo-400
                text-xs sm:text-sm font-bold tracking-[0.18em] uppercase text-zinc-100
                shadow-lg transition-colors
              "
            >
              {t.shopNow}
            </Link>
          </div>
        </div>

        {/* 4-Slide Dots */}
        <div className="absolute bottom-5 right-6 sm:right-12 md:right-[10%] z-10 flex items-center space-x-2.5">
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2.5 rounded-full transition-all cursor-pointer ${
                activeSlide === index
                  ? "w-8 bg-indigo-400"
                  : "w-2.5 bg-zinc-500/70 hover:bg-zinc-300"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Main Content Container */}
      <div className="w-full px-4 sm:px-6 md:w-[84%] md:px-0 lg:w-[80%] mx-auto space-y-16 mt-12">
        {notice && (
          <div
            role="status"
            className="px-4 py-3 rounded-md bg-[#27272A] border border-indigo-400/60 text-sm text-zinc-100 flex items-center justify-between"
          >
            <span>{notice}</span>
            <button
              type="button"
              onClick={() => setNotice("")}
              className="text-xs uppercase tracking-wider text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              {t.dismiss}
            </button>
          </div>
        )}

        {/* 2. Store Highlights Section */}
        <section
          aria-labelledby="store-highlights-heading"
          className="w-full lg:max-h-[560px] flex flex-col justify-between"
        >
          <h2
            id="store-highlights-heading"
            className="text-xl sm:text-2xl font-bold tracking-wider uppercase text-zinc-100 mb-6"
          >
            {t.storeHighlights}
          </h2>

          <div className="flex flex-wrap gap-5">
            {HOME_HIGHLIGHT_ITEMS.map((item) => (
              <Card
                key={item.id}
                item={item}
                onBuyNow={handleBuyNow}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <Link
              to="/games"
              className="text-sm font-semibold tracking-wide text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {t.exploreMore} →
            </Link>
          </div>
        </section>

        {/* 3. Bundles Section */}
        <section
          aria-labelledby="bundles-heading"
          className="w-full lg:max-h-[560px] flex flex-col justify-between"
        >
          <h2
            id="bundles-heading"
            className="text-xl sm:text-2xl font-bold tracking-wider uppercase text-zinc-100 mb-6"
          >
            {t.bundles}
          </h2>

          <div className="flex flex-wrap gap-5">
            {BUNDLE_ITEMS.map((item) => (
              <Card
                key={item.id}
                item={item}
                onBuyNow={handleBuyNow}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <Link
              to="/special-offers"
              className="text-sm font-semibold tracking-wide text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {t.exploreMore} →
            </Link>
          </div>
        </section>
      </div>

      {/* 4. Displate Section */}
      <section
        aria-label="Displate Official Merchandise"
        className="relative w-full h-[300px] sm:h-[380px] lg:h-[450px] mt-16 overflow-hidden bg-zinc-900 border-y border-zinc-800"
      >
        <img
          src={displateBanner}
          alt="Displate Official Metal Posters"
          className="w-full h-full object-cover object-center"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/25 to-transparent" />

        <div className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-10">
          <a
            href={DISPLATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="
      inline-block px-7 py-3.5 rounded-md
      bg-[#27272A] hover:bg-indigo-500
      border border-zinc-600 hover:border-indigo-400
      text-xs sm:text-sm font-bold tracking-[0.18em] uppercase text-zinc-100
      shadow-lg transition-colors whitespace-nowrap
    "
          >
            {t.displateShop}
          </a>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
