"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/cva/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ArrowLeft, Loader2, CheckCircle2, XCircle, Leaf, Calendar, Car, Route, Calculator } from "lucide-react"
import { cvaApi, type PendingCreditRequest, type CreditSaving } from "@/lib/api/cva"
import { toast } from "sonner"
import Link from "next/link"

export default function CreditRequestDetailPage() {
    const params = useParams()
    const router = useRouter()
    const requestId = Number(params.id)

    const [request, setRequest] = useState<PendingCreditRequest | null>(null)
    const [savings, setSavings] = useState<CreditSaving[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isProcessing, setIsProcessing] = useState(false)
    const [confirmDialog, setConfirmDialog] = useState<"approve" | "reject" | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [requestsRes, savingsRes] = await Promise.all([
                    cvaApi.getPendingRequests(),
                    cvaApi.getRequestSavings(requestId),
                ])
                const foundRequest = requestsRes.result.find((r) => r.requestId === requestId)
                if (foundRequest) {
                    setRequest(foundRequest)
                }
                setSavings(savingsRes.result)
            } catch (error) {
                console.error("Failed to fetch data:", error)
                toast.error("Không thể tải thông tin yêu cầu")
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [requestId])

    const handleApprove = async () => {
        setIsProcessing(true)
        try {
            await cvaApi.approveRequest(requestId)
            toast.success("Đã duyệt yêu cầu tín chỉ!", {
                description: `Yêu cầu #${requestId} đã được phê duyệt và tín chỉ đã được cấp.`,
            })
            router.push("/cva/credits")
        } catch (error) {
            console.error("Failed to approve request:", error)
            toast.error("Không thể duyệt yêu cầu")
        } finally {
            setIsProcessing(false)
            setConfirmDialog(null)
        }
    }

    const handleReject = async () => {
        setIsProcessing(true)
        try {
            await cvaApi.rejectRequest(requestId)
            toast.success("Đã từ chối yêu cầu tín chỉ!", {
                description: `Yêu cầu #${requestId} đã bị từ chối.`,
            })
            router.push("/cva/credits")
        } catch (error) {
            console.error("Failed to reject request:", error)
            toast.error("Không thể từ chối yêu cầu")
        } finally {
            setIsProcessing(false)
            setConfirmDialog(null)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen">
                <Header title="Chi tiết yêu cầu" />
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </div>
        )
    }

    if (!request) {
        return (
            <div className="min-h-screen">
                <Header title="Chi tiết yêu cầu" />
                <div className="p-6">
                    <div className="text-center py-20">
                        <p className="text-muted-foreground">Không tìm thấy yêu cầu</p>
                        <Link href="/cva/credits">
                            <Button variant="outline" className="mt-4 bg-transparent">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Quay lại
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const totalDistance = savings.reduce((sum, s) => sum + s.distanceKm, 0)
    const totalCO2Saved = savings.reduce((sum, s) => sum + s.co2SavedKg, 0)

    return (
        <div className="min-h-screen">
            <Header title={`Yêu cầu #${requestId}`} description="Kiểm tra chi tiết dữ liệu phát thải & hồ sơ tín chỉ" />

            <div className="p-6 space-y-6">
                {/* Back Button */}
                <Link href="/cva/credits">
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại danh sách
                    </Button>
                </Link>

                {/* Request Summary */}
                <Card className="bg-card/50 border-border/50">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Thông tin yêu cầu</CardTitle>
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-warning/10 text-warning">Chờ duyệt</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 rounded-xl bg-secondary/30">
                                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                    <Car className="h-4 w-4" />
                                    <span className="text-sm">Biển số xe</span>
                                </div>
                                <p className="font-semibold text-lg">{request.licensePlate}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-secondary/30">
                                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                    <Leaf className="h-4 w-4" />
                                    <span className="text-sm">CO₂ tiết kiệm</span>
                                </div>
                                <p className="font-semibold text-lg">{request.co2AmountKg} kg</p>
                            </div>
                            <div className="p-4 rounded-xl bg-primary/10">
                                <div className="flex items-center gap-2 text-primary mb-2">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span className="text-sm">Tín chỉ yêu cầu</span>
                                </div>
                                <p className="font-bold text-2xl text-primary">{request.creditAmount}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-secondary/30">
                                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                    <Calendar className="h-4 w-4" />
                                    <span className="text-sm">Ngày yêu cầu</span>
                                </div>
                                <p className="font-semibold text-lg">{new Date(request.requestDate).toLocaleDateString("vi-VN")}</p>
                            </div>
                        </div>
                        {request.verificationNote && (
                            <div className="mt-4 p-4 rounded-xl bg-secondary/30">
                                <p className="text-sm text-muted-foreground mb-1">Ghi chú</p>
                                <p>{request.verificationNote}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Savings Details */}
                <Card className="bg-card/50 border-border/50">
                    <CardHeader>
                        <CardTitle>Chi tiết dữ liệu tiết kiệm CO₂</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Summary Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="p-4 rounded-xl bg-info/10 text-center">
                                <Route className="h-6 w-6 mx-auto text-info mb-2" />
                                <p className="text-2xl font-bold text-info">{totalDistance.toLocaleString()} km</p>
                                <p className="text-sm text-muted-foreground">Tổng quãng đường</p>
                            </div>
                            <div className="p-4 rounded-xl bg-success/10 text-center">
                                <Leaf className="h-6 w-6 mx-auto text-success mb-2" />
                                <p className="text-2xl font-bold text-success">{totalCO2Saved.toLocaleString()} kg</p>
                                <p className="text-sm text-muted-foreground">Tổng CO₂ tiết kiệm</p>
                            </div>
                            <div className="p-4 rounded-xl bg-primary/10 text-center">
                                <Calculator className="h-6 w-6 mx-auto text-primary mb-2" />
                                <p className="text-2xl font-bold text-primary">{savings.length}</p>
                                <p className="text-sm text-muted-foreground">Số bản ghi</p>
                            </div>
                        </div>

                        {/* Savings List */}
                        {savings.length === 0 ? (
                            <div className="text-center py-10">
                                <Leaf className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                                <p className="text-muted-foreground">Không có dữ liệu tiết kiệm</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="grid grid-cols-5 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b border-border/50">
                                    <span>ID</span>
                                    <span>Quãng đường</span>
                                    <span>CO₂ tiết kiệm</span>
                                    <span>Phương pháp</span>
                                    <span>Ngày ghi nhận</span>
                                </div>
                                {savings.map((saving) => (
                                    <div
                                        key={saving.savingId}
                                        className="grid grid-cols-5 gap-4 px-4 py-3 rounded-xl bg-secondary/30 items-center"
                                    >
                                        <span className="font-medium">#{saving.savingId}</span>
                                        <span>{saving.distanceKm.toLocaleString()} km</span>
                                        <span className="text-success font-medium">{saving.co2SavedKg} kg</span>
                                        <span className="text-sm">{saving.calculationMethod}</span>
                                        <span className="text-sm text-muted-foreground">
                                            {new Date(saving.recordedDate).toLocaleDateString("vi-VN")}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4">
                    <Button
                        variant="outline"
                        onClick={() => setConfirmDialog("reject")}
                        className="border-destructive/50 text-destructive hover:bg-destructive/10"
                    >
                        <XCircle className="h-4 w-4 mr-2" />
                        Từ chối
                    </Button>
                    <Button
                        onClick={() => setConfirmDialog("approve")}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Duyệt & Cấp tín chỉ
                    </Button>
                </div>

                {/* Confirm Dialog */}
                <Dialog open={confirmDialog !== null} onOpenChange={() => setConfirmDialog(null)}>
                    <DialogContent className="bg-card border-border/50">
                        <DialogHeader>
                            <DialogTitle>
                                {confirmDialog === "approve" ? "Xác nhận duyệt yêu cầu" : "Xác nhận từ chối yêu cầu"}
                            </DialogTitle>
                            <DialogDescription>
                                {confirmDialog === "approve"
                                    ? `Bạn sẽ phê duyệt yêu cầu #${requestId} và cấp ${request.creditAmount} tín chỉ carbon vào ví của chủ xe.`
                                    : `Bạn sẽ từ chối yêu cầu #${requestId}. Hành động này không thể hoàn tác.`}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setConfirmDialog(null)} disabled={isProcessing}>
                                Hủy
                            </Button>
                            {confirmDialog === "approve" ? (
                                <Button
                                    onClick={handleApprove}
                                    disabled={isProcessing}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                >
                                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Xác nhận duyệt"}
                                </Button>
                            ) : (
                                <Button onClick={handleReject} disabled={isProcessing} variant="destructive">
                                    {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Xác nhận từ chối"}
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
