import PageLayout from '../components/layout/PageLayout';
import Hero from '../components/landing/Hero';
import HowItWorks from '../components/landing/HowItWorks';
import FeaturedInitiatives from '../components/landing/FeaturedInitiatives';
import TrustSection from '../components/landing/TrustSection';

export default function Landing() {
  return (
    <PageLayout fullWidth>
      <Hero />
      <HowItWorks />
      <FeaturedInitiatives />
      <TrustSection />
    </PageLayout>
  );
}
