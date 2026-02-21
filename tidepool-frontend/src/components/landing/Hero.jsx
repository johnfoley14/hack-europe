import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Globe2, Zap } from 'lucide-react';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-forest-dark">
      {/* Background atmospheric effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-forest/40 blur-[128px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-amber/15 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-emerald/8 blur-[150px]" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow badge */}
          <motion.div variants={fadeUpVariants} className="flex justify-center mb-10">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
              <span className="text-white/70 text-sm font-medium tracking-wide">
                Community-powered funding
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUpVariants}
            className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.05] tracking-tight"
          >
            Pool your power.
            <br />
            <span className="bg-gradient-to-r from-amber via-amber-light to-amber bg-clip-text text-transparent">
              Fund what matters.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={fadeUpVariants}
            className="mt-8 text-lg sm:text-xl text-white/55 leading-relaxed max-w-2xl mx-auto"
          >
            When your community pledges together, funds are held&nbsp;&mdash; not
            charged&nbsp;&mdash; until the goal is met. If it works, everyone pays.
            If not, nobody does.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUpVariants}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/explore"
              className="group inline-flex items-center gap-2.5 bg-amber hover:bg-amber-light text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber/25"
            >
              Explore Pools
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/initiatives/new"
              className="inline-flex items-center gap-2.5 border border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:bg-white/5"
            >
              Start a Pool
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={fadeUpVariants}
            className="mt-24 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { icon: Users, value: '2,400+', label: 'Community members' },
              { icon: Globe2, value: '£127K', label: 'Total pledged' },
              { icon: Zap, value: '89%', label: 'Success rate' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="h-5 w-5 text-white/30 mx-auto mb-3" />
                <p className="font-mono text-2xl sm:text-3xl font-bold text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-white/40 mt-1.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade to parchment */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-parchment to-transparent" />
    </section>
  );
}
