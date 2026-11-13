import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ComponentProps, useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import SecaoCard from '@/components/SecaoCard';
import { Cores, LOCALIZACAO_PADRAO } from '@/constants/agro';
import { buscarClima, Clima, conselhosAgro, descricaoClima } from '@/services/clima';
import { obterLocalizacao } from '@/services/localizacao';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

const COR_CONSELHO = { ok: Cores.secundaria, aviso: Cores.aviso, perigo: Cores.perigo } as const;
const ICONE_CONSELHO: Record<'ok' | 'aviso' | 'perigo', IconName> = {
  ok: 'check-circle',
  aviso: 'alert',
  perigo: 'alert-octagon',
};

export default function TelaClima() {
  const [clima, setClima] = useState<Clima | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [usouGps, setUsouGps] = useState(true);

  const carregar = useCallback(async () => {
    setErro(null);
    let coords = LOCALIZACAO_PADRAO;
    let gps = true;
    try {
      coords = await obterLocalizacao(); // recurso nativo: GPS
    } catch {
      gps = false; // sem permissão: usa a localização padrão
    }
    try {
      const dados = await buscarClima(coords.latitude, coords.longitude); // API externa
      setClima(dados);
      setUsouGps(gps);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao carregar o clima.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={Cores.secundaria} />
        <Text style={styles.msg}>Buscando previsão do tempo...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scroll}
      refreshControl={<RefreshControl refreshing={false} onRefresh={carregar} colors={[Cores.secundaria]} />}
    >
      <View style={styles.conteudo}>
        {erro && (
          <SecaoCard>
            <Text style={styles.erro}>{erro}</Text>
            <Text style={styles.msg}>Verifique a internet e puxe a tela para baixo para tentar de novo.</Text>
          </SecaoCard>
        )}

        {clima && (
          <>
            <Text style={styles.origem}>
              {usouGps
                ? '📍 Previsão para a sua localização atual'
                : '📍 GPS indisponível: exibindo previsão de Brasília-DF'}
            </Text>

            <SecaoCard>
              <View style={styles.atual}>
                <MaterialCommunityIcons
                  name={descricaoClima(clima.atual.codigo).icone as IconName}
                  size={64}
                  color={Cores.secundaria}
                />
                <View style={{ marginLeft: 16 }}>
                  <Text style={styles.temp}>{Math.round(clima.atual.temperatura)}°C</Text>
                  <Text style={styles.desc}>{descricaoClima(clima.atual.codigo).texto}</Text>
                </View>
              </View>
              <View style={styles.metricas}>
                <Text style={styles.metrica}>💧 {clima.atual.umidade}%</Text>
                <Text style={styles.metrica}>💨 {Math.round(clima.atual.vento)} km/h</Text>
                <Text style={styles.metrica}>🌧️ {clima.atual.precipitacao} mm</Text>
              </View>
            </SecaoCard>

            <SecaoCard titulo="Recomendações para o campo">
              {conselhosAgro(clima).map((c, i) => (
                <View key={i} style={styles.conselho}>
                  <MaterialCommunityIcons name={ICONE_CONSELHO[c.nivel]} size={22} color={COR_CONSELHO[c.nivel]} />
                  <Text style={styles.conselhoTexto}>{c.texto}</Text>
                </View>
              ))}
            </SecaoCard>

            <SecaoCard titulo="Próximos dias">
              {clima.dias.map((d) => (
                <View key={d.data.toISOString()} style={styles.dia}>
                  <Text style={styles.diaData}>{format(d.data, 'EEE dd/MM', { locale: ptBR })}</Text>
                  <MaterialCommunityIcons
                    name={descricaoClima(d.codigo).icone as IconName}
                    size={24}
                    color={Cores.secundaria}
                  />
                  <Text style={styles.diaTemp}>
                    {Math.round(d.min)}° / {Math.round(d.max)}°
                  </Text>
                  <Text style={styles.diaChuva}>🌧️ {d.probChuva}% · {d.chuvaMm} mm</Text>
                </View>
              ))}
            </SecaoCard>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  msg: { color: Cores.textoSec, marginTop: 10, textAlign: 'center' },
  scroll: { padding: 16, alignItems: 'center', backgroundColor: Cores.fundo },
  conteudo: { width: '100%', maxWidth: 500 },
  erro: { color: Cores.perigo, fontWeight: 'bold', textAlign: 'center' },
  origem: { color: Cores.textoSec, fontSize: 13, marginBottom: 10, textAlign: 'center' },
  atual: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  temp: { fontSize: 40, fontWeight: 'bold', color: Cores.primaria },
  desc: { fontSize: 15, color: '#444' },
  metricas: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 14 },
  metrica: { fontSize: 14, color: '#333', fontWeight: '600' },
  conselho: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  conselhoTexto: { flex: 1, fontSize: 14, color: '#333' },
  dia: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  diaData: { width: 80, fontSize: 13, fontWeight: '600', textTransform: 'capitalize' },
  diaTemp: { width: 70, fontSize: 13, textAlign: 'center' },
  diaChuva: { fontSize: 12, color: Cores.textoSec },
});
