import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import { useLanguage } from "../context/LanguageContext";

const DLC_LABELS = {
  en: {
    dlcHeading: "DLC",
    dlcSubtitle: "Hunt: Showdown 1896",
    dismiss: "Dismiss",
  },
  ka: {
    dlcHeading: "DLC",
    dlcSubtitle: "Hunt: Showdown 1896-ის უახლესი დამატებები",
    dismiss: "დახურვა",
  },
};

// Match each `image` value to the corresponding file name in `src/assets/images/`
const LATEST_CRYTEK_DLCS = [
  {
    id: "dlc-bound-by-blood",
    title: "Hunt: Showdown 1896 – Bound by Blood",
    price: "$9.99",
    image: "dlc-bound-by-blood",
    badge: "DLC",
  },
  {
    id: "dlc-sage-of-joseon",
    title: "Hunt: Showdown 1896 – Sage of Joseon",
    price: "$9.99",
    image: "dlc-sage-of-joseon",
    badge: "DLC",
  },
  {
    id: "dlc-cry-of-the-caged-bird",
    title: "Hunt: Showdown 1896 - Cry of the Caged Bird",
    price: "$9.99",
    image: "dlc-cry-of-the-caged-bird",
    badge: "DLC",
  },
  {
    id: "dlc-shroud-of-the-snake",
    title: "Hunt: Showdown 1896 - Shroud of the Snake",
    price: "$9.99",
    image: "dlc-shroud-of-the-snake",
    badge: "DLC",
  },
  {
    id: "dlc-daughters-of-decay",
    title: "Hunt: Showdown 1896 - Daughters of Decay",
    price: "$14.99",
    image: "dlc-daughters-of-decay",
    badge: "DLC",
  },
  {
    id: "dlc-ghost-face-rampage",
    title: "Hunt: Showdown 1896 - Ghost Face Rampage",
    price: "$9.99",
    image: "dlc-ghost-face-rampage",
    badge: "DLC",
  },
  {
    id: "dlc-the-pale-judge",
    title: "Hunt: Showdown 1896 - The Pale Judge",
    price: "$9.99",
    image: "dlc-the-pale-judge",
    badge: "DLC",
  },
  {
    id: "dlc-corvids-brood",
    title: "Hunt: Showdown 1896 - Corvid's Brood",
    price: "$14.99",
    image: "dlc-corvids-brood",
    badge: "DLC",
  },
  {
    id: "dlc-the-penitent",
    title: "Hunt: Showdown 1896 - The Penitent",
    price: "$9.99",
    image: "dlc-the-penitent",
    badge: "DLC",
  },
  {
    id: "dlc-vaquero",
    title: "Hunt: Showdown 1896 - Vaquero",
    price: "$9.99",
    image: "dlc-vaquero",
    badge: "DLC",
  },
  {
    id: "dlc-blood-and-ice",
    title: "Hunt: Showdown 1896 - Blood and Ice",
    price: "$14.99",
    image: "dlc-blood-and-ice",
    badge: "DLC",
  },
  {
    id: "dlc-the-prescient-night",
    title: "Hunt: Showdown 1896 - The Prescient Night",
    price: "$9.99",
    image: "dlc-the-prescient-night",
    badge: "DLC",
  },
];

const DlcPage = () => {
  const { lang } = useLanguage();
  const t = DLC_LABELS[lang];
  const navigate = useNavigate();
  const [notice, setNotice] = useState("");

  const handleBuyNow = (item) => {
    navigate("/account", { state: { buyNowItem: item } });
  };

  const handleAddToCart = (item) => {
    setNotice(`Added "${item.title}" to cart.`);
  };

  return (
    <main className="w-full bg-zinc-950 text-zinc-100 py-12 pb-16">
      {/* Responsive Container: Phone full width, Tablet ~84%, Desktop ~80% */}
      <div className="w-full px-4 sm:px-6 md:w-[84%] md:px-0 lg:w-[80%] mx-auto space-y-10">
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

        {/* 12 Latest Crytek DLCs (1 col phone, 2 cols tablet, 3 cols desktop) */}
        <section aria-labelledby="dlc-page-heading" className="flex flex-col">
          <div className="text-center mb-8">
            <h1
              id="dlc-page-heading"
              className="text-2xl sm:text-3xl font-bold tracking-wider uppercase text-zinc-100"
            >
              {t.dlcHeading}
            </h1>
            <p className="mt-2 text-xs sm:text-sm tracking-wider uppercase text-zinc-400">
              {t.dlcSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {LATEST_CRYTEK_DLCS.map((dlc) => (
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
