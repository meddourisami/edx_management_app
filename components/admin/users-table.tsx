"use client"

import { useState } from "react"
import { MoreHorizontal, Edit, Trash2, Mail, Calendar, Eye } from "lucide-react"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { UserDetailsDialog } from "./user-details"
import { EditUserDialog } from "./edit-user-dialog"
import { DeleteConfirmationDialog } from "./delete-confirmation"

interface UsersTableProps {
  users: any[]
}

export function UsersTable({ users }: UsersTableProps) {
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const getStatusColor = (status: string) => {
    return status === "active" ? "default" : "secondary"
  }

  const getRoleColor = (role: string) => {
    return role === "admin" ? "default" : "outline"
  }

  const handleViewDetails = (user: any) => {
    setSelectedUser(user)
    setShowDetails(true)
  }

  const handleEdit = (user: any) => {
    setSelectedUser(user)
    setShowEdit(true)
  }

  const handleDelete = (user: any) => {
    setSelectedUser(user)
    setShowDelete(true)
  }

  const handleSaveEdit = (updatedUser: any) => {
    console.log("[v0] Saving user:", updatedUser)
    // Here you would typically update the user in your backend
  }

  const handleConfirmDelete = () => {
    console.log("[v0] Deleting user:", selectedUser)
    // Here you would typically delete the user from your backend
    setShowDelete(false)
  }

  return (
    <>
      <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">Users Management</CardTitle>
          <CardDescription>Manage all users in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-background/50 backdrop-blur-sm">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50">
                  <TableHead className="font-semibold">User</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Role</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Join Date</TableHead>
                  <TableHead className="font-semibold">Last Login</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow
                    key={user.id}
                    className="hover:bg-muted/30 transition-colors duration-200 animate-in fade-in-0 duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs font-medium">
                            {user.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getRoleColor(user.role)}
                        className="hover:scale-105 transition-transform duration-200"
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusColor(user.status)}
                        className="hover:scale-105 transition-transform duration-200"
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{new Date(user.joinDate).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{new Date(user.lastLogin).toLocaleDateString()}</span>
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
                            onClick={() => handleViewDetails(user)}
                            className="hover:bg-muted/50 transition-colors duration-200"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEdit(user)}
                            className="hover:bg-muted/50 transition-colors duration-200"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(user)}
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

      <UserDetailsDialog open={showDetails} onOpenChange={setShowDetails} user={selectedUser} />
      <EditUserDialog open={showEdit} onOpenChange={setShowEdit} user={selectedUser} onSave={handleSaveEdit} />
      <DeleteConfirmationDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        title="Delete User"
        description={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
