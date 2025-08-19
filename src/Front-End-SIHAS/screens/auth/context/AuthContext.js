import React, { createContext, useContext, useState, useEffect, useRef } from "react"
import { AxiosClient } from "./http_client"
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const fetchedUserData = useRef(false)
  const isLoading = false

  const login = async (email, password) => {
    try {
      const data = await AxiosClient.post("/api/login", { email, password });

      const userInfo = {
        token: data.jwt,
        userId: data.userId,
        username: data.username,
        rol: data.rol,
        status: data.status,
      };

      setUser(userInfo);

      await AsyncStorage.setItem("userData", JSON.stringify(userInfo));

      console.log("Login exitoso:", data);
      return data;
    } catch (err) {
      console.error("Error en el login:", err);
      return false;
    }
  };


  const logout = () => {
    setUser(null)
    setUserData(null)
    fetchedUserData.current = false
  }

  const Register = async (name, surname, lastname, email, password, status, isProfessional) => {
    try {
      const rol = isProfessional ? "PROFESIONAL" : "USUARIO"

      const response = await AxiosClient.post("/api/usuario/register", {
        name,
        surname,
        lastname,
        email,
        password,
        status,
        rol
      })

      const data = response.data

      if (data.type === "SUCCESS") {
        console.log("Registro exitoso:", data.result)
        return data.result
      } else {
        console.warn("Registro no exitoso:", data.text)
        return false
      }
    } catch (err) {
      console.error("Error en el registro:", err)
      return false
    }
  }

  const getUserById = async () => {
    if (!user?.userId) return null
console.log("id:",user?.userId)
    try {
      const  data  = await AxiosClient.get(`/api/usuario/${user.userId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      })

      setUserData(data?.result)
      console.log("Usuario obtenido:",data?.result)
      return data
    } catch (err) {
      console.error("Error al obtener usuario por ID:", err)
      return null
    }
  }

  useEffect(() => {
    if (user && !fetchedUserData.current) {
      fetchedUserData.current = true
      getUserById()
    }
  }, [user])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, Register, getUserById, userData }}>
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
