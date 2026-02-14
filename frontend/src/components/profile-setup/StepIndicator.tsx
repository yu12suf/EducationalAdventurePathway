interface Step {
  id: string;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: string;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);
  return (
    <div className="px-6 py-4 border-b border-gray-200">
      <nav className="flex justify-center">
        <ol className="flex items-center space-x-2 md:space-x-4">
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = step.id === currentStep;
            return (
              <li key={step.id} className="flex items-center">
                {index > 0 && (
                  <div className={`w-8 h-0.5 mx-2 ${isCompleted ? 'bg-blue-600' : 'bg-gray-300'}`} />
                )}
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    isCurrent
                      ? 'bg-blue-600 text-white'
                      : isCompleted
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="hidden sm:block ml-2 text-xs font-medium text-gray-700">
                  {step.label}
                </span>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}