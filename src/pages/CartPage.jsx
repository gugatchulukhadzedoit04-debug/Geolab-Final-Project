import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, CreditCard, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";

const USERS_STORAGE_KEY = "crytek_users";
const CURRENT_USER_STORAGE_KEY = "crytek_current_user";

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

const parsePrice = (priceStr) => {
  if (typeof priceStr === "number") return priceStr;
  if (!priceStr) return 0;
  const numeric = parseFloat(String(priceStr).replace(/[^0-9.]/g, ""));
  return Number.isNaN(numeric) ? 0 : numeric;
};

const readStoredUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const readCurrentUser = () => {
  try {
    const raw = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const CART_LABELS = {
  en: {
    pageTitle: "Your Cart",
    emptyTitle: "Cart is Empty",
    emptySubtitle:
      "Looks like you haven't added any games, DLCs, or bundles yet.",
    continueShopping: "Continue Shopping",
    selectAll: "Select All",
    removeSelected: "Remove Selected",
    removeAll: "Remove All",
    removeBtn: "Remove",
    selectedItems: "Selected items",
    totalLabel: "Total",
    continueToPayment: "Continue to Payment",
    selectWarning: "Select at least one item to continue to payment.",
    modalTitle: "Payment Summary",
    totalItemsModal: "Total Items",
    totalPriceModal: "Total Price",
    selectCardLabel: "Select Payment Card",
    proceedWithPayment: "Proceed with Payment",
    returnToCart: "Return to Cart",
    notLoggedInMsg:
      "You need to sign in to your account before completing a purchase.",
    goToAccount: "Go to Account",
    noCardsMsg:
      "No saved payment cards found on your profile. Add a card first.",
    goToProfile: "Manage Cards in Profile",
    selectCardError: "Please select a payment card to continue.",
    paymentSuccess:
      "Payment completed! Your items have been added to your Purchase History.",
  },
  ka: {
    pageTitle: "თქვენი კალათა",
    emptyTitle: "კალათა ცარიელია",
    emptySubtitle: "თამაშები, DLC-ები ან პაკეტები ჯერ არ დაგიმატებიათ.",
    continueShopping: "შოპინგის გაგრძელება",
    selectAll: "ყველას მონიშვნა",
    removeSelected: "მონიშნულის წაშლა",
    removeAll: "ყველას წაშლა",
    removeBtn: "წაშლა",
    selectedItems: "მონიშნული ერთეული",
    totalLabel: "ჯამი",
    continueToPayment: "გადახდაზე გადასვლა",
    selectWarning: "გადახდაზე გადასასვლელად მონიშნეთ მინიმუმ ერთი ნივთი.",
    modalTitle: "გადახდის დეტალები",
    totalItemsModal: "ნივთების რაოდენობა",
    totalPriceModal: "ჯამური ფასი",
    selectCardLabel: "აირჩიეთ ბარათი",
    proceedWithPayment: "გადახდის გაგრძელება",
    returnToCart: "კალათაში დაბრუნება",
    notLoggedInMsg: "შესყიდვის დასასრულებლად საჭიროა ანგარიშში შესვლა.",
    goToAccount: "ანგარიშზე გადასვლა",
    noCardsMsg: "პროფილში შენახული ბარათი არ მოიძებნა. ჯერ დაამატეთ ბარათი.",
    goToProfile: "ბარათების მართვა პროფილში",
    selectCardError: "გთხოვთ აირჩიოთ გადახდის ბარათი.",
    paymentSuccess:
      "გადახდა წარმატებით დასრულდა! ნივთები დაემატა შესყიდვების ისტორიას.",
  },
};

const CartPage = () => {
  const { lang } = useLanguage();
  const t = CART_LABELS[lang];
  const { cartItems, removeFromCart, removeSelectedItems, clearCart } =
    useCart();
  const navigate = useNavigate();

  const [selectedIds, setSelectedIds] = useState(() =>
    cartItems.map((item) => item.id),
  );
  const [selectionNotice, setSelectionNotice] = useState("");
  const [successNotice, setSuccessNotice] = useState("");

  // Payment pop-up state
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [activeSessionUser, setActiveSessionUser] = useState(() =>
    readCurrentUser(),
  );

  useEffect(() => {
    setSelectedIds((prev) => {
      const currentIds = new Set(cartItems.map((item) => item.id));
      const validExisting = prev.filter((id) => currentIds.has(id));
      const brandNew = cartItems
        .filter((item) => !prev.includes(item.id))
        .map((item) => item.id);
      return [...validExisting, ...brandNew];
    });
  }, [cartItems]);

  const allSelected =
    cartItems.length > 0 &&
    cartItems.every((item) => selectedIds.includes(item.id));

  const toggleItemSelection = (id) => {
    setSelectionNotice("");
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    setSelectionNotice("");
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cartItems.map((item) => item.id));
    }
  };

  const selectedItems = cartItems.filter((item) =>
    selectedIds.includes(item.id),
  );

  const selectedCount = selectedItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0,
  );

  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + parsePrice(item.price) * (item.quantity || 1),
    0,
  );

  const openPaymentModal = () => {
    if (selectedItems.length === 0) {
      setSelectionNotice(t.selectWarning);
      return;
    }

    setSelectionNotice("");
    setSuccessNotice("");
    setPaymentError("");

    const sessionUser = readCurrentUser();
    setActiveSessionUser(sessionUser);

    if (sessionUser?.email) {
      const users = readStoredUsers();
      const matchedUser = users.find(
        (u) => u.email.toLowerCase() === sessionUser.email.toLowerCase(),
      );
      const cards = Array.isArray(matchedUser?.paymentMethods)
        ? matchedUser.paymentMethods
        : [];
      setSavedCards(cards);
      setSelectedCardId(cards[0]?.id || "");
    } else {
      setSavedCards([]);
      setSelectedCardId("");
    }

    setIsPaymentOpen(true);
  };

  const closePaymentModal = () => {
    setIsPaymentOpen(false);
    setPaymentError("");
  };

  const handleProceedWithPayment = () => {
    if (!activeSessionUser?.email) {
      setPaymentError(t.notLoggedInMsg);
      return;
    }

    if (savedCards.length === 0) {
      setPaymentError(t.noCardsMsg);
      return;
    }

    if (!selectedCardId) {
      setPaymentError(t.selectCardError);
      return;
    }

    const chosenCard = savedCards.find((card) => card.id === selectedCardId);
    const cardLabel = chosenCard
      ? `${chosenCard.brand || "Card"} •••• ${String(
          chosenCard.last4 || chosenCard.cardNumber || "",
        ).slice(-4)}`
      : "Saved Card";

    const purchaseDate = new Date().toLocaleDateString(
      lang === "ka" ? "ka-GE" : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    );

    const newPurchaseEntries = selectedItems.map((item, idx) => {
      const qty = item.quantity || 1;
      const unitPrice = parsePrice(item.price);
      return {
        id: `order-${Date.now()}-${idx}-${item.id}`,
        title: item.title,
        badge: item.badge || "STORE ITEM",
        quantity: qty,
        price: `$${(unitPrice * qty).toFixed(2)}`,
        cardUsed: cardLabel,
        date: purchaseDate,
        purchasedAt: new Date().toISOString(),
      };
    });

    const users = readStoredUsers();
    const updatedUsers = users.map((u) => {
      if (u.email.toLowerCase() === activeSessionUser.email.toLowerCase()) {
        const existingPurchases = Array.isArray(u.purchases) ? u.purchases : [];
        return {
          ...u,
          purchases: [...newPurchaseEntries, ...existingPurchases],
        };
      }
      return u;
    });

    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      window.dispatchEvent(new Event("auth-change"));
    } catch {}

    if (allSelected) {
      clearCart();
    } else {
      removeSelectedItems(selectedIds);
    }

    setSelectedIds([]);
    setIsPaymentOpen(false);
    setPaymentError("");
    setSuccessNotice(t.paymentSuccess);
  };

  return (
    <main className="w-full min-h-[calc(100vh-160px)] bg-zinc-950 text-zinc-100 py-10 pb-16">
      <div className="w-full px-4 sm:px-6 md:w-[84%] md:px-0 lg:w-[80%] mx-auto space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-wider uppercase text-zinc-100 border-b border-zinc-800 pb-4">
          {t.pageTitle}
        </h1>

        {successNotice && (
          <div
            role="status"
            className="p-4 rounded-md bg-[#27272A] border border-indigo-400/70 text-xs sm:text-sm text-zinc-100 flex flex-wrap items-center justify-between gap-3"
          >
            <span>{successNotice}</span>
            <Link
              to="/profile"
              className="text-xs font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
            >
              {lang === "ka" ? "ისტორიის ნახვა" : "View Purchase History"}
            </Link>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="bg-[#121214] border border-zinc-800 rounded-md py-16 px-6 text-center space-y-5">
            <h2 className="text-xl sm:text-2xl font-bold tracking-wide text-zinc-100">
              {t.emptyTitle}
            </h2>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              {t.emptySubtitle}
            </p>
            <div className="pt-2">
              <Link
                to="/games"
                className="inline-block py-2.5 px-6 rounded-md bg-[#27272A] hover:bg-indigo-500 border border-zinc-600 hover:border-indigo-400 text-xs sm:text-sm font-bold tracking-wider uppercase text-zinc-100 transition-colors"
              >
                {t.continueShopping}
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart Item Rows */}
            <div className="flex flex-col space-y-4">
              {cartItems.map((item) => {
                const isChecked = selectedIds.includes(item.id);
                const imgSrc = resolveItemImage(item.image);
                const qty = item.quantity || 1;

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 sm:gap-4"
                  >
                    {/* Selection Checkbox */}
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleItemSelection(item.id)}
                      aria-label={`Select ${item.title}`}
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded border-zinc-600 bg-[#27272A] accent-indigo-500 cursor-pointer shrink-0"
                    />

                    <article
                      className={`flex-1 flex flex-row items-stretch bg-[#121214] border rounded-md overflow-hidden transition-colors ${
                        isChecked
                          ? "border-indigo-400/70"
                          : "border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <div className="w-28 sm:w-44 md:w-52 shrink-0 bg-zinc-900 flex items-center justify-center overflow-hidden">
                        {imgSrc ? (
                          <img
                            src={imgSrc}
                            alt={item.title || "Cart item"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[11px] uppercase tracking-wider text-zinc-500 px-2 text-center">
                            {item.image || "No Image"}
                          </span>
                        )}
                      </div>

                      {/* Title, Price and Remove Button */}
                      <div className="flex-1 p-3.5 sm:p-5 bg-[#27272A]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          {item.badge && (
                            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                              {item.badge}
                            </span>
                          )}
                          <h2 className="text-sm sm:text-base font-bold text-zinc-100 truncate">
                            {item.title}
                            {qty > 1 ? ` (x${qty})` : ""}
                          </h2>
                          <p className="text-sm sm:text-base font-bold text-indigo-300">
                            {item.price}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="self-start sm:self-center inline-flex items-center gap-1.5 py-2 px-3 rounded-md bg-zinc-900 hover:bg-red-950/60 border border-zinc-700 hover:border-red-500/70 text-xs font-semibold tracking-wider uppercase text-zinc-300 hover:text-red-300 transition-colors cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{t.removeBtn}</span>
                        </button>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>

            {/* Select All  & Dynamic Remove Selected / Remove All Button */}
            <div className="pt-1 flex items-center justify-between gap-4">
              <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded border-zinc-600 bg-[#27272A] accent-indigo-500 cursor-pointer"
                />
                <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-zinc-200 hover:text-indigo-400 transition-colors">
                  {t.selectAll}
                </span>
              </label>

              {selectedIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectionNotice("");
                    if (allSelected) {
                      clearCart();
                    } else {
                      removeSelectedItems(selectedIds);
                    }
                    setSelectedIds([]);
                  }}
                  className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-md bg-zinc-900 hover:bg-red-950/60 border border-zinc-700 hover:border-red-500/70 text-xs font-semibold tracking-wider uppercase text-zinc-300 hover:text-red-300 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{allSelected ? t.removeAll : t.removeSelected}</span>
                </button>
              )}
            </div>

            {selectionNotice && (
              <div
                role="alert"
                className="p-3 rounded-md bg-red-950/50 border border-red-500/60 text-xs text-red-200"
              >
                {selectionNotice}
              </div>
            )}

            {/* Selected Count + Total Price */}
            <div className="bg-[#121214] border border-zinc-800 rounded-md p-5 sm:p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                <span className="text-xs sm:text-sm uppercase tracking-wider text-zinc-400">
                  {t.selectedItems}:{" "}
                  <strong className="text-zinc-100">{selectedCount}</strong>
                </span>

                <div className="text-right">
                  <span className="text-xs sm:text-sm uppercase tracking-wider text-zinc-400 mr-2">
                    {t.totalLabel}:
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-indigo-400">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex flex-row items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={openPaymentModal}
                  className="flex-1 sm:flex-initial py-2.5 px-5 rounded-md bg-[#27272A] hover:bg-indigo-500 border border-zinc-600 hover:border-indigo-400 text-xs sm:text-sm font-bold tracking-wider uppercase text-zinc-100 transition-colors cursor-pointer"
                >
                  {t.continueToPayment}
                </button>

                <Link
                  to="/games"
                  className="flex-1 sm:flex-initial text-center py-2.5 px-5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-indigo-400/70 text-xs sm:text-sm font-semibold tracking-wider uppercase text-zinc-200 hover:text-indigo-400 transition-colors"
                >
                  {t.continueShopping}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Pop-Up */}
      {isPaymentOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="payment-modal-title"
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center px-4 py-6"
        >
          <div className="w-full max-w-md bg-[#121214] border border-zinc-700 rounded-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3.5">
              <h2
                id="payment-modal-title"
                className="text-lg font-bold tracking-wider uppercase text-zinc-100"
              >
                {t.modalTitle}
              </h2>
              <button
                type="button"
                onClick={closePaymentModal}
                aria-label="Close payment modal"
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-[#27272A] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Total Items & Total Price */}
            <div className="bg-[#27272A]/50 border border-zinc-800 rounded-md p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="uppercase tracking-wider text-zinc-400">
                  {t.totalItemsModal}
                </span>
                <span className="font-bold text-zinc-100">{selectedCount}</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm border-t border-zinc-800 pt-2.5">
                <span className="uppercase tracking-wider text-zinc-400">
                  {t.totalPriceModal}
                </span>
                <span className="text-lg font-bold text-indigo-400">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {paymentError && (
              <div
                role="alert"
                className="p-3 rounded-md bg-red-950/50 border border-red-500/60 text-xs text-red-200 space-y-2"
              >
                <p>{paymentError}</p>
                {!activeSessionUser?.email && (
                  <button
                    type="button"
                    onClick={() => navigate("/account")}
                    className="inline-block text-xs font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 underline underline-offset-4 cursor-pointer"
                  >
                    {t.goToAccount}
                  </button>
                )}
                {activeSessionUser?.email && savedCards.length === 0 && (
                  <button
                    type="button"
                    onClick={() => navigate("/profile")}
                    className="inline-block text-xs font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 underline underline-offset-4 cursor-pointer"
                  >
                    {t.goToProfile}
                  </button>
                )}
              </div>
            )}

            {/* Saved Card Selection */}
            {activeSessionUser?.email && savedCards.length > 0 && (
              <div className="space-y-2">
                <label
                  htmlFor="payment-card-select"
                  className="block text-xs font-bold tracking-wider uppercase text-zinc-300"
                >
                  {t.selectCardLabel}
                </label>
                <div className="relative">
                  <select
                    id="payment-card-select"
                    value={selectedCardId}
                    onChange={(e) => {
                      setPaymentError("");
                      setSelectedCardId(e.target.value);
                    }}
                    className="
                      w-full px-3.5 py-2.5 rounded-md
                      bg-[#27272A] border border-zinc-700
                      text-sm text-zinc-100
                      focus:outline-none focus:border-indigo-400
                      transition-colors cursor-pointer
                    "
                  >
                    {savedCards.map((card) => {
                      const last4 = String(
                        card.last4 || card.cardNumber || "0000",
                      ).slice(-4);
                      return (
                        <option key={card.id} value={card.id}>
                          {card.brand || "Card"} •••• {last4}
                          {card.holderName ? ` — ${card.holderName}` : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            )}

            {/* Proceed with Payment & Return to Store */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-1">
              <button
                type="button"
                onClick={handleProceedWithPayment}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-md bg-[#27272A] hover:bg-indigo-500 border border-zinc-600 hover:border-indigo-400 text-xs sm:text-sm font-bold tracking-wider uppercase text-zinc-100 transition-colors cursor-pointer"
              >
                <CreditCard className="w-4 h-4 shrink-0" />
                <span>{t.proceedWithPayment}</span>
              </button>

              <button
                type="button"
                onClick={closePaymentModal}
                className="flex-1 inline-flex items-center justify-center py-2.5 px-4 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-indigo-400/70 text-xs sm:text-sm font-bold tracking-wider uppercase text-zinc-200 hover:text-indigo-400 transition-colors cursor-pointer"
              >
                {t.returnToCart}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CartPage;
