import React from "react";

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

const resolveCardImage = (image) => {
  if (!image) return "";
  if (typeof image !== "string") return image;
  if (
    image.startsWith("http") ||
    image.startsWith("/") ||
    image.startsWith("data:")
  ) {
    return image;
  }
  const cleanKey = image.replace(/\.[^/.]+$/, "");
  return IMAGE_MAP[cleanKey] || "";
};

const Card = ({ item, onBuyNow, onAddToCart }) => {
  const imgSrc = resolveCardImage(item?.image);

  const handleBuyNow = () => {
    if (onBuyNow) {
      onBuyNow(item);
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(item);
    }
  };

  return (
    <article className="group w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(25%-0.9375rem)] flex flex-col justify-between bg-[#121214] border border-zinc-800 hover:border-indigo-400/70 rounded-md overflow-hidden transition-colors">
      {/* Image Area + Hover Overlay (Title & Price appear over the picture on hover) */}
      <div className="relative aspect-[16/10] w-full bg-zinc-900 overflow-hidden flex items-center justify-center">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={item?.title || "Store item"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-xs uppercase tracking-wider text-zinc-500 px-3 text-center">
            {item?.image || "No Image"}
          </span>
        )}

        {/* Hover Overlay over the picture */}
        <div
          className="
            pointer-events-none absolute inset-0
            bg-black/80 opacity-0 group-hover:opacity-100
            transition-opacity duration-200
            p-4 flex flex-col justify-end
          "
        >
          {item?.badge && (
            <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400 mb-1">
              {item.badge}
            </span>
          )}
          <h3 className="text-sm sm:text-base font-bold text-zinc-100 leading-snug">
            {item?.title}
          </h3>
          {item?.price && (
            <p className="text-sm font-bold text-indigo-300 mt-1">
              {item.price}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Action Buttons: Buy Now on top, Add to Cart below */}
      <div className="p-3.5 bg-[#27272A]/60 border-t border-zinc-800/90 flex flex-col gap-2">
        <button
          type="button"
          onClick={handleBuyNow}
          className="
            w-full py-2 px-3 rounded-md
            bg-[#27272A] hover:bg-indigo-500
            border border-zinc-600 hover:border-indigo-400
            text-xs font-bold tracking-wider uppercase text-zinc-100
            transition-colors cursor-pointer
          "
        >
          Buy Now
        </button>

        <button
          type="button"
          onClick={handleAddToCart}
          className="
            w-full py-2 px-3 rounded-md
            bg-zinc-900 hover:bg-zinc-800
            border border-zinc-700 hover:border-indigo-400/70
            text-xs font-semibold tracking-wider uppercase text-zinc-200 hover:text-indigo-400
            transition-colors cursor-pointer
          "
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
};

export default Card;
