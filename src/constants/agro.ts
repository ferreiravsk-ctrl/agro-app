export const Cores = {
  primaria: '#1b5e20',
  secundaria: '#2e7d32',
  clara: '#a5d6a7',
  muitoClara: '#e8f5e9',
  fundo: '#f4f6f8',
  card: '#ffffff',
  borda: '#e0e0e0',
  texto: '#222222',
  textoSec: '#666666',
  perigo: '#c62828',
  aviso: '#ef6c00',
  info: '#1565c0',
} as const;

export const STATUS = ['Preparação', 'Plantado', 'Crescimento', 'Colheita', 'Colhido'] as const;
export type Status = (typeof STATUS)[number];

export const COR_STATUS: Record<Status, string> = {
  Preparação: '#8d6e63',
  Plantado: '#1565c0',
  Crescimento: '#2e7d32',
  Colheita: '#ef6c00',
  Colhido: '#6a1b9a',
};

export const CULTURAS = [
  'Soja',
  'Milho',
  'Algodão',
  'Trigo',
  'Café',
  'Cana-de-açúcar',
  'Feijão',
  'Arroz',
  'Sorgo',
  'Outra',
] as const;

// Brasília: usada como localização padrão quando o GPS não está disponível
export const LOCALIZACAO_PADRAO = { latitude: -15.7801, longitude: -47.9292 };
