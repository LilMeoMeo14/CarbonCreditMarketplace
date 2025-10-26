import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { useAppContext } from '../../../contexts/AppContext';
import { useRouter } from '../../../contexts/RouterContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Separator } from '../../ui/separator';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
import { CreditCard, Wallet, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export function Checkout() {
  const { cart, purchaseCredits, clearCart } = useAppContext();
  const { navigateTo } = useRouter();
  const [paymentMethod, setPaymentMethod] = React.useState('vnpay');
  const [processing, setProcessing] = React.useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.credit.price * item.quantity), 0);
  const platformFee = subtotal * 0.05;
  const total = subtotal + platformFee;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // Save purchase to history
      const result = purchaseCredits(cart);
      if (result.success) {
        clearCart();
        toast.success('✅ Thanh toán thành công! Chứng chỉ carbon đã được gửi tới email của bạn.');
        
        // Navigate to history page after short delay
        setTimeout(() => {
          navigateTo('/buyer/history');
        }, 1000);
      } else {
        toast.error('Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.');
      }
      setProcessing(false);
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              Giỏ hàng của bạn đang trống
            </p>
            <Button onClick={() => navigateTo('/buyer/marketplace')}>
              Tiếp tục mua sắm
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1>Thanh toán</h1>
        <p className="text-muted-foreground mt-2">
          Hoàn tất đơn hàng và nhận chứng chỉ carbon
        </p>
      </div>

      <form onSubmit={handleCheckout}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Billing Info */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin thanh toán</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input id="fullName" placeholder="Nguyễn Văn A" required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="email@example.com" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="company">Công ty (tùy chọn)</Label>
                  <Input id="company" placeholder="Tên công ty" />
                </div>
                <div>
                  <Label htmlFor="taxCode">Mã số thuế (tùy chọn)</Label>
                  <Input id="taxCode" placeholder="0123456789" />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Phương thức thanh toán</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="vnpay" id="vnpay" />
                    <Label htmlFor="vnpay" className="flex-1 cursor-pointer flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      <div>
                        <div>VNPay</div>
                        <p className="text-sm text-muted-foreground">Thanh toán qua VNPay</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="momo" id="momo" />
                    <Label htmlFor="momo" className="flex-1 cursor-pointer flex items-center gap-2">
                      <Wallet className="w-5 h-5" />
                      <div>
                        <div>MoMo</div>
                        <p className="text-sm text-muted-foreground">Thanh toán qua ví MoMo</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank" className="flex-1 cursor-pointer flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      <div>
                        <div>Chuyển khoản ngân hàng</div>
                        <p className="text-sm text-muted-foreground">Chuyển khoản trực tiếp</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Đơn hàng ({cart.length} sản phẩm)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.creditId} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <div className="font-medium">{item.credit.projectInfo?.title}</div>
                        <div className="text-muted-foreground">
                          {item.quantity} tCO₂ × {item.credit.price.toLocaleString('vi-VN')} ₫
                        </div>
                      </div>
                      <div className="font-medium">
                        {(item.quantity * item.credit.price).toLocaleString('vi-VN')} ₫
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tạm tính</span>
                    <span>{subtotal.toLocaleString('vi-VN')} ₫</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phí nền tảng (5%)</span>
                    <span>{platformFee.toLocaleString('vi-VN')} ₫</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng cộng</span>
                    <span>{total.toLocaleString('vi-VN')} ₫</span>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={processing}>
                  {processing ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  Bằng việc thanh toán, bạn đồng ý với{' '}
                  <button type="button" className="text-primary hover:underline">
                    Điều khoản dịch vụ
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}
