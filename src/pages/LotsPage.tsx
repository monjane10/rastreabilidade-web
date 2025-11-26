import { useState } from "react";

type Lote = {
  codigo: string;
  produto: string;
  estado: string;
  validade: string;
};

const mockLots: Lote[] = [
  {
    codigo: "L-2025-001",
    produto: "Hambúrguer bovino",
    estado: "EXPOSTO",
    validade: "2025-12-10",
  },
  {
    codigo: "L-2025-002",
    produto: "Salsicha fresca",
    estado: "RECEBIDO",
    validade: "2025-11-30",
  },
];

export function LotsPage() {
  const [lots, setLots] = useState<Lote[]>(mockLots);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    produto: "",
    unidadeIndustrial: "",
    dataFabrico: "",
    validade: "",
    quantidade: "",
    observacoes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.produto || !form.validade) {
      // validação simples só para garantir algo
      alert("Preencha pelo menos o nome do produto e a data de validade.");
      return;
    }

    const novoCodigo = `L-${new Date().getFullYear()}-${String(
      lots.length + 1
    ).padStart(3, "0")}`;

    const novoLote: Lote = {
      codigo: novoCodigo,
      produto: form.produto,
      estado: "REGISTADO",
      validade: form.validade,
    };

    setLots((prev) => [...prev, novoLote]);

    // limpar e fechar formulário
    setForm({
      produto: "",
      unidadeIndustrial: "",
      dataFabrico: "",
      validade: "",
      quantidade: "",
      observacoes: "",
    });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Lotes</h1>
          <p className="text-sm text-slate-600">
            Lista resumida dos lotes de produtos alimentares processados registados
            no sistema.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-300 transition-colors shadow-sm border border-amber-300"
        >
          {showForm ? "Cancelar" : "+ Novo lote"}
        </button>
      </div>

      {/* Formulário de novo lote */}
      {showForm && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">
            Registar novo lote
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Produto */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Produto
                </label>
                <input
                  type="text"
                  name="produto"
                  value={form.produto}
                  onChange={handleChange}
                  placeholder="Ex: Hambúrguer bovino"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                />
              </div>

              {/* Unidade Industrial */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Unidade industrial
                </label>
                <input
                  type="text"
                  name="unidadeIndustrial"
                  value={form.unidadeIndustrial}
                  onChange={handleChange}
                  placeholder="Ex: Unidade Industrial A"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                />
              </div>

              {/* Data fabrico */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Data de fabrico
                </label>
                <input
                  type="date"
                  name="dataFabrico"
                  value={form.dataFabrico}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                />
              </div>

              {/* Validade */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Data de validade
                </label>
                <input
                  type="date"
                  name="validade"
                  value={form.validade}
                  onChange={handleChange}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                />
              </div>

              {/* Quantidade */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Quantidade produzida (unidades / kg)
                </label>
                <input
                  type="number"
                  name="quantidade"
                  value={form.quantidade}
                  onChange={handleChange}
                  placeholder="Ex: 500"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                />
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
                placeholder="Informações adicionais sobre o lote, condições específicas, etc."
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
                Guardar lote
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabela */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Código
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Produto
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Estado
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Validade
              </th>
            </tr>
          </thead>
          <tbody>
            {lots.map((lote, idx) => (
              <tr
                key={lote.codigo}
                className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}
              >
                <td className="px-4 py-2.5 text-slate-900">{lote.codigo}</td>
                <td className="px-4 py-2.5 text-slate-800">{lote.produto}</td>
                <td className="px-4 py-2.5">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${
                      lote.estado === "EXPOSTO"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : lote.estado === "RECEBIDO"
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    {lote.estado}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-slate-700">{lote.validade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
