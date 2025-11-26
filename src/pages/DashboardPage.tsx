import { useNavigate } from "react-router-dom";

export function DashboardPage() {
  const navigate = useNavigate();

  // Dados mock – só para protótipo
  const resumo = {
    lotesRegistados: 18,
    produtosExpostos: 42,
    inspecoesRealizadas: 7,
    alertasPendentes: 3,
  };

  const actividadeRecente = [
    {
      id: 1,
      tipo: "Lote registado",
      descricao:
        "Lote L-2025-001 – Hambúrguer Bovino registado pela Unidade Industrial da Matola.",
      data: "2025-11-20 09:15",
    },
    {
      id: 2,
      tipo: "Inspecção",
      descricao: "Inspecção ao Estabelecimento Comercial Racheio.",
      data: "2025-11-19 15:40",
    },
    {
      id: 3,
      tipo: "Consulta pública",
      descricao: "Consumidor consultou o lote L-2025-001 via QR Code.",
      data: "2025-11-19 11:22",
    },
  ];

  const alertas = [
    {
      id: 1,
      tipo: "Produto suspeito",
      descricao:
        "Código de lote não encontrado durante consulta pública. Estabelecimento: Shoprite.",
      data: "2025-11-18 18:03",
      severidade: "alta",
    },
    {
      id: 2,
      tipo: "Validade próxima",
      descricao:
        "Lote L-2025-004 com validade a 5 dias – verificar rotação em loja.",
      data: "2025-11-18 10:27",
      severidade: "media",
    },
    {
      id: 3,
      tipo: "Produto suspeito",
      descricao:
        "Código de lote não encontrado durante consulta pública. Estabelecimento: Congelados.",
      data: "2025-11-18 10:27",
      severidade: "alta",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Cabeçalho do dashboard */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
            Visão geral
          </h1>
          <p className="text-sm text-slate-600">
            Monitorização dos principais indicadores e eventos de rastreabilidade.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              navigate("/dashboard/inspecoes", { state: { modo: "registar" } })
            }
            className="inline-flex items-center justify-center rounded-full bg-amber-400 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-900 hover:bg-amber-300 border border-amber-300 shadow-sm"
          >
            Registar inspecção
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/inspecoes")}
            className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 border border-slate-300 hover:bg-slate-100"
          >
            Ver inspecções
          </button>
        </div>
      </div>

      {/* Cartões de métricas principais */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 flex flex-col gap-1.5">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Lotes registados
          </span>
          <span className="text-2xl font-semibold text-slate-900">
            {resumo.lotesRegistados}
          </span>
          <span className="text-[11px] text-slate-500">
            Total de lotes de produtos processados registados no sistema.
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 flex flex-col gap-1.5">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Produtos expostos
          </span>
          <span className="text-2xl font-semibold text-slate-900">
            {resumo.produtosExpostos}
          </span>
          <span className="text-[11px] text-slate-500">
            Lotes actualmente em exposição nos estabelecimentos comerciais.
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 flex flex-col gap-1.5">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Inspecções realizadas
          </span>
          <span className="text-2xl font-semibold text-slate-900">
            {resumo.inspecoesRealizadas}
          </span>
          <span className="text-[11px] text-slate-500">
            Inspecções registadas pelas entidades fiscalizadoras.
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 flex flex-col gap-1.5">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Alertas pendentes
          </span>
          <span className="text-2xl font-semibold text-red-600">
            {resumo.alertasPendentes}
          </span>
          <span className="text-[11px] text-slate-500">
            Casos que requerem análise, como suspeita de falsificação ou
            inconsistências.
          </span>
        </div>
      </section>

      {/* Secção inferior em duas colunas */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actividade recente */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Actividade recente
            </h2>
            <span className="text-[11px] text-slate-500">
              Últimos eventos registados
            </span>
          </div>

          <div className="space-y-3">
            {actividadeRecente.map((item) => (
              <div
                key={item.id}
                className="border border-slate-200 rounded-lg px-3 py-2.5 bg-slate-50/60"
              >
                <p className="text-xs font-semibold text-slate-700">
                  {item.tipo}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  {item.descricao}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {item.data}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Alertas e possíveis irregularidades */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Alertas e irregularidades
            </h2>
            <span className="text-[11px] text-slate-500">
              Monitoria de risco
            </span>
          </div>

          <div className="space-y-3">
            {alertas.map((alerta) => (
              <div
                key={alerta.id}
                className={`rounded-lg px-3 py-2.5 border text-xs ${
                  alerta.severidade === "alta"
                    ? "border-red-300 bg-red-50"
                    : "border-amber-300 bg-amber-50"
                }`}
              >
                <p className="font-semibold text-slate-900">{alerta.tipo}</p>
                <p className="mt-0.5 text-slate-700">{alerta.descricao}</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {alerta.data}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide ${
                      alerta.severidade === "alta"
                        ? "bg-red-600 text-white"
                        : "bg-amber-400 text-slate-900"
                    }`}
                  >
                    {alerta.severidade === "alta"
                      ? "Alta prioridade"
                      : "Média"}
                  </span>
                </div>
              </div>
            ))}

            {alertas.length === 0 && (
              <p className="text-xs text-slate-500">
                Não existem alertas pendentes no momento.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
