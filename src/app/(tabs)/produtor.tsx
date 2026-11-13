import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import Botao from '@/components/Botao';
import CampoTexto from '@/components/CampoTexto';
import SecaoCard from '@/components/SecaoCard';
import { Cores } from '@/constants/agro';
import { useAuth } from '@/context/AuthContext';
import { useLotes } from '@/context/LotesContext';
import type { Produtor } from '@/types';
import { avisar, confirmar } from '@/utils/dialogo';

export default function TelaProdutor() {
  const { produtor, salvarProdutor } = useLotes();
  const { usuario, sair } = useAuth();
  const [form, setForm] = useState<Produtor>(produtor);

  // Quando os dados salvos terminam de carregar, preenche o formulário
  useEffect(() => {
    setForm(produtor);
  }, [produtor]);

  function atualizar(campo: keyof Produtor, valor: string) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function handleSalvar() {
    if (!form.nome.trim()) {
      avisar('Atenção', 'Informe o nome do produtor.');
      return;
    }
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      avisar('Atenção', 'E-mail inválido.');
      return;
    }
    salvarProdutor({ ...form, nome: form.nome.trim() });
    avisar('Salvo!', 'Seus dados foram guardados no aparelho.');
  }

  async function handleSair() {
    if (await confirmar('Sair da conta', 'Deseja sair do AgroApp?', 'Sair', true)) {
      await sair(); // volta automaticamente para a tela de login
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      <View style={styles.conteudo}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="account-cowboy-hat" size={48} color={Cores.primaria} />
          <Text style={styles.titulo}>Perfil do Produtor</Text>
          {usuario && <Text style={styles.conta}>Conta: {usuario.email}</Text>}
        </View>

        <SecaoCard titulo="Dados pessoais">
          <CampoTexto label="Nome completo *" placeholder="Ex: João da Silva" value={form.nome} onChangeText={(t) => atualizar('nome', t)} />
          <CampoTexto
            label="E-mail"
            placeholder="exemplo@fazenda.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(t) => atualizar('email', t)}
          />
          <CampoTexto
            label="Telefone"
            placeholder="(61) 99999-9999"
            keyboardType="phone-pad"
            value={form.telefone}
            onChangeText={(t) => atualizar('telefone', t)}
          />
        </SecaoCard>

        <SecaoCard titulo="Propriedade">
          <CampoTexto label="Nome da propriedade" placeholder="Ex: Fazenda Boa Esperança" value={form.propriedade} onChangeText={(t) => atualizar('propriedade', t)} />
          <CampoTexto label="Município / UF" placeholder="Ex: Cristalina - GO" value={form.municipio} onChangeText={(t) => atualizar('municipio', t)} />
        </SecaoCard>

        <Botao titulo="Salvar perfil" onPress={handleSalvar} />
        <View style={{ height: 12 }} />
        <Botao titulo="Sair da conta" variante="contorno" onPress={handleSair} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, alignItems: 'center', backgroundColor: Cores.fundo },
  conteudo: { width: '100%', maxWidth: 500 },
  header: { alignItems: 'center', marginBottom: 16 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: Cores.primaria, marginTop: 6 },
  conta: { fontSize: 13, color: Cores.textoSec, marginTop: 2 },
});
