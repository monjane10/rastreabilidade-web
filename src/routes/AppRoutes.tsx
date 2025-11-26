import { Routes, Route } from "react-router-dom";
import { LandingPage } from "../pages/LandingPage";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { LotsPage } from "../pages/LotsPage";
import { InspectionsPage } from "../pages/InspectionsPage";
import { PublicScanPage } from "../pages/PublicScanPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { Layout } from "../components/Layout";

export function AppRoutes() {
  return (
    <Routes>
      {/* Primeira tela (landing) */}
      <Route path="/" element={<LandingPage />} />

      {/* Login (utilizador interno) */}
      <Route path="/login" element={<LoginPage />} />

      {/* Área interna (unidades, estabelecimentos, fiscais) */}
      <Route path="/dashboard" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="lotes" element={<LotsPage />} />
        <Route path="inspecoes" element={<InspectionsPage />} />
      </Route>

      {/* Consulta pública (consumidor) */}
      <Route path="/consulta" element={<PublicScanPage />} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
