import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 px-4">
      <h1 className="text-5xl font-bold text-slate-200">404</h1>
      <p className="mt-2 text-sm text-slate-400">
        A página que procuras não foi encontrada.
      </p>
      <Link
        to="/"
        className="mt-4 inline-flex items-center justify-center rounded-md bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 transition-colors"
      >
        Voltar ao dashboard
      </Link>
    </div>
  );
}
