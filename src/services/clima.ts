import { parseISO } from 'date-fns';

export type ClimaAtual = {
  temperatura: number;
  umidade: number;
  vento: number; // km/h
  precipitacao: number; // mm
  codigo: number;
};

export type ClimaDia = {
  data: Date;
  max: number;
  min: number;
  chuvaMm: number;
  probChuva: number;
  codigo: number;
};

export type Clima = { atual: ClimaAtual; dias: ClimaDia[] };

// API REST gratuita (Open-Meteo), sem chave de acesso
export async function buscarClima(latitude: number, longitude: number): Promise<Clima> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max` +
    `&timezone=auto&forecast_days=5`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Não foi possível consultar a previsão do tempo.');
  const j = await res.json();

  return {
    atual: {
      temperatura: j.current.temperature_2m,
      umidade: j.current.relative_humidity_2m,
      vento: j.current.wind_speed_10m,
      precipitacao: j.current.precipitation,
      codigo: j.current.weather_code,
    },
    dias: j.daily.time.map((d: string, i: number) => ({
      data: parseISO(d),
      max: j.daily.temperature_2m_max[i],
      min: j.daily.temperature_2m_min[i],
      chuvaMm: j.daily.precipitation_sum[i],
      probChuva: j.daily.precipitation_probability_max[i] ?? 0,
      codigo: j.daily.weather_code[i],
    })),
  };
}

export function descricaoClima(codigo: number): { texto: string; icone: string } {
  if (codigo === 0) return { texto: 'Céu limpo', icone: 'weather-sunny' };
  if (codigo <= 3) return { texto: 'Parcialmente nublado', icone: 'weather-partly-cloudy' };
  if (codigo <= 48) return { texto: 'Neblina', icone: 'weather-fog' };
  if (codigo <= 57) return { texto: 'Garoa', icone: 'weather-rainy' };
  if (codigo <= 67) return { texto: 'Chuva', icone: 'weather-pouring' };
  if (codigo <= 77) return { texto: 'Frio intenso', icone: 'weather-snowy' };
  if (codigo <= 82) return { texto: 'Pancadas de chuva', icone: 'weather-pouring' };
  return { texto: 'Tempestade', icone: 'weather-lightning-rainy' };
}

export type Conselho = { texto: string; nivel: 'ok' | 'aviso' | 'perigo' };

// Regras simples de apoio à decisão no campo
export function conselhosAgro(clima: Clima): Conselho[] {
  const { atual, dias } = clima;
  const hoje = dias[0];
  const lista: Conselho[] = [];

  if (atual.vento >= 15) {
    lista.push({ nivel: 'perigo', texto: 'Vento forte: evite pulverização (risco de deriva).' });
  } else if (atual.umidade < 50) {
    lista.push({ nivel: 'aviso', texto: 'Umidade baixa: a calda evapora rápido. Prefira pulverizar no início da manhã.' });
  }

  if (hoje && (hoje.probChuva >= 60 || hoje.chuvaMm >= 10)) {
    lista.push({ nivel: 'aviso', texto: 'Chuva provável hoje: adie colheita e adubação de cobertura.' });
  }

  if (atual.temperatura >= 35) {
    lista.push({ nivel: 'perigo', texto: 'Calor intenso: atenção à irrigação e ao estresse hídrico das plantas.' });
  }

  if (lista.length === 0) {
    lista.push({ nivel: 'ok', texto: 'Boas condições para operações de campo hoje.' });
  }
  return lista;
}
