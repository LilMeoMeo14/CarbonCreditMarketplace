import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { useAppContext } from '../../../contexts/AppContext';
import { useRouter } from '../../../contexts/RouterContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Separator } from '../../ui/separator';
import { Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';

export function Cart() {
  const { cart, removeFromCart, updateCartQuantity } = useAppContext();
  const { navigateTo } = useRouter();

  const subtotal = cart.reduce((sum, item) => sum + (item.credit.price * item.quantity), 0);
  const platformFee = subtotal * 0.05;
  const total = subtotal + platformFee;

  const handleQuantityChange = (creditId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(creditId);
    } else {
      updateCartQuantity(creditId, newQuantity);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1>Giỏ hàng</h1>
        <p className="text-muted-foreground mt-2">
          Xem lại các tín chỉ carbon bạn muốn mua
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm ({cart.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    Giỏ hàng của bạn đang trống
                  </p>
                  <Button onClick={() => navigateTo('/buyer/marketplace')}>
                    Tiếp tục mua sắm
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.creditId} className="flex gap-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{item.credit.projectInfo?.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.credit.vehicle} - {item.credit.region}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="text-lg font-bold">
                            {item.credit.price.toLocaleString('vi-VN')} ₫/tCO₂
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Còn {item.credit.projectInfo?.availableCredits || 0} tCO₂
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuantityChange(item.creditId, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.creditId, parseInt(e.target.value))}
                            className="w-16 text-center"
                            min="1"
                            max={item.credit.projectInfo?.availableCredits || 0}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleQuantityChange(item.creditId, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="text-lg font-bold">
                          {(item.credit.price * item.quantity).toLocaleString('vi-VN')} ₫
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item.creditId)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Tổng đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>{subtotal.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phí nền tảng (5%)</span>
                  <span>{platformFee.toLocaleString('vi-VN')} ₫</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng cộng</span>
                  <span>{total.toLocaleString('vi-VN')} ₫</span>
                </div>

                <Button 
                  className="w-full mt-4"
                  disabled={cart.length === 0}
                  onClick={() => navigateTo('/buyer/checkout')}
                >
                  Thanh toán
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => navigateTo('/buyer/marketplace')}
                >
                  Tiếp tục mua sắm
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Trust Badges */}
          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Xác minh bởi CVA</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Thanh toán an toàn</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Chứng chỉ ngay lập tức</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
