import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { LanguageProvider } from "./context/LanguageContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import GamesPage from "./pages/GamesPage";
import DlcPage from "./pages/DlcPage";

const PlaceholderPage = ({ title }) => (
  <main className="min-h-screen bg-zinc-950 text-zinc-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 className="text-3xl font-bold tracking-wider uppercase">{title}</h1>
  </main>
);

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
          <Header />

          <div className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/games" element={<GamesPage />} />
              <Route path="/dlc" element={<DlcPage />} />
              <Route
                path="/special-offers"
                element={<PlaceholderPage title="Special Offers" />}
              />
              <Route
                path="/account"
                element={<PlaceholderPage title="Account" />}
              />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </div>

          <Footer />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
