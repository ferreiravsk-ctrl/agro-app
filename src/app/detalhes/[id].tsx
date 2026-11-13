import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import Chip from '@/components/Chip';
import SecaoCard from '@/components/SecaoCard';
import StatusBadge from '@/components/StatusBadge';
import { Cores, STATUS } from '@/constants/agro';
import { useLotes } from '@/context/LotesContext';
import { escolherDaGaleria, tirarFoto } from '@/services/fotos';
import { obterLocalizacao } from '@/services/localizacao';
import { avisar, confirmar } from '@/utils/dialogo';

export default function DetalhesLote() {
  const router = useRouter();
  // Parâmetro dinâmico da rota /detalhes/[id]
  const { id } = useLocalSearchParams<{ id: string }>();
  const { lotes, atualizarLote, removerLote, adicionarAnotacao } = useLotes();
  const [novaNota, setNovaNota] = useState('');

  const lote = lotes.find((l) => l.id === id);

  if (!lote) {
    return (
      <View style={styles.centro}>
        <Text style={styles.erro}>Lote não encontrado.</Text>
        <TouchableOpacity style={styles.botao} onPress={() => router.back()}>
          <Text style={styles.botaoTexto}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function handleFoto(origem: 'camera' | 'galeria') {
    try {
      const uri = origem === 'camera' ? await tirarFoto() : await escolherDaGaleria();
      if (uri) atualizarLote(lote!.id, { fotoUri: uri });
    } catch (e) {
      avisar('Atenção', e instanceof Error ? e.message : 'Não foi possível obter a foto.');
    }
  }

  async function handleGps() {
    try {
      const c = await obterLocalizacao();
      atualizarLote(lote!.id, { latitude: c.latitude, longitude: c.longitude });
    } catch (e) {
      avisar('Atenção', e instanceof Error ? e.message : 'Não foi possível obter a localização.');
    }
  }

  function handleAbrirMapa() {
    Linking.openURL(`https://www.google.com/maps?q=${lote!.latitude},${lote!.longitude}`);
  }

  function handleNota() {
    if (!novaNota.trim()) return;
    adicionarAnotacao(lote!.id, novaNota.trim());
    setNovaNota('');
  }

  async function handleExcluir() {
    const ok = await confirmar(
      'Excluir lote',
      `Deseja excluir "${lote!.nome}"? Essa ação não pode ser desfeita.`,
      'Excluir',
      true
    );
    if (ok) {
      router.back();
      removerLote(lote!.id);
    }
  }

  const temGps = lote.latitude !== undefined && lote.longitude !== undefined;

  return (
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: lote.nome }} />
      <View style={styles.conteudo}>
        <SecaoCard>
          {lote.fotoUri ? (
            <Image source={{ uri: lote.fotoUri }} style={styles.foto} contentFit="cover" />
          ) : (
            <View style={styles.fotoVazia}>
              <MaterialCommunityIcons name="sprout" size={56} color={Cores.secundaria} />
            </View>
          )}
          <View style={styles.linhaBotoes}>
            <TouchableOpacity style={styles.botaoSec} onPress={() => handleFoto('camera')}>
              <MaterialCommunityIcons name="camera" size={18} color={Cores.primaria} />
              <Text style={styles.botaoSecTexto}>Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoSec} onPress={() => handleFoto('galeria')}>
              <MaterialCommunityIcons name="image" size={18} color={Cores.primaria} />
              <Text style={styles.botaoSecTexto}>Galeria</Text>
            </TouchableOpacity>
          </View>
        </SecaoCard>

        <SecaoCard titulo="Informações">
          <View style={styles.linha}>
            <Text style={styles.label}>Cultura</Text>
            <Text style={styles.valor}>{lote.cultura}</Text>
          </View>
          <View style={styles.linha}>
            <Text style={styles.label}>Área</Text>
            <Text style={styles.valor}>{lote.areaHa} ha</Text>
          </View>
          <View style={styles.linha}>
            <Text style={styles.label}>Fase</Text>
            <StatusBadge status={lote.status} />
          </View>
          <View style={styles.linha}>
            <Text style={styles.label}>Cadastrado em</Text>
            <Text style={styles.valor}>{format(new Date(lote.criadoEm), 'dd/MM/yyyy')}</Text>
          </View>
        </SecaoCard>

        <SecaoCard titulo="Atualizar fase">
          <View style={styles.chips}>
            {STATUS.map((s) => (
              <Chip key={s} label={s} ativo={lote.status === s} onPress={() => atualizarLote(lote.id, { status: s })} />
            ))}
          </View>
        </SecaoCard>

        <SecaoCard titulo="Localização">
          {temGps ? (
            <Text style={styles.coords}>
              📍 {lote.latitude!.toFixed(5)}, {lote.longitude!.toFixed(5)}
            </Text>
          ) : (
            <Text style={styles.vazio}>Localização ainda não registrada.</Text>
          )}
          <View style={styles.linhaBotoes}>
            <TouchableOpacity style={styles.botaoSec} onPress={handleGps}>
              <MaterialCommunityIcons name="crosshairs-gps" size={18} color={Cores.primaria} />
              <Text style={styles.botaoSecTexto}>{temGps ? 'Atualizar' : 'Registrar'}</Text>
            </TouchableOpacity>
            {temGps && (
              <TouchableOpacity style={styles.botaoSec} onPress={handleAbrirMapa}>
                <MaterialCommunityIcons name="map-marker" size={18} color={Cores.primaria} />
                <Text style={styles.botaoSecTexto}>Ver no mapa</Text>
              </TouchableOpacity>
            )}
          </View>
        </SecaoCard>

        <SecaoCard titulo="Diário de campo">
          <TextInput
            style={styles.inputNota}
            placeholder="Ex: Aplicado adubo NPK, 300 kg/ha"
            placeholderTextColor="#999"
            value={novaNota}
            onChangeText={setNovaNota}
            multiline
          />
          <TouchableOpacity style={styles.botao} onPress={handleNota}>
            <Text style={styles.botaoTexto}>Adicionar anotação</Text>
          </TouchableOpacity>

          {lote.anotacoes.length === 0 ? (
            <Text style={[styles.vazio, { marginTop: 12 }]}>Nenhuma anotação ainda.</Text>
          ) : (
            lote.anotacoes.map((n) => (
              <View key={n.id} style={styles.nota}>
                <Text style={styles.notaData}>{format(new Date(n.data), 'dd/MM/yyyy HH:mm')}</Text>
                <Text style={styles.notaTexto}>{n.texto}</Text>
              </View>
            ))
          )}
        </SecaoCard>

        <TouchableOpacity style={styles.botaoExcluir} onPress={handleExcluir}>
          <MaterialCommunityIcons name="trash-can-outline" size={20} color={Cores.perigo} />
          <Text style={styles.excluirTexto}>Excluir lote</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  erro: { fontSize: 18, color: Cores.perigo, marginBottom: 20 },
  scroll: { padding: 16, alignItems: 'center', backgroundColor: Cores.fundo },
  conteudo: { width: '100%', maxWidth: 500 },
  foto: { width: '100%', height: 200, borderRadius: 10, marginBottom: 12 },
  fotoVazia: {
    height: 140,
    borderRadius: 10,
    backgroundColor: Cores.muitoClara,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  linhaBotoes: { flexDirection: 'row', gap: 10 },
  botaoSec: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Cores.clara,
    backgroundColor: Cores.muitoClara,
  },
  botaoSecTexto: { color: Cores.primaria, fontWeight: 'bold' },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: { fontSize: 15, color: '#555', fontWeight: '600' },
  valor: { fontSize: 15, color: Cores.texto, fontWeight: 'bold' },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  coords: { marginBottom: 10, color: '#333', fontWeight: '600' },
  vazio: { color: Cores.textoSec, fontStyle: 'italic', marginBottom: 10 },
  inputNota: {
    minHeight: 60,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: Cores.texto,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  botao: {
    flexDirection: 'row',
    backgroundColor: Cores.primaria,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoTexto: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  nota: { marginTop: 12, padding: 10, backgroundColor: '#f7f7f7', borderRadius: 8, borderLeftWidth: 3, borderLeftColor: Cores.secundaria },
  notaData: { fontSize: 11, color: Cores.textoSec, marginBottom: 2 },
  notaTexto: { fontSize: 14, color: '#333' },
  botaoExcluir: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    marginBottom: 24,
  },
  excluirTexto: { color: Cores.perigo, fontWeight: 'bold', fontSize: 15 },
});
