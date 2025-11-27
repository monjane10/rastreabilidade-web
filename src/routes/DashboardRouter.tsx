import { DashboardPage } from "../pages/DashboardPage";
import { DashboardIndustrialPage } from "../pages/DashboardIndustrialPage";
import { DashboardEstabelecimentoPage } from "../pages/DashboardEstabelecimentoPage";
import { getSession } from "../services/auth";

export function DashboardRouter() {
  const session = getSession();
  const perfil = session?.perfil ?? "FISCAL";

  if (perfil === "UNIDADE_INDUSTRIAL") return <DashboardIndustrialPage />;
  if (perfil === "ESTABELECIMENTO") return <DashboardEstabelecimentoPage />;

  return <DashboardPage />;
}
