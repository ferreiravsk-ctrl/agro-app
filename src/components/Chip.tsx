import { Pressable, StyleSheet, Text } from 'react-native';

import { Cores } from '@/constants/agro';

type Props = { label: string; ativo: boolean; onPress: () => void };

export default function Chip({ label, ativo, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, ativo && styles.chipAtivo]}>
      <Text style={[styles.texto, ativo && styles.textoAtivo]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Cores.clara,
    backgroundColor: '#fff',
    marginRight: 8,
    marginBottom: 8,
  },
  chipAtivo: { backgroundColor: Cores.secundaria, borderColor: Cores.secundaria },
  texto: { color: Cores.primaria, fontSize: 13, fontWeight: '600' },
  textoAtivo: { color: '#fff' },
});
