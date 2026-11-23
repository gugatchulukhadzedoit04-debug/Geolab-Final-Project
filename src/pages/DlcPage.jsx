import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { useLanguage } from "../context/LanguageContext";
import { DLC_ITEMS } from "../data/storeItems";
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

const DLC_LABELS = {
  en: {
    heroTitle: "OUR DLC",
    heroSubtitle:
      "Become a legend with our roster of Hunters, each with handcrafted weapons and stories",
    dlcHeading: "DLC",
    dlcSubtitle: "Latest Hunt: Showdown 1896 Add-Ons",
    dismiss: "Dismiss",
  },
  ka: {
    heroTitle: "ჩვენი DLC",
    heroSubtitle:
      "გახდი ლეგენდა ჩვენი მონადირეების გუნდთან ერთად, რომელთაგან თითოეულს უნიკალური იარაღი და ისტორია აქვს",
    dlcHeading: "DLC",
    dlcSubtitle: "Hunt: Showdown 1896-ის უახლესი დამატებები",
    dismiss: "დახურვა",
  },
};

const HERO_IMAGE_KEY = "dlc-hero";

const DlcPage = () => {
  const { lang } = useLanguage();
  const t = DLC_LABELS[lang];
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
      {/* Hero Banner */}
      <div className="w-full px-4 sm:px-6 md:w-[84%] md:px-0 lg:w-[80%] mx-auto pt-8">
        <section
          aria-labelledby="dlc-banner-heading"
          className="relative w-full h-[225px] bg-zinc-900 border border-zinc-800 rounded-md overflow-hidden flex items-center justify-center"
        >
          {heroImage ? (
            <img
              src={heroImage}
              alt="Crytek DLC Banner"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-zinc-950 via-[#27272A] to-zinc-950" />
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-black/55 to-black/35" />

          <div className="relative z-10 px-4 sm:px-6 text-center space-y-2.5">
            <h1
              id="dlc-banner-heading"
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

      <div className="w-full px-4 sm:px-6 md:w-[84%] md:px-0 lg:w-[80%] mx-auto space-y-10 mt-12">
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

        {/* 12 Crytek DLCs */}
        <section aria-labelledby="dlc-page-heading" className="flex flex-col">
          <div className="text-center mb-8">
            <h2
              id="dlc-page-heading"
              className="text-2xl sm:text-3xl font-bold tracking-wider uppercase text-zinc-100"
            >
              {t.dlcHeading}
            </h2>
            <p className="mt-2 text-xs sm:text-sm tracking-wider uppercase text-zinc-400">
              {t.dlcSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-5">
            {DLC_ITEMS.map((dlc) => (
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

export default DlcPage;
