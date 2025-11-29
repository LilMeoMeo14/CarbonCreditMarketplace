"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/cva/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, FileCheck, CheckCircle2, Clock, TrendingUp } from "lucide-react"
import { cvaApi, type PendingEVProfile, type PendingCreditRequest } from "@/lib/api/cva"
import Link from "next/link"

export default function CVADashboardPage() {
    const [pendingProfiles, setPendingProfiles] = useState<PendingEVProfile[]>([])
    const [pendingRequests, setPendingRequests] = useState<PendingCreditRequest[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profilesRes, requestsRes] = await Promise.all([cvaApi.getPendingProfiles(), cvaApi.getPendingRequests()])
                setPendingProfiles(profilesRes.result)
                setPendingRequests(requestsRes.result)
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    const stats = [
        {
            title: "Xe chờ duyệt",
            value: pendingProfiles.length,
            icon: Car,
            color: "text-warning",
            bgColor: "bg-warning/10",
            href: "/cva/vehicles",
        },
        {
            title: "Tín chỉ chờ duyệt",
            value: pendingRequests.length,
            icon: FileCheck,
            color: "text-info",
            bgColor: "bg-info/10",
            href: "/cva/credits",
        },
        {
            title: "Tổng CO₂ chờ xác minh",
            value: pendingRequests.reduce((sum, r) => sum + r.co2AmountKg, 0),
            unit: "kg",
            icon: TrendingUp,
            color: "text-primary",
            bgColor: "bg-primary/10",
        },
        {
            title: "Tổng tín chỉ chờ phát hành",
            value: pendingRequests.reduce((sum, r) => sum + r.creditAmount, 0),
            unit: "tín chỉ",
            icon: CheckCircle2,
            color: "text-success",
            bgColor: "bg-success/10",
        },
    ]

    return (
        <div className="min-h-screen">
            <Header title="Tổng quan CVA" description="Quản lý và xác minh hồ sơ xe & tín chỉ carbon" />

            <div className="p-6 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <Card key={index} className="bg-card/50 border-border/50">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                                    <p className="text-2xl font-bold mt-1">
                                        {isLoading ? "..." : stat.value.toLocaleString()}{" "}
                                        {stat.unit && <span className="text-sm font-normal text-muted-foreground">{stat.unit}</span>}
                                    </p>
                                </div>
                                {stat.href && (
                                    <Link href={stat.href} className="text-sm text-primary hover:underline mt-2 inline-block">
                                        Xem chi tiết →
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Quick Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Pending Vehicles */}
                    <Card className="bg-card/50 border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Xe chờ duyệt gần đây</CardTitle>
                            <Link href="/cva/vehicles" className="text-sm text-primary hover:underline">
                                Xem tất cả
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <p className="text-muted-foreground">Đang tải...</p>
                            ) : pendingProfiles.length === 0 ? (
                                <div className="text-center py-8">
                                    <Car className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                                    <p className="text-muted-foreground">Không có xe nào chờ duyệt</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {pendingProfiles.slice(0, 5).map((profile) => (
                                        <div key={profile.evProfileId} className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30">
                                            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                                                <Car className="h-5 w-5 text-warning" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{profile.vehicleModel}</p>
                                                <p className="text-sm text-muted-foreground">{profile.licensePlate}</p>
                                            </div>
                                            <div className="flex items-center gap-1 text-warning">
                                                <Clock className="h-4 w-4" />
                                                <span className="text-sm">Chờ duyệt</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Pending Credit Requests */}
                    <Card className="bg-card/50 border-border/50">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Yêu cầu tín chỉ chờ duyệt</CardTitle>
                            <Link href="/cva/credits" className="text-sm text-primary hover:underline">
                                Xem tất cả
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <p className="text-muted-foreground">Đang tải...</p>
                            ) : pendingRequests.length === 0 ? (
                                <div className="text-center py-8">
                                    <FileCheck className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                                    <p className="text-muted-foreground">Không có yêu cầu nào chờ duyệt</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {pendingRequests.slice(0, 5).map((request) => (
                                        <Link key={request.requestId} href={`/cva/credits/${request.requestId}`}>
                                            <div className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer">
                                                <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
                                                    <FileCheck className="h-5 w-5 text-info" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium">Yêu cầu #{request.requestId}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {request.licensePlate} • {request.co2AmountKg} kg CO₂
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-primary">{request.creditAmount} tín chỉ</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(request.requestDate).toLocaleDateString("vi-VN")}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
