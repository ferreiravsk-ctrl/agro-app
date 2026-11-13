import * as ImagePicker from 'expo-image-picker';

// RECURSO NATIVO: câmera e galeria (expo-image-picker)
export async function tirarFoto(): Promise<string | null> {
  const perm = await ImagePicker.requestCameraPermissionsAsync();
  if (!perm.granted) {
    throw new Error('Permissão de câmera negada.');
  }
  const r = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    quality: 0.5,
    allowsEditing: true,
    aspect: [4, 3],
  });
  return r.canceled ? null : r.assets[0].uri;
}

export async function escolherDaGaleria(): Promise<string | null> {
  const r = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 0.5,
    allowsEditing: true,
    aspect: [4, 3],
  });
  return r.canceled ? null : r.assets[0].uri;
}
