"use client"

import { useEffect, useState } from "react"
import { requireAuth } from "@/lib/auth"
import { Header } from "@/components/layout/header"
import { UsersTable } from "@/components/admin/users-table"
import { SubscriptionsTable } from "@/components/admin/subscriptions-table"
import { TrainingTable } from "@/components/admin/training-table"
import { AdminStats } from "@/components/admin/admin-stats"
import { AddSubscriptionDialog } from "@/components/admin/add-subscription-dialog"
import { AddTrainingDialog } from "@/components/admin/add-training-dialog"
import { AddUserDialog } from "@/components/admin/add-user-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, BookOpen, GraduationCap, Users } from "lucide-react"

// Mock data for admin view
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@protectedconsulting.com",
    role: "user",
    status: "active",
    joinDate: "2023-06-15",
    lastLogin: "2024-01-20",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@protectedconsulting.com",
    role: "user",
    status: "active",
    joinDate: "2023-08-22",
    lastLogin: "2024-01-19",
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@protectedconsulting.com",
    role: "user",
    status: "inactive",
    joinDate: "2023-04-10",
    lastLogin: "2023-12-15",
  },
]

const mockAllSubscriptions = [
  {
    id: "1",
    userId: "1",
    userName: "John Doe",
    platform: "EdX",
    courseName: "CS50: Introduction to Computer Science",
    status: "active",
    nextPayment: "2024-02-15",
    amount: "$99",
    batchNumber: "2024-01",
    batchDate: "2024-01-15",
    payment: {
      status: "partial",
      totalAmount: 299,
      paymentType: "Credit Card",
      plan: "3 Monthly Installments",
      installments: [
        {
          amount: 100,
          dueDate: "2024-01-15",
          paidDate: "2024-01-14",
          status: "paid",
        },
        {
          amount: 100,
          dueDate: "2024-02-15",
          paidDate: "2024-02-14",
          status: "paid",
        },
        {
          amount: 99,
          dueDate: "2024-03-15",
          status: "pending",
        },
      ],
      proofs: [
        {
          name: "Payment Receipt - Jan 2024",
          url: "/payment-receipt-january.jpg",
          uploadDate: "2024-01-14",
        },
        {
          name: "Payment Receipt - Feb 2024",
          url: "/payment-receipt-february.jpg",
          uploadDate: "2024-02-14",
        },
      ],
    },
  },
  {
    id: "2",
    userId: "1",
    userName: "John Doe",
    platform: "EdX",
    courseName: "Machine Learning Fundamentals",
    status: "active",
    nextPayment: "2024-03-01",
    amount: "$149",
    batchNumber: "2024-02",
    batchDate: "2024-02-01",
    payment: {
      status: "paid",
      totalAmount: 149,
      paymentType: "Bank Transfer",
      plan: "One-time Payment",
      installments: [
        {
          amount: 149,
          dueDate: "2024-01-01",
          paidDate: "2024-01-02",
          status: "paid",
        },
      ],
      proofs: [
        {
          name: "Bank Transfer Receipt",
          url: "/bank-transfer-receipt.png",
          uploadDate: "2024-01-02",
        },
      ],
    },
  },
  {
    id: "3",
    userId: "2",
    userName: "Jane Smith",
    platform: "EdX",
    courseName: "Data Science Professional Certificate",
    status: "expired",
    nextPayment: "2024-01-10",
    amount: "$199",
    batchNumber: "2023-12",
    batchDate: "2023-12-10",
    payment: {
      status: "pending",
      totalAmount: 199,
      paymentType: "Credit Card",
      plan: "Monthly Payment",
      installments: [
        {
          amount: 199,
          dueDate: "2024-01-10",
          status: "overdue",
        },
      ],
      proofs: [],
    },
  },
  {
    id: "4",
    userId: "3",
    userName: "Mike Johnson",
    platform: "EdX",
    courseName: "Web Development Bootcamp",
    status: "active",
    nextPayment: "2024-02-28",
    amount: "$299",
    batchNumber: "2024-01",
    batchDate: "2024-01-01",
    payment: {
      status: "partial",
      totalAmount: 599,
      paymentType: "PayPal",
      plan: "6 Monthly Installments",
      installments: [
        {
          amount: 100,
          dueDate: "2024-01-01",
          paidDate: "2024-01-01",
          status: "paid",
        },
        {
          amount: 100,
          dueDate: "2024-02-01",
          status: "pending",
        },
        {
          amount: 100,
          dueDate: "2024-03-01",
          status: "pending",
        },
        {
          amount: 100,
          dueDate: "2024-04-01",
          status: "pending",
        },
        {
          amount: 100,
          dueDate: "2024-05-01",
          status: "pending",
        },
        {
          amount: 99,
          dueDate: "2024-06-01",
          status: "pending",
        },
      ],
      proofs: [
        {
          name: "PayPal Receipt - January",
          url: "/generic-online-payment-receipt.png",
          uploadDate: "2024-01-01",
        },
      ],
    },
  },
]

