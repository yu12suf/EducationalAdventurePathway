import { useFormContext } from 'react-hook-form';

export default function StepReview() {
  const { watch } = useFormContext();
  const data = watch();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-900">Review Your Profile</h2>
      <p className="text-sm text-gray-500">Please check the information below before submitting.</p>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium">Bio</h3>
        <p className="text-sm text-gray-700">{data.bio || 'Not provided'}</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium">Professional Background</h3>
        <p className="text-sm text-gray-700">University: {data.university || 'Not provided'}</p>
        <p className="text-sm text-gray-700">Degree: {data.degree || 'Not provided'}</p>
        <p className="text-sm text-gray-700">Years of Experience: {data.yearsOfExperience}</p>
        <p className="text-sm text-gray-700">Areas of Expertise: {data.areasOfExpertise?.join(', ') || 'None'}</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium">Languages & Consultation</h3>
        <p className="text-sm text-gray-700">Languages: {data.languages?.join(', ') || 'None'}</p>
        <p className="text-sm text-gray-700">Consultation Modes: {data.consultationModes?.join(', ') || 'None'}</p>
        <p className="text-sm text-gray-700">Hourly Rate: {data.hourlyRate ? `${data.hourlyRate} ETB` : 'Not set (free)'}</p>
      </div>

      <p className="text-xs text-gray-400">
        By submitting, you confirm that the information provided is accurate.
      </p>
    </div>
  );
}