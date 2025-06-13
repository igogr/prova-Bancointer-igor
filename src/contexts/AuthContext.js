import React, { createContext, useState, useEffect } from "react";
// Assumindo que você tem um AuthService para a lógica de login/logout
// Se não tiver, você pode colocar a lógica diretamente aqui.
import AuthService from "../services/AuthService";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Tenta buscar um usuário já logado quando o app inicia
    AuthService.getUsuarioLogado().then((user) => {
      setUsuario(user);
      setCarregando(false);
    });
  }, []);

  const login = async (email, senha) => {
    const user = await AuthService.login(email, senha);
    setUsuario(user);
  };

  const logout = async () => {
    await AuthService.logout();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        login,
        logout,
        carregando,
        isAuthenticated: !!usuario, // true se o usuário existir, false se for null
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}