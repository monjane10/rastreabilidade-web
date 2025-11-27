import { utilizadores, type Perfil } from "../mocks/mockData";

export type Session = {
  userId: number;
  perfil: Perfil;
  unidadeId?: number;
  estabelecimentoId?: number;
};

export function login(codigo: string, senha: string): Session | null {
  const user = utilizadores.find((u) => u.codigo === codigo);

  if (!user) {
    console.warn("[auth] Codigo nao encontrado:", codigo);
    return null;
  }
  if (user.senha !== senha) {
    console.warn("[auth] Senha invalida para codigo:", codigo);
    return null;
  }

  const session: Session = {
    userId: user.idUtilizador,
    perfil: user.perfil,
    unidadeId: user.unidadeId,
    estabelecimentoId: user.estabelecimentoId,
  };
  localStorage.setItem("session", JSON.stringify(session));
  return session;
}

export function logout() {
  localStorage.removeItem("session");
}

export function getSession(): Session | null {
  const raw = localStorage.getItem("session");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch (e) {
    console.error("Erro ao ler session:", e);
    return null;
  }
}
