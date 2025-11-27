import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";

export function LoginPage() {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleCodigoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const apenasNumeros = e.target.value.replace(/\D/g, "");
    setCodigo(apenasNumeros);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!codigo.trim()) {
      alert("O codigo de utilizador deve conter apenas numeros.");
      return;
    }

    if (!senha.trim()) {
      alert("Por favor, introduza a senha.");
      return;
    }

    const session = login(codigo, senha);

    if (!session) {
      alert("Credenciais invalidas. Verifique codigo/senha.");
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-white via-slate-100 to-slate-200" />
      <div className="fixed inset-0 -z-10 opacity-30 bg-[radial-gradient(circle_at_top,_#facc1533,_transparent_65%),_radial-gradient(circle_at_bottom,_#0ea5e933,_transparent_70%)]" />

      <div className="w-full max-w-md px-6">
        
        {/* Cabeçalho */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-xl bg-gradient-to-br from-amber-400 to-amber-300 flex items-center justify-center text-base font-bold text-slate-900 shadow-md shadow-amber-200/60 border border-amber-300">
            RB
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Acesso ao Sistema
          </h1>
          <p className="mt-1 text-[14px] text-slate-600">
            Plataforma de Rastreabilidade de Produtos Alimentares Processados
          </p>
        </div>

        {/* Cartão */}
        <div className="rounded-xl border border-slate-300 bg-white shadow-lg shadow-slate-200/80 p-7 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Código */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Codigo de utilizador
              </label>
              <input
                type="text"
                value={codigo}
                onChange={handleCodigoChange}
                required
                maxLength={10}
                inputMode="numeric"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                placeholder="ex: 1001"
              />
            </div>

            {/* Senha + Mostrar/Ocultar */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Senha
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                  placeholder="******"
                />

                {/* Botão mostrar/ocultar */}
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 text-xs"
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            {/* Botão Entrar */}
            <button
              type="submit"
              className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-amber-400 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              Entrar no Sistema
            </button>
          </form>
        </div>

        {/* Footer */}
        <footer className="mt-5 py-4 text-center text-[15px] text-slate-500 border-t border-slate-200">
          Prototipo academico — Universidade Sao Tomas de Moçambique
        </footer>
      </div>
    </div>
  );
}
