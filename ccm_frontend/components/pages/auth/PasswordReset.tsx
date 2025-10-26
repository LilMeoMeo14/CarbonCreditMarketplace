import React from 'react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { useRouter } from '../../../contexts/RouterContext';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';

export function PasswordReset() {
  const { navigateTo } = useRouter();
  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock password reset - in production this would call API
    setSubmitted(true);
  };

  return (
    <AuthLayout>
      <Card>
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            {submitted 
              ? "Check your email for password reset instructions"
              : "Enter your email to receive password reset instructions"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-muted-foreground">
                We've sent password reset instructions to <strong>{email}</strong>
              </p>
              <Button variant="outline" onClick={() => setSubmitted(false)}>
                Try Another Email
              </Button>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => navigateTo('/login')}
              className="text-primary hover:underline"
            >
              Back to login
            </button>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
