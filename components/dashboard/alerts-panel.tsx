import { AlertTriangle, Info, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function AlertsPanel() {
  const alerts = [
    {
      id: "1",
      type: "warning",
      title: "Payment Due Soon",
      message: "Your Machine Learning Fundamentals subscription payment is due in 5 days.",
      action: "Update Payment",
    },
    {
      id: "2",
      type: "info",
      title: "New Training Available",
      message: "Agile Project Management training starts March 1st. Enrollment is now open.",
      action: "View Details",
    },
    {
      id: "3",
      type: "success",
      title: "Certificate Ready",
      message: "Your MBA Essentials certificate is ready for download.",
      action: "Download",
    },
  ]

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "info":
        return <Info className="h-4 w-4" />
      case "success":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getAlertVariant = (type: string) => {
    switch (type) {
      case "warning":
        return "destructive"
      case "success":
        return "default"
      default:
        return "default"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Alerts & Notifications
        </CardTitle>
        <CardDescription>Important updates about your subscriptions and training</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <Alert key={alert.id} variant={getAlertVariant(alert.type)}>
            <div className="flex items-start justify-between">
              <div className="flex gap-2">
                {getAlertIcon(alert.type)}
                <div>
                  <div className="font-medium">{alert.title}</div>
                  <AlertDescription className="mt-1">{alert.message}</AlertDescription>
                </div>
              </div>
              <Button variant="outline" size="sm">
                {alert.action}
              </Button>
            </div>
          </Alert>
        ))}
      </CardContent>
    </Card>
  )
}
