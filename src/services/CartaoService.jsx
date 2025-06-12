import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@cartoes";

async function listar() {
  const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
  return jsonValue != null ? JSON.parse(jsonValue) : [];
}

async function salvar(cartao) {
  const cartoes = await listar();
  cartoes.push(cartao);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cartoes));
}

async function buscar(id) {
  const cartoes = await listar();
  return cartoes.find((c) => c.id === id);
}

async function atualizar(cartaoAtualizado) {
  const cartoes = await listar();
  const novosCartoes = cartoes.map((c) =>
    c.id === cartaoAtualizado.id ? cartaoAtualizado : c
  );
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novosCartoes));
}

async function remover(id) {
  const cartoes = await listar();
  const novosCartoes = cartoes.filter((c) => c.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novosCartoes));
}

export default {
  listar,
  salvar,
  buscar,
  atualizar,
  remover,
};
