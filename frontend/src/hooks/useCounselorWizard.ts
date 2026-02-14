import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CounselorProfileData, ConsultationMode } from '@/components/profile-setup/counselor/types';
import api from '@/services/api';
import toast from 'react-hot-toast';

// Validation schema for the whole form
const schema = yup.object().shape({
  bio: yup.string().required('Bio is required').min(50, 'Bio should be at least 50 characters'),
  areasOfExpertise: yup.array().of(yup.string()).min(1, 'Select at least one area of expertise'),
  university: yup.string().required('University is required'),
  degree: yup.string().required('Degree is required'),
  yearsOfExperience: yup.number().required('Years of experience required').min(0).integer(),
  languages: yup.array().of(yup.string()).min(1, 'Select at least one language'),
  consultationModes: yup.array().of(yup.mixed<ConsultationMode>().oneOf(['chat', 'audio', 'video'])).min(1, 'Select at least one mode'),
  hourlyRate: yup.number().optional().min(0),
});

// Map steps to the fields they should validate
const stepFields: Record<string, (keyof CounselorProfileData)[]> = {
  bio: ['bio'],
  background: ['university', 'degree', 'yearsOfExperience', 'areasOfExpertise'],
  languages: ['languages', 'consultationModes', 'hourlyRate'],
  review: [],
};

export function useCounselorWizard(stepIds: string[]) {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = stepIds[currentStepIndex];

  const methods = useForm<CounselorProfileData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      bio: '',
      areasOfExpertise: [],
      university: '',
      degree: '',
      yearsOfExperience: 0,
      languages: [],
      consultationModes: [],
      hourlyRate: undefined,
    },
    mode: 'onChange',
  });

  const { handleSubmit, trigger, getValues, setValue } = methods;

  const handleNext = useCallback(async () => {
    const fieldsToValidate = stepFields[currentStep] || [];
    const isValid = fieldsToValidate.length > 0 ? await trigger(fieldsToValidate as any) : true;
    if (isValid) {
      setCurrentStepIndex((i) => Math.min(i + 1, stepIds.length - 1));
    }
  }, [currentStep, trigger, stepIds.length]);

  const handleBack = useCallback(() => {
    setCurrentStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const onSubmit = useCallback(async (data: CounselorProfileData) => {
    try {
      const response = await api.put('/api/counselor/profile', data);
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
    updateFormData: (data: Partial<CounselorProfileData>) => {
      Object.entries(data).forEach(([key, value]) => {
        setValue(key as any, value);
      });
    },
    isLastStep,
    handleNext,
    handleBack,
    handleSubmit: handleSubmit(onSubmit),
    methods,
  };
}