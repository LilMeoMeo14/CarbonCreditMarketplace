"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/cva/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileCheck, Loader2, Eye, Leaf, Calendar } from "lucide-react"
import { cvaApi, type PendingCreditRequest } from "@/lib/api/cva"
import { toast } from "sonner"
import Link from "next/link"

export default function CVACreditsPage() {
    const [requests, setRequests] = useState<PendingCreditRequest[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const response = await cvaApi.getPendingRequests()
            setRequests(response.result)
        } catch (error) {
            console.error("Failed to fetch requests:", error)
            toast.error("Không thể tải danh sách yêu cầu")
        } finally {
            setIsLoading(false)
        }
    }

    const totalCO2 = requests.reduce((sum, r) => sum + r.co2AmountKg, 0)
    const totalCredits = requests.reduce((sum, r) => sum + r.creditAmount, 0)

    return (
        <div className="min-h-screen">
            <Header title="Duyệt tín chỉ" description="Xem xét và xác minh yêu cầu phát hành tín chỉ carbon" />

            <div className="p-6 space-y-6">
                {/* Stats */}
                <div className="flex items-center gap-4">
                    <StatBadge label="Tổng chờ duyệt" value={requests.length} color="warning" />
                    <StatBadge label="Tổng CO₂" value={totalCO2} unit="kg" color="info" />
                    <StatBadge label="Tổng tín chỉ" value={totalCredits} color="primary" />
                </div>

                {/* Requests List */}
                <Card className="bg-card/50 border-border/50">
                    <CardHeader>
                        <CardTitle>Danh sách yêu cầu chờ duyệt</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-10">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        ) : requests.length === 0 ? (
                            <div className="text-center py-10">
                                <FileCheck className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                                <p className="text-muted-foreground">Không có yêu cầu nào chờ duyệt</p>
                                <p className="text-sm text-muted-foreground">Tất cả yêu cầu đã được xử lý</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {requests.map((request) => (
                                    <div
                                        key={request.requestId}
                                        className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                                    >
                                        <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center">
                                            <FileCheck className="h-6 w-6 text-info" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-medium">Yêu cầu #{request.requestId}</p>
                                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
                                                    Chờ duyệt
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span className="font-medium">{request.licensePlate}</span>
                                                <span className="flex items-center gap-1">
                                                    <Leaf className="h-3 w-3" />
                                                    {request.co2AmountKg} kg CO₂
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(request.requestDate).toLocaleDateString("vi-VN")}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right mr-4">
                                            <p className="font-bold text-primary text-lg">{request.creditAmount}</p>
                                            <p className="text-xs text-muted-foreground">tín chỉ</p>
                                        </div>
                                        <Link href={`/cva/credits/${request.requestId}`}>
                                            <Button variant="outline" size="sm" className="border-border/50 bg-transparent">
                                                <Eye className="h-4 w-4 mr-2" />
                                                Xem chi tiết
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function StatBadge({ label, value, unit, color }: { label: string; value: number; unit?: string; color?: string }) {
    const colorClass = color ? `text-${color}` : "text-foreground"

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50">
            <span className="text-sm text-muted-foreground">{label}:</span>
            <span className={`font-semibold ${colorClass}`}>
                {value.toLocaleString()}
                {unit && <span className="text-xs ml-1">{unit}</span>}
            </span>
        </div>
    )
}
