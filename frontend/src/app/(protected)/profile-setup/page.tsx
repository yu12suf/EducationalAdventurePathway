'use client';

import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { FormProvider } from 'react-hook-form';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { useProfileWizard } from '@/hooks/useProfileWizard';
import StepIndicator from '@/components/profile-setup/StepIndicator';
import StepLevel from '@/components/profile-setup/StepLevel';
import StepOcrUpload from '@/components/profile-setup/StepOcrUpload';
import StepPersonalInfo from '@/components/profile-setup/StepPersonalInfo';
import StepAcademicHistory from '@/components/profile-setup/StepAcademicHistory';
import StepDocumentUpload from '@/components/profile-setup/StepDocumentUpload';
import StepStudyPreferences from '@/components/profile-setup/StepStudyPreferences';
import StepFundingTest from '@/components/profile-setup/StepFundingTest';
import StepReview from '@/components/profile-setup/StepReview';

const steps = [
  { id: 'level', label: 'Study Level' },
  { id: 'ocr', label: 'Upload Document' }, // new step for OCR
  { id: 'personal', label: 'Personal Info' },
  { id: 'academic', label: 'Academic History' },
  { id: 'documents', label: 'Documents' },
  { id: 'preferences', label: 'Study Preferences' },
  { id: 'funding', label: 'Funding & Tests' },
  { id: 'review', label: 'Review' },
];

// Map step IDs to components
const stepComponents: Record<string, React.ComponentType> = {
  level: StepLevel,
  ocr: StepOcrUpload,
  personal: StepPersonalInfo,
  academic: StepAcademicHistory,
  documents: StepDocumentUpload,
  preferences: StepStudyPreferences,
  funding: StepFundingTest,
  review: StepReview,
};

export default function ProfileSetupPage() {
  const {
    currentStep,
    isLastStep,
    handleNext,
    handleBack,
    handleSubmit,
    methods,
  } = useProfileWizard(steps.map((s) => s.id));

  const StepComponent = stepComponents[currentStep];

  // If the step component doesn't exist (should not happen), show a fallback
  if (!StepComponent) {
    return <div>Invalid step</div>;
  }

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Home Link */}
          <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
            <FaArrowLeft className="mr-2" /> Back to Home
          </Link>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">Complete Your Student Profile</h1>
              <p className="mt-1 text-sm text-gray-600">
                Help us personalize your experience – it only takes a few minutes.
              </p>
            </div>

            {/* Step Indicator */}
            <StepIndicator steps={steps} currentStep={currentStep} />

            {/* Form Content – wrapped in FormProvider */}
            <FormProvider {...methods}>
              <div className="p-6">
                <StepComponent />
              </div>
            </FormProvider>

            {/* Navigation Buttons */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              <button
                onClick={handleBack}
                disabled={currentStep === steps[0].id}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
              {isLastStep ? (
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Submit Profile
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}