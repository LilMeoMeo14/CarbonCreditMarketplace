import React from 'react';
import { useRouter } from '../../contexts/RouterContext';
import { Leaf, Zap, Shield, TrendingUp } from 'lucide-react';
//import { ImageWithFallback } from '../figma/ImageWithFallback';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { navigateTo } = useRouter();

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left side - Branding */}
      <div className="hidden md:flex flex-col justify-center items-center relative overflow-hidden p-12">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
          src="https://images.unsplash.com/photo-1726471819205-faf7d51590bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBjaGFyZ2luZyUyMGdyZWVufGVufDF8fHx8MTc2MDYxNTg3M3ww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="EV Charging"
          className="w-full h-full object-cover"
           onError={(e) => {
           const target = e.target as HTMLImageElement;
          target.onerror = null; // Ngăn lặp vô hạn
           target.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // Ảnh trống 1px
          }}
        />
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-accent/90" />
        </div>

        <div className="max-w-md relative z-10 text-white">
          <div 
            className="flex items-center gap-3 mb-8 cursor-pointer"
            onClick={() => navigateTo('/')}
          >
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border-2 border-white/30">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold">EV Carbon Market</span>
          </div>
          
          <h2 className="mb-4 text-white">Biến Xe Điện Thành Công Cụ Tạo Tín Chỉ Carbon</h2>
          <p className="text-white/90 mb-8 text-lg">
            Tham gia cùng hàng nghìn chủ xe điện đang kiếm tiền từ việc bảo vệ môi trường. 
            Theo dõi, xác minh và bán lượng carbon tiết kiệm trên thị trường an toàn của chúng tôi.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-white">Theo dõi Tự động</div>
                <div className="text-sm text-white/80">Giám sát thời gian thực lượng carbon tiết kiệm của bạn</div>
              </div>
            </div>
            
            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-white">Tín chỉ Đã Xác minh</div>
                <div className="text-sm text-white/80">Chứng nhận chuyên nghiệp bởi các đối tác CVA</div>
              </div>
            </div>
            
            <div className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-white">Thị trường An toàn</div>
                <div className="text-sm text-white/80">Giao dịch an toàn với người mua toàn cầu</div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/20">
            <p className="text-white/70 text-sm">
              🌱 Đã có <span className="font-semibold text-white">5,000+</span> chủ xe điện tham gia
            </p>
            <p className="text-white/70 text-sm mt-2">
              💰 Trung bình <span className="font-semibold text-white">2-6 triệu VNĐ</span>/năm từ carbon tiết kiệm
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-col justify-center items-center p-6 md:p-12 bg-gradient-to-br from-background to-muted/30">
        <div className="w-full max-w-md">
          <div 
            className="flex md:hidden items-center gap-2 mb-8 cursor-pointer justify-center"
            onClick={() => navigateTo('/')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-xl">EV Carbon Market</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
