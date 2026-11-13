import type { Status } from '@/constants/agro';

export type Anotacao = {
  id: string;
  texto: string;
  data: string; // ISO
};

export type Lote = {
  id: string;
  nome: string;
  cultura: string;
  areaHa: number;
  status: Status;
  fotoUri?: string;
  latitude?: number;
  longitude?: number;
  criadoEm: string; // ISO
  anotacoes: Anotacao[];
};

export type Produtor = {
  nome: string;
  email: string;
  telefone: string;
  propriedade: string;
  municipio: string;
};

export type Usuario = {
  id: string;
  nome: string;
  email: string;
};
