"use client"

// IMPORTANT: Always import AuthContext using the alias path ("@/components/auth-provider") to avoid context mismatch errors.
import { useContext } from "react"
import { AuthContext } from "@/components/auth-provider"

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
