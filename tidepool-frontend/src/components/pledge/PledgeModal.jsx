import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Shield } from 'lucide-react';
import Modal from '../shared/Modal';
import ProgressBar from '../shared/ProgressBar';
import { formatCurrency } from '../../utils/formatCurrency';

const presets = [
  { value: 1000, label: '£10' },
  { value: 2500, label: '£25' },
  { value: 5000, label: '£50' },
  { value: 10000, label: '£100' },
];

export default function PledgeModal({ initiative, isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [customAmount, setCustomAmount] = useState('');

  const handlePresetSelect = (value) => {
    setSelectedPreset(value);
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomChange = (e) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    setCustomAmount(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed > 0) {
      setSelectedPreset(null);
      setAmount(Math.round(parsed * 100));
    } else {
      setAmount(0);
    }
  };

  const handleClose = () => {
    setStep(0);
    setAmount(0);
    setSelectedPreset(null);
    setCustomAmount('');
    onClose();
  };

  const stepTitles = ['Choose amount', 'Payment details', 'Confirmed'];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={stepTitles[step]}>
      {/* Step 0 — Choose Amount */}
      {step === 0 && (
        <div>
          <p className="text-stone text-sm mb-4">How much would you like to pledge?</p>

          <div className="grid grid-cols-2 gap-3">
            {presets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => handlePresetSelect(preset.value)}
                className={`border-2 rounded-xl p-4 text-center cursor-pointer transition ${
                  selectedPreset === preset.value
                    ? 'border-amber bg-amber/5 text-amber font-semibold'
                    : 'border-sand hover:border-stone text-ink'
                }`}
              >
                <span className="font-mono text-xl">{preset.label}</span>
                <span className="block text-xs text-stone mt-1">pledge</span>
              </button>
            ))}
          </div>

          <div className="mt-4">
            <div
              className={`flex items-center border-2 rounded-xl p-4 transition ${
                customAmount ? 'border-amber' : 'border-sand'
              } focus-within:border-amber`}
            >
              <span className="font-mono text-xl text-stone mr-2">&pound;</span>
              <input
                type="text"
                inputMode="decimal"
                value={customAmount}
                onChange={handleCustomChange}
                placeholder="Custom amount"
                className="flex-1 font-mono text-xl text-ink bg-transparent outline-none placeholder:text-stone/50"
              />
            </div>
          </div>

          <button
            onClick={() => setStep(1)}
            disabled={amount === 0}
            className={`w-full mt-6 bg-amber text-white py-3 rounded-xl font-medium transition ${
              amount === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-dark'
            }`}
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 1 — Payment (Mock) */}
      {step === 1 && (
        <div>
          <p className="text-stone text-sm mb-4">Payment details</p>

          <div className="space-y-3">
            <div className="border border-sand rounded-lg p-3">
              <label className="text-xs text-stone block mb-1">Card number</label>
              <input
                type="text"
                placeholder="4242 4242 4242 4242"
                disabled
                className="w-full font-mono text-ink bg-transparent outline-none placeholder:text-stone/40"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-sand rounded-lg p-3">
                <label className="text-xs text-stone block mb-1">Expiry</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  disabled
                  className="w-full font-mono text-ink bg-transparent outline-none placeholder:text-stone/40"
                />
              </div>
              <div className="border border-sand rounded-lg p-3">
                <label className="text-xs text-stone block mb-1">CVC</label>
                <input
                  type="text"
                  placeholder="123"
                  disabled
                  className="w-full font-mono text-ink bg-transparent outline-none placeholder:text-stone/40"
                />
              </div>
            </div>
          </div>

          <div className="bg-parchment rounded-xl p-4 mt-4 flex items-start gap-3">
            <Shield className="h-5 w-5 text-forest shrink-0 mt-0.5" />
            <p className="text-sm text-forest">
              Your card will be authorized for{' '}
              <span className="font-semibold">{formatCurrency(amount, initiative?.currency)}</span>.
              You will only be charged if this pool reaches its{' '}
              <span className="font-semibold">
                {formatCurrency(initiative?.goalCents, initiative?.currency)}
              </span>{' '}
              goal.
            </p>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full mt-6 bg-forest hover:bg-forest-light text-white py-3 rounded-xl font-medium transition"
          >
            Confirm Pledge
          </button>

          <button
            onClick={() => setStep(0)}
            className="w-full mt-2 text-stone hover:text-ink text-sm py-2 transition"
          >
            Back
          </button>
        </div>
      )}

      {/* Step 2 — Confirmation */}
      {step === 2 && (
        <motion.div
          className="flex flex-col items-center text-center py-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="w-16 h-16 rounded-full bg-emerald/10 flex items-center justify-center">
            <Check className="h-8 w-8 text-emerald" />
          </div>

          <h3 className="font-display text-2xl font-bold mt-4 text-ink">Your pledge is held!</h3>

          <p className="font-mono text-3xl text-forest mt-2">
            {formatCurrency(amount, initiative?.currency)}
          </p>

          <p className="text-stone text-sm mt-3 max-w-xs">
            This amount has been authorized on your card. You won't be charged unless the pool
            reaches its goal.
          </p>

          {initiative && (
            <div className="w-full mt-6 bg-parchment rounded-xl p-4">
              <p className="font-display font-semibold text-ink text-sm">{initiative.title}</p>
              <div className="mt-2">
                <ProgressBar
                  current={initiative.heldTotalCents + amount}
                  goal={initiative.goalCents}
                  currency={initiative.currency}
                  size="sm"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleClose}
            className="w-full mt-8 bg-forest text-white py-3 rounded-xl font-medium transition hover:bg-forest-light"
          >
            Done
          </button>
        </motion.div>
      )}
    </Modal>
  );
}
