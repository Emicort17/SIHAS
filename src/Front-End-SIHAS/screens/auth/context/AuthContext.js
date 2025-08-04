"use client"

import React, { createContext, useContext, useState } from "react"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const isLoading = false

  const login = async (email, password) => {
    try {
      const response = await fetch("http://192.168.0.12:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error("Credeciales incorrectas")
      }

      const data = await response.json();
      setUser({
        token: data.jwt,
        userId: data.userId,
        username: data.username,
        rol: data.rol
      })
      console.log(data)
      return data;
    } catch (err) {
      console.error("Error en el login: ", err)
    }
    return false
  }

  const logout = () => {
    setUser(null)
  }

  const Register = async (name, surname, lastname, email, password, status, isProfessional) => {
    try {
      const rol = isProfessional ? "PROFESIONAL" : "USUARIO";

      const response = await fetch("http://192.168.0.12:8080/api/usuario/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, surname, lastname, email, password, status, rol })
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
