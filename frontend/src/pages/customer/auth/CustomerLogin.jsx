import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Utensils, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/authService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const schema = z.object({
  mobile: z
    .string()
    .min(1, 'Mobile number is required.')
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number.'),
  password: z.string().min(1, 'Password is required.'),
});

export default function CustomerLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const authData = await authService.customerLogin(data);
      login(authData);
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Login failed. Please check your credentials.';
      setServerError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-2xl shadow-md mb-4">
            <Utensils size={28} className="text-white" />
          </div>
          <h1 className="text-page-title text-text-primary">Welcome Back</h1>
          <p className="text-small text-text-secondary mt-1">
            Sign in to your Meals &amp; Bowls account
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-card shadow-card border border-surface-border p-8">

          {serverError && (
            <div className="mb-5 p-3.5 rounded-btn bg-danger/5 border border-danger/20 text-small text-danger">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

            <Input
              id="customer-mobile"
              label="Mobile Number"
              type="tel"
              placeholder="e.g. 9876543210"
              required
              error={errors.mobile?.message}
              {...register('mobile')}
            />

            <div className="relative">
              <Input
                id="customer-password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                required
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-text-placeholder hover:text-text-secondary
                           transition-colors focus:outline-none"
                onClick={() => setShowPassword((p) => !p)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-small text-text-secondary">
              Don&apos;t have an account?{' '}
              <Link
                to="/signup"
                className="text-primary font-medium hover:underline focus:outline-none
                           focus-visible:ring-2 focus-visible:ring-primary rounded"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-caption text-text-placeholder mt-6">
          Meals &amp; Bowls &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
