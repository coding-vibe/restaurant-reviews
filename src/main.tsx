import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import App from "./App.tsx";
import LoginPage from "./components/LoginPage/LoginPage.tsx";
import ReviewsPage from "./components/ReviewsPage/ReviewsPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />\
        <Route path="/restaurant/:id/reviews" element={<ReviewsPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
