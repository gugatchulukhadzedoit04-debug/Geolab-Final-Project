import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  CreditCard,
  History,
  LifeBuoy,
  LogOut,
  Plus,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const USERS_STORAGE_KEY = "crytek_users";
const CURRENT_USER_STORAGE_KEY = "crytek_current_user";

//. Languages
const PROFILE_LABELS = {
  en: {
    navTitle: "My Account",
    tabAccount: "Account Information",
    tabPayment: "Payment Information",
    tabHistory: "Purchase History",
    tabSupport: "Contact Our Support",
    btnLogout: "Log Out",

    accountHeading: "Account Information",
    emailLabel: "EMAIL",
    dobLabel: "DATE OF BIRTH",
    saveProfileBtn: "SAVE CHANGES",
    profileSaved: "Account information updated.",

    paymentHeading: "Payment Information",
    cardNumberLabel: "CREDIT CARD NUMBER",
    cardNameLabel: "NAME ON THE CREDIT CARD",
    addPaymentBtn: "Add a payment method",
    addAnotherPaymentBtn: "Add another payment method",
    savedCardsHeading: "Saved Payment Methods",
    errCardFields: "Please enter both Credit Card Number and Name on the Card.",

    historyHeading: "Purchase History",
    emptyHistory: "You haven't made any purchases yet.",
    purchasedOn: "Purchased on",
    statusCompleted: "Completed",

    supportHeading: "Contact Our Support",
    supportEmailLabel: "SUPPORT EMAIL",
    supportMessageLabel: "YOUR MESSAGE",
    sendSupportBtn: "SEND MESSAGE",
    supportSent: "Your message has been sent to example@mail.com.",
    errSupportEmpty: "Please describe your concern before sending.",
  },
  ka: {
    navTitle: "ჩემი ანგარიში",
    tabAccount: "ანგარიშის ინფორმაცია",
    tabPayment: "გადახდის ინფორმაცია",
    tabHistory: "შესყიდვების ისტორია",
    tabSupport: "მხარდაჭერასთან დაკავშირება",
    btnLogout: "გასვლა",

    accountHeading: "ანგარიშის ინფორმაცია",
    emailLabel: "ელ-ფოსტა",
    dobLabel: "დაბადების თარიღი",
    saveProfileBtn: "შენახვა",
    profileSaved: "ანგარიშის ინფორმაცია განახლდა.",

    paymentHeading: "გადახდის ინფორმაცია",
    cardNumberLabel: "საკრედიტო ბარათის ნომერი",
    cardNameLabel: "მფლობელის სახელი ბარათზე",
    addPaymentBtn: "Add a payment method",
    addAnotherPaymentBtn: "Add another payment method",
    savedCardsHeading: "შენახული ბარათები",
    errCardFields: "გთხოვთ შეავსოთ ბარათის ნომერი და მფლობელის სახელი.",

    historyHeading: "შესყიდვების ისტორია",
    emptyHistory: "თქვენ ჯერ არ გაქვთ განხორციელებული შესყიდვები.",
    purchasedOn: "შეძენის თარიღი",
    statusCompleted: "დასრულებული",

    supportHeading: "მხარდაჭერასთან დაკავშირება",
    supportEmailLabel: "მხარდაჭერის ელ-ფოსტა",
    supportMessageLabel: "თქვენი შეტყობინება",
    sendSupportBtn: "გაგზავნა",
    supportSent: "თქვენი შეტყობინება გაიგზავნა მისამართზე example@mail.com.",
    errSupportEmpty: "გთხოვთ ჩაწეროთ თქვენი შეტყობინება გაგზავნამდე.",
  },
};

const getStoredUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const getStoredCurrentUser = () => {
  try {
    const raw = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const maskCardNumber = (num) => {
  const digits = num.replace(/\s+/g, "");
  if (digits.length <= 4) return digits;
  const last4 = digits.slice(-4);
  return `•••• •••• •••• ${last4}`;
};

const ProfilePage = () => {
  const { lang } = useLanguage();
  const t = PROFILE_LABELS[lang];
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("account");
  const [userRecord, setUserRecord] = useState(null);

  // Account Info state
  const [dob, setDob] = useState("");
  const [accountSavedMsg, setAccountSavedMsg] = useState("");

  // Payment Info state
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showCardForm, setShowCardForm] = useState(true);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [paymentError, setPaymentError] = useState("");

  // Purchase History state
  const [purchases, setPurchases] = useState([]);

  // Support state
  const [supportMessage, setSupportMessage] = useState("");
  const [supportFeedback, setSupportFeedback] = useState({
    type: "",
    text: "",
  });

  const refreshUserRecord = useCallback(
    (syncInputs = false) => {
      const sessionUser = getStoredCurrentUser();
      if (!sessionUser?.email) {
        navigate("/account");
        return;
      }

      const users = getStoredUsers();
      const found = users.find(
        (u) => u.email.toLowerCase() === sessionUser.email.toLowerCase(),
      ) || {
        email: sessionUser.email,
        dob: "",
        paymentMethods: [],
        purchases: [],
      };

      setUserRecord(found);
      setPurchases(Array.isArray(found.purchases) ? found.purchases : []);

      const existingCards = Array.isArray(found.paymentMethods)
        ? found.paymentMethods
        : [];
      setPaymentMethods(existingCards);

      if (syncInputs) {
        setDob(found.dob || "");
        setShowCardForm(existingCards.length === 0);
      }
    },
    [navigate],
  );

  useEffect(() => {
    refreshUserRecord(true);

    const handleSync = () => refreshUserRecord(false);
    window.addEventListener("auth-change", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("auth-change", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [refreshUserRecord]);

  useEffect(() => {
    if (activeSection === "history") {
      refreshUserRecord(false);
    }
  }, [activeSection, refreshUserRecord]);

  //  `crytek_users` in localStorage
  const persistUserUpdates = (updates) => {
    if (!userRecord?.email) return;

    const users = getStoredUsers();
    const idx = users.findIndex(
      (u) => u.email.toLowerCase() === userRecord.email.toLowerCase(),
    );

    const updatedRecord = { ...userRecord, ...updates };
    if (idx !== -1) {
      users[idx] = updatedRecord;
    } else {
      users.push(updatedRecord);
    }

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    setUserRecord(updatedRecord);
    if (Array.isArray(updatedRecord.purchases)) {
      setPurchases(updatedRecord.purchases);
    }
  };

  // Date of Birth
  const handleSaveAccountInfo = (e) => {
    e.preventDefault();
    persistUserUpdates({ dob });
    setAccountSavedMsg(t.profileSaved);
    setTimeout(() => setAccountSavedMsg(""), 3000);
  };

  // Add Payment Method
  const handleAddPaymentMethod = (e) => {
    e.preventDefault();
    setPaymentError("");

    const trimmedNum = cardNumber.trim();
    const trimmedName = cardName.trim();

    if (!trimmedNum || !trimmedName) {
      setPaymentError(t.errCardFields);
      return;
    }

    const digits = trimmedNum.replace(/\s+/g, "");
    const newCard = {
      id: `card-${Date.now()}`,
      brand: "Card",
      last4: digits.slice(-4),
      holderName: trimmedName,
      cardNumber: trimmedNum,
      maskedNumber: maskCardNumber(trimmedNum),
      cardName: trimmedName,
    };

    const updatedCards = [...paymentMethods, newCard];
    setPaymentMethods(updatedCards);
    persistUserUpdates({ paymentMethods: updatedCards });

    setCardNumber("");
    setCardName("");
    setShowCardForm(false);
  };

  // Contact Support Submit
  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportMessage.trim()) {
      setSupportFeedback({ type: "error", text: t.errSupportEmpty });
      return;
    }

    const existingTickets = userRecord?.supportTickets || [];
    persistUserUpdates({
      supportTickets: [
        ...existingTickets,
        {
          id: `ticket-${Date.now()}`,
          to: "example@mail.com",
          message: supportMessage.trim(),
          sentAt: new Date().toISOString(),
        },
      ],
    });

    setSupportMessage("");
    setSupportFeedback({ type: "success", text: t.supportSent });
  };

  // 5. Log Out -> Redirect to Home Page
  const handleLogout = () => {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  if (!userRecord) return null;

  return (
    <main className="w-full min-h-[calc(100vh-160px)] bg-zinc-950 text-zinc-100 py-10 pb-16">
      <div className="w-full px-4 sm:px-6 md:w-[84%] md:px-0 lg:w-[80%] mx-auto">
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
          <aside
            aria-label="Profile Navigation"
            className="w-full md:w-64 lg:w-72 shrink-0 bg-[#121214] border border-zinc-800 rounded-md overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-zinc-800 bg-[#27272A]/40">
              <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-indigo-400">
                {t.navTitle}
              </p>
              <p className="mt-1 text-xs text-zinc-300 truncate">
                {userRecord.email}
              </p>
            </div>

            <nav className="flex flex-col p-2 space-y-1">
              <button
                type="button"
                onClick={() => setActiveSection("account")}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-md text-left text-xs sm:text-sm font-semibold tracking-wide transition-colors cursor-pointer ${
                  activeSection === "account"
                    ? "bg-[#27272A] text-indigo-400 border border-indigo-400/40"
                    : "text-zinc-300 hover:bg-[#27272A]/50 hover:text-indigo-400"
                }`}
              >
                <User className="w-4 h-4 shrink-0" />
                <span>{t.tabAccount}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection("payment")}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-md text-left text-xs sm:text-sm font-semibold tracking-wide transition-colors cursor-pointer ${
                  activeSection === "payment"
                    ? "bg-[#27272A] text-indigo-400 border border-indigo-400/40"
                    : "text-zinc-300 hover:bg-[#27272A]/50 hover:text-indigo-400"
                }`}
              >
                <CreditCard className="w-4 h-4 shrink-0" />
                <span>{t.tabPayment}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection("history")}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-md text-left text-xs sm:text-sm font-semibold tracking-wide transition-colors cursor-pointer ${
                  activeSection === "history"
                    ? "bg-[#27272A] text-indigo-400 border border-indigo-400/40"
                    : "text-zinc-300 hover:bg-[#27272A]/50 hover:text-indigo-400"
                }`}
              >
                <History className="w-4 h-4 shrink-0" />
                <span>{t.tabHistory}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection("support")}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-md text-left text-xs sm:text-sm font-semibold tracking-wide transition-colors cursor-pointer ${
                  activeSection === "support"
                    ? "bg-[#27272A] text-indigo-400 border border-indigo-400/40"
                    : "text-zinc-300 hover:bg-[#27272A]/50 hover:text-indigo-400"
                }`}
              >
                <LifeBuoy className="w-4 h-4 shrink-0" />
                <span>{t.tabSupport}</span>
              </button>

              <div className="pt-2 mt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-md text-left text-xs sm:text-sm font-semibold tracking-wide text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>{t.btnLogout}</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* Right Content Panel */}
          <section className="flex-1 w-full bg-[#121214] border border-zinc-800 rounded-md p-6 sm:p-8">
            {/* 1. ACCOUNT INFORMATION */}
            {activeSection === "account" && (
              <div className="space-y-6">
                <h1 className="text-xl sm:text-2xl font-bold tracking-wider uppercase text-zinc-100 border-b border-zinc-800 pb-4">
                  {t.accountHeading}
                </h1>

                {accountSavedMsg && (
                  <div
                    role="status"
                    className="p-3 rounded-md bg-[#27272A] border border-indigo-400/60 text-xs text-zinc-200 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{accountSavedMsg}</span>
                  </div>
                )}

                <form
                  onSubmit={handleSaveAccountInfo}
                  className="max-w-md space-y-5"
                >
                  <div className="space-y-1.5">
                    <label
                      htmlFor="profile-email"
                      className="block text-xs font-bold tracking-wider uppercase text-zinc-300"
                    >
                      {t.emailLabel}
                    </label>
                    <input
                      id="profile-email"
                      type="email"
                      value={userRecord.email}
                      readOnly
                      className="w-full px-3.5 py-2.5 rounded-md bg-[#27272A]/50 border border-zinc-800 text-sm text-zinc-400 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="profile-dob"
                      className="block text-xs font-bold tracking-wider uppercase text-zinc-300"
                    >
                      {t.dobLabel}
                    </label>
                    <input
                      id="profile-dob"
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-md bg-[#27272A] border border-zinc-700 text-sm text-zinc-100 focus:outline-none focus:border-indigo-400 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-md bg-[#27272A] hover:bg-indigo-500 border border-zinc-600 hover:border-indigo-400 text-xs font-bold tracking-wider uppercase text-zinc-100 transition-colors cursor-pointer"
                  >
                    {t.saveProfileBtn}
                  </button>
                </form>
              </div>
            )}

            {/* 2. PAYMENT INFORMATION */}
            {activeSection === "payment" && (
              <div className="space-y-6">
                <h1 className="text-xl sm:text-2xl font-bold tracking-wider uppercase text-zinc-100 border-b border-zinc-800 pb-4">
                  {t.paymentHeading}
                </h1>

                {/* Saved Credit Cards Display */}
                {paymentMethods.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xs font-bold tracking-wider uppercase text-zinc-400">
                      {t.savedCardsHeading}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {paymentMethods.map((card) => (
                        <div
                          key={card.id}
                          className="p-4 rounded-md bg-gradient-to-br from-[#27272A] to-zinc-900 border border-zinc-700 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <CreditCard className="w-5 h-5 text-indigo-400" />
                            <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-400">
                              {card.brand || "CARD"}
                            </span>
                          </div>
                          <p className="text-base font-mono tracking-wider text-zinc-100">
                            {card.maskedNumber ||
                              maskCardNumber(
                                card.cardNumber || card.last4 || "",
                              )}
                          </p>
                          <p className="text-xs uppercase tracking-wider text-zinc-400">
                            {card.cardName || card.holderName}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Button below saved cards */}
                    {!showCardForm && (
                      <button
                        type="button"
                        onClick={() => setShowCardForm(true)}
                        className="inline-flex items-center gap-2 py-2.5 px-4 rounded-md bg-[#27272A] hover:bg-indigo-500 border border-zinc-600 hover:border-indigo-400 text-xs font-bold tracking-wider uppercase text-zinc-100 transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{t.addAnotherPaymentBtn}</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Add Payment Method Form */}
                {showCardForm && (
                  <form
                    onSubmit={handleAddPaymentMethod}
                    className="max-w-md space-y-5 pt-2"
                    noValidate
                  >
                    {paymentError && (
                      <div
                        role="alert"
                        className="p-3 rounded-md bg-red-950/50 border border-red-500/60 text-xs text-red-200"
                      >
                        {paymentError}
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label
                        htmlFor="card-number"
                        className="block text-xs font-bold tracking-wider uppercase text-zinc-300"
                      >
                        {t.cardNumberLabel}
                      </label>
                      <input
                        id="card-number"
                        type="text"
                        inputMode="numeric"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-md bg-[#27272A] border border-zinc-700 text-sm text-zinc-100 focus:outline-none focus:border-indigo-400 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="card-name"
                        className="block text-xs font-bold tracking-wider uppercase text-zinc-300"
                      >
                        {t.cardNameLabel}
                      </label>
                      <input
                        id="card-name"
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-md bg-[#27272A] border border-zinc-700 text-sm text-zinc-100 focus:outline-none focus:border-indigo-400 transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      className="py-2.5 px-5 rounded-md bg-[#27272A] hover:bg-indigo-500 border border-zinc-600 hover:border-indigo-400 text-xs font-bold tracking-wider uppercase text-zinc-100 transition-colors cursor-pointer"
                    >
                      {t.addPaymentBtn}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* 3. PURCHASE HISTORY */}
            {activeSection === "history" && (
              <div className="space-y-6">
                <h1 className="text-xl sm:text-2xl font-bold tracking-wider uppercase text-zinc-100 border-b border-zinc-800 pb-4">
                  {t.historyHeading}
                </h1>

                {purchases.length === 0 ? (
                  <div className="p-8 rounded-md bg-[#27272A]/30 border border-zinc-800 text-center">
                    <p className="text-sm text-zinc-400">{t.emptyHistory}</p>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-4">
                    {purchases.map((purchase, index) => (
                      <article
                        key={purchase.id || index}
                        className="w-full p-4 sm:p-5 rounded-md bg-[#27272A]/50 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          {purchase.badge && (
                            <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-zinc-900 text-indigo-400 border border-zinc-700">
                              {purchase.badge}
                            </span>
                          )}
                          <h2 className="text-base font-bold text-zinc-100">
                            {purchase.title}
                            {purchase.quantity > 1
                              ? ` (x${purchase.quantity})`
                              : ""}
                          </h2>
                          <p className="text-xs text-zinc-400">
                            {t.purchasedOn}:{" "}
                            {purchase.date || new Date().toLocaleDateString()}
                            {purchase.cardUsed ? ` • ${purchase.cardUsed}` : ""}
                          </p>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                          <span className="text-base font-bold text-indigo-400">
                            {purchase.price}
                          </span>
                          <span className="text-[11px] uppercase tracking-wider text-emerald-400">
                            {t.statusCompleted}
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. CONTACT OUR SUPPORT */}
            {activeSection === "support" && (
              <div className="space-y-6">
                <h1 className="text-xl sm:text-2xl font-bold tracking-wider uppercase text-zinc-100 border-b border-zinc-800 pb-4">
                  {t.supportHeading}
                </h1>

                {supportFeedback.text && (
                  <div
                    role={supportFeedback.type === "error" ? "alert" : "status"}
                    className={`p-3 rounded-md border text-xs ${
                      supportFeedback.type === "error"
                        ? "bg-red-950/50 border-red-500/60 text-red-200"
                        : "bg-[#27272A] border-indigo-400/60 text-zinc-200"
                    }`}
                  >
                    {supportFeedback.text}
                  </div>
                )}

                <form
                  onSubmit={handleSupportSubmit}
                  className="max-w-lg space-y-5"
                >
                  <div className="space-y-1.5">
                    <label
                      htmlFor="support-email"
                      className="block text-xs font-bold tracking-wider uppercase text-zinc-300"
                    >
                      {t.supportEmailLabel}
                    </label>
                    <input
                      id="support-email"
                      type="email"
                      value="example@mail.com"
                      readOnly
                      className="w-full px-3.5 py-2.5 rounded-md bg-[#27272A]/60 border border-zinc-700 text-sm font-medium text-indigo-400 cursor-default"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="support-message"
                      className="block text-xs font-bold tracking-wider uppercase text-zinc-300"
                    >
                      {t.supportMessageLabel}
                    </label>
                    <textarea
                      id="support-message"
                      rows={5}
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-md bg-[#27272A] border border-zinc-700 text-sm text-zinc-100 focus:outline-none focus:border-indigo-400 transition-colors resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-md bg-[#27272A] hover:bg-indigo-500 border border-zinc-600 hover:border-indigo-400 text-xs font-bold tracking-wider uppercase text-zinc-100 transition-colors cursor-pointer"
                  >
                    {t.sendSupportBtn}
                  </button>
                </form>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
