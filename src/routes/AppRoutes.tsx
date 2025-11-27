import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { LoginPage } from "../pages/LoginPage";
import { LandingPage } from "../pages/LandingPage";
import { DashboardRouter } from "./DashboardRouter";
import { InspectionsPage } from "../pages/InspectionsPage";
import { LotsPage } from "../pages/LotsPage";
import { PublicScanPage } from "../pages/PublicScanPage";
import { getSession } from "../services/auth";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const session = getSession();
  if (!session) return <Navigate to="/login" replace />;
  return children;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardRouter />} />
        <Route path="lotes" element={<LotsPage />} />
        <Route path="inspecoes" element={<InspectionsPage />} />
        <Route path="qr" element={<LotsPage />} />
        <Route path="saida" element={<LotsPage />} />
        <Route path="recepcao" element={<LotsPage />} />
        <Route path="armazenamento" element={<LotsPage />} />
        <Route path="venda" element={<LotsPage />} />
        <Route path="corretivas" element={<InspectionsPage />} />
      </Route>
      <Route path="/consulta" element={<PublicScanPage />} />
      <Route path="/consulta/:loteId" element={<PublicScanPage />} />
      <Route path="/publico/lote/:loteId" element={<PublicScanPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
