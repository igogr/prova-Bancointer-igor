import AsyncStorage from "@react-native-async-storage/async-storage";

const USERS_KEY = "@usuarios";
const SESSION_KEY = "@usuario_logado";

async function listar() {
  const json = await AsyncStorage.getItem(USERS_KEY);
  return json ? JSON.parse(json) : [];
}

async function registrar(usuario) {
  const usuarios = await listar();
  const existe = usuarios.find((u) => u.email === usuario.email);
  if (existe) throw new Error("Email já cadastrado.");

  usuarios.push(usuario);
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(usuarios));
}

async function login(email, senha) {
  const usuarios = await listar();

  const user = usuarios.find(
    (u) => u.email === email.trim() && u.senha === senha
  );

  if (!user) {
    throw new Error("Credenciais inválidas.");
  }

  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

async function logout() {
  await AsyncStorage.removeItem(SESSION_KEY);
}

async function getUsuarioLogado() {
  const json = await AsyncStorage.getItem(SESSION_KEY);
  return json ? JSON.parse(json) : null;
}

export default {
  registrar,
  login,
  logout,
  getUsuarioLogado,
};
