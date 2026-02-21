import { motion } from 'framer-motion';
import { Target, HandCoins, CircleCheck, Lightbulb } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Target,
    title: 'Create a Pool',
    description:
      'Set a funding goal, deadline (up to 7 days), and tell your community why it matters.',
  },
  {
    number: '02',
    icon: HandCoins,
    title: 'People Pledge',
    description:
      'Members pledge what they can. Their cards are authorized but not charged \u2014 money stays in their account.',
  },
  {
    number: '03',
    icon: CircleCheck,
    title: 'Goal Met = Funded',
    description:
      'Hit the target and all pledges are captured. Miss it, and every hold is released. No risk, no waste.',
  },
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-amber font-mono text-sm font-medium tracking-wider uppercase mb-4">
            How it works
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink">
            Three steps to funded
          </h2>
          <p className="mt-5 text-stone text-lg leading-relaxed">
            Tidepool uses a hold-not-charge model. Your money is only taken when
            the goal is reached.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mt-20 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              custom={i}
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="text-center"
            >
              {/* Number */}
              <span className="font-mono text-amber/60 text-sm font-medium tracking-wider">
                {step.number}
              </span>

              {/* Icon */}
              <div className="mt-4 mx-auto rounded-2xl bg-parchment w-16 h-16 flex items-center justify-center">
                <step.icon className="h-7 w-7 text-forest" strokeWidth={1.5} />
              </div>

              {/* Title */}
              <h3 className="font-display text-xl font-semibold mt-6 text-ink">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-stone text-sm leading-relaxed mt-3 max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Key insight box */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-20 bg-parchment rounded-2xl p-8 max-w-2xl mx-auto flex gap-5 items-start"
        >
          <div className="shrink-0 mt-0.5 w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center">
            <Lightbulb className="h-5 w-5 text-amber" />
          </div>
          <div>
            <p className="font-semibold text-ink text-sm">
              Zero-risk pledging
            </p>
            <p className="text-stone text-sm leading-relaxed mt-1">
              Unlike traditional crowdfunding, your money is never taken unless
              the goal is reached. No refunds needed&nbsp;&mdash; because you're
              never charged.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
