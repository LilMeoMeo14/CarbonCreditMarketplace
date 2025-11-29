"use client"

import { useEffect, useState } from "react"
import { BuyerHeader } from "@/components/buyer/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Award, Loader2, FileText, Calendar, Flame, Plus } from "lucide-react"
import { walletsApi, type Certificate, type CarbonWallet } from "@/lib/api/wallets"
import { toast } from "sonner"

export default function BuyerCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [carbonWallet, setCarbonWallet] = useState<CarbonWallet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRetireDialogOpen, setIsRetireDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [retireData, setRetireData] = useState({ amount: 0, reason: "" })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [certsRes, walletRes] = await Promise.all([walletsApi.getMyCertificates(), walletsApi.getCarbonWallet()])
      setCertificates(certsRes.result || [])
      setCarbonWallet(walletRes.result)
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetire = async () => {
    setIsSubmitting(true)
    try {
      await walletsApi.retireCredits(retireData.amount, retireData.reason)
      toast.success("Tiêu hủy tín chỉ thành công!", {
        description: `Bạn đã tiêu hủy ${retireData.amount} tín chỉ và nhận chứng chỉ giảm phát thải.`,
      })
      setIsRetireDialogOpen(false)
      setRetireData({ amount: 0, reason: "" })
      fetchData()
    } catch (error) {
      console.error("Failed to retire credits:", error)
      toast.error("Tiêu hủy thất bại", {
        description: "Vui lòng kiểm tra số dư tín chỉ và thử lại.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalRetired = certificates.filter((c) => c.type === "RETIREMENT").reduce((sum, c) => sum + c.amount, 0)

  return (
    <div className="min-h-screen">
      <BuyerHeader title="Chứng chỉ Carbon" description="Quản lý chứng chỉ giảm phát thải carbon của bạn" />

      <div className="p-6 space-y-6">
        {/* Stats and Action */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tổng chứng chỉ</p>
                  <p className="text-2xl font-bold">{certificates.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Flame className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tín chỉ đã tiêu hủy</p>
                  <p className="text-2xl font-bold text-success">{totalRetired}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tín chỉ khả dụng</p>
                  <p className="text-2xl font-bold text-primary">{carbonWallet?.balance ?? 0}</p>
                </div>
                <Dialog open={isRetireDialogOpen} onOpenChange={setIsRetireDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90" disabled={!carbonWallet?.balance}>
                      <Plus className="h-4 w-4 mr-2" />
                      Tiêu hủy
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-border/50 max-w-md">
                    <DialogHeader>
                      <DialogTitle>Tiêu hủy tín chỉ carbon</DialogTitle>
                      <DialogDescription>
                        Tiêu hủy tín chỉ để nhận chứng chỉ giảm phát thải carbon cho báo cáo CSR
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="p-4 rounded-xl bg-secondary/30">
                        <p className="text-sm text-muted-foreground">Tín chỉ khả dụng</p>
                        <p className="text-xl font-bold text-primary">{carbonWallet?.balance ?? 0} tín chỉ</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="retireAmount">Số lượng tiêu hủy</Label>
                        <Input
                          id="retireAmount"
                          type="number"
                          min={1}
                          max={carbonWallet?.balance ?? 0}
                          value={retireData.amount || ""}
                          onChange={(e) =>
                            setRetireData({
                              ...retireData,
                              amount: Math.min(Number(e.target.value), carbonWallet?.balance ?? 0),
                            })
                          }
                          className="bg-secondary/50 border-border/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="retireReason">Lý do tiêu hủy</Label>
                        <Textarea
                          id="retireReason"
                          placeholder="VD: Báo cáo CSR năm 2025, Offset carbon cho sự kiện XYZ..."
                          value={retireData.reason}
                          onChange={(e) => setRetireData({ ...retireData, reason: e.target.value })}
                          className="bg-secondary/50 border-border/50"
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsRetireDialogOpen(false)}>
                        Hủy
                      </Button>
                      <Button
                        onClick={handleRetire}
                        className="bg-primary hover:bg-primary/90"
                        disabled={isSubmitting || !retireData.amount || !retireData.reason}
                      >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Tiêu hủy & Nhận chứng chỉ"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Certificates List */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle>Danh sách chứng chỉ</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : certificates.length === 0 ? (
              <div className="text-center py-12">
                <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg font-medium mb-2">Chưa có chứng chỉ nào</p>
                <p className="text-muted-foreground">Tiêu hủy tín chỉ carbon để nhận chứng chỉ giảm phát thải</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <div
                    key={cert.certificateId}
                    className="p-5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                      <Badge
                        variant="secondary"
                        className={cert.type === "RETIREMENT" ? "bg-success/20 text-success" : "bg-info/20 text-info"}
                      >
                        {cert.type === "RETIREMENT" ? "Tiêu hủy" : "Phát hành"}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <p className="font-semibold text-lg">Chứng chỉ #{cert.certificateId}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span className="font-mono text-xs">{cert.serialNumber}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(cert.issueDate).toLocaleDateString("vi-VN")}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-primary/20">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Số lượng</span>
                        <span className="text-xl font-bold text-primary">{cert.amount} tín chỉ</span>
                      </div>
                      {cert.reason && (
                        <p className="text-sm text-muted-foreground mt-2">
                          <span className="font-medium">Lý do:</span> {cert.reason}
                        </p>
                      )}
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
