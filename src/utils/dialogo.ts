import { Alert, Platform } from 'react-native';

// Alert.alert não funciona no navegador (web), então usamos window.alert/confirm lá.
export function avisar(titulo: string, mensagem?: string) {
  if (Platform.OS === 'web') {
    window.alert(mensagem ? `${titulo}\n\n${mensagem}` : titulo);
  } else {
    Alert.alert(titulo, mensagem);
  }
}

export function confirmar(
  titulo: string,
  mensagem: string,
  textoConfirmar = 'Confirmar',
  destrutivo = false
): Promise<boolean> {
  if (Platform.OS === 'web') {
    return Promise.resolve(window.confirm(`${titulo}\n\n${mensagem}`));
  }
  return new Promise((resolve) => {
    Alert.alert(
      titulo,
      mensagem,
      [
        { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
        { text: textoConfirmar, style: destrutivo ? 'destructive' : 'default', onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) }
    );
  });
}
