import React from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { Mail, Phone, MapPin, MessageSquare, Send, Clock } from 'lucide-react';
import { toast } from 'sonner';

export function Contact() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    toast.success('Tin nhắn của bạn đã được gửi thành công! Chúng tôi sẽ phản hồi sớm.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'support@evcarbon.vn',
      description: 'Gửi email cho chúng tôi bất kỳ lúc nào'
    },
    {
      icon: Phone,
      title: 'Điện thoại',
      value: '+84 123 456 789',
      description: 'Thứ 2 - Thứ 6, 9:00 - 18:00'
    },
    {
      icon: MapPin,
      title: 'Địa chỉ',
      value: 'Hà Nội, Việt Nam',
      description: 'Văn phòng chính'
    },
    {
      icon: MessageSquare,
      title: 'Chat Trực tiếp',
      value: 'Trò chuyện ngay',
      description: 'Có mặt 9:00 - 18:00'
    }
  ];

  return (
    <PublicLayout>
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm rounded-full mb-6">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-primary font-medium">Liên Hệ</span>
              </div>
              <h1 className="mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Liên Hệ Với Chúng Tôi</h1>
              <p className="text-muted-foreground text-lg">
                Hãy liên hệ với đội ngũ của chúng tôi - chúng tôi luôn sẵn sàng giúp đỡ
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {contactInfo.map((info, index) => (
                <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <info.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="mb-2">{info.title}</h4>
                    <p className="text-primary font-medium mb-1">{info.value}</p>
                    <p className="text-sm text-muted-foreground">{info.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Form */}
              <Card className="border-2">
                <CardContent className="p-8">
                  <h3 className="mb-6">Gửi Tin nhắn</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name">Họ và Tên *</Label>
                      <Input
                        id="name"
                        placeholder="Nguyễn Văn A"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Chủ đề *</Label>
                      <Input
                        id="subject"
                        placeholder="Tôi cần hỗ trợ về..."
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Tin nhắn *</Label>
                      <Textarea
                        id="message"
                        rows={6}
                        placeholder="Nhập tin nhắn của bạn tại đây..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        className="mt-2"
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full shadow-lg shadow-primary/20">
                      <Send className="w-4 h-4 mr-2" />
                      Gửi Tin nhắn
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <div className="space-y-6">
                <Card className="border-2 bg-gradient-to-br from-primary/10 to-accent/10">
                  <CardContent className="p-8">
                    <Clock className="w-12 h-12 text-primary mb-4" />
                    <h3 className="mb-4">Giờ Làm việc</h3>
                    <div className="space-y-2 text-muted-foreground">
                      <p><strong className="text-foreground">Thứ Hai - Thứ Sáu:</strong> 9:00 - 18:00</p>
                      <p><strong className="text-foreground">Thứ Bảy:</strong> 9:00 - 13:00</p>
                      <p><strong className="text-foreground">Chủ Nhật:</strong> Đóng cửa</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardContent className="p-8">
                    <h3 className="mb-4">Câu hỏi Thường gặp</h3>
                    <p className="text-muted-foreground mb-4">
                      Trước khi liên hệ, bạn có thể tìm câu trả lời cho các câu hỏi phổ biến trong phần FAQ của chúng tôi.
                    </p>
                    <Button variant="outline" className="w-full border-2" onClick={() => window.location.href = '/faq'}>
                      Xem FAQ
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 bg-gradient-to-br from-primary/5 to-accent/5">
                  <CardContent className="p-8">
                    <h3 className="mb-4">Hỗ trợ Khẩn cấp</h3>
                    <p className="text-muted-foreground mb-4">
                      Đối với các vấn đề khẩn cấp cần giải quyết ngay lập tức, vui lòng gọi cho hotline hỗ trợ của chúng tôi.
                    </p>
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <Phone className="w-5 h-5" />
                      <span>+84 123 456 789</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Map or Additional Info */}
            <Card className="mt-8 border-2">
              <CardContent className="p-0">
                <div className="h-64 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Bản đồ văn phòng</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
