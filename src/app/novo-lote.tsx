import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Botao from '@/components/Botao';
import CampoTexto from '@/components/CampoTexto';
import Chip from '@/components/Chip';
import SecaoCard from '@/components/SecaoCard';
import { Cores, CULTURAS, STATUS, Status } from '@/constants/agro';
import { useLotes } from '@/context/LotesContext';
import { escolherDaGaleria, tirarFoto } from '@/services/fotos';
import { Coordenadas, obterLocalizacao } from '@/services/localizacao';
import { avisar } from '@/utils/dialogo';

export default function NovoLote() {
  const router = useRouter();
  const { adicionarLote } = useLotes();

  const [nome, setNome] = useState('');
  const [cultura, setCultura] = useState<string>('Soja');
  const [area, setArea] = useState('');
  const [status, setStatus] = useState<Status>('Preparação');
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [coords, setCoords] = useState<Coordenadas | null>(null);
  const [buscandoGps, setBuscandoGps] = useState(false);

  async function handleFoto(origem: 'camera' | 'galeria') {
    try {
      const uri = origem === 'camera' ? await tirarFoto() : await escolherDaGaleria();
      if (uri) setFotoUri(uri);
    } catch (e) {
      avisar('Atenção', e instanceof Error ? e.message : 'Não foi possível obter a foto.');
    }
  }

  async function handleGps() {
    setBuscandoGps(true);
    try {
      setCoords(await obterLocalizacao());
    } catch (e) {
      avisar('Atenção', e instanceof Error ? e.message : 'Não foi possível obter a localização.');
    } finally {
      setBuscandoGps(false);
    }
  }

  function handleSalvar() {
    const areaHa = parseFloat(area.replace(',', '.'));
    if (!nome.trim()) {
      avisar('Atenção', 'Informe o nome do lote.');
      return;
    }
    if (isNaN(areaHa) || areaHa <= 0) {
      avisar('Atenção', 'Informe uma área válida em hectares.');
      return;
    }
    adicionarLote({
      nome: nome.trim(),
      cultura,
      areaHa,
      status,
      fotoUri: fotoUri ?? undefined,
      latitude: coords?.latitude,
      longitude: coords?.longitude,
    });
    router.back();
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      <View style={styles.conteudo}>
        <SecaoCard titulo="Identificação">
          <CampoTexto label="Nome do lote *" placeholder="Ex: Talhão Norte" value={nome} onChangeText={setNome} />
          <CampoTexto
            label="Área (hectares) *"
            placeholder="Ex: 42,5"
            keyboardType="decimal-pad"
            value={area}
            onChangeText={setArea}
          />
        </SecaoCard>

        <SecaoCard titulo="Cultura">
          <View style={styles.chips}>
            {CULTURAS.map((c) => (
              <Chip key={c} label={c} ativo={cultura === c} onPress={() => setCultura(c)} />
            ))}
          </View>
        </SecaoCard>

        <SecaoCard titulo="Fase atual">
          <View style={styles.chips}>
            {STATUS.map((s) => (
              <Chip key={s} label={s} ativo={status === s} onPress={() => setStatus(s)} />
            ))}
          </View>
        </SecaoCard>

        <SecaoCard titulo="Foto do lote (câmera)">
          {fotoUri && <Image source={{ uri: fotoUri }} style={styles.foto} contentFit="cover" />}
          <View style={styles.linhaBotoes}>
            <TouchableOpacity style={styles.botaoSec} onPress={() => handleFoto('camera')}>
              <MaterialCommunityIcons name="camera" size={20} color={Cores.primaria} />
              <Text style={styles.botaoSecTexto}>Tirar foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoSec} onPress={() => handleFoto('galeria')}>
              <MaterialCommunityIcons name="image" size={20} color={Cores.primaria} />
              <Text style={styles.botaoSecTexto}>Galeria</Text>
            </TouchableOpacity>
          </View>
        </SecaoCard>

        <SecaoCard titulo="Localização (GPS)">
          {coords && (
            <Text style={styles.coords}>
              📍 {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
            </Text>
          )}
          <TouchableOpacity style={styles.botaoSec} onPress={handleGps} disabled={buscandoGps}>
            {buscandoGps ? (
              <ActivityIndicator color={Cores.primaria} />
            ) : (
              <MaterialCommunityIcons name="crosshairs-gps" size={20} color={Cores.primaria} />
            )}
            <Text style={styles.botaoSecTexto}>{coords ? 'Atualizar localização' : 'Usar minha localização'}</Text>
          </TouchableOpacity>
        </SecaoCard>

        <Botao titulo="Salvar lote" onPress={handleSalvar} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, alignItems: 'center', backgroundColor: Cores.fundo },
  conteudo: { width: '100%', maxWidth: 500 },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  foto: { width: '100%', height: 180, borderRadius: 10, marginBottom: 12 },
  linhaBotoes: { flexDirection: 'row', gap: 10 },
  botaoSec: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 11,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Cores.clara,
    backgroundColor: Cores.muitoClara,
  },
  botaoSecTexto: { color: Cores.primaria, fontWeight: 'bold' },
  coords: { marginBottom: 10, color: '#333', fontWeight: '600' },
});
