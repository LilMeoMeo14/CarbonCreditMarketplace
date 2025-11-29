"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Header } from "@/components/ev-owner/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { Plus, Car, Pencil, Trash2, Loader2, Battery, Calendar, FileText } from "lucide-react"
import { evProfilesApi, type EVProfile, type CreateEVProfileRequest } from "@/lib/api/ev-profiles"
import { filesApi } from "@/lib/api/files"
import { toast } from "sonner"

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<EVProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<EVProfile | null>(null)
  const [deleteVehicle, setDeleteVehicle] = useState<EVProfile | null>(null)
  const [formData, setFormData] = useState<CreateEVProfileRequest>({
    vehicleModel: "",
    licensePlate: "",
    batteryCapacityKwh: 0,
    registrationDate: "",
    verificationDocumentUrl: "",
  })
  const [uploadingFile, setUploadingFile] = useState(false)

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const response = await evProfilesApi.getMyVehicles()
      setVehicles(response.result)
    } catch (error) {
      console.error("Failed to fetch vehicles:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingFile(true)
    try {
      const url = await filesApi.upload(file)
      setFormData({ ...formData, verificationDocumentUrl: url })
    } catch (error) {
      console.error("Failed to upload file:", error)
    } finally {
      setUploadingFile(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingVehicle) {
        await evProfilesApi.updateProfile(editingVehicle.evProfileId, formData)
        toast.success("Cập nhật xe thành công!")
      } else {
        await evProfilesApi.createProfile(formData)
        toast.success("Thêm xe mới thành công!", {
          description: "Xe của bạn đang chờ admin xác minh.",
        })
      }
      setIsDialogOpen(false)
      resetForm()
      fetchVehicles()
    } catch (error) {
      console.error("Failed to save vehicle:", error)
      toast.error("Có lỗi xảy ra", {
        description: "Không thể lưu thông tin xe. Vui lòng thử lại.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteVehicle) return

    try {
      await evProfilesApi.deleteProfile(deleteVehicle.evProfileId)
      toast.success("Xóa xe thành công!")
      setDeleteVehicle(null)
      fetchVehicles()
    } catch (error) {
      console.error("Failed to delete vehicle:", error)
      toast.error("Không thể xóa xe", {
        description: "Vui lòng thử lại sau.",
      })
    }
  }

  const openEditDialog = (vehicle: EVProfile) => {
    setEditingVehicle(vehicle)
    setFormData({
      vehicleModel: vehicle.vehicleModel,
      licensePlate: vehicle.licensePlate,
      batteryCapacityKwh: vehicle.batteryCapacityKwh,
      registrationDate: vehicle.registrationDate,
      verificationDocumentUrl: vehicle.verificationDocumentUrl,
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingVehicle(null)
    setFormData({
      vehicleModel: "",
      licensePlate: "",
      batteryCapacityKwh: 0,
      registrationDate: "",
      verificationDocumentUrl: "",
    })
  }

  return (
    <div className="min-h-screen">
      <Header title="Xe của tôi" description="Quản lý hồ sơ xe điện của bạn" />

      <div className="p-6 space-y-6">
        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Car className="h-4 w-4" />
            <span>{vehicles.length} xe đã đăng ký</span>
          </div>
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open)
              if (!open) resetForm()
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Plus className="h-4 w-4 mr-2" />
                Thêm xe mới
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border/50 max-w-md">
              <DialogHeader>
                <DialogTitle>{editingVehicle ? "Chỉnh sửa xe" : "Thêm xe mới"}</DialogTitle>
                <DialogDescription>
                  {editingVehicle ? "Cập nhật thông tin xe của bạn" : "Nhập thông tin xe điện của bạn"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleModel">Model xe</Label>
                  <Input
                    id="vehicleModel"
                    placeholder="VD: VinFast VF8"
                    value={formData.vehicleModel}
                    onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                    className="bg-secondary/50 border-border/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licensePlate">Biển số xe</Label>
                  <Input
                    id="licensePlate"
                    placeholder="VD: 30A-12345"
                    value={formData.licensePlate}
                    onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                    className="bg-secondary/50 border-border/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batteryCapacityKwh">Dung lượng pin (kWh)</Label>
                  <Input
                    id="batteryCapacityKwh"
                    type="number"
                    placeholder="VD: 82"
                    value={formData.batteryCapacityKwh || ""}
                    onChange={(e) => setFormData({ ...formData, batteryCapacityKwh: Number(e.target.value) })}
                    className="bg-secondary/50 border-border/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registrationDate">Ngày đăng ký</Label>
                  <Input
                    id="registrationDate"
                    type="date"
                    value={formData.registrationDate}
                    onChange={(e) => setFormData({ ...formData, registrationDate: e.target.value })}
                    className="bg-secondary/50 border-border/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Giấy tờ xác minh</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      onChange={handleFileUpload}
                      className="bg-secondary/50 border-border/50"
                      accept="image/*,.pdf"
                    />
                    {uploadingFile && <Loader2 className="h-4 w-4 animate-spin" />}
                  </div>
                  {formData.verificationDocumentUrl && (
                    <p className="text-xs text-success">File đã tải lên thành công</p>
                  )}
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
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : editingVehicle ? (
                      "Cập nhật"
                    ) : (
                      "Thêm xe"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Vehicles Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : vehicles.length === 0 ? (
          <Card className="bg-card/50 border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <Car className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-medium mb-2">Chưa có xe nào</h3>
              <p className="text-muted-foreground text-center mb-4">
                Thêm xe điện đầu tiên của bạn để bắt đầu theo dõi carbon
              </p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm xe mới
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map((vehicle) => (
              <Card
                key={vehicle.evProfileId}
                className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Car className="h-6 w-6 text-primary" />
                    </div>
                    <StatusBadge status={vehicle.verificationStatus} />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{vehicle.vehicleModel}</h3>
                  <p className="text-primary font-mono mb-4">{vehicle.licensePlate}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Battery className="h-4 w-4" />
                      <span>{vehicle.batteryCapacityKwh} kWh</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(vehicle.registrationDate).toLocaleDateString("vi-VN")}</span>
                    </div>
                    {vehicle.verificationDocumentUrl && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>Có giấy tờ xác minh</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => openEditDialog(vehicle)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Sửa
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10 bg-transparent"
                      onClick={() => setDeleteVehicle(vehicle)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Xóa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteVehicle} onOpenChange={() => setDeleteVehicle(null)}>
        <AlertDialogContent className="bg-card border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa xe</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa xe <strong>{deleteVehicle?.vehicleModel}</strong> ({deleteVehicle?.licensePlate}
              )? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Xóa xe
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    APPROVED: "bg-success/10 text-success",
    PENDING: "bg-warning/10 text-warning",
    REJECTED: "bg-destructive/10 text-destructive",
  }
  const labels = {
    APPROVED: "Đã xác minh",
    PENDING: "Chờ duyệt",
    REJECTED: "Từ chối",
  }
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.PENDING}`}
    >
      {labels[status as keyof typeof labels] || status}
    </span>
  )
}
