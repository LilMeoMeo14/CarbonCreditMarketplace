"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
    LayoutDashboard,
    Car,
    FileCheck,
    FileSpreadsheet,
    LogOut,
    ChevronLeft,
    ChevronRight,
    User,
    Shield,
    Leaf,
} from "lucide-react"
import { useState, useEffect } from "react"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { authApi, type User as UserType } from "@/lib/api/auth"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const menuItems = [
    { href: "/cva/dashboard", label: "Tổng quan", icon: LayoutDashboard },
    { href: "/cva/vehicles", label: "Duyệt xe", icon: Car },
    { href: "/cva/credits", label: "Duyệt tín chỉ", icon: FileCheck },
    { href: "/cva/savings", label: "Duyệt CO₂ Saving", icon: Leaf },
    { href: "/cva/reports", label: "Báo cáo", icon: FileSpreadsheet },
]

export function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [collapsed, setCollapsed] = useState(false)
    const [user, setUser] = useState<UserType | null>(null)

    useEffect(() => {
        const currentUser = authApi.getCurrentUser()
        setUser(currentUser)
    }, [])

    const handleLogout = async () => {
        try {
            await authApi.logout()
            toast.success("Đăng xuất thành công!")
            router.push("/login")
        } catch (error) {
            console.error("Logout error:", error)
            toast.error("Có lỗi xảy ra khi đăng xuất")
            router.push("/login")
        }
    }

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 h-screen bg-card border-r border-border/50 transition-all duration-300 z-40 flex flex-col",
                collapsed ? "w-20" : "w-64",
            )}
        >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
                {!collapsed && <Logo size="sm" />}
                {collapsed && <Logo size="sm" showText={false} />}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                    {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
            </div>

            {/* Role Badge */}
            {!collapsed && (
                <div className="px-4 py-3 border-b border-border/50">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary">
                        <Shield className="h-4 w-4" />
                        <span className="text-sm font-medium">CVA - Kiểm định viên</span>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                    return (
                        <Link key={item.href} href={item.href}>
                            <div
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                                )}
                            >
                                <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-primary")} />
                                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                            </div>
                        </Link>
                    )
                })}
            </nav>

            {/* User section */}
            <div className="p-4 border-t border-border/50">
                {!collapsed ? (
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-2 rounded-xl bg-secondary/50">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Đăng xuất
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-5 w-5" />
                    </Button>
                )}
            </div>
        </aside>
    )
}
