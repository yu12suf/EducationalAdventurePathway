import { useFormContext } from 'react-hook-form';
import Input from '@/components/ui/Input';

export default function StepFundingTest() {
  const { register, watch } = useFormContext();
  const fundingNeed = watch('fundingNeed');

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Funding & Test Status</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Do you need financial aid?</label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="true"
              {...register('fundingNeed')}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Yes</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="false"
              {...register('fundingNeed')}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">No</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">English Proficiency Level (CEFR)</label>
        <select
          {...register('englishProficiencyLevel')}
          className="px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        >
          <option value="">Select (if known)</option>
          <option value="A1">A1 - Beginner</option>
          <option value="A2">A2 - Elementary</option>
          <option value="B1">B1 - Intermediate</option>
          <option value="B2">B2 - Upper Intermediate</option>
          <option value="C1">C1 - Advanced</option>
          <option value="C2">C2 - Proficient</option>
        </select>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-md font-medium text-gray-900 mb-2">Standardized Test Scores (Optional)</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">IELTS</label>
            <div className="grid grid-cols-2 gap-4 mt-1">
              <Input placeholder="Overall" {...register('standardizedTests.ielts.overall')} />
              <Input placeholder="Listening" {...register('standardizedTests.ielts.listening')} />
              <Input placeholder="Reading" {...register('standardizedTests.ielts.reading')} />
              <Input placeholder="Writing" {...register('standardizedTests.ielts.writing')} />
              <Input placeholder="Speaking" {...register('standardizedTests.ielts.speaking')} />
              <Input type="date" placeholder="Test Date" {...register('standardizedTests.ielts.testDate')} />
            </div>
          </div>
          {/* Similar for TOEFL and GRE – can be expanded */}
        </div>
      </div>
    </div>
  );
}