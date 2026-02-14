import { useFormContext, useWatch } from 'react-hook-form';
import Input from '@/components/ui/Input';
import { StudyLevel } from './types';

export default function StepAcademicHistory() {
  const { register, control, formState: { errors } } = useFormContext();
  const studyLevel = useWatch({ control, name: 'studyLevel' }) as StudyLevel;

  const renderFields = () => {
    switch (studyLevel) {
      case 'undergraduate':
        return (
          <>
            <Input
              label="High School Name"
              {...register('academicHistory.0.institution', { required: 'High school is required' })}
              error={(errors.academicHistory as any)?.[0]?.institution?.message}
            />
            <Input
              label="Graduation Year"
              type="number"
              {...register('academicHistory.0.graduationYear')}
            />
            <Input
              label="National Exam Result (optional)"
              {...register('academicHistory.0.rawGrade')}
              placeholder="e.g., 85% or A"
            />
          </>
        );
      case 'master':
        return (
          <>
            <Input
              label="Bachelor's Degree Institution"
              {...register('academicHistory.0.institution', { required: 'Institution is required' })}
              error={(errors.academicHistory as any)?.[0]?.institution?.message}
            />
            <Input
              label="Degree Title"
              {...register('academicHistory.0.degree', { required: 'Degree title is required' })}
              placeholder="e.g., Bachelor of Science in Computer Science"
            />
            <Input
              label="Field of Study"
              {...register('academicHistory.0.fieldOfStudy', { required: 'Field of study is required' })}
            />
            <Input
              label="GPA (on 4.0 scale)"
              type="number"
              step="0.01"
              {...register('academicHistory.0.gpa')}
            />
            <Input
              label="Graduation Year"
              type="number"
              {...register('academicHistory.0.graduationYear')}
            />
          </>
        );
      case 'phd':
        return (
          <>
            <Input
              label="Master's Degree Institution"
              {...register('academicHistory.0.institution', { required: 'Institution is required' })}
              error={(errors.academicHistory as any)?.[0]?.institution?.message}
            />
            <Input
              label="Degree Title"
              {...register('academicHistory.0.degree', { required: 'Degree title is required' })}
            />
            <Input
              label="Field of Study"
              {...register('academicHistory.0.fieldOfStudy', { required: 'Field of study is required' })}
            />
            <Input
              label="GPA (on 4.0 scale)"
              type="number"
              step="0.01"
              {...register('academicHistory.0.gpa')}
            />
            <Input
              label="Research Interests (optional)"
              {...register('academicHistory.0.fieldOfStudy')}
            />
          </>
        );
      default:
        return <p className="text-red-500">Please select a study level first.</p>;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-900">Academic History</h2>
      {renderFields()}
    </div>
  );
}