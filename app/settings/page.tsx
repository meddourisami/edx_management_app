"use client"

import { useEffect, useState } from "react"
import { requireAuth } from "@/lib/auth"
import { Header } from "@/components/layout/header"
import { NotificationSettings } from "@/components/notifications/notification-settings"

export default function SettingsPage() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const currentUser = requireAuth()
    if (currentUser) {
      setUser(currentUser)
    }
  }, [])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Settings" />

      <main className="container mx-auto p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Settings</h2>
          <p className="text-muted-foreground">Manage your account preferences and notifications</p>
        </div>

        <NotificationSettings />
      </main>
    </div>
  )
}
