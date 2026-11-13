import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import { lotesIniciais } from '@/data/lotesIniciais';
import type { Lote, Produtor, Usuario } from '@/types';

const KEY_LOTES = '@agro/lotes';
const KEY_PRODUTOR = '@agro/produtor';
// Cada usuário tem seus próprios lotes e perfil: a chave inclui o id da conta

const produtorVazio: Produtor = { nome: '', email: '', telefone: '', propriedade: '', municipio: '' };

type NovoLote = Omit<Lote, 'id' | 'criadoEm' | 'anotacoes'>;

type LotesContextType = {
  lotes: Lote[];
  produtor: Produtor;
  carregando: boolean;
  adicionarLote: (dados: NovoLote) => Lote;
  atualizarLote: (id: string, parcial: Partial<Omit<Lote, 'id'>>) => void;
  removerLote: (id: string) => void;
  adicionarAnotacao: (loteId: string, texto: string) => void;
  salvarProdutor: (dados: Produtor) => void;
};

const LotesContext = createContext<LotesContextType | null>(null);

export function LotesProvider({ children, usuario }: { children: ReactNode; usuario: Usuario | null }) {
  const uid = usuario?.id ?? null;
  const nomeUsuario = usuario?.nome ?? '';
  const emailUsuario = usuario?.email ?? '';

  const [lotes, setLotes] = useState<Lote[]>([]);
  const [produtor, setProdutor] = useState<Produtor>(produtorVazio);
  const [carregando, setCarregando] = useState(uid !== null);

  // Carrega os dados salvos da conta (AsyncStorage) quando o usuário entra
  useEffect(() => {
    if (!uid) return;
    async function carregar() {
      try {
        const [l, p] = await Promise.all([
          AsyncStorage.getItem(`${KEY_LOTES}:${uid}`),
          AsyncStorage.getItem(`${KEY_PRODUTOR}:${uid}`),
        ]);
        setLotes(l ? (JSON.parse(l) as Lote[]) : lotesIniciais);
        setProdutor(p ? (JSON.parse(p) as Produtor) : { ...produtorVazio, nome: nomeUsuario, email: emailUsuario });
      } catch {
        setLotes(lotesIniciais);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [uid, nomeUsuario, emailUsuario]);

  // Salva automaticamente sempre que os lotes mudam
  useEffect(() => {
    if (carregando || !uid) return;
    AsyncStorage.setItem(`${KEY_LOTES}:${uid}`, JSON.stringify(lotes)).catch(() => {});
  }, [lotes, carregando, uid]);

  useEffect(() => {
    if (carregando || !uid) return;
    AsyncStorage.setItem(`${KEY_PRODUTOR}:${uid}`, JSON.stringify(produtor)).catch(() => {});
  }, [produtor, carregando, uid]);

  const adicionarLote = useCallback((dados: NovoLote) => {
    const novo: Lote = {
      ...dados,
      id: uuidv4(),
      criadoEm: new Date().toISOString(),
      anotacoes: [],
    };
    setLotes((prev) => [novo, ...prev]);
    return novo;
  }, []);

  const atualizarLote = useCallback((id: string, parcial: Partial<Omit<Lote, 'id'>>) => {
    setLotes((prev) => prev.map((l) => (l.id === id ? { ...l, ...parcial } : l)));
  }, []);

  const removerLote = useCallback((id: string) => {
    setLotes((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const adicionarAnotacao = useCallback((loteId: string, texto: string) => {
    const nota = { id: uuidv4(), texto, data: new Date().toISOString() };
    setLotes((prev) =>
      prev.map((l) => (l.id === loteId ? { ...l, anotacoes: [nota, ...l.anotacoes] } : l))
    );
  }, []);

  const salvarProdutor = useCallback((dados: Produtor) => setProdutor(dados), []);

  const value = useMemo(
    () => ({
      lotes,
      produtor,
      carregando,
      adicionarLote,
      atualizarLote,
      removerLote,
      adicionarAnotacao,
      salvarProdutor,
    }),
    [lotes, produtor, carregando, adicionarLote, atualizarLote, removerLote, adicionarAnotacao, salvarProdutor]
  );

  return <LotesContext.Provider value={value}>{children}</LotesContext.Provider>;
}

export function useLotes() {
  const ctx = useContext(LotesContext);
  if (!ctx) throw new Error('useLotes deve ser usado dentro de <LotesProvider>');
  return ctx;
}
