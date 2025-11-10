import React from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { useRouter } from '../../../contexts/RouterContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { ArrowRight, Leaf, Shield, TrendingUp, Users, Zap, CheckCircle } from 'lucide-react';

export function Home() {
  const { navigateTo } = useRouter();
  const { t } = useLanguage();

  const features = [
    {
      icon: Zap,
      title: 'Theo dõi Thời gian Thực',
      description: 'Tự động theo dõi lượng carbon tiết kiệm được qua kết nối thiết bị',
    },
    {
      icon: Shield,
      title: 'Tín chỉ Đã Xác minh',
      description: 'Xác minh chuyên nghiệp bởi các tổ chức CVA được chứng nhận',
    },
    {
      icon: TrendingUp,
      title: 'Kiếm tiền Dễ dàng',
      description: 'Niêm yết và bán tín chỉ carbon trên thị trường an toàn',
    },
    {
      icon: Users,
      title: 'Thị trường Toàn cầu',
      description: 'Kết nối với người mua trên toàn thế giới đang tìm kiếm tín chỉ carbon',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Tín chỉ đã giao dịch' },
    { value: '5,000+', label: 'Chủ xe điện' },
    { value: '50M kg', label: 'CO₂ tiết kiệm' },
    { value: '98%', label: 'Hài lòng' },
  ];

  const steps = [
    {
      number: '01',
      title: 'Đăng ký & Kết nối',
      description: 'Tạo tài khoản và kết nối xe điện của bạn qua tích hợp bảo mật',
    },
    {
      number: '02',
      title: 'Theo dõi Tiết kiệm Carbon',
      description: 'Tự động giám sát lượng phát thải tránh được so với xe thông thường',
    },
    {
      number: '03',
      title: 'Yêu cầu Xác minh',
      description: 'Gửi dữ liệu để xác minh chuyên nghiệp bởi đối tác CVA được chứng nhận',
    },
    {
      number: '04',
      title: 'Niêm yết & Kiếm tiền',
      description: 'Bán tín chỉ đã xác minh trên thị trường và nhận thanh toán an toàn',
    },
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img
          src="https://images.unsplash.com/photo-1726471819205-faf7d51590bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBjaGFyZ2luZyUyMGdyZWVufGVufDF8fHx8MTc2MDYxNTg3M3ww&ixlib=rb-4.1.0&q=80&w=1080"
           alt="EV Charging"
          className="w-full h-full object-cover"
          onError={(e) => { // Xử lý lỗi đơn giản 
         const target = e.target as HTMLImageElement;
          target.onerror = null; // Ngăn lặp vô hạn
           target.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // Ảnh trống 1px
        }}
          />
        </div>
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm rounded-full mb-6 border border-primary/20">
              <Leaf className="w-4 h-4 text-primary" />
              <span className="text-primary font-medium">Thị trường Tín chỉ Carbon</span>
            </div>
            <h1 className="mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Kiếm tiền khi bảo vệ môi trường
            </h1>
            <p className="text-muted-foreground mb-8 text-lg">
              Biến xe điện của bạn thành công cụ tạo tín chỉ carbon. Theo dõi, xác minh và kiếm tiền từ việc bảo vệ môi trường.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigateTo('/register')} className="shadow-lg shadow-primary/20">
                Đăng ký miễn phí
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigateTo('/how-it-works')} className="border-2">
                Tìm hiểu thêm
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4">Tại sao chọn Nền tảng của chúng tôi</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Chúng tôi cung cấp mọi thứ bạn cần để kiếm tiền từ tác động môi trường
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="mb-2">{feature.title}</h4>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4">Cách Hoạt động</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Bốn bước đơn giản để bắt đầu kiếm tiền từ xe điện
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-bold text-primary/10 mb-4">
                  {step.number}
                </div>
                <h4 className="mb-2">{step.title}</h4>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-4 w-8 h-0.5 bg-primary/20" />
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" onClick={() => navigateTo('/how-it-works')}>
              Tìm hiểu thêm
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="mb-6">Tối ưu hóa Tác động Môi trường</h2>
              <div className="space-y-4">
                {[
                  'Tự động theo dõi carbon từ xe của bạn',
                  'Xác minh và chứng nhận chuyên nghiệp',
                  'Định giá thị trường minh bạch',
                  'Xử lý thanh toán an toàn',
                  'Phân tích và báo cáo thời gian thực',
                  'Hỗ trợ khách hàng tận tâm',
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              <Button className="mt-6 shadow-lg shadow-primary/20" onClick={() => navigateTo('/register')}>
                Bắt đầu Kiếm tiền Ngay hôm nay
              </Button>
            </div>
            <div className="relative rounded-2xl overflow-hidden">
              <img
              src="https://images.unsplash.com/photo-1659290541504-6db0bbd00d9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGVuZXJneSUyMGVudmlyb25tZW50fGVufDF8fHx8MTc2MDYxNTg3NHww&ixlib=rb-4.1.0&q=80&w=1080"
             alt="Sustainable Environment"
             className="w-full h-full object-cover rounded-2xl"
             onError={(e) => { // Xử lý lỗi đơn giản (tùy chọn)
            const target = e.target as HTMLImageElement;
             target.onerror = null; // Ngăn lặp vô hạn
             target.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // Ảnh trống 1px
              }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-accent/40 rounded-2xl flex items-center justify-center">
                <div className="text-center p-8 bg-background/90 backdrop-blur-sm rounded-xl">
                  <Leaf className="w-24 h-24 text-primary mx-auto mb-4" />
                  <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">1,250 kg</div>
                  <div className="text-muted-foreground font-medium">Trung bình CO₂ tiết kiệm mỗi xe/năm</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary via-primary to-accent text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
         src="https://images.unsplash.com/photo-1711376606067-5ffe715bbcd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJib24lMjBmb290cHJpbnQlMjBuYXR1cmV8ZW58MXx8fHwxNzYwNjE1ODc0fDA&ixlib=rb-4.1.0&q=80&w=1080"
         alt="Nature Background"
        className="w-full h-full object-cover"
        onError={(e) => { // Xử lý lỗi đơn giản (tùy chọn)
         const target = e.target as HTMLImageElement;
         target.onerror = null; // Ngăn lặp vô hạn
         target.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // Ảnh trống 1px
            }}
        />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="mb-4">Sẵn sàng Bắt đầu Kiếm tiền?</h2>
          <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto text-lg">
            Tham gia cùng hàng nghìn chủ xe điện đang kiếm tiền từ tác động môi trường
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigateTo('/register')} className="shadow-xl">
              Tạo Tài khoản Miễn phí
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" onClick={() => navigateTo('/contact')}>
              Liên hệ Bán hàng
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
