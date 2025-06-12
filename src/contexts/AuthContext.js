import React, { createContext, useState, useEffect } from "react";
import AuthService from "../services/AuthService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
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
    <AuthContext.Provider value={{ usuario, login, logout, carregando }}>
      {children}
    </AuthContext.Provider>
  );
}
