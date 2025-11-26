import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

const linkBase =
  "flex items-center gap-2 px-3 py-2 text-xs md:text-sm rounded-full transition-colors w-full";
const linkInactive =
  "text-slate-600 hover:text-slate-900 hover:bg-slate-100";
const linkActive =
  "text-slate-900 bg-amber-200/70 border border-amber-300 shadow-sm";

export function Sidebar() {
  const navigate = useNavigate();
  const [openMobile, setOpenMobile] = useState(false);

  const handleLogout = () => {
    navigate("/");
  };

  const NavItems = (
    <>
      <NavLink
        to="/dashboard"
        end
        className={({ isActive }) =>
          `${linkBase} ${isActive ? linkActive : linkInactive}`
        }
        onClick={() => setOpenMobile(false)}
      >
        <span>Dashboard</span>
      </NavLink>

      <NavLink
        to="/dashboard/lotes"
        className={({ isActive }) =>
          `${linkBase} ${isActive ? linkActive : linkInactive}`
        }
        onClick={() => setOpenMobile(false)}
      >
        <span>Lotes</span>
      </NavLink>

      <NavLink
        to="/dashboard/inspecoes"
        className={({ isActive }) =>
          `${linkBase} ${isActive ? linkActive : linkInactive}`
        }
        onClick={() => setOpenMobile(false)}
      >
        <span>Inspecções</span>
      </NavLink>
    </>
  );

  return (
    <>
      {/* SIDEBAR FIXA – DESKTOP */}
      <aside className="hidden md:block">
        <div className="fixed left-0 top-0 h-screen w-56 border-r border-slate-200 bg-white/90 backdrop-blur flex flex-col">
          {/* topo com logo */}
          <div className="px-3 pt-4 pb-3 border-b border-slate-200">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-slate-900 hover:text-amber-600 transition-colors"
            >
              <div className="h-8 w-8 rounded-xl bg-amber-400 flex items-center justify-center text-xs font-bold text-slate-900 shadow-md shadow-amber-200/70 border border-amber-300">
                RB
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  RastroBlock
                </span>
              </div>
            </button>
          </div>

          {/* navegação */}
          <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
            {NavItems}
          </nav>

          {/* sair */}
          <div className="px-3 pb-4 border-t border-slate-200 pt-3">
            <button
              onClick={handleLogout}
              className="w-full px-3 py-1.5 text-xs font-medium rounded-full border border-slate-300 bg-white text-slate-700 hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              Terminar sessão
            </button>
          </div>
        </div>
      </aside>

      {/* HEADER + DRAWER MOBILE */}
      <header className="md:hidden flex items-center justify-between px-3 py-2 border-b border-slate-200 bg-white/90 backdrop-blur">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1 text-slate-900"
        >
          <div className="h-7 w-7 rounded-lg bg-amber-400 flex items-center justify-center text-[10px] font-bold text-slate-900 border border-amber-300">
            RB
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              RastroBlock
            </span>
            <span className="text-[10px] text-slate-500">
              Rastreabilidade alimentar
            </span>
          </div>
        </button>

        <button
          onClick={() => setOpenMobile((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-md border border-slate-300 p-1 text-slate-700 hover:bg-slate-100"
        >
          <span className="sr-only">Abrir menu</span>
          <div className="space-y-1">
            <span className="block h-0.5 w-5 bg-slate-800" />
            <span className="block h-0.5 w-4 bg-slate-500" />
            <span className="block h-0.5 w-3 bg-slate-400" />
          </div>
        </button>
      </header>

      {openMobile && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div
            className="absolute inset-0 bg-black/25"
            onClick={() => setOpenMobile(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-slate-200 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-700">
                Menu
              </span>
              <button
                onClick={() => setOpenMobile(false)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Fechar
              </button>
            </div>

            <nav className="flex-1 space-y-2">{NavItems}</nav>

            <button
              onClick={() => {
                setOpenMobile(false);
                handleLogout();
              }}
              className="mt-4 px-3 py-1.5 text-xs font-medium rounded-full border border-slate-300 bg-white text-slate-700 hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-colors w-full"
            >
              Terminar sessão
            </button>
          </div>
        </div>
      )}
    </>
  );
}
