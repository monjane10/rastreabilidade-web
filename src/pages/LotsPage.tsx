import { useMemo, useState } from "react";
import { getLotes, getMovimentos, getReclamacoes } from "../services/dataStore";
import { eventosBlockchain } from "../mocks/mockData";

function Badge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] bg-amber-100 text-amber-800 border border-amber-200">
      {text}
    </span>
  );
}

export function LotsPage() {
  const [lotes] = useState(getLotes());
  const [movimentos] = useState(getMovimentos());
  const [reclamacoes] = useState(getReclamacoes());

  const lotesEnriquecidos = useMemo(
    () =>
      lotes.map((l) => ({
        lote: l,
        movs: movimentos.filter((m) => m.loteId === l.idLote),
        evs: eventosBlockchain.filter((e) => e.loteId === l.idLote),
        recs: reclamacoes.filter((r) => r.loteId === l.idLote),
      })),
    [lotes, movimentos, reclamacoes]
  );

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Lotes</h1>

      <div className="overflow-hidden rounded-xl border">
        <div className="grid grid-cols-4 bg-slate-50 px-3 py-2 text-[12px] font-semibold text-slate-600">
          <div>Lote</div>
          <div>Datas</div>
          <div>Movimentos</div>
          <div>Reclamacoes</div>
        </div>
        <div className="divide-y">
          {lotesEnriquecidos.map(({ lote, recs }, idx) => (
            <div
              key={lote.idLote}
              className={`grid grid-cols-4 px-3 py-3 text-sm text-slate-800 ${
                idx % 2 === 0 ? "bg-white" : "bg-slate-50"
              }`}
            >
              <div className="space-y-1">
                <div className="font-medium">{lote.codLote}</div>
                <div className="text-xs text-slate-500">QR: {lote.qrCode}</div>
              </div>
              <div className="space-y-1 text-xs text-slate-700">
                <div>Fabricacao: {lote.dataFabricacao}</div>
                <div>Validade: {lote.dataValidade}</div>
              </div>
              <div className="space-y-1 text-xs text-slate-700">
                {recs.length === 0 && <div className="text-slate-500">Sem reclamacoes.</div>}
                {recs.map((r) => (
                  <div key={r.idReclamacao} className="flex items-center justify-between">
                    <span>{r.dataReclamacao}</span>
                    <Badge text={r.estado}  />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
