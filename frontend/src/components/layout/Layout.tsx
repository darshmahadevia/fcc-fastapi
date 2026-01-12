import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { Toaster } from '@/components/ui/sonner';

export function Layout() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/50">
        {/* Floating gradient orbs for glass effect visibility */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-400/25 to-pink-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-cyan-400/20 to-blue-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      <Header />
      <main className={`flex-1 ${isLandingPage ? '' : 'container mx-auto max-w-4xl px-4 py-8'}`}>
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
