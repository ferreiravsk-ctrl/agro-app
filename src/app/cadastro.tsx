import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import Botao from '@/components/Botao';
import CampoTexto from '@/components/CampoTexto';
import { Cores } from '@/constants/agro';
import { useAuth } from '@/context/AuthContext';

export default function Cadastro() {
  const { cadastrar } = useAuth();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [aceitaTermos, setAceitaTermos] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleCadastrar() {
    setErro(null);
    if (!nome.trim() || !email.trim() || !senha) {
      setErro('Preencha nome, e-mail e senha.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setErro('E-mail inválido.');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }
    if (senha !== confirmar) {
      setErro('As senhas não conferem.');
      return;
    }
    if (!aceitaTermos) {
      setErro('É necessário aceitar os termos de uso.');
      return;
    }
    setEnviando(true);
    try {
      await cadastrar(nome, email, senha); // cria a conta e já entra no app
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Não foi possível criar a conta.');
      setEnviando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      <View style={styles.conteudo}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="account-cowboy-hat" size={52} color={Cores.primaria} />
          <Text style={styles.titulo}>Cadastro de Produtor</Text>
        </View>

        <View style={styles.card}>
          <CampoTexto label="Nome completo *" placeholder="Ex: João da Silva" value={nome} onChangeText={setNome} />
          <CampoTexto
            label="E-mail *"
            placeholder="exemplo@fazenda.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />
          <CampoTexto
            label="Senha * (mín. 6 caracteres)"
            secureTextEntry
            autoCapitalize="none"
            value={senha}
            onChangeText={setSenha}
          />
          <CampoTexto
            label="Confirmar senha *"
            secureTextEntry
            autoCapitalize="none"
            value={confirmar}
            onChangeText={setConfirmar}
            onSubmitEditing={handleCadastrar}
          />

          <View style={styles.linhaTermos}>
            <Text style={styles.termosTexto}>{aceitaTermos ? '✅ Termos aceitos' : 'Aceito os termos de uso'}</Text>
            <Switch
              value={aceitaTermos}
              onValueChange={setAceitaTermos}
              trackColor={{ false: '#767577', true: Cores.clara }}
              thumbColor={aceitaTermos ? Cores.secundaria : '#f4f3f4'}
            />
          </View>

          {erro && <Text style={styles.erro}>{erro}</Text>}

          <Botao titulo="Criar conta" onPress={handleCadastrar} carregando={enviando} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, alignItems: 'center', backgroundColor: Cores.fundo, flexGrow: 1 },
  conteudo: { width: '100%', maxWidth: 460 },
  header: { alignItems: 'center', marginVertical: 16 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: Cores.primaria, marginTop: 6 },
  card: {
    backgroundColor: Cores.card,
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: Cores.borda,
    elevation: 2,
  },
  linhaTermos: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  termosTexto: { fontSize: 14, fontWeight: '600', color: '#333' },
  erro: { color: Cores.perigo, fontWeight: '600', marginBottom: 12, textAlign: 'center' },
});
