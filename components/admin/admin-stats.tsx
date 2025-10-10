import { Users, BookOpen, GraduationCap, AlertTriangle, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AdminStatsProps {
  users: any[]
  subscriptions: any[]
  training: any[]
}

export function AdminStats({ users, subscriptions, training }: AdminStatsProps) {
  const activeUsers = users.filter((user) => user.status === "active").length
  const activeSubscriptions = subscriptions.filter((sub) => sub.status === "active").length
  const inProgressTraining = training.filter((t) => t.status === "in-progress").length
  const expiredSubscriptions = subscriptions.filter((sub) => sub.status === "expired").length

  const stats = [
    {
      title: "Total Users",
      value: users.length,
      subtitle: `${activeUsers} active users`,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      delay: "0ms",
    },
    {
      title: "Active Subscriptions",
      value: activeSubscriptions,
      subtitle: `${subscriptions.length} total subscriptions`,
      icon: BookOpen,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      delay: "100ms",
    },
    {
      title: "Ongoing Training",
      value: inProgressTraining,
      subtitle: `${training.length} total programs`,
      icon: GraduationCap,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      delay: "200ms",
    },
    {
      title: "Expired Subscriptions",
      value: expiredSubscriptions,
      subtitle: "Require attention",
      icon: AlertTriangle,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      delay: "300ms",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card
            key={stat.title}
            className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom-4 ${stat.bgColor} backdrop-blur-sm`}
            style={{ animationDelay: stat.delay }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {stat.subtitle}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
