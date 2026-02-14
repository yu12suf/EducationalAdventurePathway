import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { StudentProfileFormData, StudyLevel } from '@/components/profile-setup/types';
import api from '@/services/api';
import toast from 'react-hot-toast';

// Helper to map study level to academic history level
const mapStudyLevelToAcademicLevel = (studyLevel: StudyLevel | null): string | null => {
  if (!studyLevel) return null;
  switch (studyLevel) {
    case 'undergraduate':
      return 'highschool';
    case 'master':
      return 'bachelor';
    case 'phd':
      return 'master';
    default:
      return null;
  }
};

export function useProfileWizard(stepIds: string[]) {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = stepIds[currentStepIndex];
  const [studyLevel, setStudyLevel] = useState<StudyLevel | null>(null);

  const methods = useForm<StudentProfileFormData>({
    defaultValues: {
      studyLevel: null,
      firstName: '',
      lastName: '',
      nationality: '',
      currentLocation: '',
      dateOfBirth: undefined,
      phone: '',
      academicHistory: [],
      studyPreferences: [],
      fundingNeed: false,
      englishProficiencyLevel: undefined,
      standardizedTests: {},
      uploadedDocuments: [],
    },
    mode: 'onChange',
  });

  const { handleSubmit, trigger, getValues, setValue } = methods;

  const handleNext = useCallback(async () => {
    const isValid = await trigger(); // step‑specific validation can be added later
    if (isValid) {
      if (currentStep === 'level') {
        const level = getValues('studyLevel');
        if (level) setStudyLevel(level);
      }
      setCurrentStepIndex((i) => Math.min(i + 1, stepIds.length - 1));
    }
  }, [currentStep, stepIds.length, trigger, getValues]);

  const handleBack = useCallback(() => {
    setCurrentStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const onSubmit = useCallback(async (data: StudentProfileFormData) => {
    try {
      // Prepare academic history: ensure each entry has a level and is not empty
      const academicLevel = mapStudyLevelToAcademicLevel(data.studyLevel);
      let processedAcademicHistory = data.academicHistory;

      if (processedAcademicHistory && processedAcademicHistory.length > 0) {
        // Add level to each entry if missing (using study level mapping)
        processedAcademicHistory = processedAcademicHistory.map(entry => ({
          ...entry,
          level: entry.level || academicLevel,
        })).filter(entry => entry.institution && entry.level); // only keep entries with at least institution and level
      } else {
        // If no academic history provided, send an empty array (backend accepts it)
        processedAcademicHistory = [];
      }

      const profileData = {
        ...data,
        academicHistory: processedAcademicHistory,
      };

      // Remove uploadedDocuments as they are not part of the backend schema
      const { uploadedDocuments, ...profileDataToSend } = profileData;

      const response = await api.put('/api/student/profile', profileDataToSend);
      if (response.data.success) {
        toast.success('Profile saved successfully!');
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Profile submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to save profile');
    }
  }, [router]);

  const isLastStep = currentStepIndex === stepIds.length - 1;

  return {
    currentStep,
    setCurrentStep: (step: string) => {
      const index = stepIds.indexOf(step);
      if (index !== -1) setCurrentStepIndex(index);
    },
    formData: getValues(),
    updateFormData: (data: Partial<StudentProfileFormData>) => {
      Object.entries(data).forEach(([key, value]) => {
        setValue(key as any, value);
      });
    },
    studyLevel,
    isLastStep,
    handleNext,
    handleBack,
    handleSubmit: handleSubmit(onSubmit),
    methods,
  };
}