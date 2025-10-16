"use client"

import { useState } from "react"
import { MoreHorizontal, Edit, Trash2, Eye, DollarSign, Search, X, ArrowUpDown } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TrainingTableProps {
  training: any[]
}

export function TrainingTable({ training }: TrainingTableProps) {
  const [selectedTraining, setSelectedTraining] = useState<any>(null)
  const [showPaymentDetails, setShowPaymentDetails] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string | null>("all")
  const [filterPayment, setFilterPayment] = useState<string | null>("all")
  const [sortBy, setSortBy] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

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

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
    setCurrentPage(1)
  }

  const filteredTraining = training.filter((prog) => {
    const matchesSearch =
      prog.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prog.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prog.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || prog.status === filterStatus
    const matchesPayment = filterPayment === "all" || prog.payment?.status === filterPayment
    return matchesSearch && matchesStatus && matchesPayment
  })

  const sortedTraining = [...filteredTraining].sort((a, b) => {
    if (!sortBy) return 0
    let aValue = a[sortBy]
    let bValue = b[sortBy]

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(sortedTraining.length / itemsPerPage)
  const paginatedTraining = sortedTraining.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <>
      <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">Training Programs Management</CardTitle>
          <CardDescription>Manage all training programs and enrollments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1 space-y-2">
              <Label className="text-sm font-medium">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by program, provider, or instructor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select value={filterStatus || "all"} onValueChange={(value) => setFilterStatus(value)}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Payment</Label>
              <Select value={filterPayment || "all"} onValueChange={(value) => setFilterPayment(value)}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="All Payments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(searchTerm || filterStatus !== "all" || filterPayment !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm("")
                  setFilterStatus("all")
                  setFilterPayment("all")
                }}
                className="hover:bg-muted/50"
              >
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>

          <div className="rounded-lg border bg-background/50 backdrop-blur-sm">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50">
                  <TableHead
                    className="font-semibold cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("program")}
                  >
                    <div className="flex items-center gap-2">
                      Program
                      {sortBy === "program" && <ArrowUpDown className="h-4 w-4" />}
                    </div>
                  </TableHead>
                  <TableHead
                    className="font-semibold cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("provider")}
                  >
                    <div className="flex items-center gap-2">
                      Provider
                      {sortBy === "provider" && <ArrowUpDown className="h-4 w-4" />}
                    </div>
                  </TableHead>
                  <TableHead
                    className="font-semibold cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      {sortBy === "status" && <ArrowUpDown className="h-4 w-4" />}
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">Payment</TableHead>
                  <TableHead
                    className="font-semibold cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("startDate")}
                  >
                    <div className="flex items-center gap-2">
                      Start Date
                      {sortBy === "startDate" && <ArrowUpDown className="h-4 w-4" />}
                    </div>
                  </TableHead>
                  <TableHead
                    className="font-semibold cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("endDate")}
                  >
                    <div className="flex items-center gap-2">
                      End Date
                      {sortBy === "endDate" && <ArrowUpDown className="h-4 w-4" />}
                    </div>
                  </TableHead>
                  <TableHead
                    className="font-semibold cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("instructor")}
                  >
                    <div className="flex items-center gap-2">
                      Instructor
                      {sortBy === "instructor" && <ArrowUpDown className="h-4 w-4" />}
                    </div>
                  </TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTraining.length > 0 ? (
                  paginatedTraining.map((program, index) => (
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No training programs found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, sortedTraining.length)} of {sortedTraining.length} training
                programs
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
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
