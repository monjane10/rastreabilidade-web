import { Outlet } from "react-router-dom";
import { Sidebar } from "./SideBar";
import { Navbar } from "./NavBar";
export function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar fixa (desktop) + header mobile */}
      <Sidebar />

      {/* Conteúdo principal (deslocado 56 * 4 = 224px à direita em md+) */}
      <div className="flex flex-col min-h-screen md:ml-56">
        <Navbar />

        <main className="flex-1 px-4 py-6 md:px-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-5 py-4 text-center text-[15px] text-slate-500 border-t border-slate-200">
          Protótipo académico — Universidade São Tomás de Moçambique
        </footer>
      </div>
    </div>
  );
}