import { useMemo, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  addReclamacao,
  getLotes,
  getMovimentos,
  getReclamacoes,
  getInspecoes,
} from "../services/dataStore";
import type { Reclamacao } from "../mocks/mockData";
import { unidades } from "../mocks/mockData";

type Alert = { type: "success" | "error"; message: string };

type LotePublico = {
  codigo: string;
  produto: string;
  fabrica: string;
  validade: string;
  estado: string;
  autentico: boolean;
};

export function PublicScanPage() {
  const params = useParams();
  const [showScanner, setShowScanner] = useState(false);
  const [codigoManual, setCodigoManual] = useState(params.loteId ?? "");
  const [lotePublico, setLotePublico] = useState<LotePublico | null>(null);
  const [erroTecnico, setErroTecnico] = useState("");
  const [alerta, setAlerta] = useState<Alert | null>(null);
  const [modalReclamacao, setModalReclamacao] = useState(false);

  const [reclamacoes, setReclamacoes] = useState(getReclamacoes());
  const [form, setForm] = useState({ descricao: "", nrConsumidor: "" });

  const lotesStore = useMemo(() => getLotes(), []);
  const movsStore = useMemo(() => getMovimentos(), []);
  const inspecoesStore = useMemo(() => getInspecoes(), []);

  const consultarLote = (codigo: string) => {
    const codigoTrim = codigo.trim();
    if (!codigoTrim) return;

    const encontrado = lotesStore.find((l) => l.codLote === codigoTrim);

  if (encontrado) {
  const unidade = unidades.find(u => u.idUnidade === encontrado.unidadeId);

  setErroTecnico("");
  setLotePublico({
    codigo: encontrado.codLote,
    produto: encontrado.nomeProduto,
    fabrica: unidade?.nome ?? "Unidade industrial desconhecida",
    validade: encontrado.dataValidade,
    estado: "REGISTADO",
    autentico: true,
  });
  return;
}

    setLotePublico({
      codigo: codigoTrim,
      produto: "Produto não identificado no sistema",
      fabrica: "—",
      validade: "—",
      estado: "DESCONHECIDO",
      autentico: false,
    });
    setErroTecnico("");
  };

  const handleScanResult = (result: unknown) => {
    if (!result) return;
    const valor =
      Array.isArray(result) && result.length > 0
        ? (result[0] as any).rawValue ?? String(result[0])
        : String(result);

    setShowScanner(false);
    setCodigoManual(valor);
    consultarLote(valor);
  };

  const handleSubmitReclamacao = (e: FormEvent) => {
    e.preventDefault();
    if (!lotePublico || !lotePublico.codigo) {
      setAlerta({ type: "error", message: "Consulte um lote antes de reclamar." });
      return;
    }
    if (!form.descricao.trim() || !form.nrConsumidor.trim()) {
      setAlerta({ type: "error", message: "Preencha descrição e contacto." });
      return;
    }
    const nova: Reclamacao = {
      idReclamacao: Date.now(),
      loteId: lotesStore.find((l) => l.codLote === lotePublico.codigo)?.idLote ?? -1,
      dataReclamacao: new Date().toISOString().slice(0, 10),
      descricao: form.descricao.trim(),
      nrConsumidor: form.nrConsumidor.trim(),
      estado: "Em análise",
    };
    const atual = addReclamacao(nova);
    console.log("[publico] reclamacao criada", nova);
    setReclamacoes(atual);
    setForm({ descricao: "", nrConsumidor: "" });
    setAlerta({ type: "success", message: "Reclamação enviada à fiscalização." });
    setModalReclamacao(false);
  };

  const movsLote = useMemo(() => {
    if (!lotePublico) return [];
    const loteId = lotesStore.find((l) => l.codLote === lotePublico.codigo)?.idLote;
    if (!loteId) return [];
    return movsStore.filter((m) => m.loteId === loteId);
  }, [lotePublico, lotesStore, movsStore]);

  const inspecoes = useMemo(() => inspecoesStore, [inspecoesStore]);

  const recls = useMemo(() => {
    if (!lotePublico) return [];
    const loteId = lotesStore.find((l) => l.codLote === lotePublico.codigo)?.idLote;
    if (!loteId) return [];
    return reclamacoes.filter((r) => r.loteId === loteId);
  }, [lotePublico, reclamacoes, lotesStore]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Fundo suave */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-white via-slate-50 to-slate-100" />

      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        {/* Cabeçalho */}
        <div className="mb-8 text-center space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            Consulta Pública do Produto
          </h1>
          <p className="text-sm text-slate-600">
            Verifique a autenticidade de produtos alimentares processados via QR Code
            ou introduzindo o código do lote.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          {/* COLUNA ESQUERDA – Scanner + input */}
          <section className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <h2 className="text-sm font-semibold text-slate-800">
                Como pretende consultar?
              </h2>
              <p className="text-xs text-slate-600">
                Utilize a câmara do dispositivo ou introduza manualmente o código do lote
                presente na embalagem.
              </p>

              <button
                onClick={() => {
                  setAlerta(null);
                  setErroTecnico("");
                  setShowScanner(true);
                }}
                className="w-full rounded-xl bg-amber-400 px-6 py-3 shadow-md shadow-amber-300/50 text-slate-900 font-semibold active:scale-[0.99] transition-transform text-sm"
              >
                Ler QR Code com a câmara
              </button>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-medium text-slate-700">
                  Introduzir código do lote
                </label>
                <input
                  type="text"
                  value={codigoManual}
                  onChange={(e) => setCodigoManual(e.target.value)}
                  placeholder="Ex: L-2024-001"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                />
                <button
                  onClick={() => consultarLote(codigoManual)}
                  className="w-full mt-2 rounded-md bg-slate-900 text-white py-2 text-sm font-medium hover:bg-slate-800"
                >
                  Consultar produto
                </button>
              </div>

              {erroTecnico && (
                <div className="mt-2 rounded-xl border border-red-300 bg-red-50 p-3 text-xs text-red-700">
                  {erroTecnico}
                </div>
              )}

              {lotePublico && !lotePublico.autentico && (
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <p className="text-xs text-slate-600">
                    Suspeita de falsificação? Pode comunicar directamente à entidade
                    fiscalizadora.
                  </p>
                  <button
                    onClick={() => {
                      setAlerta(null);
                      setModalReclamacao(true);
                    }}
                    className="w-full rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-400 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    Abrir reclamação
                  </button>
                </div>
              )}
            </div>

            {/* Scanner (aparece abaixo do card de consulta) */}
            {showScanner && (
              <div className="rounded-2xl border border-slate-300 bg-white shadow p-4 space-y-3">
                <Scanner
                  onError={() =>
                    setErroTecnico(
                      "Erro ao aceder à câmara. Verifique as permissões do navegador."
                    )
                  }
                  onScan={handleScanResult}
                  components={{ finder: true }}
                  styles={{
                    container: { width: "100%" },
                    video: { width: "100%", borderRadius: "0.75rem" },
                  }}
                />
                <button
                  onClick={() => setShowScanner(false)}
                  className="w-full border border-slate-300 rounded-md py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Fechar leitor
                </button>
              </div>
            )}
          </section>

          {/* COLUNA DIREITA – Resultado e histórico */}
          <section className="space-y-6">
            {lotePublico ? (
              <>
                {/* Banner de autenticidade */}
                <div
                  className={`rounded-xl border p-4 flex gap-3 items-start ${
                    lotePublico.autentico
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-red-300 bg-red-50"
                  }`}
                >
                  <div
                    className={`h-3 w-3 rounded-full mt-1.5 ${
                      lotePublico.autentico ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                  <div>
                    <p className="font-semibold text-sm">
                      {lotePublico.autentico
                        ? "Produto autêntico registado."
                        : "Possível produto falsificado."}
                    </p>
                    <p className="text-xs text-slate-700 mt-0.5">
                      {lotePublico.autentico
                        ? "Os dados correspondem aos registos oficiais de rastreabilidade."
                        : "Este código não consta nos registos. Evite consumir e informe as autoridades competentes."}
                    </p>
                  </div>
                </div>

                {/* Card principal de informação do produto */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Produto
                      </p>
                      <h2 className="text-lg font-semibold text-slate-900">
                        {lotePublico.produto}
                      </h2>
                      <p className="text-xs text-slate-600 mt-1">
                        Informação resumida do lote disponível para o consumidor.
                      </p>
                    </div>

                    <span
                      className={`self-start px-2 py-1 text-xs font-semibold rounded-md uppercase tracking-wide ${
                        lotePublico.autentico
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {lotePublico.autentico ? "Autêntico" : "Suspeito"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700 pt-2 border-t border-slate-100">
                    <div className="space-y-1">
                      <p>
                        <span className="font-medium">Código do lote: </span>
                        {lotePublico.codigo}
                      </p>
                      <p>
                        <span className="font-medium">Unidade industrial: </span>
                        {lotePublico.fabrica}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p>
                        <span className="font-medium">Validade: </span>
                        {lotePublico.validade}
                      </p>
                      <p>
                        <span className="font-medium">Estado no sistema: </span>
                        {lotePublico.estado}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Percurso + Inspecções em grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Percurso */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-800">Percurso</h3>
                      <span className="text-[11px] text-slate-500">
                        Histórico de movimentos
                      </span>
                    </div>
                    <div className="space-y-2 mt-1">
                      {movsLote.length === 0 ? (
                        <p className="text-xs text-slate-500">
                          Sem movimentos registados para este lote.
                        </p>
                      ) : (
                        movsLote.map((m) => (
                          <div
                            key={m.idMovimento}
                            className="text-sm text-slate-800 border border-slate-200 rounded-md px-3 py-2 bg-white shadow-sm"
                          >
                            <div className="font-medium">
                              {m.tipo} — {m.local}
                            </div>
                            <div className="text-slate-600 text-xs mt-0.5">
                              {m.dataHora} · Qtd {m.quantidade}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Inspecções */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-800">
                        Inspecções
                      </h3>
                      <span className="text-[11px] text-slate-500">
                        Registos oficiais
                      </span>
                    </div>
                    <div className="space-y-2 mt-1">
                      {inspecoes.length === 0 ? (
                        <p className="text-xs text-slate-500">
                          Ainda não há inspecções registadas no sistema.
                        </p>
                      ) : (
                        inspecoes.map((i) => (
                          <div
                            key={i.idInspecao}
                            className="text-sm text-slate-800 border border-slate-200 rounded-md px-3 py-2 bg-white shadow-sm"
                          >
                            <div className="font-medium">
                              {i.dataInspecao} — {i.localTipo}
                            </div>
                            <div className="text-slate-600 text-xs mt-0.5">
                              {i.resultado}
                            </div>
                            <div className="text-slate-500 text-xs">
                              {i.observacoes}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Reclamações */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-800">
                      Reclamações de consumidores
                    </h3>
                    <span className="text-[11px] text-slate-500">
                      Canal público de feedback
                    </span>
                  </div>
                  <div className="space-y-2 mt-1">
                    {recls.length === 0 ? (
                      <p className="text-xs text-slate-500">
                        Sem reclamações associadas a este lote.
                      </p>
                    ) : (
                      recls.map((r) => (
                        <div
                          key={r.idReclamacao}
                          className="text-sm text-slate-800 border border-slate-200 rounded-md px-3 py-2 bg-white shadow-sm"
                        >
                          <div className="font-medium">
                            {r.dataReclamacao} — {r.estado}
                          </div>
                          <div className="text-slate-600 text-xs mt-0.5">
                            {r.descricao}
                          </div>
                          <div className="text-slate-500 text-xs">
                            Contacto: {r.nrConsumidor}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            ) : (
              !showScanner && (
                <div className="rounded-2xl border border-slate-200 bg-white/80 p-10 text-center text-slate-400 shadow-sm">
                  <p className="text-sm">Nenhum lote consultado ainda.</p>
                  <p className="text-xs mt-1">
                    Use o leitor de QR Code ou introduza o código para ver os detalhes.
                  </p>
                </div>
              )
            )}
          </section>
        </div>
      </div>

      <footer className="py-4 text-center text-[13px] text-slate-500 border-t border-slate-200 bg-white/80 backdrop-blur">
        Protótipo académico — Universidade São Tomás de Moçambique
      </footer>

      {/* MODAL: Reclamação */}
      {modalReclamacao && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center px-4">
          <div className="w-full max-w-2xl rounded-2xl border bg-white p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800">
                Abrir reclamação sobre o produto
              </h2>
              <button
                onClick={() => setModalReclamacao(false)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Fechar
              </button>
            </div>

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

            <form onSubmit={handleSubmitReclamacao} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-600">Descrição</label>
                <textarea
                  value={form.descricao}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, descricao: e.target.value }))
                  }
                  rows={3}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                  placeholder="Ex: Embalagem danificada, cheiro estranho..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-600">Contacto</label>
                <input
                  value={form.nrConsumidor}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, nrConsumidor: e.target.value }))
                  }
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                  placeholder="+258 ..."
                />
                <p className="text-[11px] text-slate-500">
                  Usado apenas para retorno por parte da fiscalização.
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalReclamacao(false)}
                  className="inline-flex items-center rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-400 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  Enviar reclamação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
