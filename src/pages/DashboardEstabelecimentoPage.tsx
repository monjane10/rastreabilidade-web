import { type FormEvent, useEffect, useMemo, useState } from "react";
import { getSession } from "../services/auth";
import { addMovimento, getMovimentos, getLotes } from "../services/dataStore";
import { estabelecimentos } from "../mocks/mockData";
import type { MovimentoLote } from "../mocks/mockData";

type Alert = { type: "success" | "error"; message: string };

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((d, idx) => (
        <div
          key={idx}
          className="flex-1 rounded-sm bg-gradient-to-t from-sky-200 to-sky-400"
          style={{ height: `${(d / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

export function DashboardEstabelecimentoPage() {
  const session = getSession();
  const estabelecimentoId = session?.estabelecimentoId ?? -1;
  const estab = estabelecimentos.find(
    (e) => e.idEstabelecimento === estabelecimentoId
  );

  const [movimentos, setMovimentos] = useState<MovimentoLote[]>(() =>
    getMovimentos().filter((m) => m.estabelecimentoId === estabelecimentoId)
  );
  const [alerta, setAlerta] = useState<Alert | null>(null);
  const [recepcao, setRecepcao] = useState({
    loteId: "",
    quantidade: "",
    local: "Armazém",
  });
  const [venda, setVenda] = useState({
    loteId: "",
    quantidade: "",
    local: "Expositor",
  });

  const lotesDisponiveis = useMemo(
    () => getLotes().map((l) => ({ id: l.idLote, label: l.codLote })),
    []
  );

  useEffect(() => {
    setMovimentos(
      getMovimentos().filter((m) => m.estabelecimentoId === estabelecimentoId)
    );
  }, [estabelecimentoId]);

  const stats = useMemo(
    () => [
      { label: "Registos de movimento", value: movimentos.length },
      {
        label: "Lotes distintos",
        value: new Set(movimentos.map((m) => m.loteId)).size,
      },
      {
        label: "Movimentos de venda/exposição",
        value: movimentos.filter((m) => m.tipo === "VENDA").length,
      },
    ],
    [movimentos]
  );

  const handleRecepcao = (e: FormEvent) => {
    e.preventDefault();
    const loteNum = Number(recepcao.loteId);
    if (!loteNum || !recepcao.quantidade.trim()) {
      setAlerta({ type: "error", message: "Informe lote e quantidade." });
      return;
    }
    const mov: MovimentoLote = {
      idMovimento: Date.now(),
      loteId: loteNum,
      tipo: "RECEPCAO",
      dataHora: new Date().toISOString(),
      quantidade: Number(recepcao.quantidade),
      local: recepcao.local,
      estabelecimentoId,
    };
    const atual = addMovimento(mov);
    setMovimentos(
      atual.filter((m) => m.estabelecimentoId === estabelecimentoId)
    );
    setRecepcao({ loteId: "", quantidade: "", local: "Armazém" });
    setAlerta({ type: "success", message: "Recepção registada com sucesso." });
  };

  const handleVenda = (e: FormEvent) => {
    e.preventDefault();
    const loteNum = Number(venda.loteId);
    if (!loteNum || !venda.quantidade.trim()) {
      setAlerta({ type: "error", message: "Informe lote e quantidade." });
      return;
    }
    const mov: MovimentoLote = {
      idMovimento: Date.now(),
      loteId: loteNum,
      tipo: "VENDA",
      dataHora: new Date().toISOString(),
      quantidade: Number(venda.quantidade),
      local: venda.local,
      estabelecimentoId,
    };
    const atual = addMovimento(mov);
    setMovimentos(
      atual.filter((m) => m.estabelecimentoId === estabelecimentoId)
    );
    setVenda({ loteId: "", quantidade: "", local: "Expositor" });
    setAlerta({
      type: "success",
      message: "Estado actualizado para venda/exposição.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da página */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
            Painel do Estabelecimento
          </h1>
          <p className="text-sm text-slate-600">
            Acompanhe as recepções de lotes, movimentos em venda e histórico
            registado neste estabelecimento.
          </p>
        </div>

        {estab && (
          <div className="mt-2 sm:mt-0 rounded-lg border border-amber-200 bg-amber-50/70 px-3 py-2 text-xs text-slate-800">
            <div className="font-semibold">{estab.nome}</div>
            <div className="text-[11px] text-slate-600">
              {estab.endereco} · Contacto: {estab.contacto}
            </div>
          </div>
        )}
      </div>

      {/* Alerta de feedback */}
      {alerta && (
        <div
          className={`rounded-md border px-3 py-2 text-sm ${
            alerta.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {alerta.message}
        </div>
      )}

      {/* Métricas principais */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-200 bg-white shadow-sm px-4 py-3 flex flex-col gap-1.5"
          >
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
              {s.label}
            </span>
            <span className="text-2xl font-semibold text-slate-900">
              {s.value}
            </span>
          </div>
        ))}
      </section>

      {/* Resumo visual + info rápida */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-800">
              Fluxo semanal
            </span>
            <span className="text-[11px] text-slate-500">Mock</span>
          </div>
          <Sparkline data={[2, 4, 3, 5, 2, 6]} />
          <p className="text-[11px] text-slate-500">
            Representação simplificada de recepções e vendas registadas.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-2">
          <div className="text-sm font-semibold text-slate-800">
            Recepções recentes
          </div>
          <ul className="space-y-1 text-sm text-slate-700">
            {movimentos
              .filter((m) => m.tipo === "RECEPCAO")
              .slice(0, 4)
              .map((m) => (
                <li key={m.idMovimento} className="flex justify-between">
                  <span>Lote {m.loteId}</span>
                  <span className="text-slate-500">Qtd {m.quantidade}</span>
                </li>
              ))}
            {movimentos.filter((m) => m.tipo === "RECEPCAO").length === 0 && (
              <li className="text-slate-500 text-sm">
                Sem recepções registadas.
              </li>
            )}
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-2">
          <div className="text-sm font-semibold text-slate-800">
            Lotes em loja
          </div>
          <p className="text-sm text-slate-700">
            {lotesDisponiveis.length} lote(s) com QR Code visível para o
            consumidor.
          </p>
          <p className="text-[11px] text-slate-500">
            Esta informação será refinada quando estiver ligada ao backend.
          </p>
        </div>
      </section>

      {/* Formulários lado a lado */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recepção */}
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">
            Confirmar recepção de lote
          </h2>
          <p className="text-[11px] text-slate-500">
            Registe a entrada de um lote na loja após leitura do QR Code ou
            conferência documental.
          </p>

          <form
            onSubmit={handleRecepcao}
            className="grid md:grid-cols-4 gap-3 mt-1"
          >
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs text-slate-600">Lote</label>
              <select
                value={recepcao.loteId}
                onChange={(e) =>
                  setRecepcao((f) => ({ ...f, loteId: e.target.value }))
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
              >
                <option value="">Selecione</option>
                {lotesDisponiveis.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-600">Quantidade</label>
              <input
                type="number"
                min={0}
                value={recepcao.quantidade}
                onChange={(e) =>
                  setRecepcao((f) => ({ ...f, quantidade: e.target.value }))
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                placeholder="0"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-600">Local</label>
              <input
                value={recepcao.local}
                onChange={(e) =>
                  setRecepcao((f) => ({ ...f, local: e.target.value }))
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
              />
            </div>
            <div className="md:col-span-4 flex justify-end">
              <button
                type="submit"
                className="w-full md:w-auto rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-400 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                Registar recepção
              </button>
            </div>
          </form>
        </div>

        {/* Venda / exposição */}
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">
            Actualizar estado para venda / exposição
          </h2>
          <p className="text-[11px] text-slate-500">
            Indique que o lote foi colocado em exposição ou associado a uma
            venda ao consumidor.
          </p>

          <form
            onSubmit={handleVenda}
            className="grid md:grid-cols-4 gap-3 mt-1"
          >
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs text-slate-600">Lote</label>
              <select
                value={venda.loteId}
                onChange={(e) =>
                  setVenda((f) => ({ ...f, loteId: e.target.value }))
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              >
                <option value="">Selecione</option>
                {lotesDisponiveis.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-600">Quantidade</label>
              <input
                type="number"
                min={0}
                value={venda.quantidade}
                onChange={(e) =>
                  setVenda((f) => ({ ...f, quantidade: e.target.value }))
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
                placeholder="0"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-600">Local</label>
              <input
                value={venda.local}
                onChange={(e) =>
                  setVenda((f) => ({ ...f, local: e.target.value }))
                }
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              />
            </div>
            <div className="md:col-span-4 flex justify-end">
              <button
                type="submit"
                className="w-full md:w-auto rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                Actualizar estado
              </button>
            </div>
          </form>
        </div>
      </section>

     {/* Histórico de movimentos */}
<section className="space-y-3">
  <h2 className="text-sm font-semibold text-slate-800">
    Registos do estabelecimento
  </h2>
  <p className="text-[11px] text-slate-500">
    Histórico dos movimentos registados neste ponto de venda.
  </p>

  {movimentos.length === 0 ? (
    <p className="text-sm text-slate-500">
      Sem registos ainda. Após registar recepções e vendas, estas informações serão apresentadas aqui.
    </p>
  ) : (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      
      {/* Cabeçalho da tabela */}
      <div className="grid grid-cols-5 bg-slate-50 px-4 py-2 text-[12px] font-semibold text-slate-600">
        <div>Tipo</div>
        <div>Lote</div>
        <div>Quantidade</div>
        <div>Local</div>
        <div>Data / Hora</div>
      </div>

      {/* Linhas */}
      <div className="divide-y divide-slate-200">
        {movimentos.map((m) => (
          <div
            key={m.idMovimento}
            className="grid grid-cols-5 px-4 py-2 text-sm text-slate-800"
          >
            {/* Tipo */}
            <div className="text-xs font-medium">
              {m.tipo === "RECEPCAO" ? "Recepção" : "Venda"}
            </div>

            {/* Lote */}
            <div className="text-xs text-slate-700">
              {m.loteId}
            </div>

            {/* Quantidade */}
            <div className="text-xs text-slate-700">
              {m.quantidade}
            </div>

            {/* Local */}
            <div className="text-xs text-slate-600 truncate">
              {m.local}
            </div>

            {/* Data / hora */}
            <div className="text-[11px] text-slate-500 truncate">
              {m.dataHora}
            </div>
          </div>
        ))}
      </div>
    </div>
  )}
</section>

    </div>
  );
}
