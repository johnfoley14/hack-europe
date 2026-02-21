import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Shield, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PledgeFormProps {
  goalAmount: number;
  heldAmount: number;
  status: string;
  onPledge?: (amount: number) => void;
  className?: string;
}

type Step = 'amount' | 'payment' | 'loading' | 'success' | 'error';

const suggestedAmounts = [10, 25, 50, 100];

export const PledgeForm = ({ goalAmount, heldAmount, status, onPledge, className }: PledgeFormProps) => {
  const [step, setStep] = useState<Step>('amount');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const remaining = goalAmount - heldAmount;
  const disabled = status !== 'open';

  const handleContinue = () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) { setError('Enter a valid amount'); return; }
    if (val > remaining) { setError(`Maximum pledge is £${remaining.toLocaleString()}`); return; }
    setError('');
    setStep('payment');
  };

  const handleSubmit = () => {
    setStep('loading');
    setTimeout(() => {
      setStep('success');
      onPledge?.(parseFloat(amount));
    }, 2000);
  };

  const handleRetry = () => { setStep('payment'); };

  if (disabled) {
    return (
      <div className={cn('rounded-xl bg-card border border-border p-6', className)}>
        <p className="text-sm text-muted-foreground text-center">
          {status === 'funded' ? 'This initiative has been fully funded! 🎉' : 'This initiative is no longer accepting pledges.'}
        </p>
      </div>
    );
  }

  return (
    <div className={cn('rounded-xl bg-card border border-border overflow-hidden', className)}>
      <div className="p-6">
        <h3 className="text-lg font-semibold font-display mb-4">Make a Pledge</h3>

        <AnimatePresence mode="wait">
          {step === 'amount' && (
            <motion.div key="amount" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {suggestedAmounts.map((a) => (
                  <button
                    key={a}
                    onClick={() => { setAmount(String(a)); setError(''); }}
                    className={cn(
                      'rounded-lg border py-2 text-sm font-medium transition-all',
                      amount === String(a)
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50 text-foreground'
                    )}
                  >
                    £{a}
                  </button>
                ))}
              </div>

              <div className="relative mb-3">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">£</span>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setError(''); }}
                  placeholder="Other amount"
                  className="pl-7"
                  min={1}
                />
              </div>

              {error && <p className="text-xs text-destructive mb-2">{error}</p>}

              <Button onClick={handleContinue} className="w-full" size="lg">
                Continue
              </Button>
            </motion.div>
          )}

          {step === 'payment' && (
            <motion.div key="payment" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <p className="text-sm text-muted-foreground mb-3">Holding <strong className="text-foreground">£{parseFloat(amount).toLocaleString()}</strong></p>

              {/* Simulated Stripe Elements */}
              <div className="space-y-3 mb-4">
                <div className="rounded-lg border border-border p-3 bg-secondary/30">
                  <label className="text-xs text-muted-foreground mb-1 block">Card number</label>
                  <div className="h-5 bg-secondary rounded w-full" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border p-3 bg-secondary/30">
                    <label className="text-xs text-muted-foreground mb-1 block">Expiry</label>
                    <div className="h-5 bg-secondary rounded w-full" />
                  </div>
                  <div className="rounded-lg border border-border p-3 bg-secondary/30">
                    <label className="text-xs text-muted-foreground mb-1 block">CVC</label>
                    <div className="h-5 bg-secondary rounded w-full" />
                  </div>
                </div>
              </div>

              <Button onClick={handleSubmit} className="w-full" size="lg">
                Hold £{parseFloat(amount).toLocaleString()}
              </Button>
              <button onClick={() => setStep('amount')} className="w-full text-xs text-muted-foreground mt-2 hover:text-foreground transition-colors">
                ← Change amount
              </button>
            </motion.div>
          )}

          {step === 'loading' && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-8">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
              <p className="text-sm font-medium">Authorizing hold…</p>
              <p className="text-xs text-muted-foreground">This may take a moment</p>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-8">
              <div className="w-14 h-14 rounded-full bg-success/10 flex items-center justify-center mb-3">
                <CheckCircle className="w-7 h-7 text-success" />
              </div>
              <p className="text-base font-semibold font-display">Funds held successfully!</p>
              <p className="text-xs text-muted-foreground mt-1 text-center">Your £{parseFloat(amount).toLocaleString()} will only be charged if the goal is reached.</p>
            </motion.div>
          )}

          {step === 'error' && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-8">
              <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-3">
                <AlertCircle className="w-7 h-7 text-destructive" />
              </div>
              <p className="text-base font-semibold font-display">Authorization failed</p>
              <p className="text-xs text-muted-foreground mt-1">Please check your card details and try again.</p>
              <Button onClick={handleRetry} variant="outline" className="mt-3">Try Again</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-6 py-3 bg-secondary/30 border-t border-border flex items-center gap-2">
        <Shield className="w-3.5 h-3.5 text-success" />
        <p className="text-xs text-muted-foreground">Funds are only charged if the goal is reached</p>
      </div>
    </div>
  );
};
