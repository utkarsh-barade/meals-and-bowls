import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from './Input';
import Button from './Button';

const schema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  mobileNumber: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
});

export default function CustomerForm({ defaultValues, onSubmit, isSubmitting, submitLabel = 'Save' }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {
      fullName: '',
      mobileNumber: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Full Name"
        id="fullName"
        placeholder="Enter full name"
        {...register('fullName')}
        error={errors.fullName?.message}
      />

      <Input
        label="Mobile Number"
        id="mobileNumber"
        placeholder="10-digit mobile number"
        {...register('mobileNumber')}
        error={errors.mobileNumber?.message}
      />

      <div className="pt-2">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
