import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';

import { Cores } from '@/constants/agro';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

function icone(nome: IconName) {
  return ({ color, size }: { color: string; size: number }) => (
    <MaterialCommunityIcons name={nome} color={color} size={size} />
  );
}

// Navegação por abas (React Navigation via Expo Router)
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: Cores.primaria },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        tabBarActiveTintColor: Cores.secundaria,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Painel', tabBarIcon: icone('view-dashboard') }} />
      <Tabs.Screen name="lotes" options={{ title: 'Lotes', tabBarIcon: icone('sprout') }} />
      <Tabs.Screen name="clima" options={{ title: 'Clima', tabBarIcon: icone('weather-partly-cloudy') }} />
      <Tabs.Screen name="produtor" options={{ title: 'Produtor', tabBarIcon: icone('account-cowboy-hat') }} />
    </Tabs>
  );
}
