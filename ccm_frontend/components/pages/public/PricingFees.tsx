import React from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { useRouter } from '../../../contexts/RouterContext';
import { CheckCircle, Info, Sparkles } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';

export function PricingFees() {
  const { navigateTo } = useRouter();

  const pricingPlans = [
    {
      name: 'Chủ Xe Điện',
      price: 'Miễn phí',
      description: 'Bắt đầu kiếm tiền từ xe điện',
      features: [
        'Theo dõi carbon không giới hạn',
        'Tích hợp telematics',
        'Yêu cầu phát hành tín chỉ',
        'Niêm yết trên thị trường',
        'Phí nền tảng 10% trên doanh số',
      ],
    },
    {
      name: 'Người Mua - Cá nhân',
      price: 'Miễn phí',
      description: 'Mua tín chỉ carbon',
      features: [
        'Xem tất cả danh sách',
        'Thanh toán an toàn',
        'Lịch sử mua hàng',
        'Chứng chỉ có thể tải xuống',
        'Phí giao dịch 2%',
      ],
    },
    {
      name: 'Người Mua - Doanh nghiệp',
      price: 'Tùy chỉnh',
      description: 'Định giá khối lượng',
      features: [
        'Quản lý tài khoản riêng',
        'Định giá tùy chỉnh',
        'Giảm giá mua hàng loạt',
        'Hỗ trợ ưu tiên',
        'Báo cáo ESG hàng quý',
      ],
      highlighted: true,
    },
  ];

  const feeStructure = [
    { type: 'Phí Nền tảng (Người bán)', rate: '10%', description: 'Hoa hồng cho mỗi tín chỉ được bán' },
    { type: 'Phí Giao dịch (Người mua)', rate: '2%', description: 'Phí xử lý thanh toán' },
    { type: 'Xác minh CVA', rate: '100.000-200.000 VNĐ/tín chỉ', description: 'Chi phí xác minh bên thứ ba' },
    { type: 'Phí Rút tiền', rate: '1%', description: 'Tối thiểu 40.000 VNĐ, tối đa 200.000 VNĐ' },
  ];

  return (
    <PublicLayout>
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-primary font-medium">Giá Cả Minh Bạch</span>
            </div>
            <h1 className="mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Định Giá Minh Bạch</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Không có phí ẩn. Biết chính xác những gì bạn sẽ trả.
            </p>
          </div>

          {/* Pricing Plans */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`${plan.highlighted ? 'border-primary border-2 shadow-lg shadow-primary/20 scale-105' : 'border-2'} hover:shadow-xl transition-all`}
              >
                {plan.highlighted && (
                  <div className="bg-gradient-to-r from-primary to-accent text-white text-center py-2 font-medium">
                    Phổ biến nhất
                  </div>
                )}
                <CardHeader>
                  <CardTitle>
                    <div className="text-sm text-muted-foreground mb-2">{plan.name}</div>
                    <div className="text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{plan.price}</div>
                    <div className="text-sm text-muted-foreground mt-2">{plan.description}</div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plan.highlighted ? 'default' : 'outline'}
                    onClick={() => navigateTo('/register')}
                  >
                    Bắt đầu
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Fee Structure Table */}
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-6 text-center">Chi tiết Cấu trúc Phí</h2>
            <Card className="border-2">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Loại Phí</TableHead>
                      <TableHead className="font-semibold">Tỷ lệ</TableHead>
                      <TableHead className="font-semibold">Mô tả</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feeStructure.map((fee, index) => (
                      <TableRow key={index} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{fee.type}</TableCell>
                        <TableCell className="font-semibold text-primary">{fee.rate}</TableCell>
                        <TableCell className="text-muted-foreground">{fee.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Example Calculation */}
          <div className="max-w-2xl mx-auto mt-12">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  Ví dụ Tính toán
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bán 100 tín chỉ @ 200.000 VNĐ mỗi tín chỉ</span>
                    <span className="font-semibold">20.000.000 VNĐ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phí nền tảng (10%)</span>
                    <span className="text-destructive">-2.000.000 VNĐ</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between">
                    <span className="font-semibold">Bạn nhận được</span>
                    <span className="font-semibold text-primary text-xl">18.000.000 VNĐ</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border-2 border-primary/20">
              <h3 className="mb-4">Sẵn sàng bắt đầu kiếm tiền?</h3>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Tham gia hàng nghìn chủ xe điện đang tạo thu nhập thụ động từ tác động môi trường
              </p>
              <Button size="lg" onClick={() => navigateTo('/register')} className="shadow-lg shadow-primary/20">
                Đăng ký Miễn phí Ngay
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
