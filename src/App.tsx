import { BrowserRouter, Route, Routes } from "react-router-dom";

import { CookieConsentBanner } from "./components/CookieConsentBanner";
import { useAnalyticsPageviews } from "./hooks/useAnalyticsPageviews";
import { Home } from "./pages/Home";
import { ThankYou } from "./pages/ThankYou";

function AnalyticsListener() {
  useAnalyticsPageviews();
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <AnalyticsListener />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
      <CookieConsentBanner />
    </BrowserRouter>
  );
}

export default App;