const mockAllTraining = [
  {
    id: "1",
    userId: "1",
    userName: "John Doe",
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
    userId: "2",
    userName: "Jane Smith",
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
    userId: "1",
    userName: "John Doe",
    program: "Agile Project Management",
    provider: "Protected Consulting",
    status: "upcoming",
    startDate: "2024-03-01",
    endDate: "2024-05-30",
    progress: 0,
    instructor: "Sami Sahraoui",
  },
]

export default function AdminPage() {
  const [user, setUser] = useState(null)
  const [showAddSubscription, setShowAddSubscription] = useState(false)
  const [showAddTraining, setShowAddTraining] = useState(false)
  const [showAddUser, setShowAddUser] = useState(false)

  useEffect(() => {
    const currentUser = requireAuth("admin")
    if (currentUser) {
      setUser(currentUser)
    }
  }, [])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header title="Admin Dashboard" />

      <main className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between animate-in fade-in-0 duration-500">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Admin Dashboard
            </h2>
            <p className="text-muted-foreground">Manage all users, subscriptions, and training programs</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="hover:scale-105 transition-transform duration-200 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button
              onClick={() => setShowAddUser(true)}
              className="hover:scale-105 transition-transform duration-200 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            >
              <Users className="h-4 w-4 mr-2" />
              Add User
            </Button>
            <Button
              onClick={() => setShowAddSubscription(true)}
              className="hover:scale-105 transition-transform duration-200 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Add Subscription
            </Button>
            <Button
              onClick={() => setShowAddTraining(true)}
              className="hover:scale-105 transition-transform duration-200 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              Add Training
            </Button>
          </div>
        </div>

        <div className="animate-in slide-in-from-bottom-4 duration-700 delay-100">
          <AdminStats users={mockUsers} subscriptions={mockAllSubscriptions} training={mockAllTraining} />
        </div>

        <div className="animate-in slide-in-from-bottom-4 duration-700 delay-200">
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50 backdrop-blur-sm">
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
              >
                Users
              </TabsTrigger>
              <TabsTrigger
                value="subscriptions"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
              >
                All Subscriptions
              </TabsTrigger>
              <TabsTrigger
                value="training"
                className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
              >
                All Training
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="animate-in fade-in-0 duration-300">
              <UsersTable users={mockUsers} />
            </TabsContent>

            <TabsContent value="subscriptions" className="animate-in fade-in-0 duration-300">
              <SubscriptionsTable subscriptions={mockAllSubscriptions} />
            </TabsContent>

            <TabsContent value="training" className="animate-in fade-in-0 duration-300">
              <TrainingTable training={mockAllTraining} />
            </TabsContent>
          </Tabs>
        </div>

        <AddUserDialog open={showAddUser} onOpenChange={setShowAddUser} />
        <AddSubscriptionDialog open={showAddSubscription} onOpenChange={setShowAddSubscription} users={mockUsers} />
        <AddTrainingDialog open={showAddTraining} onOpenChange={setShowAddTraining} users={mockUsers} />
      </main>
    </div>
  )
}
