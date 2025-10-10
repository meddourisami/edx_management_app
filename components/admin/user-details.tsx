"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, Calendar, Shield, Activity } from "lucide-react"

interface UserDetailsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user: any
}

export function UserDetailsDialog({ open, onOpenChange, user }: UserDetailsDialogProps) {
    if (!user) return null

    const getStatusColor = (status: string) => {
        return status === "active" ? "default" : "secondary"
    }

    const getRoleColor = (role: string) => {
        return role === "admin" ? "default" : "outline"
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">User Details</DialogTitle>
                    <DialogDescription>Complete information about the user</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* User Profile Section */}
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                        <Avatar className="h-16 w-16">
                            <AvatarFallback className="text-lg font-semibold">
                                {user.name
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold">{user.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{user.email}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Badge variant={getRoleColor(user.role)}>{user.role}</Badge>
                            <Badge variant={getStatusColor(user.status)}>{user.status}</Badge>
                        </div>
                    </div>

                    <Separator />

                    {/* Account Information */}
                    <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Account Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">User ID</p>
                                <p className="font-medium">{user.id}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Role</p>
                                <p className="font-medium capitalize">{user.role}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Status</p>
                                <p className="font-medium capitalize">{user.status}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Join Date</p>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <p className="font-medium">{new Date(user.joinDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Activity Information */}
                    <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Activity
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Last Login</p>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <p className="font-medium">{new Date(user.lastLogin).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Account Age</p>
                                <p className="font-medium">
                                    {Math.floor((Date.now() - new Date(user.joinDate).getTime()) / (1000 * 60 * 60 * 24))} days
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
