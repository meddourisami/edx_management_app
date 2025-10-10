"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { CreditCard, Calendar, CheckCircle2, Clock, ImageIcon, Download } from "lucide-react"

interface PaymentDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subscription: any
}

export function PaymentDetailsDialog({ open, onOpenChange, subscription }: PaymentDetailsDialogProps) {
  if (!subscription) return null

  const paymentData = subscription.payment || {}
  const installments = paymentData.installments || []
  const totalPaid = installments
    .filter((i: any) => i.status === "paid")
    .reduce((sum: number, i: any) => sum + i.amount, 0)
  const totalAmount = paymentData.totalAmount || 0
  const paymentProgress = totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "default"
      case "pending":
        return "secondary"
      case "overdue":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Payment Details</DialogTitle>
          <DialogDescription>Complete payment information for {subscription.userName}'s subscription</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Overview */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">Payment Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold">${totalAmount}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Amount Paid</p>
                  <p className="text-2xl font-bold text-green-600">${totalPaid}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Payment Progress</span>
                  <span className="font-medium">{paymentProgress.toFixed(0)}%</span>
                </div>
                <Progress value={paymentProgress} className="h-3" />
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Payment Type</p>
                    <p className="font-medium">{paymentData.paymentType || "Credit Card"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Payment Plan</p>
                    <p className="font-medium">{paymentData.plan || "Monthly Installments"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Installments */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">Payment Installments</CardTitle>
              <CardDescription>Track individual payment installments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {installments.map((installment: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                        {installment.status === "paid" ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">Installment {index + 1}</p>
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(installment.dueDate).toLocaleDateString()}
                        </p>
                        {installment.paidDate && (
                          <p className="text-sm text-green-600">
                            Paid: {new Date(installment.paidDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-bold">${installment.amount}</p>
                        <Badge variant={getPaymentStatusColor(installment.status)} className="mt-1">
                          {installment.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Proofs */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">Payment Proofs</CardTitle>
              <CardDescription>Uploaded payment receipts and proofs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {paymentData.proofs && paymentData.proofs.length > 0 ? (
                  paymentData.proofs.map((proof: any, index: number) => (
                    <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video bg-muted relative group">
                        <img
                          src={proof.url || "/placeholder.svg?height=200&width=300&query=payment receipt"}
                          alt={`Payment proof ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button size="sm" variant="secondary">
                            <ImageIcon className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button size="sm" variant="secondary">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <p className="text-sm font-medium">{proof.name || `Receipt ${index + 1}`}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(proof.uploadDate).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8 text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No payment proofs uploaded yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
