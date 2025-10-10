"use client"

export interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const userData = localStorage.getItem("user")
  return userData ? JSON.parse(userData) : null
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user")
    window.location.href = "/"
  }
}

export function requireAuth(requiredRole?: "admin") {
  if (typeof window === "undefined") {
    // On server side, return null but don't redirect
    return null
  }

  const user = getCurrentUser()

  if (!user) {
    window.location.href = "/"
    return null
  }

  if (requiredRole && user.role !== requiredRole) {
    window.location.href = "/dashboard"
    return null
  }

  return user
}
