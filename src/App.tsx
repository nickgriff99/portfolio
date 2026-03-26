import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import { Home } from "./pages/Home";
import { ThankYou } from "./pages/ThankYou";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/thank-you" element={<ThankYou />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
