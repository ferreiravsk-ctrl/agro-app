import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Cores } from '@/constants/agro';

type Props = { titulo?: string; children: ReactNode };

export default function SecaoCard({ titulo, children }: Props) {
  return (
    <View style={styles.card}>
      {titulo ? <Text style={styles.titulo}>{titulo}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Cores.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Cores.borda,
    elevation: 2,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Cores.primaria,
    marginBottom: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: '#c8e6c9',
    paddingBottom: 4,
  },
});
