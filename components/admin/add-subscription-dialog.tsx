"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2, Plus, Trash2, Upload } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface AddSubscriptionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  users: any[]
}

interface Installment {
  id: string
  amount: string
  dueDate: Date | undefined
  status: "pending" | "paid"
}

export function AddSubscriptionDialog({ open, onOpenChange, users }: AddSubscriptionDialogProps) {
  const [loading, setLoading] = useState(false)
  const [validityDate, setValidityDate] = useState<Date>()
  const [batchDate, setBatchDate] = useState<Date>()
  const [paymentType, setPaymentType] = useState("credit-card")
  const [paymentProof, setPaymentProof] = useState<File | null>(null)
  const [installments, setInstallments] = useState<Installment[]>([
    { id: "1", amount: "", dueDate: undefined, status: "pending" },
  ])
  const [formData, setFormData] = useState({
    userId: "",
    platform: "EdX",
    courseName: "",
    batchNumber: "",
    totalAmount: "",
    status: "active",
  })

  const addInstallment = () => {
    setInstallments([...installments, { id: Date.now().toString(), amount: "", dueDate: undefined, status: "pending" }])
  }

  const removeInstallment = (id: string) => {
    if (installments.length > 1) {
      setInstallments(installments.filter((inst) => inst.id !== id))
    }
  }

  const updateInstallment = (id: string, field: keyof Installment, value: any) => {
    setInstallments(installments.map((inst) => (inst.id === id ? { ...inst, [field]: value } : inst)))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("New subscription:", {
      ...formData,
      validityUntil: validityDate,
      batchDate,
      paymentType,
      paymentProof: paymentProof?.name,
      installments,
    })
    setLoading(false)
    onOpenChange(false)

    // Reset form
    setFormData({
      userId: "",
      platform: "EdX",
      courseName: "",
      batchNumber: "",
      totalAmount: "",
      status: "active",
    })
    setValidityDate(undefined)
    setBatchDate(undefined)
    setPaymentType("credit-card")
    setPaymentProof(null)
    setInstallments([{ id: "1", amount: "", dueDate: undefined, status: "pending" }])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Subscription</DialogTitle>
          <DialogDescription>Create a new EdX subscription with payment configuration.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user">User</Label>
              <Select value={formData.userId} onValueChange={(value) => setFormData({ ...formData, userId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select
                value={formData.platform}
                onValueChange={(value) => setFormData({ ...formData, platform: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EdX">EdX</SelectItem>
                  <SelectItem value="Coursera">Coursera</SelectItem>
                  <SelectItem value="Udemy">Udemy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="courseName">Course Name</Label>
            <Input
              id="courseName"
              value={formData.courseName}
              onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
              placeholder="Enter course name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="batchNumber">Batch Number</Label>
              <Input
                id="batchNumber"
                value={formData.batchNumber}
                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                placeholder="e.g., 2024-01"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Batch Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !batchDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {batchDate ? format(batchDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={batchDate} onSelect={setBatchDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Total Amount</Label>
              <Input
                id="totalAmount"
                value={formData.totalAmount}
                onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                placeholder="$299"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Validity Until</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !validityDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {validityDate ? format(validityDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={validityDate} onSelect={setValidityDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Card className="border-2 border-dashed">
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-semibold text-sm">Payment Configuration</h3>

              <div className="space-y-2">
                <Label htmlFor="paymentType">Payment Type</Label>
                <Select value={paymentType} onValueChange={setPaymentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit-card">Credit Card</SelectItem>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentProof">Payment Proof (Optional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="paymentProof"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  <Button type="button" size="icon" variant="outline">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                {paymentProof && <p className="text-xs text-muted-foreground">Selected: {paymentProof.name}</p>}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Payment Installments</Label>
                  <Button type="button" size="sm" variant="outline" onClick={addInstallment}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add Installment
                  </Button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {installments.map((installment, index) => (
                    <div key={installment.id} className="flex items-center gap-2 p-3 border rounded-lg bg-muted/30">
                      <span className="text-sm font-medium min-w-[80px]">Part {index + 1}</span>
                      <Input
                        placeholder="Amount"
                        value={installment.amount}
                        onChange={(e) => updateInstallment(installment.id, "amount", e.target.value)}
                        className="flex-1"
                      />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className={cn(!installment.dueDate && "text-muted-foreground")}
                          >
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {installment.dueDate ? format(installment.dueDate, "MMM dd") : "Due date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={installment.dueDate}
                            onSelect={(date) => updateInstallment(installment.id, "dueDate", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {installments.length > 1 && (
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => removeInstallment(installment.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Subscription
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
