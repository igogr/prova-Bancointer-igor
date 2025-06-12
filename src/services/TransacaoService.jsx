import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@transacoes";

async function listar() {
  const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
  return jsonValue != null ? JSON.parse(jsonValue) : [];
}

async function salvar(transacao) {
  transacao.id = new Date().getTime();
  const transacoes = await listar();
  transacoes.push(transacao);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transacoes));
}

async function buscar(id) {
  const transacoes = await listar();
  return transacoes.find((t) => t.id === id);
}

async function remover(id) {
  const transacoes = await listar();
  const novaLista = transacoes.filter((t) => t.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista));
}

async function atualizar(novaTransacao) {
  const transacoes = await listar();
  const novaLista = transacoes.map((t) =>
    t.id === novaTransacao.id ? novaTransacao : t
  );
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista));
}

export default {
  listar,
  salvar,
  buscar,
  atualizar,
  remover,
};
