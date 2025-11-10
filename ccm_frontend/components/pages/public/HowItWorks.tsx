import React from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { useRouter } from '../../../contexts/RouterContext';
import { Car, LineChart, CheckCircle, Store, Leaf, Zap, Shield, TrendingUp } from 'lucide-react';

export function HowItWorks() {
  const { navigateTo } = useRouter();

  const steps = [
    {
      icon: Car,
      title: 'Đăng ký Xe Điện',
      description: 'Tạo tài khoản và thêm thông tin xe điện của bạn bao gồm hãng, dòng và số VIN.',
      details: [
        'Quy trình đăng ký đơn giản',
        'Xác minh KYC để đảm bảo an toàn',
        'Hỗ trợ tất cả các hãng xe điện lớn',
      ],
    },
    {
      icon: Zap,
      title: 'Kết nối Telematics',
      description: 'Liên kết xe của bạn thông qua API của OEM hoặc thiết bị telematics bên thứ ba để thu thập dữ liệu tự động.',
      details: [
        'Tích hợp trực tiếp với nhà sản xuất',
        'Hỗ trợ thiết bị bên thứ ba',
        'Truyền dữ liệu an toàn',
      ],
    },
    {
      icon: LineChart,
      title: 'Theo dõi Tiết kiệm Carbon',
      description: 'Hệ thống tự động tính toán lượng phát thải CO₂ tránh được dựa trên dữ liệu lái xe của bạn.',
      details: [
        'Bảng điều khiển theo dõi thời gian thực',
        'Phân tích và biểu đồ chi tiết',
        'Xuất dữ liệu bất kỳ lúc nào',
      ],
    },
    {
      icon: CheckCircle,
      title: 'Yêu cầu Xác minh',
      description: 'Gửi lượng carbon tiết kiệm tích lũy để xác minh chuyên nghiệp bởi các tổ chức CVA được chứng nhận.',
      details: [
        'Quy trình hướng dẫn từng bước',
        'Hỗ trợ tải lên tài liệu',
        'Thời gian xác minh minh bạch',
      ],
    },
    {
      icon: Shield,
      title: 'Nhận Chứng nhận',
      description: 'Kiểm toán viên CVA xem xét dữ liệu của bạn theo tiêu chuẩn quốc tế và phát hành tín chỉ đã xác minh.',
      details: [
        'Tuân thủ ISO 14064',
        'Được phê duyệt bởi VERRA/Gold Standard',
        'Số sê-ri duy nhất',
      ],
    },
    {
      icon: Store,
      title: 'Niêm yết & Bán',
      description: 'Tạo danh sách trên thị trường của chúng tôi, đặt giá và kết nối với người mua trên toàn thế giới.',
      details: [
        'Tùy chọn định giá linh hoạt',
        'Đấu giá hoặc giá cố định',
        'Hệ thống ký quỹ an toàn',
      ],
    },
  ];

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
        <div className="absolute inset-0 opacity-5">
          <img
        src="https://images.unsplash.com/photo-1758614351900-6398341d5b97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHRlY2hub2xvZ3klMjBpbm5vdmF0aW9ufGVufDF8fHx8MTc2MDU5MzMyNHww&ixlib=rb-4.1.0&q=80&w=1080"
         alt="Green Technology"
        className="w-full h-full object-cover"
        onError={(e) => { // Xử lý lỗi đơn giản 
        const target = e.target as HTMLImageElement;
         target.onerror = null; // Ngăn lặp vô hạn
         target.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // Ảnh trống 1px
        }}
        />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm rounded-full mb-6 border border-primary/20">
              <Leaf className="w-4 h-4 text-primary" />
              <span className="text-primary font-medium">Cách Hoạt động</span>
            </div>
            <h1 className="mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Từ Tài xế EV đến Người bán Tín chỉ Carbon
            </h1>
            <p className="text-muted-foreground text-lg">
              Quy trình minh bạch, từng bước để kiếm tiền từ tác động môi trường của bạn
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            {steps.map((step, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-[1fr,2fr] gap-8 items-start">
                    <div className="text-center md:text-left">
                      <div className="inline-flex w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl items-center justify-center mb-4">
                        <step.icon className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-sm text-muted-foreground mb-2 font-medium">
                        Bước {index + 1}
                      </div>
                      <h3 className="text-primary">{step.title}</h3>
                    </div>
                    <div>
                      <p className="mb-4 text-lg">{step.description}</p>
                      <ul className="space-y-2">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4">Sẵn sàng Bắt đầu?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
            Tham gia nền tảng của chúng tôi ngay hôm nay và bắt đầu kiếm tiền từ tác động môi trường
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" onClick={() => navigateTo('/register')} className="shadow-lg shadow-primary/20">
              Tạo Tài khoản
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigateTo('/marketplace')} className="border-2">
              Xem Thị trường
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
