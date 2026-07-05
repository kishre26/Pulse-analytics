import { createContext, useContext, useState } from "react";
import client from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("pulse_user");
    return stored ? JSON.parse(stored) : null;
  });

  function persist(token, user) {
    localStorage.setItem("pulse_token", token);
    localStorage.setItem("pulse_user", JSON.stringify(user));
    setUser(user);
  }

  async function login(email, password) {
    const { data } = await client.post("/auth/login", { email, password });
    persist(data.token, data.user);
  }

  async function register(name, email, password) {
    const { data } = await client.post("/auth/register", { name, email, password });
    persist(data.token, data.user);
  }

  function logout() {
    localStorage.removeItem("pulse_token");
    localStorage.removeItem("pulse_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
