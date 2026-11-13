import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';

import { Cores } from '@/constants/agro';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LotesProvider } from '@/context/LotesContext';

function Raiz() {
  const { usuario, carregando } = useAuth();

  // Enquanto verifica se já existe sessão salva
  if (carregando) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Cores.primaria }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    // key: ao trocar de conta, os dados do app são recarregados do zero
    <LotesProvider key={usuario?.id ?? 'visitante'} usuario={usuario}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Cores.primaria },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {/* Telas protegidas: só existem para quem está logado */}
        <Stack.Protected guard={!!usuario}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="detalhes/[id]" options={{ title: 'Detalhes do Lote' }} />
          <Stack.Screen name="novo-lote" options={{ title: 'Novo Lote' }} />
        </Stack.Protected>

        {/* Telas públicas: só aparecem para quem NÃO está logado */}
        <Stack.Protected guard={!usuario}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="cadastro" options={{ title: 'Criar conta' }} />
        </Stack.Protected>
      </Stack>
    </LotesProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Raiz />
    </AuthProvider>
  );
}
