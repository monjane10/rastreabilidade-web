export type Perfil = "FISCAL" | "UNIDADE_INDUSTRIAL" | "ESTABELECIMENTO";

export type Utilizador = {
  idUtilizador: number;
  codigo: string;
  nome: string;
  perfil: Perfil;
  senha: string;
  unidadeId?: number;
  estabelecimentoId?: number;
};

export type UnidadeIndustrial = {
  idUnidade: number;
  nome: string;
  endereco: string;
  contacto: string;
};

export type EstabelecimentoComercial = {
  idEstabelecimento: number;
  nome: string;
  endereco: string;
  contacto: string;
};

export type Lote = {
  idLote: number;
  codLote: string;
  nomeProduto: string;
  dataFabricacao: string;
  dataValidade: string;
  qrCode: string;
  unidadeId: number;
};

export type MovimentoLote = {
  idMovimento: number;
  loteId: number;
  tipo: "ENTRADA" | "SAIDA" | "TRANSFERENCIA" | "VENDA" | "RECEPCAO";
  dataHora: string;
  quantidade: number;
  local: string;
  estabelecimentoId?: number;
  unidadeId?: number;
};

export type Inspecao = {
  idInspecao: number;
  entidadeId: number;
  dataInspecao: string;
  localTipo: string;
  resultado: string;
  observacoes: string;
};

export type EventoBlockchain = {
  idEvento: number;
  tipoEvento: string;
  hashTransacao: string;
  dataHora: string;
  loteId: number;
};

export type Reclamacao = {
  idReclamacao: number;
  loteId: number;
  dataReclamacao: string;
  descricao: string;
  nrConsumidor: string;
  estado: string;
};

export const utilizadores: Utilizador[] = [
  { idUtilizador: 1, codigo: "1001", nome: "Fiscal INAE Maputo", perfil: "FISCAL", senha: "fiscal123" },
  { idUtilizador: 2, codigo: "2001", nome: "Matadouro da Matola", perfil: "UNIDADE_INDUSTRIAL", senha: "ind123", unidadeId: 10 },
  { idUtilizador: 3, codigo: "2002", nome: "Interfrango Moçambique", perfil: "UNIDADE_INDUSTRIAL", senha: "ind123", unidadeId: 11 },
  { idUtilizador: 4, codigo: "3001", nome: "Shoprite Maputo", perfil: "ESTABELECIMENTO", senha: "est123", estabelecimentoId: 20 },
  { idUtilizador: 5, codigo: "3002", nome: "Mercado do Xipamanine", perfil: "ESTABELECIMENTO", senha: "est123", estabelecimentoId: 21 },
  { idUtilizador: 6, codigo: "3003", nome: "Casa do Gado – Malanga", perfil: "ESTABELECIMENTO", senha: "est123", estabelecimentoId: 22 },
];


export const unidades: UnidadeIndustrial[] = [
  { idUnidade: 10, nome: "Matadouro da Matola", endereco: "Matola – Cidade da Matola", contacto: "+258 84 100 1000" },
  { idUnidade: 11, nome: "Interfrango Moçambique", endereco: "Boane – Maputo", contacto: "+258 82 333 221" },
  { idUnidade: 12, nome: "Frango King", endereco: "Marracuene – Maputo", contacto: "+258 84 556 5000" },
  { idUnidade: 13, nome: "Mozbife (Unidade de Abate)", endereco: "Chimoio – Manica", contacto: "+258 85 700 7000" },
];


export const estabelecimentos: EstabelecimentoComercial[] = [
  { idEstabelecimento: 20, nome: "Shoprite Maputo Baixa", endereco: "Av. Guerra Popular", contacto: "+258 86 555 0011" },
  { idEstabelecimento: 21, nome: "Mercado do Xipamanine", endereco: "Bairro Xipamanine", contacto: "+258 85 900 1110" },
  { idEstabelecimento: 22, nome: "Casa do Gado – Malanga", endereco: "Malanga – Maputo", contacto: "+258 84 303 8888" },
  { idEstabelecimento: 23, nome: "Interfrigo – Zimpeto", endereco: "Av. de Moçambique, Zimpeto", contacto: "+258 87 667 7722" },
  { idEstabelecimento: 24, nome: "Pingo Doce Maputo", endereco: "Av. Julius Nyerere", contacto: "+258 84 777 9000" },
];


