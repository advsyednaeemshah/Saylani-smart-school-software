import { createContext, useContext, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import api from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("eduverse-user"));
    } catch {
      return null;
    }
  });

  const saveSession = (data) => {
    localStorage.setItem("eduverse-token", data.token);
    localStorage.setItem("eduverse-user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const signup = async (form) => {
    const response = await api.post("/auth/signup", form);
    saveSession(response.data);
  };

  const login = async (form) => {
    const response = await api.post("/auth/login", form);
    saveSession(response.data);
  };

  const logout = () => {
    localStorage.removeItem("eduverse-token");
    localStorage.removeItem("eduverse-user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

