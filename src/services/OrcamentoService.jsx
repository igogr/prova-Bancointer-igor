import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@orcamentos";

async function listar() {
  const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
  return jsonValue != null ? JSON.parse(jsonValue) : [];
}

async function salvar(orcamento) {
  const orcamentos = await listar();
  orcamento.id = new Date().getTime();
  orcamentos.push(orcamento);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(orcamentos));
}

async function buscar(id) {
  const orcamentos = await listar();
  return orcamentos.find((o) => o.id === id);
}

async function atualizar(novoOrcamento) {
  const orcamentos = await listar();
  const novaLista = orcamentos.map((o) =>
    o.id === novoOrcamento.id ? novoOrcamento : o
  );
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista));
}

async function remover(id) {
  const orcamentos = await listar();
  const novaLista = orcamentos.filter((o) => o.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista));
}

export default {
  listar,
  salvar,
  buscar,
  atualizar,
  remover,
};
