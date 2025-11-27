import { useNavigate } from "react-router-dom";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-white via-slate-50 to-slate-100" />
      <div className="fixed inset-0 -z-10 opacity-30 bg-[radial-gradient(circle_at_top,_#facc1533,_transparent_65%),_radial-gradient(circle_at_bottom,_#0ea5e933,_transparent_70%)]" />

      <header className="px-4 pt-6 pb-4 flex items-center justify-between max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-400 flex items-center justify-center text-xs font-bold text-slate-900 shadow-md shadow-amber-200/60 border border-amber-300">
            RB
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold text-slate-800 tracking-tight">
              RastroBlock
            </span>
            <span className="text-[11px] text-slate-500">
              Sistema de Rastreabilidade de Produtos Alimentares Processados
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-10">
        <div className="w-full max-w-5xl flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <section className="md:w-1/2 space-y-3">
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
              Bem-vindo ao sistema de rastreabilidade alimentar de Maputo.
            </h1>
            <p className="text-sm md:text-[15px] text-slate-600 leading-relaxed">
              Escolha como pretende aceder a plataforma. Consumidores podem verificar a
              origem e o historial dos produtos atraves do QR Code. Unidades industriais,
              estabelecimentos comerciais e entidades fiscalizadoras utilizam o acesso
              interno para registar e acompanhar os lotes processados.
            </p>
            <p className="text-[11px] text-slate-500">
              Esta aplicacao e um prototipo funcional de apoio a transparencia e seguranca
              alimentar.
            </p>
          </section>

          <section className="md:w-1/2">
            <div className="w-full max-w-md mx-auto space-y-4">
              <button
                type="button"
                onClick={() => navigate("/consulta")}
                className="w-full rounded-3xl bg-amber-400 px-6 py-6 shadow-md shadow-amber-300/50 flex items-center justify-between gap-4 active:scale-[0.99] transition-transform"
              >
                <div className="flex items-center gap-4">
                  <div className="h-11 w-11 rounded-xl bg-white/90 flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-[2px]">
                      <span className="h-2.5 w-2.5 bg-slate-900 rounded-[2px]" />
                      <span className="h-2.5 w-2.5 bg-transparent" />
                      <span className="h-2.5 w-2.5 bg-slate-900 rounded-[2px]" />
                      <span className="h-2.5 w-2.5 bg-transparent" />
                      <span className="h-2.5 w-2.5 bg-slate-900 rounded-[2px]" />
                      <span className="h-2.5 w-2.5 bg-transparent" />
                      <span className="h-2.5 w-2.5 bg-slate-900 rounded-[2px]" />
                      <span className="h-2.5 w-2.5 bg-transparent" />
                      <span className="h-2.5 w-2.5 bg-slate-900 rounded-[2px]" />
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-slate-900">
                      Sou consumidor
                    </span>
                    <span className="text-[11px] text-slate-800">
                      Quero fazer scan do QR Code e consultar o historial do produto.
                    </span>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full rounded-3xl bg-white px-6 py-6 shadow-sm border border-slate-200 flex items-center justify-between gap-4 active:scale-[0.99] transition-transform"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className="h-9 w-9 rounded-full bg-slate-900" />
                    <span className="mt-1 h-3 w-10 rounded-full bg-slate-900/90" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-slate-900">
                      Acesso institucional
                    </span>
                    <span className="text-[11px] text-slate-600">
                      Unidades industriais, estabelecimentos comerciais e entidades
                      fiscalizadoras.
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </section>
        </div>
      </main>

      <footer className="py-4 text-center text-[15px] text-slate-500 border-t border-slate-200 bg-white/80 backdrop-blur">
        Prototipo academico — Universidade Sao Tomas de Mocambique
      </footer>
    </div>
  );
}
