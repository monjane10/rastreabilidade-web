import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useLocation } from "react-router-dom";

type Inspecao = {
  id: string;
  data: string;
  local: string;
  resultado: "CONFORME" | "NAO_CONFORME";
};

const mockInspections: Inspecao[] = [
  {
    id: "INSP-001",
    data: "2025-11-10",
    local: "Unidade Industrial A",
    resultado: "CONFORME",
  },
  {
    id: "INSP-002",
    data: "2025-11-18",
    local: "Supermercado X",
    resultado: "NAO_CONFORME",
  },
];

export function InspectionsPage() {
  const location = useLocation() as { state?: { modo?: string } };

  const [inspections, setInspections] = useState<Inspecao[]>(mockInspections);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    local: "",
    data: "",
    lote: "",
    resultado: "CONFORME" as "CONFORME" | "NAO_CONFORME",
    observacoes: "",
  });

  // 👉 Se veio do Dashboard com { modo: "registar" }, abre logo o formulário
  useEffect(() => {
    if (location.state?.modo === "registar") {
      setShowForm(true);
    }
  }, [location.state]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!form.local || !form.data) {
      alert("Preencha pelo menos o local e a data da inspecção.");
      return;
    }

    const novoId = `INSP-${String(inspections.length + 1).padStart(3, "0")}`;

    const novaInspecao: Inspecao = {
      id: novoId,
      data: form.data,
      local: form.lote
        ? `${form.local} (Lote ${form.lote})`
        : form.local,
      resultado: form.resultado,
    };

    setInspections((prev) => [...prev, novaInspecao]);

    // limpar e fechar
    setForm({
      local: "",
      data: "",
      lote: "",
      resultado: "CONFORME",
      observacoes: "",
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Inspecções</h1>
          <p className="text-sm text-slate-600">
            Registo de inspecções efectuadas pelas entidades fiscalizadoras aos
            lotes e estabelecimentos comerciais.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-300 transition-colors shadow-sm border border-amber-300"
        >
          {showForm ? "Cancelar" : "+ Nova inspecção"}
        </button>
      </div>

      {/* Formulário de nova inspecção */}
      {showForm && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">
            Registar nova inspecção
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Local / estabelecimento */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Local / Estabelecimento
                </label>
                <input
                  type="text"
                  name="local"
                  value={form.local}
                  onChange={handleChange}
                  placeholder="Ex: Supermercado X"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                />
              </div>

              {/* Data */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Data da inspecção
                </label>
                <input
                  type="date"
                  name="data"
                  value={form.data}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                />
              </div>

              {/* Lote (opcional) */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Código do lote (opcional)
                </label>
                <input
                  type="text"
                  name="lote"
                  value={form.lote}
                  onChange={handleChange}
                  placeholder="Ex: L-2025-001"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                />
              </div>

              {/* Resultado */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Resultado
                </label>
                <select
                  name="resultado"
                  value={form.resultado}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                >
                  <option value="CONFORME">Conforme</option>
                  <option value="NAO_CONFORME">Não conforme</option>
                </select>
              </div>
            </div>

            {/* Observações */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Observações (opcional)
              </label>
              <textarea
                name="observacoes"
                value={form.observacoes}
                onChange={handleChange}
                rows={3}
                placeholder="Descreva as principais constatações da inspecção."
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-amber-300 border border-amber-300"
              >
                Guardar inspecção
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de inspecções */}
      <div className="grid gap-4 md:grid-cols-2">
        {inspections.map((insp) => (
          <div
            key={insp.id}
            className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono text-slate-500">
                {insp.id}
              </span>
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold border uppercase tracking-wide ${
                  insp.resultado === "CONFORME"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-red-50 text-red-800 border-red-200"
                }`}
              >
                {insp.resultado === "CONFORME"
                  ? "Conforme"
                  : "Não conforme"}
              </span>
            </div>

            <p className="mt-1 text-sm font-medium text-slate-900">
              {insp.local}
            </p>
            <p className="text-xs text-slate-600">
              Data da inspecção:{" "}
              <span className="font-medium text-slate-800">
                {insp.data}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
