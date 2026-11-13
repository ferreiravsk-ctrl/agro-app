import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import StatusBadge from '@/components/StatusBadge';
import { Cores } from '@/constants/agro';
import type { Lote } from '@/types';

// Props: dados do lote, modo de exibição e callback de toque
type LoteCardProps = {
  lote: Lote;
  modoCompacto: boolean;
  onPress: () => void;
};

export default function LoteCard({ lote, modoCompacto, onPress }: LoteCardProps) {
  const tamanho = modoCompacto ? 40 : 56;

  return (
    <TouchableOpacity style={[styles.card, modoCompacto && styles.cardCompacto]} onPress={onPress}>
      {lote.fotoUri ? (
        <Image source={{ uri: lote.fotoUri }} style={{ width: tamanho, height: tamanho, borderRadius: 8 }} contentFit="cover" />
      ) : (
        <View style={[styles.icone, { width: tamanho, height: tamanho }]}>
          <MaterialCommunityIcons name="leaf" size={tamanho * 0.55} color={Cores.secundaria} />
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.titulo}>{lote.nome}</Text>
        {/* Renderização condicional baseada no state do modo compacto */}
        {!modoCompacto && (
          <>
            <Text style={styles.subtitulo}>
              {lote.cultura} · {lote.areaHa} ha
            </Text>
            <StatusBadge status={lote.status} />
          </>
        )}
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color="#888" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Cores.card,
    padding: 14,
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Cores.borda,
    alignItems: 'center',
    elevation: 2,
  },
  cardCompacto: { padding: 8, marginVertical: 3 },
  icone: {
    borderRadius: 8,
    backgroundColor: Cores.muitoClara,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, marginLeft: 14, gap: 3 },
  titulo: { fontSize: 16, fontWeight: 'bold', color: Cores.primaria },
  subtitulo: { fontSize: 14, color: '#555' },
});
