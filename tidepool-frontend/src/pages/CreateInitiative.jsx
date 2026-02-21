import { useState } from 'react';
import { MapPin, Info } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import StepIndicator from '../components/shared/StepIndicator';
import InitiativeCard from '../components/shared/InitiativeCard';
import { communities } from '../data/communities';
import { categories } from '../data/initiatives';

const steps = ['Basics', 'Goal & Deadline', 'Location', 'Review'];

const durationOptions = [
  { days: 1, label: '1 day' },
  { days: 3, label: '3 days' },
  { days: 5, label: '5 days' },
  { days: 7, label: '7 days' },
];

const currencyOptions = [
  { code: 'GBP', symbol: '\u00A3' },
  { code: 'EUR', symbol: '\u20AC' },
  { code: 'USD', symbol: '$' },
];

export default function CreateInitiative() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    communityId: '',
    category: '',
    goalCents: 0,
    goalInput: '',
    currency: 'GBP',
    durationDays: null,
    locationName: '',
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGoalChange = (e) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    updateField('goalInput', val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed > 0) {
      updateField('goalCents', Math.round(parsed * 100));
    } else {
      updateField('goalCents', 0);
    }
  };

  const computedDeadline = formData.durationDays
    ? new Date(Date.now() + formData.durationDays * 24 * 60 * 60 * 1000)
    : null;

  const selectedCommunity = communities.find((c) => c.id === formData.communityId);
  const selectedCategory = categories.find((c) => c.id === formData.category);
  const currencySymbol =
    currencyOptions.find((c) => c.code === formData.currency)?.symbol || '\u00A3';

  const canContinue = () => {
    switch (currentStep) {
      case 0:
        return formData.title.trim() && formData.description.trim() && formData.communityId && formData.category;
      case 1:
        return formData.goalCents > 0 && formData.durationDays;
      case 2:
        return formData.locationName.trim();
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const handlePublish = () => {
    // Mock publish — in a real app this would POST to the API
    alert('Pool published! (This is a demo)');
  };

  // Build a mock initiative object for preview
  const previewInitiative = {
    id: 'preview',
    title: formData.title || 'Untitled Pool',
    description: formData.description,
    community: selectedCommunity
      ? { id: selectedCommunity.id, name: selectedCommunity.name }
      : { id: '', name: 'No community' },
    organizer: { id: 'user_1', name: 'Alex Morgan', initials: 'AM' },
    goalCents: formData.goalCents || 10000,
    heldTotalCents: 0,
    capturedTotalCents: 0,
    currency: formData.currency,
    status: 'open',
    pledgeCount: 0,
    deadline: computedDeadline ? computedDeadline.toISOString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    location: formData.locationName ? { name: formData.locationName, lat: 0, lng: 0 } : null,
    category: formData.category || 'community',
    updates: [],
  };

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-3xl font-bold text-ink mb-8">Start a new pool</h1>

        {/* Step Indicator */}
        <div className="mb-10">
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>

        {/* Step 0 — Basics */}
        {currentStep === 0 && (
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="text-xs uppercase tracking-wider text-stone font-semibold block mb-2">
                Pool name
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Give your pool a name..."
                className="w-full font-display text-xl border-b-2 border-sand focus:border-amber outline-none pb-2 text-ink bg-transparent transition-colors placeholder:text-stone/40"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs uppercase tracking-wider text-stone font-semibold block mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Describe what you're funding and why it matters..."
                className="w-full border border-sand rounded-xl p-4 min-h-[160px] text-ink bg-transparent outline-none focus:border-amber transition-colors resize-y placeholder:text-stone/40"
              />
            </div>

            {/* Community selector */}
            <div>
              <label className="text-xs uppercase tracking-wider text-stone font-semibold block mb-2">
                Community
              </label>
              <select
                value={formData.communityId}
                onChange={(e) => updateField('communityId', e.target.value)}
                className="w-full border border-sand rounded-xl p-3 text-ink bg-white outline-none focus:border-amber transition-colors appearance-none cursor-pointer"
              >
                <option value="">Select a community</option>
                {communities.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category selector */}
            <div>
              <label className="text-xs uppercase tracking-wider text-stone font-semibold block mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateField('category', cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition ${
                      formData.category === cat.id
                        ? 'border-amber bg-amber/5 text-amber'
                        : 'border-sand hover:border-stone text-ink'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 1 — Goal & Deadline */}
        {currentStep === 1 && (
          <div className="space-y-8">
            {/* Goal amount */}
            <div>
              <label className="text-xs uppercase tracking-wider text-stone font-semibold block mb-2">
                Funding goal
              </label>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-3xl text-stone">{currencySymbol}</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={formData.goalInput}
                  onChange={handleGoalChange}
                  placeholder="0"
                  className="font-mono text-3xl border-b-2 border-sand focus:border-amber outline-none pb-2 text-ink bg-transparent transition-colors w-48 placeholder:text-stone/40"
                />
              </div>
            </div>

            {/* Currency selector */}
            <div>
              <label className="text-xs uppercase tracking-wider text-stone font-semibold block mb-2">
                Currency
              </label>
              <div className="flex gap-2">
                {currencyOptions.map((cur) => (
                  <button
                    key={cur.code}
                    onClick={() => updateField('currency', cur.code)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition ${
                      formData.currency === cur.code
                        ? 'border-amber bg-amber/5 text-amber'
                        : 'border-sand hover:border-stone text-ink'
                    }`}
                  >
                    {cur.symbol} {cur.code}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration selector */}
            <div>
              <label className="text-xs uppercase tracking-wider text-stone font-semibold block mb-2">
                How many days?
              </label>
              <div className="flex gap-3">
                {durationOptions.map((opt) => (
                  <button
                    key={opt.days}
                    onClick={() => updateField('durationDays', opt.days)}
                    className={`flex-1 px-4 py-3 rounded-xl text-center font-medium border-2 transition ${
                      formData.durationDays === opt.days
                        ? 'border-amber bg-amber/5 text-amber'
                        : 'border-sand hover:border-stone text-ink'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {computedDeadline && (
                <p className="text-stone text-sm mt-2">
                  Deadline:{' '}
                  {computedDeadline.toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              )}
            </div>

            {/* Info note */}
            <div className="bg-parchment rounded-xl p-4 flex items-start gap-3">
              <Info className="h-5 w-5 text-forest shrink-0 mt-0.5" />
              <p className="text-sm text-forest">
                Pools have a maximum duration of 7 days. Funds are held until the deadline.
              </p>
            </div>
          </div>
        )}

        {/* Step 2 — Location */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {/* Location name */}
            <div>
              <label className="text-xs uppercase tracking-wider text-stone font-semibold block mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.locationName}
                onChange={(e) => updateField('locationName', e.target.value)}
                placeholder="e.g. Hackney, London"
                className="w-full border border-sand rounded-xl p-3 text-ink bg-transparent outline-none focus:border-amber transition-colors placeholder:text-stone/40"
              />
            </div>

            {/* Placeholder map */}
            <div className="bg-parchment-dark rounded-xl h-48 flex flex-col items-center justify-center gap-2">
              <MapPin className="h-8 w-8 text-stone" />
              <span className="text-stone text-sm">Map preview will appear here</span>
            </div>
          </div>
        )}

        {/* Step 3 — Review */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {/* Preview card */}
            <div>
              <label className="text-xs uppercase tracking-wider text-stone font-semibold block mb-3">
                Preview
              </label>
              <div className="max-w-sm pointer-events-none">
                <InitiativeCard initiative={previewInitiative} />
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl card-shadow p-6 space-y-4">
              <h3 className="font-display font-semibold text-ink">Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs uppercase tracking-wider text-stone font-semibold block">
                    Title
                  </span>
                  <p className="text-ink mt-0.5">{formData.title || 'Not set'}</p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-stone font-semibold block">
                    Community
                  </span>
                  <p className="text-ink mt-0.5">{selectedCommunity?.name || 'Not set'}</p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-stone font-semibold block">
                    Category
                  </span>
                  <p className="text-ink mt-0.5">{selectedCategory?.label || 'Not set'}</p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-stone font-semibold block">
                    Goal
                  </span>
                  <p className="text-ink mt-0.5 font-mono">
                    {formData.goalCents > 0
                      ? `${currencySymbol}${(formData.goalCents / 100).toLocaleString('en-GB')}`
                      : 'Not set'}
                  </p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-stone font-semibold block">
                    Duration
                  </span>
                  <p className="text-ink mt-0.5">
                    {formData.durationDays
                      ? `${formData.durationDays} day${formData.durationDays > 1 ? 's' : ''}`
                      : 'Not set'}
                  </p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-stone font-semibold block">
                    Location
                  </span>
                  <p className="text-ink mt-0.5">{formData.locationName || 'Not set'}</p>
                </div>
              </div>
              {formData.description && (
                <div>
                  <span className="text-xs uppercase tracking-wider text-stone font-semibold block">
                    Description
                  </span>
                  <p className="text-stone text-sm mt-1 leading-relaxed whitespace-pre-line line-clamp-4">
                    {formData.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-sand">
          {currentStep > 0 ? (
            <button
              onClick={handleBack}
              className="text-stone hover:text-ink transition-colors font-medium"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!canContinue()}
              className={`bg-amber text-white rounded-xl px-6 py-3 font-medium transition ${
                !canContinue() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-dark'
              }`}
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handlePublish}
              className="w-full bg-amber text-white py-4 rounded-xl font-display text-lg font-semibold transition hover:bg-amber-dark"
            >
              Publish Pool
            </button>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
