import { useFormContext } from 'react-hook-form';
import Input from '@/components/ui/Input';

export default function StepPersonalInfo() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
      
      {/* First and Last Name in a two‑column layout */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="First Name"
          {...register('firstName', { required: 'First name is required' })}
          error={errors.firstName?.message as string}
        />
        <Input
          label="Last Name"
          {...register('lastName', { required: 'Last name is required' })}
          error={errors.lastName?.message as string}
        />
      </div>

      <Input
        label="Nationality"
        {...register('nationality', { required: 'Nationality is required' })}
        error={errors.nationality?.message as string}
        placeholder="e.g., Ethiopian"
      />
      <Input
        label="Current Location (optional)"
        {...register('currentLocation')}
        placeholder="City, Country"
      />
      <Input
        label="Date of Birth (optional)"
        type="date"
        {...register('dateOfBirth')}
      />
      <Input
        label="Phone Number (optional)"
        {...register('phone')}
        placeholder="+251 912 345 678"
      />
    </div>
  );
}