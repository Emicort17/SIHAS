"use client"

import React, { createContext, useContext, useState } from "react"

// Datos de usuarios simulados (estáticos)
const MOCK_USERS = [
  {
    id: "1",
    email: "alejandro@gmail.com",
    password: "Alejandro123",
    role: "user",
    name: "Alejandro Oliva Quiroz",
  },
  {
    id: "2",
    email: "doctor@sihas.com",
    password: "Doctor123",
    role: "medic",
    name: "Dr. García",
  },
]

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const isLoading = false 

  const login = async (email, password) => {
    const foundUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    )

    if (foundUser) {
      setUser({
        id: foundUser.id,
        email: foundUser.email,
        role: foundUser.role,
        name: foundUser.name,
      })
      return foundUser;
    }

    return false
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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
