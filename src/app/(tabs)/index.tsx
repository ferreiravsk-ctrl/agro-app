import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRouter } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

import SecaoCard from '@/components/SecaoCard';
import { COR_STATUS, Cores, STATUS } from '@/constants/agro';
import { useLotes } from '@/context/LotesContext';

export default function Painel() {
  const router = useRouter();
  const { lotes, produtor, carregando } = useLotes();
  const { width } = useWindowDimensions();

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={Cores.secundaria} />
      </View>
    );
  }

  const areaTotal = lotes.reduce((soma, l) => soma + l.areaHa, 0);
  const emColheita = lotes.filter((l) => l.status === 'Colheita');

  // Área (ha) somada por cultura, para o gráfico
  const porCultura: Record<string, number> = {};
  lotes.forEach((l) => {
    porCultura[l.cultura] = (porCultura[l.cultura] ?? 0) + l.areaHa;
  });
  const culturas = Object.entries(porCultura)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const larguraGrafico = Math.min(width, 500) - 64;
  const saudacao = produtor.nome ? `Olá, ${produtor.nome.split(' ')[0]}!` : 'Bem-vindo ao AgroApp';

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.conteudo}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="tractor" size={42} color={Cores.primaria} />
          <Text style={styles.titulo}>{saudacao}</Text>
          <Text style={styles.data}>{format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}</Text>
          {produtor.propriedade ? <Text style={styles.data}>{produtor.propriedade}</Text> : null}
        </View>

        <View style={styles.linhaResumo}>
          <View style={styles.resumo}>
            <Text style={styles.resumoNumero}>{lotes.length}</Text>
            <Text style={styles.resumoLabel}>Lotes</Text>
          </View>
          <View style={styles.resumo}>
            <Text style={styles.resumoNumero}>{areaTotal.toLocaleString('pt-BR')}</Text>
            <Text style={styles.resumoLabel}>Hectares</Text>
          </View>
          <View style={styles.resumo}>
            <Text style={[styles.resumoNumero, { color: Cores.aviso }]}>{emColheita.length}</Text>
            <Text style={styles.resumoLabel}>Em colheita</Text>
          </View>
        </View>

        <SecaoCard titulo="Área plantada por cultura (ha)">
          {culturas.length === 0 ? (
            <Text style={styles.vazio}>Cadastre lotes para ver o gráfico.</Text>
          ) : (
            <BarChart
              data={{
                labels: culturas.map(([c]) => (c.length > 8 ? c.slice(0, 7) + '.' : c)),
                datasets: [{ data: culturas.map(([, ha]) => ha) }],
              }}
              width={larguraGrafico}
              height={210}
              yAxisLabel=""
              yAxisSuffix=""
              fromZero
              chartConfig={{
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: Cores.muitoClara,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
                labelColor: () => 'rgba(0, 0, 0, 0.7)',
              }}
              style={{ borderRadius: 8, marginTop: 4 }}
            />
          )}
        </SecaoCard>

        <SecaoCard titulo="Lotes por fase">
          {STATUS.map((s) => {
            const qtd = lotes.filter((l) => l.status === s).length;
            const pct = lotes.length ? (qtd / lotes.length) * 100 : 0;
            return (
              <View key={s} style={styles.linhaStatus}>
                <Text style={styles.statusNome}>{s}</Text>
                <View style={styles.barraFundo}>
                  <View style={[styles.barra, { width: `${pct}%`, backgroundColor: COR_STATUS[s] }]} />
                </View>
                <Text style={styles.statusQtd}>{qtd}</Text>
              </View>
            );
          })}
        </SecaoCard>

        {emColheita.length > 0 && (
          <SecaoCard titulo="🌾 Prontos para colher">
            {emColheita.map((l) => (
              <Text
                key={l.id}
                style={styles.link}
                onPress={() => router.push(`/detalhes/${l.id}`)}
              >
                {l.nome} · {l.cultura} · {l.areaHa} ha
              </Text>
            ))}
          </SecaoCard>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: 16, alignItems: 'center', backgroundColor: Cores.fundo },
  conteudo: { width: '100%', maxWidth: 500 },
  header: { alignItems: 'center', marginBottom: 16 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: Cores.primaria, marginTop: 6 },
  data: { fontSize: 13, color: Cores.textoSec, textTransform: 'capitalize' },
  linhaResumo: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  resumo: {
    flex: 1,
    backgroundColor: Cores.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Cores.borda,
    paddingVertical: 14,
    alignItems: 'center',
    elevation: 2,
  },
  resumoNumero: { fontSize: 24, fontWeight: 'bold', color: Cores.primaria },
  resumoLabel: { fontSize: 12, color: Cores.textoSec, marginTop: 2 },
  vazio: { color: Cores.textoSec, fontStyle: 'italic' },
  linhaStatus: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  statusNome: { width: 90, fontSize: 13, color: '#333' },
  barraFundo: { flex: 1, height: 10, backgroundColor: '#eee', borderRadius: 5, overflow: 'hidden' },
  barra: { height: 10, borderRadius: 5 },
  statusQtd: { width: 28, textAlign: 'right', fontWeight: 'bold', color: '#333' },
  link: { color: Cores.info, fontWeight: '600', paddingVertical: 6 },
});