export const lotes: Lote[] = [
  {
    idLote: 100,
    codLote: "L0001",
    nomeProduto: "Hamburguer Bovino",
    dataFabricacao: "2024-01-10",
    dataValidade: "2025-01-10",
    qrCode: "QR-L-2024-001",
    unidadeId: 10,
  },
  {
    idLote: 101,
    codLote: "L0002",
    nomeProduto: "Hamburguer Suino",
    dataFabricacao: "2024-02-04",
    dataValidade: "2025-02-04",
    qrCode: "QR-L-2024-045",
    unidadeId: 11,
  },
  {
    idLote: 102,
    codLote: "L0003",
    nomeProduto: "Salsicha Bovino",
    dataFabricacao: "2024-03-15",
    dataValidade: "2025-03-15",
    qrCode: "QR-L-2024-088",
    unidadeId: 12,
  },
  {
    idLote: 103,
    codLote: "L0004",
    nomeProduto: "Hamburguer de Frango",
    dataFabricacao: "2024-04-12",
    dataValidade: "2025-04-12",
    qrCode: "QR-L-2024-120",
    unidadeId: 11,
  },
  {
    idLote: 104,
    codLote: "L0005",
    nomeProduto: "Salsicha de Frango",
    dataFabricacao: "2024-05-22",
    dataValidade: "2025-05-22",
    qrCode: "QR-L-2024-340",
    unidadeId: 13,
  },
];

export const movimentos: MovimentoLote[] = [
  {
    idMovimento: 500,
    loteId: 100,
    tipo: "ENTRADA",
    dataHora: "2024-01-11T10:00:00Z",
    quantidade: 100,
    local: "Armazem Matadouro da Matola",
    unidadeId: 10,
  },
  {
    idMovimento: 501,
    loteId: 100,
    tipo: "RECEPCAO",
    dataHora: "2024-01-15T09:30:00Z",
    quantidade: 100,
    local: "Shoprite Maputo Baixa",
    estabelecimentoId: 20,
  },
  {
    idMovimento: 502,
    loteId: 100,
    tipo: "VENDA",
    dataHora: "2024-01-18T15:00:00Z",
    quantidade: 20,
    local: "Shoprite — Balcão Carnes",
    estabelecimentoId: 20,
  },
  {
    idMovimento: 503,
    loteId: 101,
    tipo: "TRANSFERENCIA",
    dataHora: "2024-02-05T11:45:00Z",
    quantidade: 50,
    local: "Interfrigo – Zimpeto",
    estabelecimentoId: 23,
  },
  {
    idMovimento: 504,
    loteId: 103,
    tipo: "RECEPCAO",
    dataHora: "2024-04-14T10:10:00Z",
    quantidade: 70,
    local: "Casa do Gado – Malanga",
    estabelecimentoId: 22,
  },
];

export const inspecoes: Inspecao[] = [
  {
    idInspecao: 900,
    entidadeId: 1,
    dataInspecao: "2024-02-01",
    localTipo: "Shoprite Maputo Baixa",
    resultado: "Conforme",
    observacoes: "Armazenamento adequado.",
  },
  {
    idInspecao: 901,
    entidadeId: 1,
    dataInspecao: "2024-03-12",
    localTipo: "Mercado do Xipamanine",
    resultado: "Nao conforme",
    observacoes: "Higiene insuficiente no sector de carnes.",
  },
];

export const eventosBlockchain: EventoBlockchain[] = [
  {
    idEvento: 800,
    tipoEvento: "MOVIMENTO",
    hashTransacao: "0xabc123",
    dataHora: "2024-01-11T10:01:00Z",
    loteId: 100,
  },
  {
    idEvento: 801,
    tipoEvento: "VENDA",
    hashTransacao: "0xfe129ab",
    dataHora: "2024-02-15T12:44:00Z",
    loteId: 103,
  },
];

export const reclamacoes: Reclamacao[] = [
  {
    idReclamacao: 700,
    loteId: 100,
    dataReclamacao: "2024-02-10",
    descricao: "Produto com embalagem danificada.",
    nrConsumidor: "+258 822 222",
    estado: "Em analise",
  },
  {
    idReclamacao: 701,
    loteId: 102,
    dataReclamacao: "2024-03-03",
    descricao: "Cheiro estranho no momento da abertura.",
    nrConsumidor: "+258 845 445",
    estado: "Resolvido",
  },
];
