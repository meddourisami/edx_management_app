"use client"

import { useState } from "react"
import { Bell, Mail, Smartphone, Monitor } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  inAppNotifications: boolean
  paymentReminders: boolean
  courseUpdates: boolean
  trainingReminders: boolean
  certificateAlerts: boolean
  adminAlerts: boolean
}

export function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    inAppNotifications: true,
    paymentReminders: true,
    courseUpdates: true,
    trainingReminders: true,
    certificateAlerts: true,
    adminAlerts: false,
  })

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const saveSettings = () => {
    // In real app, save to backend
    console.log("Saving notification settings:", settings)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
        <CardDescription>Manage how you receive notifications about your subscriptions and training</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Delivery Methods */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Delivery Methods</h4>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
              </div>
            </div>
            <Switch
              id="push-notifications"
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Monitor className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label htmlFor="in-app-notifications">In-App Notifications</Label>
                <p className="text-sm text-muted-foreground">Show notifications within the app</p>
              </div>
            </div>
            <Switch
              id="in-app-notifications"
              checked={settings.inAppNotifications}
              onCheckedChange={(checked) => updateSetting("inAppNotifications", checked)}
            />
          </div>
        </div>

        <Separator />

        {/* Notification Types */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Notification Types</h4>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="payment-reminders">Payment Reminders</Label>
              <p className="text-sm text-muted-foreground">Get notified about upcoming payments</p>
            </div>
            <Switch
              id="payment-reminders"
              checked={settings.paymentReminders}
              onCheckedChange={(checked) => updateSetting("paymentReminders", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="course-updates">Course Updates</Label>
              <p className="text-sm text-muted-foreground">Updates about your course progress and new content</p>
            </div>
            <Switch
              id="course-updates"
              checked={settings.courseUpdates}
              onCheckedChange={(checked) => updateSetting("courseUpdates", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="training-reminders">Training Reminders</Label>
              <p className="text-sm text-muted-foreground">Reminders about upcoming training sessions</p>
            </div>
            <Switch
              id="training-reminders"
              checked={settings.trainingReminders}
              onCheckedChange={(checked) => updateSetting("trainingReminders", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="certificate-alerts">Certificate Alerts</Label>
              <p className="text-sm text-muted-foreground">Notifications when certificates are ready</p>
            </div>
            <Switch
              id="certificate-alerts"
              checked={settings.certificateAlerts}
              onCheckedChange={(checked) => updateSetting("certificateAlerts", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="admin-alerts">Admin Alerts</Label>
              <p className="text-sm text-muted-foreground">System-wide announcements and updates</p>
            </div>
            <Switch
              id="admin-alerts"
              checked={settings.adminAlerts}
              onCheckedChange={(checked) => updateSetting("adminAlerts", checked)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={saveSettings}>Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  )
}
