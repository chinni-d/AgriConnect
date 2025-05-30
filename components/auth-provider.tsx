"use client"

// IMPORTANT: Always import AuthContext using the alias path ("@/components/auth-provider") everywhere.
import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type User = {
  id: string
  name: string
  email: string
  role: "seller" | "buyer" | "admin"
} | null

type AuthStatus = "loading" | "authenticated" | "unauthenticated"

type AuthContextType = {
  user: User
  status: AuthStatus
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, role: "seller" | "buyer") => Promise<boolean>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [status, setStatus] = useState<AuthStatus>("loading")

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("agriconnect-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setStatus("authenticated")
    } else {
      setStatus("unauthenticated")
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // Real login: check Supabase for user with matching email
      const { supabase } = await import("@/lib/supabaseClient");
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      console.log("LOGIN DEBUG:", { email, password, user, error });

      if (error || !user) {
        // User not found
        return false;
      }

      if (user.password !== password) {
        // Password does not match
        return false;
      }

      // Remove password before storing
      const { password: _pw, ...userWithoutPassword } = user;
      setUser(userWithoutPassword);
      localStorage.setItem("agriconnect-user", JSON.stringify(userWithoutPassword));
      setStatus("authenticated");
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  }

  const register = async (name: string, email: string, password: string, role: "seller" | "buyer") => {
    try {
      // Call the API route to register the user in Supabase
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Registration failed")
      }

      const { user: registeredUser } = await res.json()
      // Remove password before storing in localStorage
      const { password: _pw, ...userWithoutPassword } = registeredUser
      setUser(userWithoutPassword)
      localStorage.setItem("agriconnect-user", JSON.stringify(userWithoutPassword))
      setStatus("authenticated")
      return true
    } catch (error) {
      console.error("Registration failed:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("agriconnect-user")
    setStatus("unauthenticated")
  }

  return <AuthContext.Provider value={{ user, status, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
