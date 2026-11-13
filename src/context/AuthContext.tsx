import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import type { Usuario } from '@/types';

const KEY_USUARIOS = '@agro/usuarios';
const KEY_SESSAO = '@agro/sessao';

type UsuarioSalvo = Usuario & { salt: string; senhaHash: string };

type AuthContextType = {
  usuario: Usuario | null;
  carregando: boolean;
  cadastrar: (nome: string, email: string, senha: string) => Promise<void>;
  entrar: (email: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

// A senha nunca é guardada em texto puro: salvamos apenas o hash SHA-256 (com salt)
async function gerarHash(senha: string, salt: string) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, salt + senha);
}

async function lerUsuarios(): Promise<UsuarioSalvo[]> {
  const raw = await AsyncStorage.getItem(KEY_USUARIOS);
  return raw ? (JSON.parse(raw) as UsuarioSalvo[]) : [];
}

function publico(u: UsuarioSalvo): Usuario {
  return { id: u.id, nome: u.nome, email: u.email };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  // Restaura a sessão salva (usuário continua logado ao reabrir o app)
  useEffect(() => {
    async function restaurar() {
      try {
        const id = await AsyncStorage.getItem(KEY_SESSAO);
        if (id) {
          const lista = await lerUsuarios();
          const u = lista.find((x) => x.id === id);
          if (u) setUsuario(publico(u));
        }
      } catch {
        // sem sessão válida: segue para o login
      } finally {
        setCarregando(false);
      }
    }
    restaurar();
  }, []);

  const cadastrar = useCallback(async (nome: string, email: string, senha: string) => {
    const emailNorm = email.trim().toLowerCase();
    const lista = await lerUsuarios();
    if (lista.some((u) => u.email === emailNorm)) {
      throw new Error('Já existe uma conta com esse e-mail.');
    }
    const salt = uuidv4();
    const novo: UsuarioSalvo = {
      id: uuidv4(),
      nome: nome.trim(),
      email: emailNorm,
      salt,
      senhaHash: await gerarHash(senha, salt),
    };
    await AsyncStorage.setItem(KEY_USUARIOS, JSON.stringify([...lista, novo]));
    await AsyncStorage.setItem(KEY_SESSAO, novo.id);
    setUsuario(publico(novo));
  }, []);

  const entrar = useCallback(async (email: string, senha: string) => {
    const emailNorm = email.trim().toLowerCase();
    const lista = await lerUsuarios();
    const u = lista.find((x) => x.email === emailNorm);
    if (!u || (await gerarHash(senha, u.salt)) !== u.senhaHash) {
      throw new Error('E-mail ou senha incorretos.');
    }
    await AsyncStorage.setItem(KEY_SESSAO, u.id);
    setUsuario(publico(u));
  }, []);

  const sair = useCallback(async () => {
    await AsyncStorage.removeItem(KEY_SESSAO);
    setUsuario(null);
  }, []);

  const value = useMemo(
    () => ({ usuario, carregando, cadastrar, entrar, sair }),
    [usuario, carregando, cadastrar, entrar, sair]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}
