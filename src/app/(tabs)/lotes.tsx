import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import Chip from '@/components/Chip';
import LoteCard from '@/components/LoteCard';
import { Cores, STATUS, Status } from '@/constants/agro';
import { useLotes } from '@/context/LotesContext';

export default function ListaLotes() {
  const router = useRouter();
  const { lotes, carregando } = useLotes();

  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<Status | null>(null);
  const [modoCompacto, setModoCompacto] = useState(false);

  const termo = busca.trim().toLowerCase();
  const filtrados = lotes.filter(
    (l) =>
      (!filtro || l.status === filtro) &&
      (!termo || l.nome.toLowerCase().includes(termo) || l.cultura.toLowerCase().includes(termo))
  );

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={Cores.secundaria} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topo}>
        <TextInput
          style={styles.busca}
          placeholder="Buscar por nome ou cultura"
          placeholderTextColor="#999"
          value={busca}
          onChangeText={setBusca}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtros}>
          <Chip label="Todos" ativo={filtro === null} onPress={() => setFiltro(null)} />
          {STATUS.map((s) => (
            <Chip key={s} label={s} ativo={filtro === s} onPress={() => setFiltro(filtro === s ? null : s)} />
          ))}
        </ScrollView>

        <View style={styles.linhaSwitch}>
          <Text style={styles.switchLabel}>{modoCompacto ? 'Visualização compacta' : 'Visualização detalhada'}</Text>
          <Switch
            value={modoCompacto}
            onValueChange={setModoCompacto}
            trackColor={{ false: '#767577', true: Cores.clara }}
            thumbColor={modoCompacto ? Cores.secundaria : '#f4f3f4'}
          />
        </View>
      </View>

      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <LoteCard lote={item} modoCompacto={modoCompacto} onPress={() => router.push(`/detalhes/${item.id}`)} />
        )}
        ListEmptyComponent={
          <Text style={styles.vazio}>
            {lotes.length === 0 ? 'Nenhum lote cadastrado ainda.' : 'Nenhum lote encontrado com esses filtros.'}
          </Text>
        }
      />

      <Pressable style={styles.fab} onPress={() => router.push('/novo-lote')}>
        <MaterialCommunityIcons name="plus" size={28} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { flex: 1, backgroundColor: Cores.fundo },
  topo: { backgroundColor: '#fff', padding: 12, borderBottomWidth: 1, borderBottomColor: Cores.borda },
  busca: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    color: Cores.texto,
    marginBottom: 10,
  },
  filtros: { flexGrow: 0 },
  linhaSwitch: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  switchLabel: { fontSize: 14, fontWeight: '600', color: '#333' },
  lista: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 90 },
  vazio: { textAlign: 'center', color: Cores.textoSec, marginTop: 40, fontStyle: 'italic' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Cores.secundaria,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
});
