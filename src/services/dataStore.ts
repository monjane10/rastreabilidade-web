import {
  lotes as lotesMock,
  movimentos as movimentosMock,
  inspecoes as inspecoesMock,
  reclamacoes as reclamacoesMock,
  type Lote,
  type MovimentoLote,
  type Inspecao,
  type Reclamacao,
} from "../mocks/mockData";

const STORAGE_KEYS = {
  lotes: "ds_lotes",
  movimentos: "ds_movimentos",
  inspecoes: "ds_inspecoes",
  reclamacoes: "ds_reclamacoes",
};

function loadFromStorage<T>(key: string, fallback: T[]): T[] {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// LOTES
export function getLotes(): Lote[] {
  return loadFromStorage<Lote>(STORAGE_KEYS.lotes, lotesMock);
}

export function addLote(newLote: Lote): Lote[] {
  const current = getLotes();
  const updated = [newLote, ...current];
  saveToStorage(STORAGE_KEYS.lotes, updated);
  return updated;
}

// MOVIMENTOS
export function getMovimentos(): MovimentoLote[] {
  return loadFromStorage<MovimentoLote>(
    STORAGE_KEYS.movimentos,
    movimentosMock
  );
}

export function addMovimento(mov: MovimentoLote): MovimentoLote[] {
  const current = getMovimentos();
  const updated = [mov, ...current];
  saveToStorage(STORAGE_KEYS.movimentos, updated);
  return updated;
}

// INSPECOES
export function getInspecoes(): Inspecao[] {
  return loadFromStorage<Inspecao>(STORAGE_KEYS.inspecoes, inspecoesMock);
}

export function addInspecao(item: Inspecao): Inspecao[] {
  const current = getInspecoes();
  const updated = [item, ...current];
  saveToStorage(STORAGE_KEYS.inspecoes, updated);
  return updated;
}

// RECLAMACOES
export function getReclamacoes(): Reclamacao[] {
  return loadFromStorage<Reclamacao>(
    STORAGE_KEYS.reclamacoes,
    reclamacoesMock
  );
}

export function addReclamacao(item: Reclamacao): Reclamacao[] {
  const current = getReclamacoes();
  const updated = [item, ...current];
  saveToStorage(STORAGE_KEYS.reclamacoes, updated);
  return updated;
}
