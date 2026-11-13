# AgroApp – Gestão de Lotes e Clima no Campo

## Problema que resolve
Pequenos e médios produtores rurais costumam controlar lotes, culturas e atividades de campo em caderno ou
mensagens soltas, e decidem operações (pulverização, colheita, adubação) sem olhar a previsão do tempo.
O AgroApp reúne, no celular, o cadastro dos lotes com foto e localização, o acompanhamento da fase
de cada cultura, um diário de campo e recomendações baseadas no clima do local.

## Principais funcionalidades
- **Login e cadastro**: o app abre na tela de login; as telas só são liberadas após entrar (rotas protegidas). A sessão é lembrada e cada conta tem seus próprios dados. A senha é salva como hash SHA-256 (expo-crypto).
- **Painel**: total de lotes, hectares, lotes em colheita, gráfico de área por cultura e lotes por fase.
- **Lotes**: lista com busca, filtro por fase e modo de visualização compacto/detalhado.
- **Novo lote**: nome, cultura, área, fase, foto (câmera/galeria) e localização por GPS.
- **Detalhes do lote**: atualizar fase, trocar foto, registrar GPS, abrir no mapa, diário de campo e exclusão.
- **Clima**: previsão de 5 dias pela localização do aparelho, com recomendações (vento, umidade, chuva, calor).
- **Produtor**: perfil do produtor e da propriedade, com botão para sair da conta.
- Todos os dados ficam salvos no aparelho e continuam ao fechar o app.

## Recursos tecnológicos
- React Native + Expo (SDK 57) e TypeScript
- **Expo Router** (baseado em React Navigation): abas (Tabs), pilha (Stack), rotas protegidas (`Stack.Protected`) e rota dinâmica `/detalhes/[id]`
- **FlatList** (lista de lotes) e componentes reutilizáveis com props (`LoteCard`, `Chip`, `CampoTexto`, `SecaoCard`, `StatusBadge`)
- **useState** e **useEffect**, **Context API** (`AuthContext` e `LotesContext`) com useContext
- **AsyncStorage**: persistência de lotes, anotações e perfil
- **API REST**: Open-Meteo (previsão do tempo, gratuita e sem chave)
- react-native-chart-kit (gráfico de barras), date-fns (datas em pt-BR), uuid (IDs)
- Pressable/TouchableOpacity, Switch, TextInput, Alert, RefreshControl

## Recursos nativos 
1. **Câmera / galeria** – `expo-image-picker`
2. **GPS / localização** – `expo-location`

## Estrutura
```
src/
  app/            rotas (Expo Router): login · cadastro · (tabs)/index, lotes, clima, produtor · novo-lote · detalhes/[id]
  components/     LoteCard, Chip, StatusBadge, SecaoCard, CampoTexto
  context/        AuthContext (login/sessão) · LotesContext (lotes + AsyncStorage)
  services/       clima.ts (API), localizacao.ts (GPS), fotos.ts (câmera)
  constants/      agro.ts (cores, fases, culturas)
  types/          tipos TypeScript
```

## Como rodar
```bash
npm install
npx expo install @react-native-async-storage/async-storage expo-image-picker expo-crypto
npx expo start
```

## Como gerar o APK
```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```
