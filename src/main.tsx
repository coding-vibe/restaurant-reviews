import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import { ApolloProvider } from "@apollo/client";
import { SnackbarProvider } from "notistack";
import client from "./apollo-client";

import LoginPage from "./components/LoginPage/LoginPage.tsx";
import ReviewsPage from "./components/ReviewsPage/ReviewsPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <SnackbarProvider>
          <Routes>
            <Route path="/" element={<div>Home page</div>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/restaurant/:id/reviews" element={<ReviewsPage />} />
          </Routes>
        </SnackbarProvider>
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>
);
