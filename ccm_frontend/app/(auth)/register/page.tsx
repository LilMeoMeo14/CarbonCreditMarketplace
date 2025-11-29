"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Loader2, Car, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/ui/logo"
import { authApi } from "@/lib/api/auth"

type Role = "EV_OWNER" | "BUYER"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    reTypePassword: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    role: "EV_OWNER" as Role,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showRePassword, setShowRePassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.reTypePassword) {
      setError("Mật khẩu xác nhận không khớp")
      return
    }

    if (formData.password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự")
      return
    }

    setIsLoading(true)

    try {
      await authApi.register({
        ...formData,
        status: "ACTIVE",
      })

      // Redirect to login with success message
      router.push("/login?registered=true")
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="p-6">
        <Link href="/">
          <Logo />
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-lg bg-card/50 backdrop-blur-xl border-border/50">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Tạo tài khoản mới</CardTitle>
            <CardDescription>Tham gia cộng đồng giao dịch tín chỉ carbon</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              {/* Role Selection */}
              <div className="space-y-2">
                <Label>Loại tài khoản</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "EV_OWNER" })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.role === "EV_OWNER"
                        ? "border-primary bg-primary/10"
                        : "border-border/50 bg-secondary/30 hover:border-border"
                    }`}
                  >
                    <Car
                      className={`h-6 w-6 mx-auto mb-2 ${formData.role === "EV_OWNER" ? "text-primary" : "text-muted-foreground"}`}
                    />
                    <div
                      className={`text-sm font-medium ${formData.role === "EV_OWNER" ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      Chủ xe điện
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Bán tín chỉ carbon</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "BUYER" })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.role === "BUYER"
                        ? "border-primary bg-primary/10"
                        : "border-border/50 bg-secondary/30 hover:border-border"
                    }`}
                  >
                    <Building2
                      className={`h-6 w-6 mx-auto mb-2 ${formData.role === "BUYER" ? "text-primary" : "text-muted-foreground"}`}
                    />
                    <div
                      className={`text-sm font-medium ${formData.role === "BUYER" ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      Doanh nghiệp
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Mua tín chỉ carbon</div>
                  </button>
                </div>
              </div>

              {/* Name fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Họ</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="Nguyễn"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="pl-10 bg-secondary/50 border-border/50 focus:border-primary"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Tên</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Văn A"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="bg-secondary/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 bg-secondary/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Số điện thoại</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="0901234567"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="pl-10 bg-secondary/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 bg-secondary/50 border-border/50 focus:border-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="reTypePassword">Xác nhận mật khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reTypePassword"
                    name="reTypePassword"
                    type={showRePassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.reTypePassword}
                    onChange={handleChange}
                    className="pl-10 pr-10 bg-secondary/50 border-border/50 focus:border-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRePassword(!showRePassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showRePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2">
                <input type="checkbox" id="terms" className="mt-1 rounded border-border bg-secondary" required />
                <label htmlFor="terms" className="text-sm text-muted-foreground">
                  Tôi đồng ý với{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Điều khoản dịch vụ
                  </Link>{" "}
                  và{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Chính sách bảo mật
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Tạo tài khoản
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-muted-foreground w-full">
              Đã có tài khoản?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Đăng nhập
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-muted-foreground">
        © 2025 CarbonCredit Marketplace. All rights reserved.
      </footer>
    </div>
  )
}
