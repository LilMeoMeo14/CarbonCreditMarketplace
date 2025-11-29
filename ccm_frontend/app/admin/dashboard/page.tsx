"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/admin/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Wallet,
    Users,
    ArrowUpCircle,
    ArrowDownCircle,
    Clock,
    CheckCircle2,
    DollarSign,
    UserCheck,
    ShieldCheck,
} from "lucide-react"
import { adminApi, type PendingTransaction, type AdminUser } from "@/lib/api/admin"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function AdminDashboardPage() {
    const [transactions, setTransactions] = useState<PendingTransaction[]>([])
    const [users, setUsers] = useState<AdminUser[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [transRes, usersRes] = await Promise.all([adminApi.getPendingTransactions(), adminApi.getUsers()])
                setTransactions(transRes.result || [])
                setUsers(usersRes.result || [])
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    // Calculate statistics
    const pendingDeposits = transactions.filter((t) => t.type === "DEPOSIT")
    const pendingWithdraws = transactions.filter((t) => t.type === "WITHDRAW")
    const totalPendingAmount = transactions.reduce((sum, t) => sum + t.amount, 0)

    const activeUsers = users.filter((u) => u.status === "ACTIVE")
    const usersByRole = {
        EV_OWNER: users.filter((u) => u.role === "EV_OWNER").length,
        BUYER: users.filter((u) => u.role === "BUYER").length,
        CVA: users.filter((u) => u.role === "CVA").length,
        ADMIN: users.filter((u) => u.role === "ADMIN").length,
    }

    const stats = [
        {
            title: "Giao dịch chờ duyệt",
            value: transactions.length,
            icon: Clock,
            color: "text-warning",
            bgColor: "bg-warning/10",
            href: "/admin/transactions",
        },
        {
            title: "Nạp tiền chờ duyệt",
            value: pendingDeposits.length,
            icon: ArrowUpCircle,
            color: "text-success",
            bgColor: "bg-success/10",
            href: "/admin/transactions",
        },
        {
            title: "Rút tiền chờ duyệt",
            value: pendingWithdraws.length,
            icon: ArrowDownCircle,
            color: "text-destructive",
            bgColor: "bg-destructive/10",
            href: "/admin/transactions",
        },
        {
            title: "Tổng số tiền chờ xử lý",
            value: totalPendingAmount.toLocaleString(),
            unit: "VNĐ",
            icon: DollarSign,
            color: "text-primary",
            bgColor: "bg-primary/10",
        },
    ]

    const userStats = [
        {
            title: "Tổng người dùng",
            value: users.length,
            icon: Users,
            color: "text-primary",
            bgColor: "bg-primary/10",
            href: "/admin/users",
        },
        {
            title: "Đang hoạt động",
            value: activeUsers.length,
            icon: UserCheck,
            color: "text-success",
            bgColor: "bg-success/10",
        },
        {
            title: "Chủ xe điện",
            value: usersByRole.EV_OWNER,
            icon: Users,
            color: "text-info",
            bgColor: "bg-info/10",
        },
        {
            title: "Người mua",
            value: usersByRole.BUYER,
            icon: Users,
            color: "text-warning",
            bgColor: "bg-warning/10",
        },
    ]

    return (
        <div className="min-h-screen">
            <Header title="Tổng quan Admin" description="Quản trị hệ thống và duyệt giao dịch" />

            <div className="p-6 space-y-6">
                {/* Financial Stats */}
                <div>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-primary" />
                        Thống kê tài chính
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, index) => (
                            <Card key={index} className="bg-card/50 border-border/50 hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                        </div>
                                        {stat.href && (
                                            <Link href={stat.href} className="text-xs text-primary hover:underline">
                                                Xem →
                                            </Link>
                                        )}
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                                        <p className="text-2xl font-bold mt-1">
                                            {isLoading ? "..." : stat.value}{" "}
                                            {stat.unit && <span className="text-sm font-normal text-muted-foreground">{stat.unit}</span>}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* User Stats */}
                <div>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Thống kê người dùng
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {userStats.map((stat, index) => (
                            <Card key={index} className="bg-card/50 border-border/50 hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                        </div>
                                        {stat.href && (
                                            <Link href={stat.href} className="text-xs text-primary hover:underline">
                                                Xem →
                                            </Link>
                                        )}
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                                        <p className="text-2xl font-bold mt-1">{isLoading ? "..." : stat.value}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Quick Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Pending Transactions */}
                    <Card className="bg-card/50 border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Wallet className="h-5 w-5 text-warning" />
                                Giao dịch chờ duyệt gần đây
                            </CardTitle>
                            <Link href="/admin/transactions" className="text-sm text-primary hover:underline">
                                Xem tất cả
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <p className="text-muted-foreground">Đang tải...</p>
                            ) : transactions.length === 0 ? (
                                <div className="text-center py-8">
                                    <CheckCircle2 className="h-12 w-12 mx-auto text-success/50 mb-3" />
                                    <p className="text-muted-foreground">Không có giao dịch nào chờ duyệt</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {transactions.slice(0, 5).map((tx) => (
                                        <div key={tx.transactionId} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30">
                                            <div
                                                className={`h-10 w-10 rounded-lg flex items-center justify-center ${tx.type === "DEPOSIT" ? "bg-success/10" : "bg-destructive/10"
                                                    }`}
                                            >
                                                {tx.type === "DEPOSIT" ? (
                                                    <ArrowUpCircle className="h-5 w-5 text-success" />
                                                ) : (
                                                    <ArrowDownCircle className="h-5 w-5 text-destructive" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">
                                                    {tx.type === "DEPOSIT" ? "Nạp tiền" : "Rút tiền"} #{tx.transactionId}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Ví #{tx.walletId} • {tx.description || "Không có mô tả"}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-bold ${tx.type === "DEPOSIT" ? "text-success" : "text-destructive"}`}>
                                                    {tx.type === "DEPOSIT" ? "+" : "-"}
                                                    {tx.amount.toLocaleString()} VNĐ
                                                </p>
                                                <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    Chờ duyệt
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* User Overview by Role */}
                    <Card className="bg-card/50 border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                Phân bố người dùng
                            </CardTitle>
                            <Link href="/admin/users" className="text-sm text-primary hover:underline">
                                Xem tất cả
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <p className="text-muted-foreground">Đang tải...</p>
                            ) : (
                                <div className="space-y-4">
                                    {/* Role Distribution */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
                                                    <Users className="h-5 w-5 text-info" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Chủ xe điện (EV_OWNER)</p>
                                                    <p className="text-sm text-muted-foreground">Người sở hữu xe điện</p>
                                                </div>
                                            </div>
                                            <p className="text-xl font-bold">{usersByRole.EV_OWNER}</p>
                                        </div>

                                        <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                                                    <Users className="h-5 w-5 text-warning" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Người mua (BUYER)</p>
                                                    <p className="text-sm text-muted-foreground">Người mua tín chỉ carbon</p>
                                                </div>
                                            </div>
                                            <p className="text-xl font-bold">{usersByRole.BUYER}</p>
                                        </div>

                                        <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Kiểm định viên (CVA)</p>
                                                    <p className="text-sm text-muted-foreground">Xác minh và phát hành tín chỉ</p>
                                                </div>
                                            </div>
                                            <p className="text-xl font-bold">{usersByRole.CVA}</p>
                                        </div>

                                        <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                                                    <ShieldCheck className="h-5 w-5 text-destructive" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Quản trị viên (ADMIN)</p>
                                                    <p className="text-sm text-muted-foreground">Quản trị hệ thống</p>
                                                </div>
                                            </div>
                                            <p className="text-xl font-bold">{usersByRole.ADMIN}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
