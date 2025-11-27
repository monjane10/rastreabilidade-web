import { getSession } from "../services/auth";

export function Navbar() {
  const session = getSession();

  const initials =
    session?.perfil?.slice(0, 2).toUpperCase() ?? "NA";

  return (
    <header
      className="
        hidden md:flex
        sticky top-0 z-20
        h-14 border-b border-slate-200
        bg-white/90 backdrop-blur
        items-center justify-between px-4
      "
    >
      {/* 🔍 Barra de pesquisa — lado esquerdo */}
      <div className="flex items-center w-full max-w-xs">
        <input
          type="text"
          placeholder="Pesquisar..."
          className="
            w-full rounded-md border border-slate-300 
            bg-white px-3 py-1.5 text-sm 
            placeholder:text-slate-400 
            focus:outline-none focus:ring-2 focus:ring-amber-400
            shadow-sm
          "
        />
      </div>

      {/* 👤 Perfil + Avatar — lado direito */}
      <div className="flex items-center gap-3 ml-auto">
        <span className="text-sm font-medium text-slate-700">
          {session ? session.perfil : "Não autenticado"}
        </span>

        <div
          className="
            h-9 w-9 rounded-full bg-amber-400 
            border border-amber-300 
            shadow-sm flex items-center justify-center 
            text-xs font-bold text-slate-900
          "
        >
          {initials}
        </div>
      </div>
    </header>
  );
}
