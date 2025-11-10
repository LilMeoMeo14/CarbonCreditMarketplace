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
  const { login } = useAppContext();
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  });
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const result = login(formData.email, formData.password);
    
    if (result.success && result.user) {
      // Navigate based on role
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
          navigateTo('/');
      }
    } else {
      setError('Email hoặc mật khẩu không đúng');
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
          <div className="mt-4 p-3 bg-muted rounded-lg text-xs space-y-1">
            <div className="font-medium mb-2">Tài khoản test:</div>
            <div>✅ CVA: cvakiemduyet / cva123</div>
            <div>⚙️ Admin: admin / admin123</div>
          </div>
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
              <Label htmlFor="email">Email / Tên đăng nhập</Label>
              <Input
                id="email"
                type="text"
                placeholder="Email hoặc cvakiemduyet / admin"
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
            <Button type="submit" className="w-full">
              Đăng nhập
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
