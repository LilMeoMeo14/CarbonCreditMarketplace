"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/ev-owner/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, FileText, Loader2, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { creditRequestsApi, type CreditRequest } from "@/lib/api/credit-requests"
import { evProfilesApi, type EVProfile } from "@/lib/api/ev-profiles"
import { toast } from "sonner"

export default function RequestsPage() {
  const [requests, setRequests] = useState<CreditRequest[]>([])
  const [vehicles, setVehicles] = useState<EVProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const verifiedVehicles = vehicles.filter((v) => v.verificationStatus === "APPROVED")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [requestsRes, vehiclesRes] = await Promise.all([
        creditRequestsApi.getMyRequests(),
        evProfilesApi.getMyVehicles(),
      ])
      setRequests(requestsRes.result)
      setVehicles(vehiclesRes.result)
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (verifiedVehicles.length === 0) return

    // Auto-select the first verified vehicle
    const selectedVehicleId = verifiedVehicles[0].evProfileId

    setIsSubmitting(true)
    try {
      await creditRequestsApi.createRequest(selectedVehicleId)
      toast.success("Gửi yêu cầu thành công!", {
        description: "Yêu cầu tín chỉ của bạn đang chờ admin xét duyệt.",
      })
      setIsDialogOpen(false)
      fetchData()
    } catch (error) {
      console.error("Failed to create request:", error)
      toast.error("Gửi yêu cầu thất bại", {
        description: "Vui lòng thử lại sau.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle2 className="h-5 w-5 text-success" />
      case "REJECTED":
        return <XCircle className="h-5 w-5 text-destructive" />
      default:
        return <Clock className="h-5 w-5 text-warning" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "Đã duyệt"
      case "REJECTED":
        return "Từ chối"
      default:
        return "Chờ duyệt"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-success/10 text-success"
      case "REJECTED":
        return "bg-destructive/10 text-destructive"
      default:
        return "bg-warning/10 text-warning"
    }
  }

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "PENDING").length,
    approved: requests.filter((r) => r.status === "APPROVED").length,
    rejected: requests.filter((r) => r.status === "REJECTED").length,
  }

  return (
    <div className="min-h-screen">
      <Header title="Yêu cầu tín chỉ" description="Gửi yêu cầu phát hành tín chỉ carbon từ lượng CO₂ đã tiết kiệm" />

      <div className="p-6 space-y-6">
        {!isLoading && verifiedVehicles.length === 0 && (
          <Alert className="bg-warning/10 border-warning/30">
            <AlertCircle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-warning">
              {vehicles.length === 0
                ? "Bạn chưa đăng ký xe nào. Vui lòng thêm xe và chờ xác minh trước khi yêu cầu tín chỉ."
                : "Xe của bạn đang chờ xác minh. Vui lòng đợi admin duyệt xe trước khi yêu cầu tín chỉ."}
            </AlertDescription>
          </Alert>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <StatBadge label="Tổng" value={stats.total} />
            <StatBadge label="Chờ duyệt" value={stats.pending} color="warning" />
            <StatBadge label="Đã duyệt" value={stats.approved} color="success" />
            <StatBadge label="Từ chối" value={stats.rejected} color="destructive" />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={verifiedVehicles.length === 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Yêu cầu tín chỉ
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border/50 max-w-md">
              <DialogHeader>
                <DialogTitle>Yêu cầu phát hành tín chỉ</DialogTitle>
                <DialogDescription>
                  Xác nhận gửi yêu cầu phát hành tín chỉ từ tổng lượng CO₂ đã tiết kiệm
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                  <p className="text-sm font-medium mb-2">Thông tin yêu cầu</p>
                  <p className="text-sm text-muted-foreground">
                    Số xe đã xác minh: <span className="font-medium text-foreground">{verifiedVehicles.length} xe</span>
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <p className="text-sm text-muted-foreground">
                    Khi gửi yêu cầu, hệ thống sẽ tự động tính toán và gom tất cả lượng CO₂ tiết kiệm chưa được chuyển
                    đổi thành tín chỉ. Yêu cầu sẽ ở trạng thái{" "}
                    <span className="font-medium text-warning">Chờ duyệt</span> cho đến khi được admin xác nhận.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Gửi yêu cầu"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Requests List */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle>Danh sách yêu cầu</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-10">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">Chưa có yêu cầu tín chỉ nào</p>
                <p className="text-sm text-muted-foreground">Gửi yêu cầu đầu tiên của bạn</p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((request) => (
                  <div
                    key={request.requestId}
                    className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-shrink-0">{getStatusIcon(request.status)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">Yêu cầu #{request.requestId}</p>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}
                        >
                          {getStatusLabel(request.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Xe: {request.licensePlate}</span>
                        <span>CO₂: {request.co2AmountKg} kg</span>
                        <span>Tín chỉ: {request.creditAmount}</span>
                      </div>
                      {request.verificationNote && (
                        <p className="text-sm text-muted-foreground mt-1">Ghi chú: {request.verificationNote}</p>
                      )}
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {new Date(request.requestDate).toLocaleDateString("vi-VN")}
                    </div>
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

function StatBadge({ label, value, color }: { label: string; value: number; color?: string }) {
  const colorClass = color ? `text-${color}` : "text-foreground"

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50">
      <span className="text-sm text-muted-foreground">{label}:</span>
      <span className={`font-semibold ${colorClass}`}>{value}</span>
    </div>
  )
}
