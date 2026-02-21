import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { initiatives } from '../../data/initiatives';
import InitiativeCard from '../shared/InitiativeCard';

const openInitiatives = initiatives.filter((i) => i.status === 'open');

export default function FeaturedInitiatives() {
  return (
    <section className="py-28 lg:py-36 bg-parchment">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="text-amber font-mono text-sm font-medium tracking-wider uppercase mb-4">
              Featured
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink">
              Active pools near you
            </h2>
            <p className="mt-3 text-stone text-lg">
              Join a pool or start your own
            </p>
          </div>
          <Link
            to="/explore"
            className="group inline-flex items-center gap-2 text-forest font-medium hover:text-amber transition-colors shrink-0"
          >
            View all pools
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Card grid on desktop, horizontal scroll on mobile */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {openInitiatives.slice(0, 6).map((initiative, i) => (
            <motion.div
              key={initiative.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <InitiativeCard initiative={initiative} />
            </motion.div>
          ))}
        </div>

        {/* Mobile horizontal scroll */}
        <div className="md:hidden flex overflow-x-auto gap-5 pb-4 snap-x snap-mandatory hide-scrollbar -mx-6 px-6">
          {openInitiatives.map((initiative) => (
            <div
              key={initiative.id}
              className="snap-start flex-shrink-0 w-[320px]"
            >
              <InitiativeCard initiative={initiative} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
