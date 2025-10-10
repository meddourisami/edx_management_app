"use client"

import { useEffect, useState } from "react"
import { requireAuth } from "@/lib/auth"
import { Header } from "@/components/layout/header"
import { SubscriptionCard } from "@/components/dashboard/subscription-card"
import { TrainingCard } from "@/components/dashboard/training-card"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data - in real app, this would come from your API
const mockSubscriptions = [
  {
    id: "1",
    platform: "EdX",
    courseName: "CS50: Introduction to Computer Science",
    status: "active",
    nextPayment: "2024-02-15",
    amount: "$99",
    progress: 75,
  },
  {
    id: "2",
    platform: "EdX",
    courseName: "Machine Learning Fundamentals",
    status: "active",
    nextPayment: "2024-03-01",
    amount: "$149",
    progress: 45,
  },
  {
    id: "3",
    platform: "EdX",
    courseName: "Data Science Professional Certificate",
    status: "expired",
    nextPayment: "2024-01-10",
    amount: "$199",
    progress: 30,
  },
]

const mockTraining = [
  {
    id: "1",
    program: "PMP Certification",
    provider: "Protected Consulting",
    status: "in-progress",
    startDate: "2024-01-15",
    endDate: "2024-04-15",
    progress: 60,
    instructor: "Sami Sahraoui",
  },
  {
    id: "2",
    program: "MBA Essentials",
    provider: "Protected Consulting",
    status: "completed",
    startDate: "2023-09-01",
    endDate: "2023-12-15",
    progress: 100,
    instructor: "Sami Sahraoui",
  },
  {
    id: "3",
    program: "Agile Project Management",
    provider: "Protected Consulting",
    status: "upcoming",
    startDate: "2024-03-01",
    endDate: "2024-05-30",
    progress: 0,
    instructor: "Sami Sahraoui",
  },
]

export default function DashboardPage() {
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

  const activeSubscriptions = mockSubscriptions.filter((sub) => sub.status === "active")
  const inProgressTraining = mockTraining.filter((training) => training.status === "in-progress")

  return (
    <div className="min-h-screen bg-background">
      <Header title="Dashboard" />

      <main className="container mx-auto p-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Welcome back, {user.name}!</h2>
            <p className="text-muted-foreground">Here's your subscription and training overview</p>
          </div>
          <div className="flex gap-4">
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{activeSubscriptions.length}</div>
                <div className="text-sm text-muted-foreground">Active Subscriptions</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{inProgressTraining.length}</div>
                <div className="text-sm text-muted-foreground">Ongoing Training</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Alerts Panel */}
        <AlertsPanel />

        {/* Main Content Tabs */}
        <Tabs defaultValue="subscriptions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="subscriptions">EdX Subscriptions</TabsTrigger>
            <TabsTrigger value="training">Training Programs</TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockSubscriptions.map((subscription) => (
                <SubscriptionCard key={subscription.id} subscription={subscription} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="training" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockTraining.map((training) => (
                <TrainingCard key={training.id} training={training} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
