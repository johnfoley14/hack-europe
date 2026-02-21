import { Check } from 'lucide-react';

export default function StepIndicator({ steps = [], currentStep = 0 }) {
  return (
    <div className="flex w-full items-start">
      {steps.map((label, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isFuture = index > currentStep;

        return (
          <div key={index} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              {/* Left connector line */}
              {index > 0 && (
                <div
                  className={`h-0.5 flex-1 ${
                    index <= currentStep ? 'bg-forest' : 'bg-sand'
                  }`}
                />
              )}

              {/* Circle */}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                  isCompleted
                    ? 'bg-forest text-white'
                    : isCurrent
                      ? 'bg-amber text-white'
                      : 'bg-sand text-stone'
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
              </div>

              {/* Right connector line */}
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 ${
                    index < currentStep ? 'bg-forest' : 'bg-sand'
                  }`}
                />
              )}
            </div>

            {/* Label */}
            <span
              className={`mt-2 text-center text-xs ${
                isCompleted || isCurrent ? 'font-medium text-ink' : 'text-stone'
              }`}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
