import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const USERS_STORAGE_KEY = "crytek_users";
const CURRENT_USER_STORAGE_KEY = "crytek_current_user";

const ACCOUNT_LABELS = {
  en: {
    loginTab: "LOG IN",
    signupTab: "SIGN UP",
    emailLabel: "EMAIL",
    passwordLabel: "PASSWORD",
    loginBtn: "LOG IN",
    createAccountBtn: "CREATE ACCOUNT",
    forgotPassword: "Forgot password?",
    forgotMessage: "Password reset link has been sent if this email exists.",
    termsLabel: "I agree to the Terms and Conditions and Privacy Policy",
    welcomeHeading: "ACCOUNT",
    loggedInAs: "Signed in as",
    logoutBtn: "LOG OUT",
    errEmptyFields: "Please enter both email and password.",
    errTerms:
      "You must agree to the Terms and Conditions to create an account.",
    errUserExists: "An account with this email already exists.",
    errInvalidLogin: "Invalid email or password.",
    successSignup: "Account created! You are now logged in.",
  },
  ka: {
    loginTab: "შესვლა",
    signupTab: "რეგისტრაცია",
    emailLabel: "ელ-ფოსტა",
    passwordLabel: "პაროლი",
    loginBtn: "შესვლა",
    createAccountBtn: "ანგარიშის შექმნა",
    forgotPassword: "დაგავიწყდათ პაროლი?",
    forgotMessage:
      "პაროლის აღდგენის ბმული გაგზავნილია, თუ ელ-ფოსტა რეგისტრირებულია.",
    termsLabel:
      "ვეთანხმები წესებსა და პირობებს და კონფიდენციალურობის პოლიტიკას",
    welcomeHeading: "ანგარიში",
    loggedInAs: "შესული ხართ როგორც",
    logoutBtn: "გასვლა",
    errEmptyFields: "გთხოვთ შეავსოთ ელ-ფოსტა და პაროლი.",
    errTerms:
      "ანგარიშის შესაქმნელად აუცილებელია წესებსა და პირობებზე დათანხმება.",
    errUserExists: "ამ ელ-ფოსტით ანგარიში უკვე არსებობს.",
    errInvalidLogin: "არასწორი ელ-ფოსტა ან პაროლი.",
    successSignup: "ანგარიში შეიქმნა! თქვენ სისტემაში ხართ.",
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

const AccountPage = () => {
  const { lang } = useLanguage();
  const t = ACCOUNT_LABELS[lang];
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("login"); // "login" | "signup"
  const [currentUser, setCurrentUser] = useState(() => getStoredCurrentUser());

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError("");
    setInfoMessage("");
    setShowPassword(false);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError("");
    setInfoMessage("");

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      setError(t.errEmptyFields);
      return;
    }

    const users = getStoredUsers();
    const matchedUser = users.find(
      (u) => u.email === trimmedEmail && u.password === password,
    );

    if (!matchedUser) {
      setError(t.errInvalidLogin);
      return;
    }

    const sessionUser = { email: matchedUser.email };
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(sessionUser));
    window.dispatchEvent(new Event("auth-change"));
    setCurrentUser(sessionUser);
    setEmail("");
    setPassword("");
    navigate("/");
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setError("");
    setInfoMessage("");

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      setError(t.errEmptyFields);
      return;
    }

    if (!agreedToTerms) {
      setError(t.errTerms);
      return;
    }

    const users = getStoredUsers();
    const alreadyExists = users.some((u) => u.email === trimmedEmail);
    if (alreadyExists) {
      setError(t.errUserExists);
      return;
    }

    const newUser = {
      email: trimmedEmail,
      password,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

    const sessionUser = { email: newUser.email };
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(sessionUser));
    window.dispatchEvent(new Event("auth-change"));
    setCurrentUser(sessionUser);
    setEmail("");
    setPassword("");
    setAgreedToTerms(false);
    navigate("/");
  };

  const handleLogout = () => {
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    window.dispatchEvent(new Event("auth-change"));
    setCurrentUser(null);
    setError("");
    setInfoMessage("");
  };

  const handleForgotPassword = () => {
    setError("");
    setInfoMessage(t.forgotMessage);
  };

  // Logged-in state view
  if (currentUser) {
    return (
      <main className="w-full min-h-[calc(100vh-160px)] bg-zinc-950 text-zinc-100 flex items-center justify-center px-4 py-14">
        <div className="w-full max-w-md bg-[#121214] border border-zinc-800 rounded-md p-6 sm:p-8 text-center space-y-6">
          <h1 className="text-2xl font-bold tracking-wider uppercase text-zinc-100">
            {t.welcomeHeading}
          </h1>

          <div className="p-4 rounded-md bg-[#27272A]/60 border border-zinc-800 space-y-1">
            <p className="text-xs uppercase tracking-wider text-zinc-400">
              {t.loggedInAs}
            </p>
            <p className="text-base font-semibold text-indigo-400 break-all">
              {currentUser.email}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="
              w-full py-2.5 px-4 rounded-md
              bg-[#27272A] hover:bg-indigo-500
              border border-zinc-600 hover:border-indigo-400
              text-xs font-bold tracking-wider uppercase text-zinc-100
              transition-colors cursor-pointer
            "
          >
            {t.logoutBtn}
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-[calc(100vh-160px)] bg-zinc-950 text-zinc-100 flex items-center justify-center px-4 py-14">
      <div className="w-full max-w-md bg-[#121214] border border-zinc-800 rounded-md overflow-hidden shadow-xl">
        {/* Top Navigation Switcher: LOG IN / SIGN UP */}
        <div className="grid grid-cols-2 border-b border-zinc-800 bg-[#27272A]/40">
          <button
            type="button"
            onClick={() => switchTab("login")}
            className={`py-3.5 text-xs sm:text-sm font-bold tracking-wider uppercase transition-colors cursor-pointer border-b-2 ${
              activeTab === "login"
                ? "text-zinc-100 border-indigo-400 bg-[#121214]"
                : "text-zinc-400 border-transparent hover:text-indigo-400"
            }`}
          >
            {t.loginTab}
          </button>

          <button
            type="button"
            onClick={() => switchTab("signup")}
            className={`py-3.5 text-xs sm:text-sm font-bold tracking-wider uppercase transition-colors cursor-pointer border-b-2 ${
              activeTab === "signup"
                ? "text-zinc-100 border-indigo-400 bg-[#121214]"
                : "text-zinc-400 border-transparent hover:text-indigo-400"
            }`}
          >
            {t.signupTab}
          </button>
        </div>

        {/* Form Container */}
        <form
          onSubmit={
            activeTab === "login" ? handleLoginSubmit : handleSignupSubmit
          }
          className="p-6 sm:p-8 space-y-5"
          noValidate
        >
          {error && (
            <div
              role="alert"
              className="p-3 rounded-md bg-red-950/50 border border-red-500/60 text-xs text-red-200"
            >
              {error}
            </div>
          )}

          {infoMessage && (
            <div
              role="status"
              className="p-3 rounded-md bg-[#27272A] border border-indigo-400/60 text-xs text-zinc-200"
            >
              {infoMessage}
            </div>
          )}

          {/* Email Field — Persistent Label on Top, No Inner Placeholder */}
          <div className="space-y-1.5">
            <label
              htmlFor="account-email"
              className="block text-xs font-bold tracking-wider uppercase text-zinc-300"
            >
              {t.emailLabel}
            </label>
            <input
              id="account-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full px-3.5 py-2.5 rounded-md
                bg-[#27272A] border border-zinc-700
                text-sm text-zinc-100
                focus:outline-none focus:border-indigo-400
                transition-colors
              "
            />
          </div>

          {/* Password Field — Persistent Label on Top + Lucide Eye Toggle */}
          <div className="space-y-1.5">
            <label
              htmlFor="account-password"
              className="block text-xs font-bold tracking-wider uppercase text-zinc-300"
            >
              {t.passwordLabel}
            </label>
            <div className="relative">
              <input
                id="account-password"
                type={showPassword ? "text" : "password"}
                autoComplete={
                  activeTab === "login" ? "current-password" : "new-password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full pl-3.5 pr-11 py-2.5 rounded-md
                  bg-[#27272A] border border-zinc-700
                  text-sm text-zinc-100
                  focus:outline-none focus:border-indigo-400
                  transition-colors
                "
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="
                  absolute inset-y-0 right-0 px-3
                  flex items-center justify-center
                  text-zinc-400 hover:text-indigo-400
                  transition-colors cursor-pointer
                "
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Terms and Conditions Checkbox (SIGN UP only) */}
          {activeTab === "signup" && (
            <label className="flex items-start gap-2.5 cursor-pointer select-none pt-1">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-zinc-600 bg-[#27272A] accent-indigo-500 cursor-pointer"
              />
              <span className="text-xs text-zinc-300 leading-relaxed">
                {t.termsLabel}
              </span>
            </label>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="
              w-full py-2.5 px-4 rounded-md
              bg-[#27272A] hover:bg-indigo-500
              border border-zinc-600 hover:border-indigo-400
              text-xs sm:text-sm font-bold tracking-wider uppercase text-zinc-100
              transition-colors cursor-pointer
            "
          >
            {activeTab === "login" ? t.loginBtn : t.createAccountBtn}
          </button>

          {/* Forgot Password Link (LOG IN only) */}
          {activeTab === "login" && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-zinc-400 hover:text-indigo-400 underline underline-offset-4 transition-colors cursor-pointer"
              >
                {t.forgotPassword}
              </button>
            </div>
          )}
        </form>
      </div>
    </main>
  );
};

export default AccountPage;
