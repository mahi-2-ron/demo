import React from 'react';
import { UserCheck, Stethoscope, Bell, Trophy } from 'lucide-react';

const StepCard: React.FC<{ number: string; title: string; desc: string; icon: React.ReactNode }> = ({ number, title, desc, icon }) => (
  <div className="relative flex flex-col items-center text-center p-6 group">
    <div className="w-16 h-16 rounded-full bg-white border-2 border-slate-100 text-brand-600 flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 group-hover:border-brand-500 transition-all z-10 relative">
      {icon}
      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm border-2 border-white">
        {number}
      </div>
    </div>
    <h4 className="text-xl font-bold text-slate-900 mb-3">{title}</h4>
    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
          <p className="text-slate-600">The process is simple, safe, and rewarding. Here is how you can become a hero today.</p>
        </div>

        <div className="relative grid md:grid-cols-4 gap-8">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-14 left-0 w-full h-1 bg-slate-200 -z-0"></div>

          <StepCard 
            number="1"
            title="Register"
            desc="Sign up on our platform and fill in your basic health details."
            icon={<UserCheck className="w-8 h-8" />}
          />
          <StepCard 
            number="2"
            title="Verify"
            desc="Our team verifies your eligibility to ensure safe donation."
            icon={<Stethoscope className="w-8 h-8" />}
          />
          <StepCard 
            number="3"
            title="Get Notified"
            desc="Receive alerts when someone nearby needs your blood type."
            icon={<Bell className="w-8 h-8" />}
          />
          <StepCard 
            number="4"
            title="Donate & Save"
            desc="Visit the center, donate blood, and save a precious life."
            icon={<Trophy className="w-8 h-8" />}
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;