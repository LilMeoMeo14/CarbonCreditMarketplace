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
    password: '',
    confirmPassword: '',
    role: 'EV_OWNER',
  });
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    // Prepare user data with correct role
    const userData = {
      email: formData.email,
      password: formData.password,
      name: formData.name,
      role: formData.role, // BUYER or EV_OWNER - THIS IS KEY!
      phone: '',
      address: ''
    };

    console.log('Registering user with role:', userData.role); // Debug

    const result = register(userData);
    if (result.success) {
      navigateTo('/login');
    } else {
      setError(result.message || 'Đăng ký thất bại');
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
            <div>
              <Label htmlFor="name">Họ và Tên</Label>
              <Input
                id="name"
                type="text"
                placeholder="Nguyễn Văn A"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
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
            <div>
              <Label>Bạn là:</Label>
              <RadioGroup 
                value={formData.role} 
                onValueChange={(value) => setFormData({ ...formData, role: value })}
                className="mt-2"
              >
                <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="EV_OWNER" id="seller" />
                  <Label htmlFor="seller" className="flex-1 cursor-pointer">
                    <div>Người Bán (Chủ xe điện)</div>
                    <p className="text-sm text-muted-foreground">Tôi muốn bán tín chỉ carbon từ xe điện</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent cursor-pointer">
                  <RadioGroupItem value="BUYER" id="buyer" />
                  <Label htmlFor="buyer" className="flex-1 cursor-pointer">
                    <div>Người Mua</div>
                    <p className="text-sm text-muted-foreground">Tôi muốn mua tín chỉ carbon</p>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="Tối thiểu 6 ký tự"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
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
            
            {/* Show selected role */}
            <div className="bg-primary/10 border border-primary/30 p-3 rounded-lg text-sm">
              <strong>Vai trò đã chọn:</strong>{' '}
              {formData.role === 'BUYER' ? '👤 Người Mua' : '🚗 Người Bán (Chủ xe điện)'}
            </div>

            <Button type="submit" className="w-full">
              Tạo tài khoản
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