import { useFormContext, useFieldArray } from 'react-hook-form';
import Input from '@/components/ui/Input';
import { FaPlus, FaTrash } from 'react-icons/fa';

export default function StepStudyPreferences() {
  const { control, register, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'studyPreferences',
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-900">Study Preferences</h2>
      <p className="text-sm text-gray-500">Add one or more target countries, fields, and degree levels.</p>

      {fields.map((field, index) => (
        <div key={field.id} className="p-4 border border-gray-200 rounded-lg relative">
          <button
            type="button"
            onClick={() => remove(index)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
          >
            <FaTrash size={14} />
          </button>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Country"
              {...register(`studyPreferences.${index}.country`, { required: 'Country is required' })}
              error={(errors.studyPreferences as any)?.[index]?.country?.message}
            />
            <Input
              label="Field of Study"
              {...register(`studyPreferences.${index}.fieldOfStudy`, { required: 'Field is required' })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Degree Level</label>
              <select
                {...register(`studyPreferences.${index}.degreeLevel`, { required: 'Degree level required' })}
                className="px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                <option value="">Select...</option>
                <option value="undergraduate">Undergraduate</option>
                <option value="master">Master's</option>
                <option value="phd">PhD</option>
                <option value="postdoc">Postdoc</option>
              </select>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ country: '', fieldOfStudy: '', degreeLevel: 'undergraduate' })}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      >
        <FaPlus className="mr-2" /> Add Preference
      </button>
    </div>
  );
}