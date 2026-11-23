import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { useLanguage } from "../context/LanguageContext";
import { GAMES_ITEMS, RECOMMENDED_DLC_ITEMS } from "../data/storeItems";
import { useCart } from "../context/CartContext";

const assetModules = import.meta.glob(
  "../assets/images/*.{png,jpg,jpeg,webp,avif}",
  { eager: true, import: "default" },
);

const IMAGE_MAP = Object.entries(assetModules).reduce((acc, [path, url]) => {
  const fileName = path
    .split("/")
    .pop()
    ?.replace(/\.[^/.]+$/, "");
  if (fileName) {
    acc[fileName] = url;
  }
  return acc;
}, {});

const GAMES_LABELS = {
  en: {
    heroTitle: "Our Games",
    heroSubtitle:
      "Action-packed AAA games made on the most powerful game development platform",
    gamesHeading: "Games",
    recommendationsHeading: "Our Recommendations",
    dismiss: "Dismiss",
  },
  ka: {
    heroTitle: "ჩვენი თამაშები",
    heroSubtitle:
      "მძაფრსიუჟეტიანი AAA თამაშები, შექმნილი თამაშების განვითარების უძლიერეს პლატფორმაზე",
    gamesHeading: "თამაშები",
    recommendationsHeading: "ჩვენი რეკომენდაციები",
    dismiss: "დახურვა",
  },
};

// Optional filename key in `src/assets/images/` (e.g. "games-hero" -> games-hero.jpg)
const HERO_IMAGE_KEY = "games-hero";

const GamesPage = () => {
  const { lang } = useLanguage();
  const t = GAMES_LABELS[lang];
  const navigate = useNavigate();
  const [notice, setNotice] = useState("");
  const heroImage = IMAGE_MAP[HERO_IMAGE_KEY] || "";

  const handleBuyNow = (item) => {
    navigate("/account", { state: { buyNowItem: item } });
  };

  const { addToCart } = useCart();

  const handleAddToCart = (item) => {
    addToCart(item);
    setNotice(
      lang === "ka"
        ? `"${item.title}" დაემატა კალათაში.`
        : `Added "${item.title}" to cart.`,
    );
  };

  return (
    <main className="w-full bg-zinc-950 text-zinc-100 pb-16">
      {/* Compact Page Hero Banner */}
      <div className="w-full px-4 sm:px-6 md:w-[84%] md:px-0 lg:w-[80%] mx-auto pt-8">
        <section
          aria-label="Games Page Header Banner"
          className="relative w-full h-[225px] bg-zinc-900 border border-zinc-800 rounded-md overflow-hidden flex items-center justify-center"
        >
          {heroImage ? (
            <img
              src={heroImage}
              alt="Crytek Games Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-zinc-950 via-[#27272A] to-zinc-950" />
          )}

          {/* Dark gradient scrim for crisp text contrast */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-black/55 to-black/35" />

          <div className="relative z-10 px-4 sm:px-6 text-center space-y-2.5">
            <h1
              id="games-page-heading"
              className="text-2xl sm:text-4xl font-bold tracking-wider uppercase text-zinc-100"
            >
              {t.heroTitle}
            </h1>
            <p className="max-w-2xl mx-auto text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {t.heroSubtitle}
            </p>
          </div>
        </section>
      </div>

      <div className="w-full px-4 sm:px-6 md:w-[84%] md:px-0 lg:w-[80%] mx-auto space-y-14 mt-12">
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

        {/* Section #1: 6 Crytek Games */}
        <section aria-labelledby="games-grid-heading" className="flex flex-col">
          <h2
            id="games-grid-heading"
            className="text-center text-xl sm:text-2xl font-bold tracking-wider uppercase text-zinc-100 mb-6"
          >
            {t.gamesHeading}
          </h2>

          <div className="flex flex-wrap justify-center gap-5">
            {GAMES_ITEMS.map((game) => (
              <Card
                key={game.id}
                item={game}
                onBuyNow={handleBuyNow}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </section>

        {/* Section #2: Our Recommendations (3 Hunt: Showdown 1896 DLC cards) */}
        <section
          aria-labelledby="our-recommendations-heading"
          className="flex flex-col"
        >
          <h2
            id="our-recommendations-heading"
            className="text-center text-2xl sm:text-3xl font-bold tracking-wider uppercase text-zinc-100 mb-6"
          >
            {t.recommendationsHeading}
          </h2>

          <div className="flex flex-wrap justify-center gap-5">
            {RECOMMENDED_DLC_ITEMS.map((dlc) => (
              <Card
                key={dlc.id}
                item={dlc}
                onBuyNow={handleBuyNow}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default GamesPage;
