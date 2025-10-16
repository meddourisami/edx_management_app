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
import { SubscriptionDetailsDialog } from "./subscription-details-dialog"
import { EditSubscriptionDialog } from "./edit-subscription-dialog"
import { DeleteConfirmationDialog } from "./delete-confirmation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SubscriptionsTableProps {
  subscriptions: any[]
}

export function SubscriptionsTable({ subscriptions }: SubscriptionsTableProps) {
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null)
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

  const handleViewDetails = (subscription: any) => {
    setSelectedSubscription(subscription)
    setShowDetails(true)
  }

  const handleEdit = (subscription: any) => {
    setSelectedSubscription(subscription)
    setShowEdit(true)
  }

  const handleDelete = (subscription: any) => {
    setSelectedSubscription(subscription)
    setShowDelete(true)
  }

  const handleSaveEdit = (updatedSubscription: any) => {
    console.log("[v0] Saving subscription:", updatedSubscription)
    // Here you would typically update the subscription in your backend
  }

  const handleConfirmDelete = () => {
    console.log("[v0] Deleting subscription:", selectedSubscription)
    // Here you would typically delete the subscription from your backend
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

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch =
      sub.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.platform.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || sub.status === filterStatus
    const matchesPayment = filterPayment === "all" || sub.payment?.status === filterPayment
    return matchesSearch && matchesStatus && matchesPayment
  })

  const sortedSubscriptions = [...filteredSubscriptions].sort((a, b) => {
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

  const totalPages = Math.ceil(sortedSubscriptions.length / itemsPerPage)
  const paginatedSubscriptions = sortedSubscriptions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <>
      <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">Subscriptions Management</CardTitle>
          <CardDescription>Manage all user subscriptions across the platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1 space-y-2">
              <Label className="text-sm font-medium">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by user, course, or platform..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value)}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Payment</Label>
              <Select value={filterPayment} onValueChange={(value) => setFilterPayment(value)}>
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
                    onClick={() => handleSort("userName")}
                  >
                    <div className="flex items-center gap-2">
                      User
                      {sortBy === "userName" && <ArrowUpDown className="h-4 w-4" />}
                    </div>
                  </TableHead>
                  <TableHead
                    className="font-semibold cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("platform")}
                  >
                    <div className="flex items-center gap-2">
                      Platform
                      {sortBy === "platform" && <ArrowUpDown className="h-4 w-4" />}
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
                  <TableHead
                    className="font-semibold cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("batchNumber")}
                  >
                    <div className="flex items-center gap-2">
                      Batch N°/Date
                      {sortBy === "batchNumber" && <ArrowUpDown className="h-4 w-4" />}
                    </div>
                  </TableHead>
                  <TableHead
                    className="font-semibold cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("nextPayment")}
                  >
                    <div className="flex items-center gap-2">
                      Validity Until
                      {sortBy === "nextPayment" && <ArrowUpDown className="h-4 w-4" />}
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">Payment</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSubscriptions.length > 0 ? (
                  paginatedSubscriptions.map((subscription, index) => (
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
                          <DropdownMenuContent align="end" className="animate-in fade-in-0 zoom-in-95 duration-200">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleViewDetails(subscription)}
                              className="hover:bg-muted/50 transition-colors duration-200"
                            >
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
                            <DropdownMenuItem
                              onClick={() => handleEdit(subscription)}
                              className="hover:bg-muted/50 transition-colors duration-200"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(subscription)}
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
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No subscriptions found matching your filters
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
                {Math.min(currentPage * itemsPerPage, sortedSubscriptions.length)} of {sortedSubscriptions.length}{" "}
                subscriptions
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
        subscription={selectedSubscription}
      />
      <SubscriptionDetailsDialog open={showDetails} onOpenChange={setShowDetails} subscription={selectedSubscription} />
      <EditSubscriptionDialog
        open={showEdit}
        onOpenChange={setShowEdit}
        subscription={selectedSubscription}
        onSave={handleSaveEdit}
      />
      <DeleteConfirmationDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        title="Delete Subscription"
        description={`Are you sure you want to delete this subscription for ${selectedSubscription?.userName}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
