"use client"

import { useState } from "react"
import { MoreHorizontal, Edit, Trash2, Eye, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PaymentDetailsDialog } from "./payment-details-dialog"

interface SubscriptionsTableProps {
  subscriptions: any[]
}

export function SubscriptionsTable({ subscriptions }: SubscriptionsTableProps) {
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null)
  const [showPaymentDetails, setShowPaymentDetails] = useState(false)

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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "default"
      case "partial":
        return "secondary"
      case "pending":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const handleViewPayment = (subscription: any) => {
    setSelectedSubscription(subscription)
    setShowPaymentDetails(true)
  }

  return (
    <>
      <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">Subscriptions Management</CardTitle>
          <CardDescription>Manage all user subscriptions across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-background/50 backdrop-blur-sm">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50">
                  <TableHead className="font-semibold">User</TableHead>
                  <TableHead className="font-semibold">Platform</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Batch N°/Date</TableHead>
                  <TableHead className="font-semibold">Validity Until</TableHead>
                  <TableHead className="font-semibold">Payment</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((subscription, index) => (
                  <TableRow
                    key={subscription.id}
                    className="hover:bg-muted/30 transition-colors duration-200 animate-in fade-in-0 duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell className="font-medium">{subscription.userName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="hover:scale-105 transition-transform duration-200">
                        {subscription.platform}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusColor(subscription.status)}
                        className="hover:scale-105 transition-transform duration-200"
                      >
                        {subscription.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-sm">Batch #{subscription.batchNumber}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(subscription.batchDate).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(subscription.nextPayment).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={getPaymentStatusColor(subscription.payment?.status || "pending")}
                          className="hover:scale-105 transition-transform duration-200"
                        >
                          {subscription.payment?.status || "pending"}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewPayment(subscription)}
                          className="h-7 px-2 hover:bg-primary/10"
                        >
                          <DollarSign className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:scale-110 transition-transform duration-200"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="hover:bg-muted/50 transition-colors duration-200">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleViewPayment(subscription)}
                            className="hover:bg-muted/50 transition-colors duration-200"
                          >
                            <DollarSign className="mr-2 h-4 w-4" />
                            Payment Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-muted/50 transition-colors duration-200">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive hover:bg-destructive/10 transition-colors duration-200">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <PaymentDetailsDialog
        open={showPaymentDetails}
        onOpenChange={setShowPaymentDetails}
        subscription={selectedSubscription}
      />
    </>
  )
}
