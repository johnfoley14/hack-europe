import Navbar from './Navbar';
import Footer from './Footer';

export default function PageLayout({ children, className = '', fullWidth = false }) {
  return (
    <div className="grain-overlay min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {fullWidth ? (
          children
        ) : (
          <div className={`max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 lg:py-16 ${className}`}>
            {children}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
