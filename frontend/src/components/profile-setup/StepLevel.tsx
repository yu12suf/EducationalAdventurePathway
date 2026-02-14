import { useFormContext } from 'react-hook-form';
import { StudentProfileFormData } from './types';
import { FaGraduationCap } from 'react-icons/fa';

export default function StepLevel() {
  const { register, setValue, watch, formState: { errors } } = useFormContext<StudentProfileFormData>();
  const studyLevel = watch('studyLevel');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Select your intended study level</h2>
        <p className="text-sm text-gray-500">
          This helps us tailor the rest of the form to your needs.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {(['undergraduate', 'master', 'phd'] as const).map((level) => (
          <label
            key={level}
            className={`
              relative block rounded-lg border p-4 cursor-pointer hover:border-blue-500
              ${studyLevel === level ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}
            `}
          >
            <input
              type="radio"
              value={level}
              {...register('studyLevel', { required: 'Please select your study level' })}
              className="sr-only"
            />
            <div className="flex items-center">
              <FaGraduationCap className={`h-6 w-6 ${studyLevel === level ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className="ml-3 block text-sm font-medium text-gray-900 capitalize">{level}</span>
            </div>
            {studyLevel === level && (
              <div className="absolute inset-0 border-2 border-blue-600 rounded-lg pointer-events-none" />
            )}
          </label>
        ))}
      </div>
      {errors.studyLevel && (
        <p className="text-sm text-red-600">{errors.studyLevel.message}</p>
      )}
    </div>
  );
}