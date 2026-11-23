import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import geolabLogo from "../assets/images/geolab-logo.png";
import burgerIcon from "../assets/images/burgericon.png";
import closeIcon from "../assets/images/burger-x.png";
import enFlag from "../assets/images/english-icon.png";
import kaFlag from "../assets/images/georgian-icon.png";
import searchIcon from "../assets/images/search-icon.png";
import cartIcon from "../assets/images/cart-icon.png";
import accountIcon from "../assets/images/profile-icon.png";
import { useLanguage } from "../context/LanguageContext";
import { useCart } from "../context/CartContext";
import { GAMES_ITEMS, DLC_ITEMS, BUNDLE_ITEMS } from "../data/storeItems";

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

const resolveItemImage = (image) => {
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

const ALL_STORE_ITEMS = Array.from(
  new Map(
    [...GAMES_ITEMS, ...DLC_ITEMS, ...BUNDLE_ITEMS].map((item) => [
      item.id,
      item,
    ]),
  ).values(),
);

const NAV_LABELS = {
  en: {
    home: "HOME",
    games: "GAMES",
    dlc: "DLC",
    specialOffers: "SPECIAL OFFERS",
    account: "ACCOUNT",
    profile: "PROFILE",
    logout: "LOG OUT",
    searchAria: "Search",
    searchLabel: "SEARCH STORE",
    noResults: "No matching item found.",
    addToCart: "Add to Cart",
    added: "Added",
    cartAria: "Shopping Cart",
    langAria: "Switch language to Georgian",
    accountAria: "User Account",
    burgerAria: "Toggle Burger Menu",
  },
  ka: {
    home: "მთავარი",
    games: "თამაშები",
    dlc: "DLC",
    specialOffers: "სპეციალური შეთავაზებები",
    account: "ანგარიში",
    profile: "პროფილი",
    logout: "გასვლა",
    searchAria: "ძიება",
    searchLabel: "მაღაზიაში ძიება",
    noResults: "შესაბამისი ნივთი ვერ მოიძებნა.",
    addToCart: "კალათაში დამატება",
    added: "დამატებულია",
    cartAria: "კალათა",
    langAria: "გადართვა ინგლისურზე",
    accountAria: "ანგარიში",
    burgerAria: "ბურგერ მენიუს გახსნა",
  },
};

const NAV_ITEMS = [
  { key: "home", to: "/" },
  { key: "games", to: "/games" },
  { key: "dlc", to: "/dlc" },
  { key: "specialOffers", to: "/special-offers" },
];

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("crytek_current_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getItemRoute = (badge) => {
  const normalized = (badge || "").toUpperCase();
  if (normalized === "DLC") return "/dlc";
  if (normalized.includes("BUNDLE")) return "/special-offers";
  return "/games";
};

const Header = () => {
  const { lang, toggleLanguage } = useLanguage();
  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { totalCount, addToCart } = useCart();

  const t = NAV_LABELS[lang];

  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);

  // Live search state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [justAddedId, setJustAddedId] = useState("");
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  const trimmedQuery = searchQuery.trim().toLowerCase();
  const singleMatch = trimmedQuery
    ? ALL_STORE_ITEMS.find((item) => {
        const titleMatch = item.title?.toLowerCase().includes(trimmedQuery);
        const badgeMatch = item.badge?.toLowerCase().includes(trimmedQuery);
        return titleMatch || badgeMatch;
      }) || null
    : null;

  useEffect(() => {
    const syncAuth = () => {
      setCurrentUser(getStoredUser());
    };

    window.addEventListener("auth-change", syncAuth);
    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener("auth-change", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  useEffect(() => {
    const handleOutsideOrKey = (e) => {
      if (e.key === "Escape") {
        setAccountMenuOpen(false);
        setIsSearchOpen(false);
        return;
      }
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(e.target)
      ) {
        setAccountMenuOpen(false);
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideOrKey);
    document.addEventListener("keydown", handleOutsideOrKey);
    return () => {
      document.removeEventListener("mousedown", handleOutsideOrKey);
      document.removeEventListener("keydown", handleOutsideOrKey);
    };
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  const handleLogout = () => {
    localStorage.removeItem("crytek_current_user");
    setCurrentUser(null);
    setAccountMenuOpen(false);
    setIsBurgerMenuOpen(false);
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  const handleSearchAddToCart = (item) => {
    addToCart(item);
    setJustAddedId(item.id);
    setTimeout(() => setJustAddedId(""), 1200);
  };

  const handleNavigateToMatch = (item) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    navigate(getItemRoute(item.badge));
  };

  return (
    <header
      data-component="burger-menu"
      className="sticky top-0 z-50 w-full h-[75px] bg-[#27272A] text-zinc-100 border-b border-zinc-800 shadow-lg"
    >
      {/* Geolab */}
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex-shrink-0 flex items-center">
          <a
            href="https://geolab.edu.ge/en/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <img
              src={geolabLogo}
              alt="Geolab Logo"
              className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] object-contain bg-zinc-800 rounded-sm"
            />
          </a>
        </div>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `text-sm font-semibold tracking-wider transition-colors ${
                  isActive
                    ? "text-indigo-400"
                    : "text-zinc-200 hover:text-indigo-400"
                }`
              }
            >
              {t[item.key]}
            </NavLink>
          ))}
        </nav>

        {/* Action Icons */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* Live Search Icon + Pop-Up */}
          <div ref={searchContainerRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setIsSearchOpen((prev) => !prev);
                setAccountMenuOpen(false);
              }}
              aria-expanded={isSearchOpen}
              aria-label={t.searchAria}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                isSearchOpen ? "bg-indigo-500" : "hover:bg-indigo-400"
              }`}
            >
              <img
                src={searchIcon}
                alt="Search Icon"
                className="w-5 h-5 object-contain rounded-sm"
              />
            </button>

            {isSearchOpen && (
              <div className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 top-[82px] sm:top-auto sm:mt-3 sm:w-96 rounded-md bg-[#121214] border border-zinc-700 shadow-2xl p-4 z-50 space-y-3">
                <div className="space-y-1.5">
                  <label
                    htmlFor="header-live-search"
                    className="block text-[11px] font-bold tracking-wider uppercase text-zinc-400"
                  >
                    {t.searchLabel}
                  </label>
                  <div className="relative">
                    <input
                      ref={searchInputRef}
                      id="header-live-search"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-3 pr-8 py-2 rounded-md bg-[#27272A] border border-zinc-700 text-sm text-zinc-100 focus:outline-none focus:border-indigo-400 transition-colors"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          searchInputRef.current?.focus();
                        }}
                        aria-label="Clear search"
                        className="absolute inset-y-0 right-0 px-2.5 text-zinc-400 hover:text-zinc-100 text-sm font-bold cursor-pointer"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                {/* Single Matching Result */}
                {trimmedQuery && (
                  <div className="pt-1 border-t border-zinc-800">
                    {singleMatch ? (
                      <div className="flex items-center gap-3 p-2.5 rounded-md bg-[#27272A]/60 border border-zinc-800 hover:border-indigo-400/60 transition-colors">
                        <button
                          type="button"
                          onClick={() => handleNavigateToMatch(singleMatch)}
                          className="w-16 h-12 shrink-0 rounded bg-zinc-900 overflow-hidden flex items-center justify-center cursor-pointer"
                        >
                          {resolveItemImage(singleMatch.image) ? (
                            <img
                              src={resolveItemImage(singleMatch.image)}
                              alt={singleMatch.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[9px] uppercase text-zinc-500 px-1 text-center">
                              {singleMatch.badge}
                            </span>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleNavigateToMatch(singleMatch)}
                          className="flex-1 min-w-0 text-left cursor-pointer"
                        >
                          <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                            {singleMatch.badge}
                          </p>
                          <p className="text-xs sm:text-sm font-bold text-zinc-100 truncate hover:text-indigo-300 transition-colors">
                            {singleMatch.title}
                          </p>
                          <p className="text-xs font-bold text-indigo-300">
                            {singleMatch.price}
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSearchAddToCart(singleMatch)}
                          className="shrink-0 py-1.5 px-2.5 rounded-md bg-[#27272A] hover:bg-indigo-500 border border-zinc-600 hover:border-indigo-400 text-[11px] font-bold tracking-wider uppercase text-zinc-100 transition-colors cursor-pointer"
                        >
                          {justAddedId === singleMatch.id
                            ? t.added
                            : t.addToCart}
                        </button>
                      </div>
                    ) : (
                      <p className="py-2 text-xs text-zinc-400 text-center">
                        {t.noResults}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <Link
            to="/cart"
            aria-label={`${t.cartAria} (${totalCount})`}
            className="relative flex items-center gap-1.5 p-1.5 rounded-md hover:bg-indigo-400 transition-colors cursor-pointer"
          >
            <img
              src={cartIcon}
              alt="Cart Icon"
              className="w-5 h-5 object-contain rounded-sm"
            />
            <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-indigo-500 text-zinc-100 text-[11px] font-bold flex items-center justify-center leading-none">
              {totalCount}
            </span>
          </Link>

          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={t.langAria}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-zinc-800 transition-colors text-xs font-semibold tracking-wider text-zinc-200 cursor-pointer"
          >
            <img
              src={lang === "en" ? kaFlag : enFlag}
              alt={lang === "en" ? "Switch to Georgian" : "Switch to English"}
              className="w-5 h-5 object-contain rounded-sm"
            />
            <span>{lang === "en" ? "KA" : "EN"}</span>
          </button>

          {/* Account Icon & Dropdown */}
          {currentUser ? (
            <div ref={accountMenuRef} className="relative">
              <button
                type="button"
                onClick={() => {
                  setAccountMenuOpen((prev) => !prev);
                  setIsSearchOpen(false);
                }}
                aria-expanded={accountMenuOpen}
                aria-label={t.accountAria}
                className="flex items-center gap-2 text-zinc-100 hover:text-indigo-400 transition-colors cursor-pointer"
              >
                <img
                  src={accountIcon}
                  alt="Account"
                  className="w-6 h-6 object-contain"
                />
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 mt-3 w-44 rounded-md bg-[#121214] border border-zinc-800 shadow-xl py-1.5 z-50">
                  <Link
                    to="/profile"
                    onClick={() => setAccountMenuOpen(false)}
                    className="block px-4 py-2 text-xs font-bold tracking-wider uppercase text-zinc-200 hover:bg-[#27272A] hover:text-indigo-400 transition-colors"
                  >
                    {t.profile}
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-xs font-bold tracking-wider uppercase text-red-400 hover:bg-[#27272A] hover:text-red-300 transition-colors cursor-pointer"
                  >
                    {t.logout}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/account"
              aria-label={t.accountAria}
              className="flex items-center gap-2 text-zinc-100 hover:text-indigo-400 transition-colors"
            >
              <img
                src={accountIcon}
                alt="Account"
                className="w-6 h-6 object-contain"
              />
            </Link>
          )}

          {/* Burger Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsBurgerMenuOpen((prev) => !prev)}
            aria-label={t.burgerAria}
            aria-expanded={isBurgerMenuOpen}
            className="md:hidden p-2 rounded-md text-zinc-300 hover:text-white hover:bg-indigo-400 focus:outline-none"
          >
            <img
              src={isBurgerMenuOpen ? closeIcon : burgerIcon}
              alt={isBurgerMenuOpen ? "Close Menu Icon" : "Burger Menu Icon"}
              className="w-6 h-6 object-contain"
            />
          </button>
        </div>
      </div>

      {/* Burger Menu Dropdown */}
      {isBurgerMenuOpen && (
        <div
          id="burger-menu"
          className="md:hidden bg-zinc-900 border-b border-zinc-800 px-4 pt-2 pb-4 space-y-1 shadow-xl"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setIsBurgerMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-semibold ${
                  isActive
                    ? "bg-zinc-800 text-indigo-400"
                    : "text-zinc-200 hover:bg-zinc-800 hover:text-indigo-400"
                }`
              }
            >
              {t[item.key]}
            </NavLink>
          ))}

          {/* Account / Profile Options Inside Burger Menu */}
          <div className="border-t border-zinc-800/80 mt-2 pt-2 space-y-1">
            {currentUser ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsBurgerMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-semibold text-zinc-200 hover:bg-zinc-800 hover:text-indigo-400"
                >
                  {t.profile}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-md text-sm font-semibold text-red-400 hover:bg-zinc-800 hover:text-red-300 cursor-pointer"
                >
                  {t.logout}
                </button>
              </>
            ) : (
              <Link
                to="/account"
                onClick={() => setIsBurgerMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-semibold text-zinc-200 hover:bg-zinc-800 hover:text-indigo-400"
              >
                {t.account}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
