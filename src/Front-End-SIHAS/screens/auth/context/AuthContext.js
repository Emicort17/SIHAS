import React, { createContext, useContext, useState } from "react"
import { AxiosClient } from "./http_client"
const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null)
  const isLoading = false

  const login = async (email, password) => {
    try {
      const data = await AxiosClient.post("/api/login", { email, password });

      setUser({
        token: data.jwt,
        userId: data.userId,
        username: data.username,
        rol: data.rol
      });

      console.log("Login exitoso:", data);
      return data;

    } catch (err) {
      console.error("Error en el login: ", err);
      return false;
    }
  };

  const logout = () => {
    setUser(null)
  };

  const Register = async (name, surname, lastname, email, password, status, isProfessional) => {
    try {
      const rol = isProfessional ? "PROFESIONAL" : "USUARIO";

      const response = await AxiosClient.post("/api/usuario/register", {
        name,
        surname,
        lastname,
        email,
        password,
        status,
        rol
      });

      if (!response.ok) {
        throw new Error("Error al registrar");
      }

      const data = await response.json();

      if (data.type === "SUCCESS") {
        console.log("Registro exitoso:", data.result);
        return data.result;
      } else {
        console.warn("Registro no exitoso:", data.text);
        return false;
      }
    } catch (err) {
      console.error("Error en el registro:", err);
      return false;
    }
  };

  const SendEmail = async (destinatario) => {
    let asunto = "Recuperacion de contraseña";
    try {
      const data = await AxiosClient.post("/api/email/send-email", { destinatario, asunto });
      console.log(data)
      return data;
    } catch (error) {
      console.err("error: ", error)
    }
  }

  const changePassword = async (email,NewPassword) => {
    try{
      const data = await AxiosClient.post("/api/email/change-password", { email, NewPassword });
      console.log(data)
      return data;
    } catch (error) {
      console.error("Error: ", error )
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, Register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider")
  }
  return context
}
