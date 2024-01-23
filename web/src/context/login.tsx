import React, { createContext, useEffect, useRef, useState } from "react";
import axios from "../axios";
type AuthProvider = "google" | "github";
type AuthContextData = {
  login: (provider: AuthProvider) => never | String;
  logout: () => never | void;
  getToken: () => never | string;
};

type AuthContextProviderProps = {
  children: React.ReactNode;
};

const AuthContext = createContext({} as AuthContextData);

export const AuthContextProvider = ({
  children,
}: AuthContextProviderProps): React.ReactElement => {
  const [token, setToken] = useState<string>("");

  const login = (provider: AuthProvider): never | String => {
    let AuthURL;
    switch (provider) {
      case "google":
        AuthURL = axios + "/auth/google";
        break;
      case "github":
        AuthURL = axios + "/auth/github";
        break;
      default:
        throw new Error("Invalid provider");
    }
    return AuthURL;
  };

  const logout = () => {};

  const getToken = () => {
    return token;
  };

  useEffect(() => {
    // load token from local storage
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
