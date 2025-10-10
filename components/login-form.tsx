"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    console.log("[v0] Login attempt with email:", email)

    // Mock authentication - in real app, this would call your auth API
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock user data based on email
      const isAdmin = email === "admin@protectedconsulting.com"
      const userData = {
        id: "1",
        email,
        name: isAdmin ? "Admin User" : "John Doe",
        role: isAdmin ? "admin" : "user",
      }

      console.log("[v0] User data created:", userData)

      // Store user data in localStorage (in real app, use proper auth tokens)
      localStorage.setItem("user", JSON.stringify(userData))
      console.log("[v0] User data stored in localStorage")

      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name}!`,
      })

      // Redirect based on role
      const redirectPath = isAdmin ? "/admin" : "/dashboard"
      console.log("[v0] Redirecting to:", redirectPath)
      router.push(redirectPath)
    } catch (err) {
      console.log("[v0] Login error:", err)
      setError("Invalid credentials. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>

      <div className="text-sm text-muted-foreground text-center">
        <p>Demo accounts:</p>
        <p>User: user@protectedconsulting.com</p>
        <p>Admin: admin@protectedconsulting.com</p>
        <p>Password: any password</p>
      </div>
    </form>
  )
}
