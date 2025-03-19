"use client"

import { createContext, useState, useEffect } from "react"
import api from "../utils/api"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem("token"))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`
          const res = await api.get("/api/users/me")
          setUser(res.data)
        } catch (error) {
          localStorage.removeItem("token")
          setToken(null)
        }
      }
      setLoading(false)
    }

    loadUser()
  }, [token])

  const register = async (userData) => {
    try {
      const res = await api.post("/api/users/register", userData)
      localStorage.setItem("token", res.data.token)
      setToken(res.data.token)
      setUser(res.data.user)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Registration failed",
      }
    }
  }

  const login = async (userData) => {
    try {
      const res = await api.post("/api/users/login", userData)
      localStorage.setItem("token", res.data.token)
      setToken(res.data.token)
      setUser(res.data.user)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
      }
    }
  }

  const logout = async () => {
    try {
      await api.post("/api/users/logout")
    } catch (error) {
      console.error("Logout error:", error)
    }

    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
    delete api.defaults.headers.common["Authorization"]
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        register,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

