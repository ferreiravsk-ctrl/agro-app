import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { Cores } from '@/constants/agro';

type Props = {
  titulo: string;
  onPress: () => void;
  carregando?: boolean;
  variante?: 'primario' | 'contorno';
};

export default function Botao({ titulo, onPress, carregando = false, variante = 'primario' }: Props) {
  const contorno = variante === 'contorno';
  return (
    <TouchableOpacity
      style={[styles.botao, contorno && styles.contorno]}
      onPress={onPress}
      disabled={carregando}
      activeOpacity={0.8}
    >
      {carregando ? (
        <ActivityIndicator color={contorno ? Cores.primaria : '#fff'} />
      ) : (
        <Text style={[styles.texto, contorno && styles.textoContorno]}>{titulo}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    backgroundColor: Cores.secundaria,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  contorno: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Cores.secundaria },
  texto: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  textoContorno: { color: Cores.primaria },
});
