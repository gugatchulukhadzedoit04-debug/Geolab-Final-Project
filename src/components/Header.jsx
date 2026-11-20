import React, { useEffect, useState } from "react";
import geolabLogo from "../assets/images/geolab-logo.png";
import burgerIcon from "../assets/images/burgericon.png";
import closeIcon from "../assets/images/burger-x.png";
import enFlag from "../assets/images/english-icon.png";
import kaFlag from "../assets/images/georgian-icon.png";
import searchIcon from "../assets/images/search-icon.png";
import cartIcon from "../assets/images/cart-icon.png";
import profileIcon from "../assets/images/profile-icon.png";

const NAV_LABELS = {
  en: {
    home: "HOME",
    games: "GAMES",
    dlc: "DLC",
    specialOffers: "SPECIAL OFFERS",
    account: "ACCOUNT",
    searchAria: "Search",
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
    searchAria: "ძიება",
    cartAria: "კალათა",
    langAria: "Switch language to English",
    accountAria: "ანგარიში",
    burgerAria: "ბურგერ მენიუს გახსნა",
  },
};

const NAV_ITEMS = [
  { key: "home", href: "#home" },
  { key: "games", href: "#games" },
  { key: "dlc", href: "#dlc" },
  { key: "specialOffers", href: "#special-offers" },
];

const Header = () => {
  const [lang, setLang] = useState("en");
  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);

  const t = NAV_LABELS[lang];

  useEffect(() => {
    document.documentElement.lang = lang === "ka" ? "ka" : "en";
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "ka" : "en"));
  };

  return (
    <header
      data-component="burger-menu"
      className="sticky top-0 z-50 w-full h-[75px] bg-[#27272A] text-zinc-100 border-b border-zinc-800 shadow-lg"
    >
      {/* Geolab */}
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex-shrink-0 flex items-center">
          <a href="https://geolab.edu.ge/en/" className="flex items-center">
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
            <a
              key={item.key}
              href={item.href}
              className="text-sm font-semibold tracking-wider text-zinc-200 hover:text-indigo-400 transition-colors"
            >
              {t[item.key]}
            </a>
          ))}
        </nav>

        {/*Burger */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          <button
            type="button"
            aria-label={t.searchAria}
            className="p-1.5 rounded-md hover:bg-indigo-400 transition-colors cursor-pointer"
          >
            <img
              src={searchIcon}
              alt="Search Icon"
              className="w-5 h-5 object-contain hover:bg-indigo-400 rounded-sm"
            />
          </button>

          <button
            type="button"
            aria-label={t.cartAria}
            className="p-1.5 rounded-md hover:bg-indigo-400 transition-colors cursor-pointer"
          >
            <img
              src={cartIcon}
              alt="Cart Icon"
              className="w-5 h-5 object-contain hover:bg-indigo-400 rounded-sm"
            />
          </button>

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

          {/* Account Icon (Desktop / Non-Burger View Only) */}
          <a
            href="#account"
            aria-label={t.accountAria}
            className="hidden md:inline-flex p-1.5 rounded-md hover:bg-zinc-800 transition-colors"
          >
            <img
              src={profileIcon}
              alt="Account Logo"
              className="w-6 h-6 object-contain hover:bg-indigo-400 rounded-full"
            />
          </a>

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
            <a
              key={item.key}
              href={item.href}
              onClick={() => setIsBurgerMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-semibold text-zinc-200 hover:bg-zinc-800 hover:text-indigo-400"
            >
              {t[item.key]}
            </a>
          ))}

          {/* Account Item Inside Burger Menu */}
          <a
            href="#account"
            onClick={() => setIsBurgerMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-semibold text-zinc-200 hover:bg-zinc-800 hover:text-indigo-400 border-t border-zinc-800/80 mt-2 pt-3"
          >
            <span>{t.account}</span>
          </a>
        </div>
      )}
    </header>
  );
};

export default Header;
