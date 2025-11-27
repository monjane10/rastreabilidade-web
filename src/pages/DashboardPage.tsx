import { useMemo, useState } from "react";
import {
  getInspecoes,
  getReclamacoes,
  getLotes,
  getMovimentos,
} from "../services/dataStore";
import { eventosBlockchain } from "../mocks/mockData";

type StatProps = {
  label: string;
  value: string;
  delta?: string;
  positive?: boolean;
};

function Stat({ label, value, delta, positive }: StatProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm flex flex-col gap-1.5">
      <div className="text-[11px] text-slate-500 uppercase tracking-wide">
        {label}
      </div>
      <div className="text-2xl font-semibold text-slate-900">{value}</div>
      {delta && (
        <span
          className={`text-[11px] font-medium ${
            positive ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {delta}
        </span>
      )}
    </div>
  );
}

function Card({
  title,
  children,
  action,
  subtitle,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
          {subtitle && (
            <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function Sparkline({ data, color }: { data: number[]; color: "amber" | "sky" }) {
  const max = Math.max(...data, 1);
  const gradient =
    color === "amber"
      ? "bg-gradient-to-t from-amber-300 to-amber-500"
      : "bg-gradient-to-t from-sky-300 to-sky-500";

  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((d, idx) => (
        <div
          key={idx}
          className={`flex-1 rounded-sm ${gradient}`}
          style={{ height: `${(d / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

function MiniTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: Array<Array<string | React.ReactNode>>;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="grid grid-cols-3 bg-slate-50 px-3 py-2 text-[12px] font-semibold text-slate-600">
        {headers.map((h) => (
          <div key={h} className="truncate">
            {h}
          </div>
        ))}
      </div>
      <div className="divide-y divide-slate-200">
        {rows.map((r, idx) => (
          <div
            key={idx}
            className="grid grid-cols-3 px-3 py-2 text-sm text-slate-800 bg-white"
          >
            {r.map((c, i) => (
              <div key={i} className="truncate">
                {c}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardPage() {
  const [inspecoes] = useState(getInspecoes());
  const [reclamacoes] = useState(getReclamacoes());
  const [lotes] = useState(getLotes());
  const [movimentos] = useState(getMovimentos());

  const stats = useMemo(
    () => [
      {
        label: "Total de lotes",
        value: lotes.length.toString(),
        positive: true,
      },
      {
        label: "Movimentos registados",
        value: movimentos.length.toString(),
        positive: true,
      },
      {
        label: "Inspecções",
        value: inspecoes.length.toString(),
        positive: true,
      },
      {
        label: "Reclamações",
        value: reclamacoes.length.toString(),
        positive: true,
      },
    ],
    [lotes.length, movimentos.length, inspecoes.length, reclamacoes.length]
  );

  const sparkData = useMemo(() => [12, 14, 10, 16, 13, 18, 15], []);

  return (
    <div className="space-y-6">
      {/* Cabeçalho do painel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
            Painel de Fiscalização
          </h1>
          <p className="text-sm text-slate-600">
            Visão geral da rastreabilidade, inspecções, reclamações e eventos
            registados em Blockchain.
          </p>
        </div>

        <span className="inline-flex items-center justify-center text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
          Monitorização de risco em tempo quase real (protótipo)
        </span>
      </div>

      {/* Estatísticas principais */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Stat
            key={s.label}
            label={s.label}
            value={s.value}
            positive={s.positive}
          />
        ))}
      </section>

      {/* Secção intermédia: tendência + blockchain + reclamações */}
      <section className="grid md:grid-cols-3 gap-3">
        <Card
          title="Tendência de inspecções"
          subtitle="Distribuição dos últimos períodos (dados simulados)."
        >
          <Sparkline data={sparkData} color="amber" />
          <p className="text-[11px] text-slate-500">
            Este gráfico será alimentado pelos registos reais de inspecção no
            modelo final.
          </p>
        </Card>

        <Card
          title="Eventos Blockchain"
          subtitle="Últimas operações de registo de lote e actualização de estado."
        >
          <MiniTable
            headers={["Evento", "Data", "Hash"]}
            rows={eventosBlockchain.map((e) => [
              `#${e.idEvento} · ${e.tipoEvento}`,
              e.dataHora,
              <span
                key={e.hashTransacao}
                className="text-[11px] text-slate-500 truncate"
              >
                {e.hashTransacao}
              </span>,
            ])}
          />
        </Card>

        <Card
          title="Reclamações e denúncias"
          subtitle="Fluxo de notificações originadas pelo consumidor e pelas inspecções."
        >
          <MiniTable
            headers={["Lote", "Estado", "Data"]}
            rows={reclamacoes.map((r) => [
              `Lote ${r.loteId}`,
              <span
                key={r.idReclamacao}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] bg-amber-100 text-amber-800"
              >
                {r.estado}
              </span>,
              r.dataReclamacao,
            ])}
          />
        </Card>
      </section>

      {/* Últimas inspecções */}
<Card
  title="Últimas inspecções registadas"
  subtitle="Resumo dos estabelecimentos e unidades industriais inspecionados."
>
  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

    {/* Cabeçalho da tabela */}
    <div className="grid grid-cols-4 bg-slate-50 px-4 py-2 text-[12px] font-semibold text-slate-600">
      <div>Local</div>
      <div>Data</div>
      <div>Resultado</div>
      <div>Observações</div>
    </div>

    {/* Linhas da tabela */}
    <div className="divide-y divide-slate-200">
      {inspecoes.map((i) => (
        <div
          key={i.idInspecao}
          className="grid grid-cols-4 px-4 py-2 text-sm text-slate-800"
        >
          <div className="truncate">{i.localTipo}</div>
          <div className="text-slate-700">{i.dataInspecao}</div>
          <div className="text-slate-700">{i.resultado}</div>
          <div className="text-slate-600 truncate">{i.observacoes}</div>
        </div>
      ))}

      {inspecoes.length === 0 && (
        <div className="px-4 py-3 text-sm text-slate-500">
          Ainda não existem inspecções registadas.
        </div>
      )}
    </div>
  </div>
</Card>

    </div>
  );
}
