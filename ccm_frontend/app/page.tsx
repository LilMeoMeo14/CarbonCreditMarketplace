import Link from "next/link"
import { ArrowRight, Leaf, Car, Building2, Shield, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Tính năng
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cách hoạt động
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Bảng giá
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Đăng nhập
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Đăng ký</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm">
              <Leaf className="h-4 w-4" />
              Nền tảng giao dịch tín chỉ carbon hàng đầu Việt Nam
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-balance">
              Kiếm tiền từ việc
              <span className="text-primary"> bảo vệ môi trường</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Kết nối chủ xe điện với doanh nghiệp cần tín chỉ carbon. Đơn giản, minh bạch và được xác minh bởi tổ chức
              uy tín.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/register">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                  Bắt đầu ngay
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border/50 hover:bg-secondary/50 px-8 bg-transparent"
                >
                  Tìm hiểu thêm
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "10,000+", label: "Chủ xe điện" },
              { value: "500+", label: "Doanh nghiệp" },
              { value: "50,000", label: "Tín chỉ đã giao dịch" },
              { value: "99.9%", label: "Độ chính xác" },
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-card/50 border border-border/50">
                <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tại sao chọn chúng tôi?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nền tảng toàn diện cho việc quản lý và giao dịch tín chỉ carbon
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Car,
                title: "Cho chủ xe điện",
                description: "Theo dõi lượng CO₂ tiết kiệm và bán tín chỉ carbon dễ dàng",
              },
              {
                icon: Building2,
                title: "Cho doanh nghiệp",
                description: "Mua tín chỉ carbon được xác minh để đạt mục tiêu Net Zero",
              },
              {
                icon: Shield,
                title: "Được xác minh",
                description: "Mọi tín chỉ đều được CVA kiểm toán và xác minh",
              },
              {
                icon: TrendingUp,
                title: "Giao dịch linh hoạt",
                description: "Mua bán trực tiếp hoặc tham gia đấu giá",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center p-12 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
            <h2 className="text-3xl font-bold mb-4">Sẵn sàng bắt đầu?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Tham gia cùng hàng nghìn người đang đóng góp vào việc giảm phát thải carbon
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                Tạo tài khoản miễn phí
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground">© 2025 CarbonCredit Marketplace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
