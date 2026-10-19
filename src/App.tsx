import { BrowserRouter, Route, Routes } from "react-router-dom";

import { CookieConsentBanner } from "./components/CookieConsentBanner";
import { Home } from "./pages/Home";
import { ThankYou } from "./pages/ThankYou";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
      <CookieConsentBanner />
    </BrowserRouter>
  );
}

export default App;
