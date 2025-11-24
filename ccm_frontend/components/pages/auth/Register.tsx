import React from 'react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { useRouter } from '../../../contexts/RouterContext';
import { useAppContext } from '../../../contexts/AppContext';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Alert, AlertDescription } from '../../ui/alert';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';

export function Register() {
  const { navigateTo } = useRouter();
  const { register } = useAppContext();

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'EV_OWNER',
  });
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. Validate Password (Backend yêu cầu min 8)
    if (formData.password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự (Yêu cầu bảo mật)');
      return;
    }

    if (formData.password.length > 30) {
      setError('Mật khẩu không được quá 30 ký tự');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    // 2. Validate Phone (Backend yêu cầu đúng 10 số)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Số điện thoại phải bao gồm đúng 10 chữ số');
      return;
    }

    setIsLoading(true);

    // Prepare user data
    const userData = {
      email: formData.email,
      password: formData.password,
      name: formData.name,
      role: formData.role as 'EV_OWNER' | 'BUYER',
      phone: formData.phone,
      address: ''
    };

    try {
      const result = await register(userData);
      if (result.success) {
        navigateTo('/login');
      } else {
        setError(result.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      setError('Đã có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card>
        <CardHeader>
          <CardTitle>Tạo Tài Khoản</CardTitle>
          <CardDescription>
            Tham gia nền tảng của chúng tôi và bắt đầu giao dịch tín chỉ carbon
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* HỌ VÀ TÊN */}
            <div>
              <Label htmlFor="name">Họ và Tên</Label>
              <Input
                id="name"
                type="text"
                placeholder=""
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* EMAIL */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            {/* SỐ ĐIỆN THOẠI - MỚI */}
            <div>
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0912345678"
                value={formData.phone}
                onChange={(e) => {
                  // Chỉ cho phép nhập số
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setFormData({ ...formData, phone: value })
                }}
                maxLength={10} // UI limit
                required
              />
            </div>

            {/* ROLE SELECTION */}
            <div>
              <Label>Bạn là:</Label>
              <RadioGroup
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
                className="mt-2"
              >
                <div className={`flex items-center space-x-2 border rounded-lg p-4 cursor-pointer transition-colors ${formData.role === 'EV_OWNER' ? 'bg-accent border-primary' : 'hover:bg-accent'}`}>
                  <RadioGroupItem value="EV_OWNER" id="seller" />
                  <Label htmlFor="seller" className="flex-1 cursor-pointer">
                    <div className="font-semibold">Người Bán (Chủ xe điện)</div>
                    <p className="text-sm text-muted-foreground">Tôi muốn bán tín chỉ carbon từ xe điện</p>
                  </Label>
                </div>
                <div className={`flex items-center space-x-2 border rounded-lg p-4 cursor-pointer transition-colors ${formData.role === 'BUYER' ? 'bg-accent border-primary' : 'hover:bg-accent'}`}>
                  <RadioGroupItem value="BUYER" id="buyer" />
                  <Label htmlFor="buyer" className="flex-1 cursor-pointer">
                    <div className="font-semibold">Người Mua</div>
                    <p className="text-sm text-muted-foreground">Tôi muốn mua tín chỉ carbon</p>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* PASSWORD */}
            <div>
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="Tối thiểu 8 ký tự"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Tạo tài khoản'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-muted-foreground">Đã có tài khoản? </span>
            <button
              onClick={() => navigateTo('/login')}
              className="text-primary hover:underline"
            >
              Đăng nhập ngay
            </button>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}