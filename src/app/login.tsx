import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import Botao from '@/components/Botao';
import CampoTexto from '@/components/CampoTexto';
import { Cores } from '@/constants/agro';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const router = useRouter();
  const { entrar } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleEntrar() {
    setErro(null);
    if (!email.trim() || !senha) {
      setErro('Informe e-mail e senha.');
      return;
    }
    setEnviando(true);
    try {
      await entrar(email, senha); // ao logar, o layout libera as telas do app
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível entrar.');
      setEnviando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      <View style={styles.topo}>
        <MaterialCommunityIcons name="tractor" size={72} color="#fff" />
        <Text style={styles.marca}>AgroApp</Text>
        <Text style={styles.slogan}>Gestão de lotes e clima no campo</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.titulo}>Entrar</Text>

        <CampoTexto
          label="E-mail"
          placeholder="exemplo@fazenda.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />
        <CampoTexto
          label="Senha"
          placeholder="Sua senha"
          secureTextEntry={!mostrarSenha}
          autoCapitalize="none"
          value={senha}
          onChangeText={setSenha}
          onSubmitEditing={handleEntrar}
        />
        <TouchableOpacity onPress={() => setMostrarSenha((v) => !v)} style={styles.mostrar}>
          <MaterialCommunityIcons name={mostrarSenha ? 'eye-off' : 'eye'} size={18} color={Cores.info} />
          <Text style={styles.mostrarTexto}>{mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}</Text>
        </TouchableOpacity>

        {erro && <Text style={styles.erro}>{erro}</Text>}

        <Botao titulo="Entrar" onPress={handleEntrar} carregando={enviando} />

        <View style={styles.separador}>
          <Text style={styles.separadorTexto}>Ainda não tem conta?</Text>
        </View>
        <Botao titulo="Criar conta" variante="contorno" onPress={() => router.push('/cadastro')} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, backgroundColor: Cores.primaria, alignItems: 'center' },
  topo: { alignItems: 'center', paddingTop: 70, paddingBottom: 28 },
  marca: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginTop: 6 },
  slogan: { fontSize: 14, color: Cores.clara, marginTop: 2 },
  card: {
    width: '100%',
    maxWidth: 460,
    flex: 1,
    backgroundColor: Cores.fundo,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
  },
  titulo: { fontSize: 22, fontWeight: 'bold', color: Cores.primaria, marginBottom: 16 },
  mostrar: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14, alignSelf: 'flex-start' },
  mostrarTexto: { color: Cores.info, fontWeight: '600', fontSize: 13 },
  erro: { color: Cores.perigo, fontWeight: '600', marginBottom: 12, textAlign: 'center' },
  separador: { alignItems: 'center', marginVertical: 16 },
  separadorTexto: { color: Cores.textoSec },
});
