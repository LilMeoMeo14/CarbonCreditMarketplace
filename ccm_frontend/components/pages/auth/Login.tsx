import React from 'react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { useRouter } from '../../../contexts/RouterContext';
import { useAppContext } from '../../../contexts/AppContext';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Alert, AlertDescription } from '../../ui/alert';
import { AlertCircle } from 'lucide-react';

export function Login() {
  const { navigateTo } = useRouter();
  // Lấy hàm login từ AppContext 
  const { login } = useAppContext();

  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  });
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Gọi hàm login từ Context
      // Hàm này sẽ tự động: Gọi API Backend -> Lưu Token -> Giải mã User -> Update State
      const result = await login(formData.email, formData.password);

      if (result.success && result.user) {
        // Điều hướng dựa trên Role (Đã được AppContext xử lý sạch sẽ)
        switch (result.user.role) {
          case 'CVA':
            navigateTo('/cva/dashboard');
            break;
          case 'ADMIN':
            navigateTo('/admin/dashboard');
            break;
          case 'BUYER':
            navigateTo('/buyer/dashboard');
            break;
          case 'EV_OWNER':
            navigateTo('/ev-owner/dashboard');
            break;
          default:
            navigateTo('/'); // Trang chủ mặc định
        }
      } else {
        // Hiển thị lỗi từ Backend trả về (ví dụ: Sai mật khẩu)
        setError(result.message || 'Đăng nhập thất bại');
      }

    } catch (err) {
      console.error("Login UI Error:", err);
      setError('Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card>
        <CardHeader>
          <CardTitle>Đăng nhập</CardTitle>
          <CardDescription>
            Đăng nhập vào tài khoản của bạn để tiếp tục
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nhom12@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <button
                  type="button"
                  onClick={() => navigateTo('/password-reset')}
                  className="text-sm text-primary hover:underline"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-muted-foreground">Chưa có tài khoản? </span>
            <button
              onClick={() => navigateTo('/register')}
              className="text-primary hover:underline"
            >
              Đăng ký ngay
            </button>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}