"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, CreditCard, GraduationCap, User } from "lucide-react"

interface TrainingDetailsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    training: any
}

export function TrainingDetailsDialog({ open, onOpenChange, training }: TrainingDetailsDialogProps) {
    if (!training) return null

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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Training Details</DialogTitle>
                    <DialogDescription>Complete information about the training program</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Training Header */}
                    <div className="flex items-start justify-between p-4 rounded-lg bg-muted/50">
                        <div className="space-y-1">
                            <h3 className="text-xl font-semibold">{training.program}</h3>
                            <div className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{training.provider}</span>
                            </div>
                        </div>
                        <Badge variant={getStatusColor(training.status)} className="text-sm">
                            {training.status}
                        </Badge>
                    </div>

                    <Separator />

                    {/* Training Information */}
                    <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            Training Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Training ID</p>
                                <p className="font-medium">{training.id}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Program</p>
                                <p className="font-medium">{training.program}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Provider</p>
                                <p className="font-medium">{training.provider}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Instructor</p>
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <p className="font-medium">{training.instructor}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Start Date</p>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <p className="font-medium">{new Date(training.startDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">End Date</p>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <p className="font-medium">{new Date(training.endDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Status</p>
                                <p className="font-medium capitalize">{training.status}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Duration</p>
                                <p className="font-medium">
                                    {Math.ceil(
                                        (new Date(training.endDate).getTime() - new Date(training.startDate).getTime()) /
                                        (1000 * 60 * 60 * 24),
                                    )}{" "}
                                    days
                                </p>
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
                                <Badge variant={training.payment?.status === "paid" ? "default" : "secondary"}>
                                    {training.payment?.status || "pending"}
                                </Badge>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Total Amount</p>
                                <p className="font-medium">${training.payment?.totalAmount || 0}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Amount Paid</p>
                                <p className="font-medium">${training.payment?.paidAmount || 0}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Payment Type</p>
                                <p className="font-medium">{training.payment?.type || "N/A"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
