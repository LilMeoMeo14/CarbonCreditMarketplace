"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Header } from "@/components/admin/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Users, Search, Eye, Trash2, Loader2, UserCheck, UserX, ShieldCheck, Mail, Phone, User } from "lucide-react"
import { adminApi, type AdminUser } from "@/lib/api/admin"
import { toast } from "sonner"

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([])
    const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [roleFilter, setRoleFilter] = useState<string>("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")

    // Dialog state
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
    const [detailDialogOpen, setDetailDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    const fetchUsers = async () => {
        try {
            const response = await adminApi.getUsers()
            setUsers(response.result || [])
            setFilteredUsers(response.result || [])
        } catch (error) {
            console.error("Failed to fetch users:", error)
            toast.error("Không thể tải danh sách người dùng")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    useEffect(() => {
        let filtered = users

        // Filter by role
        if (roleFilter !== "all") {
            filtered = filtered.filter((u) => u.role === roleFilter)
        }

        // Filter by status
        if (statusFilter !== "all") {
            filtered = filtered.filter((u) => u.status === statusFilter)
        }

        // Filter by search query (email)
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(
                (u) =>
                    u.email?.toLowerCase().includes(query) ||
                    u.firstName?.toLowerCase().includes(query) ||
                    u.lastName?.toLowerCase().includes(query) ||
                    u.phoneNumber?.includes(query),
            )
        }

        setFilteredUsers(filtered)
        setCurrentPage(1)
    }, [users, searchQuery, roleFilter, statusFilter])

    const handleDeleteUser = async () => {
        if (!selectedUser) return

        setIsDeleting(true)
        try {
            await adminApi.deleteUser(selectedUser.userId)
            toast.success(`Đã xóa người dùng ${selectedUser.email}`)
            setDeleteDialogOpen(false)
            setSelectedUser(null)
            fetchUsers()
        } catch (error) {
            console.error("Failed to delete user:", error)
            toast.error("Không thể xóa người dùng")
        } finally {
            setIsDeleting(false)
        }
    }

    const getRoleBadge = (role: string) => {
        const roleConfig: Record<string, { label: string; className: string }> = {
            EV_OWNER: { label: "Chủ xe điện", className: "bg-info/10 text-info border-info/30" },
            BUYER: { label: "Người mua", className: "bg-warning/10 text-warning border-warning/30" },
            CVA: { label: "Kiểm định viên", className: "bg-primary/10 text-primary border-primary/30" },
            ADMIN: { label: "Quản trị viên", className: "bg-destructive/10 text-destructive border-destructive/30" },
        }
        const config = roleConfig[role] || { label: role, className: "" }
        return (
            <Badge variant="outline" className={config.className}>
                {config.label}
            </Badge>
        )
    }

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
            ACTIVE: {
                label: "Hoạt động",
                className: "bg-success/10 text-success border-success/30",
                icon: <UserCheck className="h-3 w-3 mr-1" />,
            },
            INACTIVE: {
                label: "Không hoạt động",
                className: "bg-muted/10 text-muted-foreground border-muted/30",
                icon: <UserX className="h-3 w-3 mr-1" />,
            },
            BANNED: {
                label: "Bị khóa",
                className: "bg-destructive/10 text-destructive border-destructive/30",
                icon: <UserX className="h-3 w-3 mr-1" />,
            },
        }
        const config = statusConfig[status] || { label: status, className: "", icon: null }
        return (
            <Badge variant="outline" className={config.className}>
                {config.icon}
                {config.label}
            </Badge>
        )
    }

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const stats = {
        total: users.length,
        active: users.filter((u) => u.status === "ACTIVE").length,
        evOwners: users.filter((u) => u.role === "EV_OWNER").length,
        buyers: users.filter((u) => u.role === "BUYER").length,
    }

    return (
        <div className="min-h-screen">
            <Header title="Quản lý User" description="Xem và quản lý danh sách người dùng" />

            <div className="p-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-card/50 border-border/50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <Users className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Tổng người dùng</p>
                                    <p className="text-xl font-bold">{stats.total}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-border/50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-success/10">
                                    <UserCheck className="h-5 w-5 text-success" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Đang hoạt động</p>
                                    <p className="text-xl font-bold">{stats.active}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-border/50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-info/10">
                                    <User className="h-5 w-5 text-info" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Chủ xe điện</p>
                                    <p className="text-xl font-bold">{stats.evOwners}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 border-border/50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-warning/10">
                                    <User className="h-5 w-5 text-warning" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Người mua</p>
                                    <p className="text-xl font-bold">{stats.buyers}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="bg-card/50 border-border/50">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm theo Email, Tên, SĐT..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder="Vai trò" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả vai trò</SelectItem>
                                    <SelectItem value="EV_OWNER">Chủ xe điện</SelectItem>
                                    <SelectItem value="BUYER">Người mua</SelectItem>
                                    <SelectItem value="CVA">Kiểm định viên</SelectItem>
                                    <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder="Trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                    <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                                    <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                                    <SelectItem value="BANNED">Bị khóa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Danh sách người dùng</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Hiển thị {paginatedUsers.length} / {filteredUsers.length} người dùng
                        </p>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="text-center py-8">
                                <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                                <p className="text-muted-foreground">Không tìm thấy người dùng nào</p>
                            </div>
                        ) : (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Người dùng</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>SĐT</TableHead>
                                            <TableHead>Vai trò</TableHead>
                                            <TableHead>Trạng thái</TableHead>
                                            <TableHead className="text-right">Thao tác</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedUsers.map((user) => (
                                            <TableRow key={user.userId}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <User className="h-4 w-4 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">
                                                                {user.firstName} {user.lastName}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">ID: {user.userId}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>{user.phoneNumber || "-"}</TableCell>
                                                <TableCell>{getRoleBadge(user.role)}</TableCell>
                                                <TableCell>{getStatusBadge(user.status)}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedUser(user)
                                                                setDetailDialogOpen(true)
                                                            }}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() => {
                                                                setSelectedUser(user)
                                                                setDeleteDialogOpen(true)
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            Trước
                                        </Button>
                                        <span className="text-sm text-muted-foreground">
                                            Trang {currentPage} / {totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                        >
                                            Sau
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* User Detail Dialog */}
            <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Chi tiết người dùng</DialogTitle>
                        <DialogDescription>Thông tin chi tiết về người dùng</DialogDescription>
                    </DialogHeader>

                    {selectedUser && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="h-8 w-8 text-primary" />
                                </div>
                                <div>
                                    <p className="text-lg font-semibold">
                                        {selectedUser.firstName} {selectedUser.lastName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">ID: {selectedUser.userId}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <div className="p-3 rounded-lg bg-secondary/30 flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <p className="font-medium">{selectedUser.email}</p>
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg bg-secondary/30 flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Số điện thoại</p>
                                        <p className="font-medium">{selectedUser.phoneNumber || "Chưa cập nhật"}</p>
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg bg-secondary/30 flex items-center gap-3">
                                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Vai trò</p>
                                        <div className="mt-1">{getRoleBadge(selectedUser.role)}</div>
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg bg-secondary/30 flex items-center gap-3">
                                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Trạng thái</p>
                                        <div className="mt-1">{getStatusBadge(selectedUser.status)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDetailDialogOpen(false)}>
                            Đóng
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa người dùng</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa người dùng <strong>{selectedUser?.email}</strong>? Hành động này không thể hoàn
                            tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteUser}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
