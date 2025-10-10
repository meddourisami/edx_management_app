"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, CreditCard, Package, User } from "lucide-react"

interface SubscriptionDetailsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    subscription: any
}

export function SubscriptionDetailsDialog({ open, onOpenChange, subscription }: SubscriptionDetailsDialogProps) {
    if (!subscription) return null

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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Subscription Details</DialogTitle>
                    <DialogDescription>Complete information about the subscription</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Subscription Header */}
                    <div className="flex items-start justify-between p-4 rounded-lg bg-muted/50">
                        <div className="space-y-1">
                            <h3 className="text-xl font-semibold">{subscription.platform}</h3>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{subscription.userName}</span>
                            </div>
                        </div>
                        <Badge variant={getStatusColor(subscription.status)} className="text-sm">
                            {subscription.status}
                        </Badge>
                    </div>

                    <Separator />

                    {/* Subscription Information */}
                    <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Subscription Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Subscription ID</p>
                                <p className="font-medium">{subscription.id}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Platform</p>
                                <p className="font-medium">{subscription.platform}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Batch Number</p>
                                <p className="font-medium">#{subscription.batchNumber}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Batch Date</p>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <p className="font-medium">{new Date(subscription.batchDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Validity Until</p>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <p className="font-medium">{new Date(subscription.nextPayment).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Status</p>
                                <p className="font-medium capitalize">{subscription.status}</p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Payment Information */}
                    <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Payment Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Payment Status</p>
                                <Badge variant={subscription.payment?.status === "paid" ? "default" : "secondary"}>
                                    {subscription.payment?.status || "pending"}
                                </Badge>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Total Amount</p>
                                <p className="font-medium">${subscription.payment?.totalAmount || 0}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Amount Paid</p>
                                <p className="font-medium">${subscription.payment?.paidAmount || 0}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Payment Type</p>
                                <p className="font-medium">{subscription.payment?.type || "N/A"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
