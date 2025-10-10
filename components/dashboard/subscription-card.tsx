import { Calendar, DollarSign, BookOpen, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

interface SubscriptionCardProps {
  subscription: {
    id: string
    platform: string
    courseName: string
    status: string
    nextPayment: string
    amount: string
    progress: number
  }
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "expired":
        return "destructive"
      case "pending":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const isExpiringSoon = () => {
    const paymentDate = new Date(subscription.nextPayment)
    const today = new Date()
    const daysUntilPayment = Math.ceil((paymentDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
    return daysUntilPayment <= 7 && daysUntilPayment > 0
  }

  return (
    <Card className="relative">
      {isExpiringSoon() && (
        <div className="absolute top-2 right-2">
          <AlertCircle className="h-4 w-4 text-orange-500" />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline">{subscription.platform}</Badge>
          <Badge variant={getStatusColor(subscription.status)}>{subscription.status}</Badge>
        </div>
        <CardTitle className="text-lg">{subscription.courseName}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span>{subscription.progress}%</span>
          </div>
          <Progress value={subscription.progress} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Next Payment: {new Date(subscription.nextPayment).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>{subscription.amount}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <BookOpen className="h-4 w-4 mr-2" />
            View Course
          </Button>
          {subscription.status === "active" && (
            <Button variant="ghost" size="sm">
              Manage
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
