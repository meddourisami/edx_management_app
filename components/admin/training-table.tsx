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
import { TrainingDetailsDialog } from "./training-details-dialog"
import { EditTrainingDialog } from "./edit-training-dialog"
import { DeleteConfirmationDialog } from "./delete-confirmation"

interface TrainingTableProps {
  training: any[]
}

export function TrainingTable({ training }: TrainingTableProps) {
  const [selectedTraining, setSelectedTraining] = useState<any>(null)
  const [showPaymentDetails, setShowPaymentDetails] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

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

  const handleViewPayment = (training: any) => {
    setSelectedTraining(training)
    setShowPaymentDetails(true)
  }

  const handleViewDetails = (training: any) => {
    setSelectedTraining(training)
    setShowDetails(true)
  }

  const handleEdit = (training: any) => {
    setSelectedTraining(training)
    setShowEdit(true)
  }

  const handleDelete = (training: any) => {
    setSelectedTraining(training)
    setShowDelete(true)
  }

  const handleSaveEdit = (updatedTraining: any) => {
    console.log("[v0] Saving training:", updatedTraining)
    // Here you would typically update the training in your backend
  }

  const handleConfirmDelete = () => {
    console.log("[v0] Deleting training:", selectedTraining)
    // Here you would typically delete the training from your backend
    setShowDelete(false)
  }

  return (
    <>
      <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">Training Programs Management</CardTitle>
          <CardDescription>Manage all training programs and enrollments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-background/50 backdrop-blur-sm">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50">
                  <TableHead className="font-semibold">Program</TableHead>
                  <TableHead className="font-semibold">Provider</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Payment</TableHead>
                  <TableHead className="font-semibold">Start Date</TableHead>
                  <TableHead className="font-semibold">End Date</TableHead>
                  <TableHead className="font-semibold">Instructor</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {training.map((program, index) => (
                  <TableRow
                    key={program.id}
                    className="hover:bg-muted/30 transition-colors duration-200 animate-in fade-in-0 duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell className="font-medium">{program.program}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="hover:scale-105 transition-transform duration-200">
                        {program.provider}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusColor(program.status)}
                        className="hover:scale-105 transition-transform duration-200"
                      >
                        {program.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={getPaymentStatusColor(program.payment?.status || "pending")}
                          className="hover:scale-105 transition-transform duration-200"
                        >
                          {program.payment?.status || "pending"}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewPayment(program)}
                          className="h-7 px-2 hover:bg-primary/10"
                        >
                          <DollarSign className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(program.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(program.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>{program.instructor}</TableCell>
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
                        <DropdownMenuContent align="end" className="animate-in fade-in-0 zoom-in-95 duration-200">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(program)}
                            className="hover:bg-muted/50 transition-colors duration-200"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleViewPayment(program)}
                            className="hover:bg-muted/50 transition-colors duration-200"
                          >
                            <DollarSign className="mr-2 h-4 w-4" />
                            Payment Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEdit(program)}
                            className="hover:bg-muted/50 transition-colors duration-200"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(program)}
                            className="text-destructive hover:bg-destructive/10 transition-colors duration-200"
                          >
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
        subscription={selectedTraining}
      />
      <TrainingDetailsDialog open={showDetails} onOpenChange={setShowDetails} training={selectedTraining} />
      <EditTrainingDialog
        open={showEdit}
        onOpenChange={setShowEdit}
        training={selectedTraining}
        onSave={handleSaveEdit}
      />
      <DeleteConfirmationDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        title="Delete Training Program"
        description={`Are you sure you want to delete the ${selectedTraining?.program} training program? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
