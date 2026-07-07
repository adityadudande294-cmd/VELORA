"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile } from "../types";
import { api } from "../services/api";
import { authService } from "../services/authService";

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isOnline: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (name: string, email: string, password: string) => Promise<UserProfile>;
  logout: () => void;
  googleLogin: (email: string) => Promise<UserProfile>;
  checkHealth: () => Promise<boolean>;
  setUserProfileState: (user: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(false);

  useEffect(() => {
    setUser(api.user);
    setToken(api.token);
    
    const runHealthCheck = async () => {
      const online = await api.checkHealth();
      setIsOnline(online);
    };
    runHealthCheck();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authService.login(email, password);
    setUser(res);
    setToken(api.token);
    return res;
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await authService.register(name, email, password);
    setUser(res);
    setToken(api.token);
    return res;
  };

  const googleLogin = async (email: string) => {
    const res = await authService.googleLogin(email);
    setUser(res);
    setToken(api.token);
    return res;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const checkHealth = async () => {
    const online = await api.checkHealth();
    setIsOnline(online);
    return online;
  };

  const setUserProfileState = (updatedUser: UserProfile) => {
    api.user = updatedUser;
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isOnline,
      login,
      register,
      logout,
      googleLogin,
      checkHealth,
      setUserProfileState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
