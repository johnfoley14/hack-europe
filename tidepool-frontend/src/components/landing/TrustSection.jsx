import { motion } from 'framer-motion';
import { Shield, Lock, RefreshCcw } from 'lucide-react';

const trustPoints = [
  {
    icon: Shield,
    title: 'Held, not charged',
    description:
      'Your card is authorized but funds stay in your account until the goal is reached.',
  },
  {
    icon: Lock,
    title: 'Bank-grade security',
    description:
      'Payments processed by Stripe. Card details never touch our servers.',
  },
  {
    icon: RefreshCcw,
    title: 'Automatic release',
    description:
      "If a pool doesn't reach its goal, holds are released automatically. No action needed.",
  },
];

export default function TrustSection() {
  return (
    <section className="py-28 lg:py-36 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-amber font-mono text-sm font-medium tracking-wider uppercase mb-4">
            Trust &amp; Security
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink">
            Your money is safe
          </h2>
          <p className="mt-5 text-stone text-lg leading-relaxed">
            Built on Stripe's infrastructure with bank-grade security at every step.
          </p>
        </div>

        {/* Trust points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 mt-20 max-w-5xl mx-auto">
          {trustPoints.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="text-center"
            >
              {/* Icon */}
              <div className="mx-auto w-14 h-14 rounded-2xl bg-forest/8 flex items-center justify-center">
                <point.icon className="h-6 w-6 text-forest" strokeWidth={1.5} />
              </div>

              {/* Title */}
              <h3 className="font-display text-lg font-semibold mt-6 text-ink">
                {point.title}
              </h3>

              {/* Description */}
              <p className="text-stone text-sm mt-3 leading-relaxed max-w-xs mx-auto">
                {point.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stripe footer */}
        <div className="mt-20 flex items-center justify-center gap-4">
          <div className="h-px w-16 bg-sand" />
          <span className="text-stone text-sm">
            Payments powered by{' '}
            <span className="font-semibold text-ink">Stripe</span>
          </span>
          <div className="h-px w-16 bg-sand" />
        </div>
      </div>
    </section>
  );
}
