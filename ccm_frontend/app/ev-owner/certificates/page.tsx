"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/ev-owner/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Award, Loader2, FileText, Calendar, Hash, Leaf } from "lucide-react"
import { walletsApi, type Certificate, type CarbonWallet } from "@/lib/api/wallets"

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [carbonWallet, setCarbonWallet] = useState<CarbonWallet | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [retireData, setRetireData] = useState({ amount: 0, reason: "" })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [certsRes, walletRes] = await Promise.all([walletsApi.getMyCertificates(), walletsApi.getCarbonWallet()])
      setCertificates(certsRes.result)
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
      setIsDialogOpen(false)
      setRetireData({ amount: 0, reason: "" })
      fetchData()
    } catch (error) {
      console.error("Failed to retire credits:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header title="Chứng chỉ" description="Xem chứng chỉ và tiêu hủy tín chỉ để nhận bằng khen" />

      <div className="p-6 space-y-6">
        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Award className="h-4 w-4" />
            <span>{certificates.length} chứng chỉ</span>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Leaf className="h-4 w-4 mr-2" />
                Tiêu hủy tín chỉ
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border/50 max-w-md">
              <DialogHeader>
                <DialogTitle>Tiêu hủy tín chỉ</DialogTitle>
                <DialogDescription>
                  Tiêu hủy tín chỉ carbon để nhận chứng chỉ giảm phát thải chính thức
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Leaf className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Số dư hiện tại:</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">{carbonWallet?.balance ?? 0} tín chỉ</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Số lượng tín chỉ</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="VD: 10"
                    value={retireData.amount || ""}
                    onChange={(e) => setRetireData({ ...retireData, amount: Number(e.target.value) })}
                    className="bg-secondary/50 border-border/50"
                    max={carbonWallet?.balance || 0}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Lý do tiêu hủy</Label>
                  <Textarea
                    id="reason"
                    placeholder="VD: Báo cáo giảm phát thải năm 2025"
                    value={retireData.reason}
                    onChange={(e) => setRetireData({ ...retireData, reason: e.target.value })}
                    className="bg-secondary/50 border-border/50"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Hủy
                </Button>
                <Button
                  onClick={handleRetire}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={
                    isSubmitting ||
                    !retireData.amount ||
                    !retireData.reason ||
                    retireData.amount > (carbonWallet?.balance || 0)
                  }
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Tiêu hủy"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Certificates Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : certificates.length === 0 ? (
          <Card className="bg-card/50 border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <Award className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium mb-2">Chưa có chứng chỉ nào</h3>
              <p className="text-muted-foreground text-center mb-4">
                Tiêu hủy tín chỉ carbon để nhận chứng chỉ giảm phát thải
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.map((cert) => (
              <Card
                key={cert.certificateId}
                className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors overflow-hidden"
              >
                <div className="h-2 bg-gradient-to-r from-primary to-primary/50" />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        cert.type === "ISSUANCE" ? "bg-success/10 text-success" : "bg-info/10 text-info"
                      }`}
                    >
                      {cert.type === "ISSUANCE" ? "Phát hành" : "Tiêu hủy"}
                    </span>
                  </div>

                  <h3 className="font-semibold text-lg mb-1">{cert.ownerName}</h3>
                  <p className="text-primary font-semibold text-2xl mb-4">{cert.amount} tín chỉ</p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Hash className="h-4 w-4" />
                      <span className="font-mono">{cert.serialNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(cert.issueDate).toLocaleDateString("vi-VN")}</span>
                    </div>
                    {cert.reason && (
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4 mt-0.5" />
                        <span>{cert.reason}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
