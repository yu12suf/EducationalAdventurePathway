import { useFormContext } from 'react-hook-form';
import { format } from 'date-fns';

export default function StepReview() {
  const { watch } = useFormContext();
  const formData = watch();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-900">Review Your Profile</h2>
      <p className="text-sm text-gray-500">Please review your information before submitting.</p>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium">Study Level</h3>
        <p className="text-sm text-gray-700 capitalize">{formData.studyLevel || 'Not selected'}</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium">Personal Information</h3>
        <p className="text-sm text-gray-700">Nationality: {formData.nationality || 'Not provided'}</p>
        <p className="text-sm text-gray-700">Location: {formData.currentLocation || 'Not provided'}</p>
        <p className="text-sm text-gray-700">Date of Birth: {formData.dateOfBirth ? format(new Date(formData.dateOfBirth), 'PPP') : 'Not provided'}</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium">Academic History</h3>
        {formData.academicHistory?.map((entry: any, idx: number) => (
          <div key={idx} className="text-sm">
            <p>{entry.institution} – {entry.degree} ({entry.graduationYear})</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400">
        By submitting, you confirm that the information provided is accurate.
      </p>
    </div>
  );
}