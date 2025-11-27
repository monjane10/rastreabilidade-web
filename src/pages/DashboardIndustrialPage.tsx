import { type FormEvent, useEffect, useMemo, useState } from "react";
import { getSession } from "../services/auth";
import { addLote, addMovimento, getLotes, getMovimentos } from "../services/dataStore";
import { unidades } from "../mocks/mockData";
import type { Lote, MovimentoLote } from "../mocks/mockData";

type Alert = { type: "success" | "error"; message: string };

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((d, idx) => (
        <div
          key={idx}
          className="flex-1 rounded-sm bg-gradient-to-t from-amber-200 to-amber-500"
          style={{ height: `${(d / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

export function DashboardIndustrialPage() {
  const session = getSession();
  const unidadeId = session?.unidadeId ?? -1;
  const unidade = unidades.find((u) => u.idUnidade === unidadeId);

  const [lotes, setLotes] = useState<Lote[]>(() =>
    getLotes().filter((l) => l.unidadeId === unidadeId)
  );
  const [movimentos, setMovimentos] = useState<MovimentoLote[]>(() =>
    getMovimentos().filter(
      (m) =>
        m.unidadeId === unidadeId ||
        getLotes().some((l) => l.idLote === m.loteId && l.unidadeId === unidadeId)
    )
  );
  const [alerta, setAlerta] = useState<Alert | null>(null);
  const [modalEntrada, setModalEntrada] = useState(false);
  const [modalLote, setModalLote] = useState(false);
  const [modalSaida, setModalSaida] = useState(false);

  const [novoLote, setNovoLote] = useState({
    codLote: "",
    dataFabricacao: "",
    dataValidade: "",
  });

  const [saida, setSaida] = useState({
    loteId: "",
    quantidade: "",
    local: "",
  });
  const [entradaMp, setEntradaMp] = useState({
    codFornecedor: "",
    quantidade: "",
    local: "Recepção",
  });

  useEffect(() => {
    setMovimentos(
      getMovimentos().filter(
        (m) => m.unidadeId === unidadeId || lotes.some((l) => l.idLote === m.loteId)
      )
    );
  }, [lotes, unidadeId]);

  const stats = useMemo(
    () => [
      { label: "Lotes activos", value: lotes.length },
      { label: "Movimentos registados", value: movimentos.length },
      {
        label: "Saídas de lote",
        value: movimentos.filter((m) => m.tipo === "SAIDA").length,
      },
      {
        label: "Entradas de matéria-prima",
        value: movimentos.filter((m) => m.tipo === "ENTRADA").length,
      },
    ],
    [lotes.length, movimentos]
  );

  const handleCriarLote = (e: FormEvent) => {
    e.preventDefault();
    if (!unidadeId) return;
    if (
      !novoLote.codLote.trim() ||
      !novoLote.dataFabricacao ||
      !novoLote.dataValidade
    ) {
      setAlerta({
        type: "error",
        message: "Preencha o código do lote, data de fabricação e validade.",
      });
      return;
    }
    const lote: Lote = {
      idLote: Date.now(),
      codLote: novoLote.codLote.trim(),
      nomeProduto: novoLote.codLote.trim(),
      dataFabricacao: novoLote.dataFabricacao,
      dataValidade: novoLote.dataValidade,
      qrCode: `QR-${novoLote.codLote.trim()}`,
      unidadeId,
    };
    const atual = addLote(lote);
    console.log("[industrial] lote criado", lote);
    setLotes(atual.filter((l) => l.unidadeId === unidadeId));
    setNovoLote({ codLote: "", dataFabricacao: "", dataValidade: "" });
    setAlerta({ type: "success", message: "Lote criado e QR Code gerado." });
    setModalLote(false);
  };

  const handleEntradaMp = (e: FormEvent) => {
    e.preventDefault();
    if (!entradaMp.codFornecedor.trim() || !entradaMp.quantidade.trim()) {
      setAlerta({
        type: "error",
        message: "Preencha o fornecedor e a quantidade de matéria-prima.",
      });
      return;
    }
    const mov: MovimentoLote = {
      idMovimento: Date.now(),
      loteId: -1,
      tipo: "ENTRADA",
      dataHora: new Date().toISOString(),
      quantidade: Number(entradaMp.quantidade),
      local: `${entradaMp.local} – Fornecedor ${entradaMp.codFornecedor}`,
      unidadeId,
    };
    const atual = addMovimento(mov);
    console.log("[industrial] entrada materia-prima", mov);
    setMovimentos(atual.filter((m) => m.unidadeId === unidadeId));
    setEntradaMp({ codFornecedor: "", quantidade: "", local: "Recepção" });
    setAlerta({
      type: "success",
      message: "Entrada de matéria-prima registada.",
    });
    setModalEntrada(false);
  };

  const handleSaida = (e: FormEvent) => {
    e.preventDefault();
    const loteIdNum = Number(saida.loteId);
    if (!loteIdNum || !saida.quantidade.trim()) {
      setAlerta({ type: "error", message: "Informe o lote e a quantidade." });
      return;
    }
    const mov: MovimentoLote = {
      idMovimento: Date.now(),
      loteId: loteIdNum,
      tipo: "SAIDA",
      dataHora: new Date().toISOString(),
      quantidade: Number(saida.quantidade),
      local: saida.local || "Expedição",
      unidadeId,
    };
    const atual = addMovimento(mov);
    console.log("[industrial] saida registada", mov);
    setMovimentos(
      atual.filter((m) => m.unidadeId === unidadeId || m.loteId === loteIdNum)
    );
    setSaida({ loteId: "", quantidade: "", local: "" });
    setAlerta({ type: "success", message: "Saída de lote registada." });
    setModalSaida(false);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da página */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
            Painel da Unidade Industrial
          </h1>
          <p className="text-sm text-slate-600">
            Acompanhe a criação de lotes, entradas de matéria-prima e saídas
            para os estabelecimentos comerciais.
          </p>
        </div>

        {unidade && (
          <div className="mt-2 sm:mt-0 rounded-lg border border-amber-200 bg-amber-50/70 px-3 py-2 text-xs text-slate-800">
            <div className="font-semibold">{unidade.nome}</div>
            <div className="text-[11px] text-slate-600">
              {unidade.endereco} · Contacto: {unidade.contacto}
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
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
          <Sparkline data={[4, 6, 3, 7, 5, 8]} />
          <p className="text-[11px] text-slate-500">
            Representação simplificada de entradas e saídas de lotes.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-2">
          <div className="text-sm font-semibold text-slate-800">
            Saídas recentes
          </div>
          <ul className="space-y-1 text-sm text-slate-700">
            {movimentos
              .filter((m) => m.tipo === "SAIDA")
              .slice(0, 4)
              .map((m) => (
                <li key={m.idMovimento} className="flex justify-between">
                  <span>Lote {m.loteId}</span>
                  <span className="text-slate-500">Qtd {m.quantidade}</span>
                </li>
              ))}
            {movimentos.filter((m) => m.tipo === "SAIDA").length === 0 && (
              <li className="text-slate-500 text-sm">
                Sem saídas registadas.
              </li>
            )}
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-2">
          <div className="text-sm font-semibold text-slate-800">
            Lotes activos
          </div>
          <p className="text-sm text-slate-700">
            {lotes.length} lote(s) com QR Code gerado e prontos para
            expedição.
          </p>
          <p className="text-[11px] text-slate-500">
            Esta informação será ligada à base de dados/Blockchain no modelo
            final.
          </p>
        </div>
      </section>

      {/* Ações rápidas */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-800">Acções rápidas</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setModalEntrada(true)}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors shadow-sm"
          >
            Registar entrada de MP
          </button>
          <button
            onClick={() => setModalLote(true)}
            className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-400 transition-colors shadow-sm"
          >
            Criar lote / gerar QR
          </button>
          <button
            onClick={() => setModalSaida(true)}
            className="rounded-md bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-300 transition-colors shadow-sm"
          >
            Registar saída de lote
          </button>
        </div>
      </section>

      {/* Lotes da unidade */}
<section className="space-y-3">
  <h2 className="text-sm font-semibold text-slate-800">Lotes da unidade industrial</h2>

  {lotes.length === 0 ? (
    <p className="text-sm text-slate-500">
      Ainda não existem lotes registados. Utilize a opção{" "}
      <span className="font-semibold">“Criar lote / gerar QR”</span> para iniciar.
    </p>
  ) : (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Cabeçalho */}
      <div className="grid grid-cols-5 bg-slate-50 px-4 py-2 text-[12px] font-semibold text-slate-600">
        <div>Código</div>
        <div>Nome</div>
        <div>Fabricação</div>
        <div>Validade</div>
        <div>QR Code</div>
      </div>

      {/* Linhas */}
      <div className="divide-y divide-slate-200">
        {lotes.map((l) => (
          <div
            key={l.idLote}
            className="grid grid-cols-5 px-4 py-2 text-sm text-slate-800"
          >
            <div className="truncate">{l.codLote}</div>
            <div className="truncate text-slate-700 text-xs">
              {l.nomeProduto ?? "—"}
            </div>
            <div className="text-slate-700 text-xs">{l.dataFabricacao}</div>
            <div className="text-slate-700 text-xs">{l.dataValidade}</div>
            <div className="text-slate-500 text-xs truncate">{l.qrCode}</div>
          </div>
        ))}
      </div>
    </div>
  )}
</section>


      {/* MODAL: Entrada de MP */}
      {modalEntrada && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center px-4">
          <div className="w-full max-w-3xl rounded-2xl border bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-800">
                Registar entrada de matéria-prima
              </h2>
              <button
                onClick={() => setModalEntrada(false)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Fechar
              </button>
            </div>
            <form
              onSubmit={handleEntradaMp}
              className="grid md:grid-cols-4 gap-3 mt-1"
            >
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs text-slate-600">
                  Fornecedor / código
                </label>
                <input
                  value={entradaMp.codFornecedor}
                  onChange={(e) =>
                    setEntradaMp((f) => ({
                      ...f,
                      codFornecedor: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                  placeholder="Fornecedor-01"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-600">Quantidade</label>
                <input
                  type="number"
                  min={0}
                  value={entradaMp.quantidade}
                  onChange={(e) =>
                    setEntradaMp((f) => ({
                      ...f,
                      quantidade: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                  placeholder="0"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-600">Local</label>
                <input
                  value={entradaMp.local}
                  onChange={(e) =>
                    setEntradaMp((f) => ({ ...f, local: e.target.value }))
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                />
              </div>
              <div className="md:col-span-4 flex justify-end gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setModalEntrada(false)}
                  className="w-full md:w-auto rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full md:w-auto rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  Guardar registo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Criar lote */}
      {modalLote && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center px-4">
          <div className="w-full max-w-3xl rounded-2xl border bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-800">
                Criar lote e gerar QR Code
              </h2>
              <button
                onClick={() => setModalLote(false)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Fechar
              </button>
            </div>
            <form
              onSubmit={handleCriarLote}
              className="grid md:grid-cols-4 gap-3 mt-1"
            >
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs text-slate-600">Código do lote</label>
                <input
                  value={novoLote.codLote}
                  onChange={(e) =>
                    setNovoLote((f) => ({ ...f, codLote: e.target.value }))
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                  placeholder="L-2025-001"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-600">Fabricação</label>
                <input
                  type="date"
                  value={novoLote.dataFabricacao}
                  onChange={(e) =>
                    setNovoLote((f) => ({
                      ...f,
                      dataFabricacao: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-600">Validade</label>
                <input
                  type="date"
                  value={novoLote.dataValidade}
                  onChange={(e) =>
                    setNovoLote((f) => ({
                      ...f,
                      dataValidade: e.target.value,
                    }))
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                />
              </div>
              <div className="md:col-span-4 flex justify-end gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setModalLote(false)}
                  className="w-full md:w-auto rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full md:w-auto rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-400 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  Guardar lote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Saída de lote */}
      {modalSaida && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center px-4">
          <div className="w-full max-w-3xl rounded-2xl border bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-800">
                Registar saída de lote
              </h2>
              <button
                onClick={() => setModalSaida(false)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Fechar
              </button>
            </div>
            <form
              onSubmit={handleSaida}
              className="grid md:grid-cols-4 gap-3 mt-1"
            >
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs text-slate-600">Lote</label>
                <select
                  value={saida.loteId}
                  onChange={(e) =>
                    setSaida((f) => ({ ...f, loteId: e.target.value }))
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                >
                  <option value="">Selecione</option>
                  {lotes.map((l) => (
                    <option key={l.idLote} value={l.idLote}>
                      {l.codLote}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-600">Quantidade</label>
                <input
                  type="number"
                  min={0}
                  value={saida.quantidade}
                  onChange={(e) =>
                    setSaida((f) => ({ ...f, quantidade: e.target.value }))
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                  placeholder="0"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-600">Local</label>
                <input
                  value={saida.local}
                  onChange={(e) =>
                    setSaida((f) => ({ ...f, local: e.target.value }))
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                  placeholder="Expedição / Armazém"
                />
              </div>
              <div className="md:col-span-4 flex justify-end gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setModalSaida(false)}
                  className="w-full md:w-auto rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full md:w-auto rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  Guardar saída
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
