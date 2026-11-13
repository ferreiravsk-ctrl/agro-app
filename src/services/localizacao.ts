import * as Location from 'expo-location';

export type Coordenadas = { latitude: number; longitude: number };

// RECURSO NATIVO: GPS (expo-location)
export async function obterLocalizacao(): Promise<Coordenadas> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permissão de localização negada.');
  }
  const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
}
