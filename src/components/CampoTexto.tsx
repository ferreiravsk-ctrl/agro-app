import { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { Cores } from '@/constants/agro';

interface CampoProps extends TextInputProps {
  label: string;
}

export default function CampoTexto({ label, onFocus, onBlur, style, ...rest }: CampoProps) {
  // useState: destaca o campo que está em edição
  const [focado, setFocado] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, focado && styles.inputFocado, style]}
        placeholderTextColor="#999"
        onFocus={(e) => {
          setFocado(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocado(false);
          onBlur?.(e);
        }}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 4 },
  input: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Cores.texto,
  },
  inputFocado: {
    borderColor: Cores.secundaria,
    borderWidth: 2,
    backgroundColor: '#fff',
  },
});
