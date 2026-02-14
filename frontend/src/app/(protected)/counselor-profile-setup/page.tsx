'use client';

import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import { FormProvider } from 'react-hook-form';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { useCounselorWizard } from '@/hooks/useCounselorWizard';
import StepIndicator from '@/components/profile-setup/StepIndicator';
import StepBio from '@/components/profile-setup/counselor/StepBio';
import StepBackground from '@/components/profile-setup/counselor/StepBackground';
import StepLanguagesModes from '@/components/profile-setup/counselor/StepLanguagesModes';
import StepReview from '@/components/profile-setup/counselor/StepReview';

const steps = [
  { id: 'bio', label: 'Bio' },
  { id: 'background', label: 'Background' },
  { id: 'languages', label: 'Languages & Modes' },
  { id: 'review', label: 'Review' },
];

const stepComponents: Record<string, React.ComponentType> = {
  bio: StepBio,
  background: StepBackground,
  languages: StepLanguagesModes,
  review: StepReview,
};

export default function CounselorProfileSetupPage() {
  const {
    currentStep,
    isLastStep,
    handleNext,
    handleBack,
    handleSubmit,
    methods,
  } = useCounselorWizard(steps.map((s) => s.id));

  const StepComponent = stepComponents[currentStep];

  if (!StepComponent) return <div>Invalid step</div>;

  return (
    <ProtectedRoute allowedRoles={['counselor']}>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back to Home Link */}
          <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
            <FaArrowLeft className="mr-2" /> Back to Home
          </Link>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">Complete Your Counselor Profile</h1>
              <p className="mt-1 text-sm text-gray-600">
                Help students get to know you. Your profile will be reviewed by an admin.
              </p>
            </div>

            <StepIndicator steps={steps} currentStep={currentStep} />

            <FormProvider {...methods}>
              <div className="p-6">
                <StepComponent />
              </div>
            </FormProvider>

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