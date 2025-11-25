

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import QuickActions from './components/QuickActions';
import Stats from './components/Stats';
import WhyDonate from './components/WhyDonate';
import HowItWorks from './components/HowItWorks';
import Emergency from './components/Emergency';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import DonorRegister from './components/DonorRegister';
import EmergencyRequest from './components/EmergencyRequest';
import DonorDashboard from './components/DonorDashboard';
import FindDonors from './components/FindDonors';
import Campaigns from './components/Campaigns';
import FeaturedCampaigns from './components/FeaturedCampaigns';
import AdminDashboard from './components/AdminDashboard';
import ApiDocs from './components/ApiDocs';
import DatabaseSchema from './components/DatabaseSchema';
import Login from './components/Login';
import About from './components/About';
import Support from './components/Support';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Mail, X } from 'lucide-react';

export type Page = 'home' | 'register' | 'emergency' | 'dashboard' | 'find-donors' | 'campaigns' | 'admin' | 'api-docs' | 'schema' | 'login' | 'about' | 'help' | 'privacy' | 'terms' | 'cookie-policy';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isLoading, setIsLoading] = useState(true);
  const { emailNotification, closeEmail } = useAuth();

  // Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'register':
        return <DonorRegister onNavigate={navigateTo} />;
      case 'login':
        return <Login onNavigate={navigateTo} />;
      case 'about':
        return <About />;
      case 'emergency':
        return <EmergencyRequest />;
      case 'dashboard':
        return <DonorDashboard />;
      case 'find-donors':
        return <FindDonors />;
      case 'campaigns':
        return <Campaigns />;
      case 'admin':
        return <AdminDashboard />;
      case 'api-docs':
        return <ApiDocs />;
      case 'schema':
        return <DatabaseSchema />;
      case 'help':
      case 'privacy':
      case 'terms':
      case 'cookie-policy':
        return <Support page={currentPage} />;
      case 'home':
      default:
        return (
          <>
            <Hero onNavigate={navigateTo} />
            <QuickActions onNavigate={navigateTo} />
            <Stats />
            <FeaturedCampaigns onNavigate={navigateTo} />
            <WhyDonate />
            <HowItWorks />
            <Emergency onNavigate={navigateTo} />
            <Testimonials />
          </>
        );
    }
  };

  // Simulated Email Notification Component
  const EmailToast = () => (
    emailNotification ? (
      <div 
        className="fixed top-24 right-4 md:right-8 z-[100] w-full max-w-sm bg-white rounded-xl shadow-2xl border-l-4 border-brand-600 overflow-hidden animate-slideLeft cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={closeEmail}
      >
        <div className="p-4 relative">
            <button 
                onClick={(e) => { e.stopPropagation(); closeEmail(); }}
                className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 p-1"
            >
                <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-2 mb-2">
                <div className="bg-brand-100 p-1.5 rounded-full">
                    <Mail className="w-4 h-4 text-brand-600" />
                </div>
                <div>
                    <span className="font-bold text-slate-800 text-sm block">New Email Received</span>
                    <span className="text-[10px] text-slate-500">{emailNotification.sender}</span>
                </div>
                <span className="ml-auto text-[10px] text-slate-400 self-start">{emailNotification.timestamp}</span>
            </div>
            
            <div className="pl-9">
                <h4 className="font-bold text-slate-900 text-sm mb-1">{emailNotification.subject}</h4>
                <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">{emailNotification.preview}</p>
            </div>
        </div>
      </div>
    ) : null
  );

  if (isLoading) {
    return (
       <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center animate-fadeIn">
          <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-white p-5 rounded-full shadow-2xl border-4 border-red-50">
               <svg viewBox="0 0 32 32" fill="none" className="w-full h-full text-red-600 animate-pulse">
                <path d="M16 2C16 2 6 12 6 19C6 24.5228 10.4772 29 16 29C21.5228 29 26 24.5228 26 19C26 12 16 2 16 2Z" fill="currentColor" />
                <path d="M8.5 22C10.5 19.5 13 18 16 18C19 18 21.5 19.5 23.5 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
               </svg>
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight animate-fadeInUp">
            Rakht<span className="text-red-600">Setu</span>
          </h1>
          <p className="text-slate-400 font-medium mt-2 tracking-wide animate-fadeInUp" style={{animationDelay: '0.2s'}}>Bridging Lives, One Drop at a Time</p>
       </div>
    );
  }

  // Admin dashboard has its own layout
  if (currentPage === 'admin') {
    return (
        <>
            <AdminDashboard />
            <EmailToast />
        </>
    );
  }
  
  // Pages that share similar full-page layout structure with nav
  const fullPageViews = [
    'api-docs', 'schema', 'login', 'about', 'register', 'emergency', 
    'dashboard', 'find-donors', 'campaigns', 'help', 'privacy', 'terms', 'cookie-policy'
  ];

  if (fullPageViews.includes(currentPage)) {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-red-200 selection:text-red-900 overflow-x-hidden">
             <Navbar onNavigate={navigateTo} currentPage={currentPage} />
             {renderContent()}
             <Footer onNavigate={navigateTo} />
             <EmailToast />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-red-200 selection:text-red-900 overflow-x-hidden">
      <Navbar onNavigate={navigateTo} currentPage={currentPage} />
      
      <main>
        {renderContent()}
      </main>
      
      <Footer onNavigate={navigateTo} />
      <EmailToast />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
