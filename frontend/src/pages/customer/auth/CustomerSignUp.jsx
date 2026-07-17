import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Utensils, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/authService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const schema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters.')
      .max(100, 'Full name must be under 100 characters.'),
    mobile: z
      .string()
      .min(1, 'Mobile number is required.')
      .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export default function CustomerSignUp() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await authService.customerRegister(data);
      setIsSuccess(true);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Registration failed. Please try again.';
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
          <h1 className="text-page-title text-text-primary">Create Account</h1>
          <p className="text-small text-text-secondary mt-1">
            Register for an account to start your meal subscription.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-card shadow-card border border-surface-border p-8">

          {serverError && (
            <div className="mb-5 p-3.5 rounded-btn bg-danger/5 border border-danger/20 text-small text-danger">
              {serverError}
            </div>
          )}

          {isSuccess ? (
            <div className="text-center space-y-4 py-4">
              <div className="mx-auto w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mb-4">
                <Utensils size={32} />
              </div>
              <h2 className="text-h3 font-bold text-text-primary">Registration Submitted!</h2>
              <p className="text-text-secondary">
                Your account is currently pending admin approval. You will be able to log in once your request is approved.
              </p>
              <div className="pt-4">
                <Link to="/customer/login">
                  <Button fullWidth>Return to Login</Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">

            <Input
              id="signup-name"
              label="Full Name"
              type="text"
              placeholder="e.g. Ravi Kumar"
              required
              error={errors.fullName?.message}
              {...register('fullName')}
            />

            <Input
              id="signup-mobile"
              label="Mobile Number"
              type="tel"
              placeholder="e.g. 9876543210"
              required
              error={errors.mobile?.message}
              {...register('mobile')}
            />

            <div className="relative">
              <Input
                id="signup-password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 characters"
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

            <div className="relative">
              <Input
                id="signup-confirm"
                label="Confirm Password"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Re-enter your password"
                required
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-text-placeholder hover:text-text-secondary
                           transition-colors focus:outline-none"
                onClick={() => setShowConfirm((p) => !p)}
                tabIndex={-1}
                aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
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
                  Creating account…
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Create Account
                </>
              )}
            </Button>
          </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-small text-text-secondary">
              Already have an account?{' '}
              <Link
                to="/customer/login"
                className="text-primary font-medium hover:underline focus:outline-none
                           focus-visible:ring-2 focus-visible:ring-primary rounded"
              >
                Sign In
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
