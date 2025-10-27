import React from 'react';
import { PublicLayout } from '../../layouts/PublicLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../ui/accordion';
import { Button } from '../../ui/button';
import { useRouter } from '../../../contexts/RouterContext';
import { HelpCircle, MessageCircle } from 'lucide-react';

export function FAQ() {
  const { navigateTo } = useRouter();

  const faqs = [
    {
      category: 'Câu hỏi Chung',
      questions: [
        {
          q: 'Tín chỉ carbon là gì?',
          a: 'Tín chỉ carbon đại diện cho việc giảm một tấn CO₂ phát thải. Chủ xe điện tạo ra tín chỉ bằng cách tránh phát thải so với xe thông thường.',
        },
        {
          q: 'Nền tảng hoạt động như thế nào?',
          a: 'Kết nối xe điện của bạn, tự động theo dõi lượng carbon tiết kiệm, xác minh tín chỉ qua CVA, sau đó niêm yết và bán chúng trên thị trường của chúng tôi.',
        },
        {
          q: 'Điều này có hợp pháp không?',
          a: 'Có. Tất cả tín chỉ được xác minh bởi các tổ chức bên thứ ba được chứng nhận (CVA) theo tiêu chuẩn quốc tế như ISO 14064.',
        },
        {
          q: 'Tôi cần bắt đầu từ đâu?',
          a: 'Đăng ký tài khoản miễn phí, thêm thông tin xe điện của bạn, kết nối thiết bị theo dõi và bắt đầu tích lũy carbon tiết kiệm.',
        },
      ],
    },
    {
      category: 'Dành cho Chủ Xe Điện',
      questions: [
        {
          q: 'Những xe nào được hỗ trợ?',
          a: 'Chúng tôi hỗ trợ hầu hết các hãng xe điện lớn bao gồm Tesla, VinFast, BYD, Hyundai, Kia và nhiều hơn nữa. Kiểm tra danh sách tương thích khi đăng ký.',
        },
        {
          q: 'Tôi có thể kiếm được bao nhiêu?',
          a: 'Thu nhập thay đổi tùy thuộc vào quãng đường lái xe và giá thị trường. Chủ xe điện trung bình tiết kiệm 1.250 kg CO₂ hàng năm, có thể tạo ra 2-6 triệu VNĐ tùy thuộc vào giá tín chỉ.',
        },
        {
          q: 'Làm thế nào để nhận thanh toán?',
          a: 'Thanh toán được xử lý an toàn thông qua nền tảng của chúng tôi. Bạn có thể rút tiền vào tài khoản ngân hàng khi đạt ngưỡng tối thiểu.',
        },
        {
          q: 'Mất bao lâu để xác minh tín chỉ?',
          a: 'Quá trình xác minh CVA thường mất 5-10 ngày làm việc sau khi bạn gửi hồ sơ đầy đủ với tài liệu minh chứng.',
        },
      ],
    },
    {
      category: 'Dành cho Người Mua',
      questions: [
        {
          q: 'Ai có thể mua tín chỉ carbon?',
          a: 'Bất kỳ ai cũng có thể mua - cá nhân muốn bù đắp dấu chân carbon của họ hoặc doanh nghiệp đáp ứng mục tiêu ESG.',
        },
        {
          q: 'Tín chỉ có được loại bỏ vĩnh viễn không?',
          a: 'Có. Khi bạn loại bỏ tín chỉ để bù đắp, chúng sẽ bị loại bỏ vĩnh viễn khỏi lưu thông với theo dõi số sê-ri duy nhất.',
        },
        {
          q: 'Tôi có thể nhận chứng chỉ không?',
          a: 'Có. Bạn nhận được chứng chỉ có thể tải xuống cho tất cả tín chỉ đã loại bỏ, phù hợp cho báo cáo ESG.',
        },
        {
          q: 'Làm thế nào để xác minh tính xác thực của tín chỉ?',
          a: 'Mỗi tín chỉ có số sê-ri duy nhất và được liên kết với báo cáo xác minh CVA mà bạn có thể xem và tải xuống.',
        },
      ],
    },
    {
      category: 'Bảo mật & Thanh toán',
      questions: [
        {
          q: 'Dữ liệu của tôi có an toàn không?',
          a: 'Có. Chúng tôi sử dụng mã hóa cấp ngân hàng và tuân thủ các tiêu chuẩn bảo mật dữ liệu quốc tế.',
        },
        {
          q: 'Phương thức thanh toán nào được chấp nhận?',
          a: 'Chúng tôi chấp nhận thẻ tín dụng/ghi nợ, chuyển khoản ngân hàng và ví điện tử phổ biến tại Việt Nam.',
        },
        {
          q: 'Có đảm bảo hoàn tiền không?',
          a: 'Tín chỉ carbon không thể hoàn lại sau khi đã loại bỏ. Tuy nhiên, chúng tôi có chính sách bảo vệ người mua cho các giao dịch chưa hoàn tất.',
        },
      ],
    },
  ];

  return (
    <PublicLayout>
      <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm rounded-full mb-6">
                <HelpCircle className="w-4 h-4 text-primary" />
                <span className="text-primary font-medium">Câu Hỏi Thường Gặp</span>
              </div>
              <h1 className="mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Câu Hỏi Thường Gặp</h1>
              <p className="text-muted-foreground text-lg">
                Tìm câu trả lời cho các câu hỏi phổ biến về nền tảng của chúng tôi
              </p>
            </div>

            <div className="space-y-8">
              {faqs.map((category, index) => (
                <div key={index}>
                  <h3 className="mb-4 text-primary">{category.category}</h3>
                  <Accordion type="single" collapsible className="space-y-2">
                    {category.questions.map((faq, i) => (
                      <AccordionItem 
                        key={i} 
                        value={`item-${index}-${i}`}
                        className="border-2 border-border rounded-lg px-4 hover:border-primary/50 transition-colors"
                      >
                        <AccordionTrigger className="hover:no-underline font-medium">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>

            <div className="mt-12 p-8 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl text-center border-2 border-primary/20">
              <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h4 className="mb-2">Vẫn còn câu hỏi?</h4>
              <p className="text-muted-foreground mb-4">
                Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button onClick={() => navigateTo('/contact')} className="shadow-lg shadow-primary/20">
                  Liên hệ Hỗ trợ
                </Button>
                <Button variant="outline" onClick={() => navigateTo('/register')} className="border-2">
                  Đăng ký Ngay
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
