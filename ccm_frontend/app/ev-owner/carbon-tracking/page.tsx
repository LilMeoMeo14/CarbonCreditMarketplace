"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Header } from "@/components/ev-owner/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Leaf, Loader2, Camera, TrendingUp, Calendar, Car, AlertCircle } from "lucide-react"
import { evProfilesApi, type EVProfile, type CarbonSaving, type CreateCarbonSavingRequest } from "@/lib/api/ev-profiles"
import { filesApi } from "@/lib/api/files"
import { toast } from "sonner"

export default function CarbonTrackingPage() {
  const [vehicles, setVehicles] = useState<EVProfile[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null)
  const [savings, setSavings] = useState<CarbonSaving[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingSavings, setIsLoadingSavings] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<CreateCarbonSavingRequest>({
    distanceKm: 0,
    recordedDate: new Date().toISOString().split("T")[0],
    evidenceImageUrl: "",
  })
  const [uploadingFile, setUploadingFile] = useState(false)

  const verifiedVehicles = vehicles.filter((v) => v.verificationStatus === "APPROVED")

  useEffect(() => {
    fetchVehicles()
  }, [])

  useEffect(() => {
    if (selectedVehicle) {
      fetchSavings(selectedVehicle)
    }
  }, [selectedVehicle])

  const fetchVehicles = async () => {
    try {
      const response = await evProfilesApi.getMyVehicles()
      setVehicles(response.result)
      const verified = response.result.filter((v) => v.verificationStatus === "APPROVED")
      if (verified.length > 0) {
        setSelectedVehicle(verified[0].evProfileId)
      }
    } catch (error) {
      console.error("Failed to fetch vehicles:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSavings = async (vehicleId: number) => {
    setIsLoadingSavings(true)
    try {
      const response = await evProfilesApi.getCarbonSavings(vehicleId)
      setSavings(response.result)
    } catch (error) {
      console.error("Failed to fetch savings:", error)
    } finally {
      setIsLoadingSavings(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingFile(true)
    try {
      const url = await filesApi.upload(file)
      setFormData({ ...formData, evidenceImageUrl: url })
    } catch (error) {
      console.error("Failed to upload file:", error)
    } finally {
      setUploadingFile(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedVehicle) return

    setIsSubmitting(true)
    try {
      await evProfilesApi.createCarbonSaving(selectedVehicle, formData)
      toast.success("Báo cáo thành công!", {
        description: "Quãng đường và CO₂ tiết kiệm đã được ghi nhận.",
      })
      setIsDialogOpen(false)
      setFormData({
        distanceKm: 0,
        recordedDate: new Date().toISOString().split("T")[0],
        evidenceImageUrl: "",
      })
      fetchSavings(selectedVehicle)
    } catch (error) {
      console.error("Failed to create saving:", error)
      toast.error("Gửi báo cáo thất bại", {
        description: "Vui lòng kiểm tra thông tin và thử lại.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalCO2Saved = savings.reduce((sum, s) => sum + s.co2SavedKg, 0)
  const totalDistance = savings.reduce((sum, s) => sum + s.distanceKm, 0)

  const pendingVehicles = vehicles.filter((v) => v.verificationStatus === "PENDING")

  return (
    <div className="min-h-screen">
      <Header title="Theo dõi Carbon" description="Ghi nhận quãng đường và xem lượng CO₂ tiết kiệm được" />

      <div className="p-6 space-y-6">
        {!isLoading && verifiedVehicles.length === 0 && (
          <Alert className="bg-warning/10 border-warning/30">
            <AlertCircle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-warning">
              {vehicles.length === 0
                ? "Bạn chưa đăng ký xe nào. Vui lòng thêm xe trước khi theo dõi carbon."
                : `Bạn có ${pendingVehicles.length} xe đang chờ duyệt. Xe cần được xác minh (VERIFIED) trước khi có thể báo cáo quãng đường.`}
            </AlertDescription>
          </Alert>
        )}

        {/* Vehicle Selector & Add Button */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Select
              value={selectedVehicle?.toString() || ""}
              onValueChange={(value) => setSelectedVehicle(Number(value))}
              disabled={verifiedVehicles.length === 0}
            >
              <SelectTrigger className="w-64 bg-secondary/50 border-border/50">
                <SelectValue placeholder={verifiedVehicles.length === 0 ? "Không có xe đã xác minh" : "Chọn xe"} />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/50">
                {verifiedVehicles.map((vehicle) => (
                  <SelectItem key={vehicle.evProfileId} value={vehicle.evProfileId.toString()}>
                    {vehicle.vehicleModel} - {vehicle.licensePlate}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={verifiedVehicles.length === 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Báo cáo Odometer
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border/50 max-w-md">
              <DialogHeader>
                <DialogTitle>Báo cáo quãng đường</DialogTitle>
                <DialogDescription>Nhập số km đã đi và chụp ảnh Odometer để xác minh</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="distanceKm">Quãng đường (km)</Label>
                  <Input
                    id="distanceKm"
                    type="number"
                    placeholder="VD: 150"
                    value={formData.distanceKm || ""}
                    onChange={(e) => setFormData({ ...formData, distanceKm: Number(e.target.value) })}
                    className="bg-secondary/50 border-border/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recordedDate">Ngày ghi nhận</Label>
                  <Input
                    id="recordedDate"
                    type="date"
                    value={formData.recordedDate}
                    onChange={(e) => setFormData({ ...formData, recordedDate: e.target.value })}
                    className="bg-secondary/50 border-border/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ảnh Odometer</Label>
                  <div className="border-2 border-dashed border-border/50 rounded-xl p-6 text-center">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="evidence-upload"
                      accept="image/*"
                    />
                    <label htmlFor="evidence-upload" className="cursor-pointer">
                      {uploadingFile ? (
                        <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
                      ) : formData.evidenceImageUrl ? (
                        <div className="text-success">
                          <Camera className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-sm">Ảnh đã tải lên</p>
                        </div>
                      ) : (
                        <div className="text-muted-foreground">
                          <Camera className="h-8 w-8 mx-auto mb-2" />
                          <p className="text-sm">Nhấn để chụp hoặc chọn ảnh</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={isSubmitting || uploadingFile}
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Gửi báo cáo"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tổng CO₂ tiết kiệm</p>
                  <p className="text-2xl font-bold">
                    {totalCO2Saved.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">kg</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-info" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tổng quãng đường</p>
                  <p className="text-2xl font-bold">
                    {totalDistance.toLocaleString()}{" "}
                    <span className="text-sm font-normal text-muted-foreground">km</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Số lần báo cáo</p>
                  <p className="text-2xl font-bold">
                    {savings.length} <span className="text-sm font-normal text-muted-foreground">lần</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Savings History */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle>Lịch sử tiết kiệm CO₂</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading || isLoadingSavings ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : vehicles.length === 0 ? (
              <div className="text-center py-10">
                <Car className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">Bạn chưa đăng ký xe nào</p>
              </div>
            ) : verifiedVehicles.length === 0 ? (
              <div className="text-center py-10">
                <AlertCircle className="h-12 w-12 mx-auto text-warning/50 mb-3" />
                <p className="text-muted-foreground">Xe của bạn đang chờ xác minh</p>
                <p className="text-sm text-muted-foreground">
                  Vui lòng đợi admin duyệt xe trước khi báo cáo quãng đường
                </p>
              </div>
            ) : savings.length === 0 ? (
              <div className="text-center py-10">
                <Leaf className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">Chưa có dữ liệu tiết kiệm CO₂</p>
                <p className="text-sm text-muted-foreground">Báo cáo quãng đường đầu tiên của bạn</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Ngày</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Quãng đường</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">CO₂ tiết kiệm</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Phương pháp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savings.map((saving) => (
                      <tr key={saving.savingId} className="border-b border-border/30 hover:bg-secondary/20">
                        <td className="py-3 px-4 text-sm">
                          {new Date(saving.recordedDate).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="py-3 px-4 text-sm text-right">{saving.distanceKm} km</td>
                        <td className="py-3 px-4 text-sm text-right text-primary font-medium">
                          {saving.co2SavedKg.toFixed(2)} kg
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{saving.calculationMethod}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
