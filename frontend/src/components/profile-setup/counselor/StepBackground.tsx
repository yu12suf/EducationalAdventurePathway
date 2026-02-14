import { useFormContext } from 'react-hook-form';
import Input from '@/components/ui/Input';
import { useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';

export default function StepBackground() {
  const { register, setValue, watch, formState: { errors } } = useFormContext();
  const [expertiseInput, setExpertiseInput] = useState('');
  const areas = watch('areasOfExpertise') || [];

  const addExpertise = () => {
    if (expertiseInput.trim() && !areas.includes(expertiseInput.trim())) {
      setValue('areasOfExpertise', [...areas, expertiseInput.trim()]);
      setExpertiseInput('');
    }
  };

  const removeExpertise = (item: string) => {
    setValue('areasOfExpertise', areas.filter((i: string) => i !== item));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-900">Professional Background</h2>
      
      <Input
        label="University / Alma Mater"
        {...register('university', { required: 'University is required' })}
        error={errors.university?.message as string}
        placeholder="e.g., Addis Ababa University"
      />

      <Input
        label="Highest Degree"
        {...register('degree', { required: 'Degree is required' })}
        error={errors.degree?.message as string}
        placeholder="e.g., Master's in Computer Science"
      />

      <Input
        label="Years of Experience"
        type="number"
        {...register('yearsOfExperience', { required: 'Years of experience required', valueAsNumber: true })}
        error={errors.yearsOfExperience?.message as string}
        min={0}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Areas of Expertise</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={expertiseInput}
            onChange={(e) => setExpertiseInput(e.target.value)}
            className="flex-1 px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., STEM, Visa Guidance"
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addExpertise(); } }}
          />
          <button
            type="button"
            onClick={addExpertise}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FaPlus />
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {areas.map((item: string) => (
            <span key={item} className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {item}
              <button type="button" onClick={() => removeExpertise(item)} className="ml-2 text-blue-600 hover:text-blue-800">
                <FaTimes size={12} />
              </button>
            </span>
          ))}
        </div>
        {errors.areasOfExpertise && <p className="mt-1 text-sm text-red-600">{errors.areasOfExpertise.message as string}</p>}
      </div>
    </div>
  );
}