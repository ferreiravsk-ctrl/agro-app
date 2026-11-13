import type { Lote } from '@/types';

// Dados de exemplo: só são usados na primeira abertura do app (storage vazio).
const agora = new Date().toISOString();

export const lotesIniciais: Lote[] = [
  { id: '1', nome: 'Lote Alfa', cultura: 'Soja', areaHa: 50, status: 'Plantado', criadoEm: agora, anotacoes: [] },
  { id: '2', nome: 'Lote Beta', cultura: 'Milho', areaHa: 35, status: 'Colheita', criadoEm: agora, anotacoes: [] },
  { id: '3', nome: 'Lote Gama', cultura: 'Algodão', areaHa: 120, status: 'Crescimento', criadoEm: agora, anotacoes: [] },
  { id: '4', nome: 'Lote Delta', cultura: 'Trigo', areaHa: 80, status: 'Preparação', criadoEm: agora, anotacoes: [] },
  { id: '5', nome: 'Lote Ômega', cultura: 'Café', areaHa: 45, status: 'Plantado', criadoEm: agora, anotacoes: [] },
];
