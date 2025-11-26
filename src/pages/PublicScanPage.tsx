import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

type LotePublico = {
  codigo: string;
  produto: string;
  fabrica: string;
  validade: string;
  estado: string;
  autentico: boolean;
};

export function PublicScanPage() {
  const [showScanner, setShowScanner] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [lote, setLote] = useState<LotePublico | null>(null);
  const [erroTecnico, setErroTecnico] = useState("");

  const mockLotes: Record<string, LotePublico> = {
    "L-2025-001": {
      codigo: "L-2025-001",
      produto: "Hambúrguer Bovino",
      fabrica: "Unidade Industrial A",
      validade: "2025-12-10",
      estado: "EXPOSTO",
      autentico: true,
    },
  };

  const consultarLote = (c: string) => {
    const codigoTrim = c.trim();
    if (!codigoTrim) return;

    const encontrado = mockLotes[codigoTrim];

    if (encontrado) {
      setErroTecnico("");
      setLote(encontrado);
    } else {
      setErroTecnico("");
      setLote({
        codigo: codigoTrim,
        produto: "Produto não identificado no sistema",
        fabrica: "—",
        validade: "—",
        estado: "DESCONHECIDO",
        autentico: false,
      });
    }
  };

  const handleScanResult = (result: unknown) => {
    if (!result) return;

    const valor =
      Array.isArray(result) && result.length > 0
        ? (result[0] as any).rawValue ?? String(result[0])
        : String(result);

    setShowScanner(false);
    setCodigo(valor);
    consultarLote(valor);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-white via-slate-50 to-slate-100" />

      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        {/* Título */}
        <h1 className="text-3xl font-semibold tracking-tight text-center mb-10">
          Consulta Pública do Produto
        </h1>

        {/* GRID RESPONSIVO 2 COLUNAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* COLUNA ESQUERDA — Ações */}
          <section className="space-y-6 self-start">
            <p className="text-sm text-slate-600">
              Verifique a autenticidade de produtos alimentares processados
              através do QR Code ou introduzindo o código do lote.
            </p>

            {/* Botão scanner */}
            <button
              onClick={() => setShowScanner(true)}
              className="w-full rounded-xl bg-amber-400 px-6 py-4 shadow-md shadow-amber-300/50 text-slate-900 font-semibold active:scale-[0.99] transition-transform"
            >
              Ler QR Code com a câmara
            </button>

            {/* Campo manual */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Introduzir código do lote
              </label>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ex: L-2025-001"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-amber-400"
              />
              <button
                onClick={() => consultarLote(codigo)}
                className="w-full mt-2 rounded-md bg-slate-900 text-white py-2 text-sm font-medium hover:bg-slate-800"
              >
                Consultar produto
              </button>
            </div>

            {erroTecnico && (
              <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
                {erroTecnico}
              </div>
            )}
          </section>

          {/* COLUNA DIREITA — Scanner ou Imagem ou Resultado */}
          <section className="space-y-6">

            {/* SCANNER */}
            {showScanner && (
              <div className="rounded-xl border border-slate-300 bg-white shadow p-4 space-y-3">
                <Scanner
                  onError={() =>
                    setErroTecnico(
                      "Erro ao aceder à câmara. Verifique as permissões."
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

            {/* RESULTADO */}
            {lote && (
              <>
                {/* Banner autenticidade */}
                <div
                  className={`rounded-xl border p-4 flex gap-3 ${
                    lote.autentico
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-red-300 bg-red-50"
                  }`}
                >
                  <div
                    className={`h-3 w-3 rounded-full mt-1 ${
                      lote.autentico ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                  <div>
                    <p className="font-semibold text-sm">
                      {lote.autentico
                        ? "Produto autêntico registado."
                        : "Possível produto falsificado."}
                    </p>
                    <p className="text-xs text-slate-700">
                      {lote.autentico
                        ? "Os dados correspondem aos registos oficiais."
                        : "Este código não consta nos registos. Evite consumir e informe as autoridades."}
                    </p>
                  </div>
                </div>

                {/* Card produto */}
                <div className="rounded-xl border border-slate-300 bg-white p-5 shadow space-y-3">
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-semibold">{lote.produto}</h2>

                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-md uppercase tracking-wide ${
                        lote.autentico
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {lote.autentico ? "Autêntico" : "Suspeito"}
                    </span>
                  </div>

                  <div className="text-sm text-slate-700 space-y-1">
                    <p>
                      <span className="font-medium">Código do lote: </span>
                      {lote.codigo}
                    </p>
                    <p>
                      <span className="font-medium">Unidade industrial: </span>
                      {lote.fabrica}
                    </p>
                    <p>
                      <span className="font-medium">Validade: </span>
                      {lote.validade}
                    </p>
                  </div>

                  <button className="w-full rounded-md bg-amber-400 py-2 text-sm font-medium hover:bg-amber-300">
                    Ver detalhes completos
                  </button>
                </div>

                {!lote.autentico && (
                  <div className="rounded-xl border border-red-300 bg-red-50 p-4 space-y-2">
                    <p className="text-sm font-semibold text-red-800">
                      Atenção: produto potencialmente falsificado.
                    </p>
                    <button className="w-full rounded-md bg-red-600 text-white py-2 text-xs font-semibold hover:bg-red-700">
                      Denunciar produto às entidades fiscalizadoras
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Placeholder quando nada foi consultado */}
            {!showScanner && !lote && (
              <div className="rounded-xl border border-slate-300 bg-white/70 p-10 text-center text-slate-400">
                <p className="text-sm">Nenhum lote consultado ainda.</p>
                <p className="text-xs mt-1">Use o scanner ou introduza o código.</p>
              </div>
            )}
          </section>
        </div>
      </div>
        {/* Footer */}
      <footer className="py-4 text-center text-[15px] text-slate-500 border-t border-slate-200 bg-white/80 backdrop-blur">
        Protótipo académico — Universidade São Tomás de Moçambique
      </footer>
    </div>
  );
}
