import { Calendar, User, BookOpen, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

interface TrainingCardProps {
  training: {
    id: string
    program: string
    provider: string
    status: string
    startDate: string
    endDate: string
    progress: number
    instructor: string
  }
}

export function TrainingCard({ training }: TrainingCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "in-progress":
        return "secondary"
      case "upcoming":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "in-progress":
        return <BookOpen className="h-4 w-4" />
      case "upcoming":
        return <Calendar className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline">{training.provider}</Badge>
          <Badge variant={getStatusColor(training.status)} className="flex items-center gap-1">
            {getStatusIcon(training.status)}
            {training.status}
          </Badge>
        </div>
        <CardTitle className="text-lg">{training.program}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {training.status !== "upcoming" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{training.progress}%</span>
            </div>
            <Progress value={training.progress} className="h-2" />
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(training.startDate).toLocaleDateString()} - {new Date(training.endDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Instructor: {training.instructor}</span>
          </div>
        </div>

        <div className="flex gap-2">
          {training.status === "in-progress" && (
            <Button size="sm" className="flex-1">
              <BookOpen className="h-4 w-4 mr-2" />
              Continue
            </Button>
          )}
          {training.status === "completed" && (
            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
              View Certificate
            </Button>
          )}
          {training.status === "upcoming" && (
            <Button variant="outline" size="sm" className="flex-1 bg-transparent">
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
