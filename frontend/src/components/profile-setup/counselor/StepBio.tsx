import { useFormContext } from 'react-hook-form';
import Input from '@/components/ui/Input';

export default function StepBio() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-900">Tell us about yourself</h2>
      <p className="text-sm text-gray-500">
        Write a short bio that will appear on your public profile.
      </p>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
        <textarea
          {...register('bio', { required: 'Bio is required', minLength: { value: 50, message: 'Bio should be at least 50 characters' } })}
          rows={5}
          className="px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          placeholder="I am an experienced counselor with expertise in ..."
        />
        {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio.message as string}</p>}
      </div>
    </div>
  );
}