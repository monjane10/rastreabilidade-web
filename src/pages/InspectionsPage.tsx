import { type FormEvent, useState } from "react";
import { addInspecao, getInspecoes } from "../services/dataStore";
import type { Inspecao } from "../mocks/mockData";

type Alert = { type: "success" | "error"; message: string };

export function InspectionsPage() {
  const [inspecoes, setInspecoes] = useState(getInspecoes());
  const [alerta, setAlerta] = useState<Alert | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    dataInspecao: "",
    localTipo: "",
    resultado: "",
    observacoes: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.dataInspecao || !form.localTipo.trim() || !form.resultado.trim()) {
      setAlerta({ type: "error", message: "Preencha data, local e resultado." });
      return;
    }
    const nova: Inspecao = {
      idInspecao: Date.now(),
      entidadeId: 1,
      dataInspecao: form.dataInspecao,
      localTipo: form.localTipo.trim(),
      resultado: form.resultado.trim(),
      observacoes: form.observacoes.trim(),
    };
    const atual = addInspecao(nova);
    console.log("[fiscal] inspecao registada", nova);
    setInspecoes(atual);
    setForm({ dataInspecao: "", localTipo: "", resultado: "", observacoes: "" });
    setAlerta({ type: "success", message: "Inspeccao registada e notificada." });
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl font-semibold">Inspeccoes</h1>
        <div className="flex items-center gap-2">
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
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            Nova inspecao
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center px-4">
          <div className="w-full max-w-3xl rounded-2xl border bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-800">Nova inspecao</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Fechar
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="grid md:grid-cols-5 gap-3"
            >
              <div className="space-y-1">
                <label className="text-xs text-slate-600">Data</label>
                <input
                  type="date"
                  value={form.dataInspecao}
                  onChange={(e) => setForm((f) => ({ ...f, dataInspecao: e.target.value }))}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-600">Local/Tipo</label>
                <input
                  value={form.localTipo}
                  onChange={(e) => setForm((f) => ({ ...f, localTipo: e.target.value }))}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                  placeholder="Ex: Mercado Sol"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-600">Resultado</label>
                <input
                  value={form.resultado}
                  onChange={(e) => setForm((f) => ({ ...f, resultado: e.target.value }))}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                  placeholder="Conforme / Irregular"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs text-slate-600">Observacoes</label>
                <input
                  value={form.observacoes}
                  onChange={(e) => setForm((f) => ({ ...f, observacoes: e.target.value }))}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                  placeholder="Acao corretiva, notas..."
                />
              </div>
              <div className="md:col-span-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="inline-flex items-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  Registar inspecao
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border">
        <div className="grid grid-cols-4 bg-slate-50 px-3 py-2 text-[12px] font-semibold text-slate-600">
          <div>Data</div>
          <div>Local/Tipo</div>
          <div>Resultado</div>
          <div>Observacoes</div>
        </div>
        <div className="divide-y">
          {inspecoes.map((i, idx) => (
            <div
              key={i.idInspecao}
              className={`grid grid-cols-4 px-3 py-2 text-sm text-slate-800 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
            >
              <div>{i.dataInspecao}</div>
              <div className="truncate">{i.localTipo}</div>
              <div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] bg-amber-100 text-amber-800">
                  {i.resultado}
                </span>
              </div>
              <div className="text-slate-600">{i.observacoes || "—"}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
