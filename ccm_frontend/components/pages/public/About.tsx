import React from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { Card, CardContent } from '../../ui/card';
import { Leaf, Target, Users, Shield, Globe, TrendingUp } from 'lucide-react';
//import { ImageWithFallback } from '../../figma/ImageWithFallback';

export function About() {
  const values = [
    {
      icon: Leaf,
      title: 'Bền vững',
      description: 'Cam kết với tương lai xanh và giảm phát thải carbon toàn cầu'
    },
    {
      icon: Shield,
      title: 'Minh bạch',
      description: 'Xác minh và theo dõi mọi tín chỉ một cách công khai và minh bạch'
    },
    {
      icon: Users,
      title: 'Cộng đồng',
      description: 'Kết nối chủ xe điện và doanh nghiệp vì một mục tiêu chung'
    },
    {
      icon: TrendingUp,
      title: 'Đổi mới',
      description: 'Công nghệ tiên tiến để theo dõi và giao dịch tín chỉ carbon'
    }
  ];

  const milestones = [
    {
      year: '2024',
      title: 'Ra mắt Nền tảng',
      description: 'Khởi động thị trường tín chỉ carbon đầu tiên cho xe điện tại Việt Nam'
    },
    {
      year: '2024',
      title: '1.000+ Người dùng',
      description: 'Đạt mốc 1.000 chủ xe điện đăng ký trên nền tảng'
    },
    {
      year: '2025',
      title: '10.000+ Tín chỉ',
      description: 'Giao dịch thành công hơn 10.000 tín chỉ carbon đã được xác minh'
    },
    {
      year: '2025',
      title: 'Mở rộng Khu vực',
      description: 'Mở rộng ra các quốc gia Đông Nam Á'
    }
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm rounded-full mb-6">
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-primary font-medium">Về Chúng Tôi</span>
            </div>
            <h1 className="mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Xây dựng Tương lai Bền vững
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Chúng tôi đang xây dựng thị trường đầu tiên trên thế giới dành riêng cho tín chỉ carbon được tạo ra bởi xe điện.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="mb-6 flex items-center gap-3">
                <Target className="w-8 h-8 text-primary" />
                Sứ mệnh của Chúng tôi
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Chúng tôi tin rằng mọi chủ xe điện đều xứng đáng được khen thưởng vì sự lựa chọn thân thiện với môi trường của họ. 
                  Nền tảng của chúng tôi kết nối chủ xe điện với doanh nghiệp và cá nhân đang tìm kiếm các khoản bù đắp carbon đã được xác minh.
                </p>
                <p>
                  Bằng cách biến tác động môi trường thành giá trị kinh tế, chúng tôi tạo động lực cho nhiều người hơn nữa 
                  chuyển sang xe điện và góp phần vào một tương lai bền vững hơn.
                </p>
                <p>
                  Với công nghệ tiên tiến và đối tác CVA uy tín, chúng tôi đảm bảo mọi tín chỉ carbon đều được xác minh 
                  theo tiêu chuẩn quốc tế cao nhất.
                </p>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden h-96">
              <img
              src="https://images.unsplash.com/photo-1659290541504-6db0bbd00d9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGVuZXJneSUyMGVudmlyb25tZW50fGVufDF8fHx8MTc2MDYxNTg3NHww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Sustainable Mission"
              className="w-full h-full object-cover"
              onError={(e) => { // Xử lý lỗi đơn giản (tùy chọn)
              const target = e.target as HTMLImageElement;
              target.onerror = null; // Ngăn lặp vô hạn
             target.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // Ảnh trống 1px
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="mb-4">Giá trị Cốt lõi</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Những nguyên tắc định hướng mọi quyết định và hành động của chúng tôi
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="mb-2">{value.title}</h4>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="mb-4">Đội ngũ của Chúng tôi</h2>
              <p className="text-muted-foreground">
                Được thành lập bởi các chuyên gia về môi trường và công nghệ, đội ngũ của chúng tôi đam mê 
                thúc đẩy quá trình chuyển đổi sang giao thông bền vững.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
                { name: 'Nguyễn Văn A', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1759844197486-5b3612c7d534' },
                { name: 'Trần Thị B', role: 'CTO', image: 'https://images.unsplash.com/photo-1759844197486-5b3612c7d534' },
                { name: 'Lê Văn C', role: 'Head of Sustainability', image: 'https://images.unsplash.com/photo-1759844197486-5b3612c7d534' },
              ].map((member, index) => (
                <Card key={index} className="border-2 hover:shadow-lg transition-all">
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20" />
                  <CardContent className="p-6 text-center">
                    <h4 className="mb-1">{member.name}</h4>
                    <p className="text-muted-foreground">{member.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="mb-4">Hành trình của Chúng tôi</h2>
              <p className="text-muted-foreground">
                Những cột mốc quan trọng trong quá trình phát triển
              </p>
            </div>
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <Card key={index} className="border-2 hover:border-primary/50 transition-all">
                  <CardContent className="p-6">
                    <div className="flex gap-6 items-start">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold">
                          {milestone.year}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="mb-2 text-primary">{milestone.title}</h4>
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mb-4">Đối tác của Chúng tôi</h2>
            <p className="text-muted-foreground mb-12">
              Chúng tôi làm việc với các tổ chức CVA hàng đầu, nhà sản xuất ô tô và chuyên gia tư vấn về tính bền vững 
              để đảm bảo tiêu chuẩn xác minh và minh bạch cao nhất.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground">Partner Logo</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
