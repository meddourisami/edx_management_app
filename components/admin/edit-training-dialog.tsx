"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon, Loader2, Plus, Trash2, Download, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface Installment {
    id: string
    amount: string
    dueDate: Date | undefined
    status: "pending" | "paid"
    proof?: File | string | null
}

interface EditTrainingDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    training: any
    onSave: (training: any) => void
}

export function EditTrainingDialog({ open, onOpenChange, training, onSave }: EditTrainingDialogProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        program: "",
        provider: "",
        instructor: "",
        status: "",
        startDate: "",
        endDate: "",
        totalAmount: "",
    })
    const [startDate, setStartDate] = useState<Date>()
    const [endDate, setEndDate] = useState<Date>()
    const [paymentType, setPaymentType] = useState("credit-card")
    const [installments, setInstallments] = useState<Installment[]>([
        { id: "1", amount: "", dueDate: undefined, status: "pending", proof: null },
    ])

    useEffect(() => {
        if (training) {
            setFormData({
                program: training.program || "",
                provider: training.provider || "",
                instructor: training.instructor || "",
                status: training.status || "",
                startDate: training.startDate ? new Date(training.startDate).toISOString().split("T")[0] : "",
                endDate: training.endDate ? new Date(training.endDate).toISOString().split("T")[0] : "",
                totalAmount: training.payment?.total || "",
            })

            if (training.startDate) {
                setStartDate(new Date(training.startDate))
            }
            if (training.endDate) {
                setEndDate(new Date(training.endDate))
            }
            if (training.payment) {
                setPaymentType(training.payment.type || "credit-card")
                if (training.payment.installments && training.payment.installments.length > 0) {
                    setInstallments(
                        training.payment.installments.map((inst: any) => ({
                            id: inst.id || Date.now().toString(),
                            amount: inst.amount || "",
                            dueDate: inst.dueDate ? new Date(inst.dueDate) : undefined,
                            status: inst.status || "pending",
                            proof: inst.proof || null,
                        })),
                    )
                }
            }
        }
    }, [training])

    const addInstallment = () => {
        setInstallments([
            ...installments,
            { id: Date.now().toString(), amount: "", dueDate: undefined, status: "pending", proof: null },
        ])
    }

    const removeInstallment = (id: string) => {
        if (installments.length > 1) {
            setInstallments(installments.filter((inst) => inst.id !== id))
        }
    }

    const updateInstallment = (id: string, field: keyof Installment, value: any) => {
        setInstallments(installments.map((inst) => (inst.id === id ? { ...inst, [field]: value } : inst)))
    }

    const handleInstallmentFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            updateInstallment(id, "proof", e.target.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        await new Promise((resolve) => setTimeout(resolve, 1000))

        onSave({
            ...training,
            ...formData,
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString(),
            payment: {
                total: formData.totalAmount,
                type: paymentType,
                installments: installments.map((inst) => ({
                    ...inst,
                    dueDate: inst.dueDate?.toISOString(),
                    proof: inst.proof instanceof File ? inst.proof.name : inst.proof,
                })),
            },
        })

        setLoading(false)
        onOpenChange(false)
    }

    if (!training) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Training</DialogTitle>
                    <DialogDescription>Update training program information and payment details</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="program">Program Name</Label>
                            <Input
                                id="program"
                                value={formData.program}
                                onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="provider">Provider</Label>
                            <Input
                                id="provider"
                                value={formData.provider}
                                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="instructor">Instructor</Label>
                        <Input
                            id="instructor"
                            value={formData.instructor}
                            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="upcoming">Upcoming</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="totalAmount">Total Amount</Label>
                            <Input
                                id="totalAmount"
                                value={formData.totalAmount}
                                onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                                placeholder="$1,500"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label>End Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {endDate ? format(endDate, "PPP") : "Pick a date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
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

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label>Payment Installments</Label>
                                    <Button type="button" size="sm" variant="outline" onClick={addInstallment}>
                                        <Plus className="h-3 w-3 mr-1" />
                                        Add Installment
                                    </Button>
                                </div>

                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                    {installments.map((installment, index) => (
                                        <Card key={installment.id} className="p-4 bg-muted/30">
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-semibold">Installment {index + 1}</span>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant={installment.status === "paid" ? "default" : "secondary"}>
                                                            {installment.status === "paid" ? (
                                                                <>
                                                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                    Paid
                                                                </>
                                                            ) : (
                                                                "Pending"
                                                            )}
                                                        </Badge>
                                                        {installments.length > 1 && (
                                                            <Button
                                                                type="button"
                                                                size="icon"
                                                                variant="ghost"
                                                                onClick={() => removeInstallment(installment.id)}
                                                                className="h-7 w-7 text-destructive hover:text-destructive"
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="space-y-1">
                                                        <Label className="text-xs">Amount</Label>
                                                        <Input
                                                            placeholder="$500"
                                                            value={installment.amount}
                                                            onChange={(e) => updateInstallment(installment.id, "amount", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label className="text-xs">Due Date</Label>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className={cn(
                                                                        "w-full justify-start text-left font-normal",
                                                                        !installment.dueDate && "text-muted-foreground",
                                                                    )}
                                                                >
                                                                    <CalendarIcon className="h-3 w-3 mr-1" />
                                                                    {installment.dueDate ? format(installment.dueDate, "MMM dd, yyyy") : "Select date"}
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
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <Label className="text-xs">Payment Status</Label>
                                                    <Select
                                                        value={installment.status}
                                                        onValueChange={(value: "pending" | "paid") =>
                                                            updateInstallment(installment.id, "status", value)
                                                        }
                                                    >
                                                        <SelectTrigger className="h-9">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="pending">Pending</SelectItem>
                                                            <SelectItem value="paid">Paid</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-1">
                                                    <Label className="text-xs">Payment Proof</Label>
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            type="file"
                                                            accept="image/*,.pdf"
                                                            onChange={(e) => handleInstallmentFileChange(installment.id, e)}
                                                            className="cursor-pointer text-xs h-9"
                                                        />
                                                        {installment.proof && (
                                                            <Button type="button" size="icon" variant="outline" className="h-9 w-9 bg-transparent">
                                                                <Download className="h-3 w-3" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                    {installment.proof && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {installment.proof instanceof File ? installment.proof.name : "Existing proof attached"}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
