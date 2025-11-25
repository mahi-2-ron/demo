import React from 'react';
import { Users, Target, Shield, Globe } from 'lucide-react';

const About: React.FC = () => {
  return (
     <div className="bg-slate-50 min-h-screen animate-fadeIn pb-20">
        {/* Hero Section */}
        <div className="bg-slate-900 text-white py-24 relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
           <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
           
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
               <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">Saving Lives, <span className="text-brand-500">One Drop</span> at a Time</h1>
               <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                   RakhtSetu (Blood Bridge) is a technology-driven platform dedicated to bridging the gap between blood donors and patients in need, ensuring timely access to safe blood for everyone.
               </p>
           </div>
        </div>
        
        {/* Mission & Values */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
                    <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center text-brand-600 mb-6">
                        <Target className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Our Mission</h3>
                    <p className="text-slate-600 leading-relaxed">
                        To solve the problem of blood shortage by connecting voluntary blood donors with blood banks and patients in real-time through innovative technology.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                        <Globe className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Our Vision</h3>
                    <p className="text-slate-600 leading-relaxed">
                        A world where no life is lost due to the unavailability of blood. We aim to create a seamless, global network of lifesavers.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                        <Shield className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Our Values</h3>
                    <p className="text-slate-600 leading-relaxed">
                        Integrity, Empathy, and Innovation. We believe in the power of community and the sanctity of every human life.
                    </p>
                </div>
            </div>
        </div>

        {/* Team Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900">Meet the Team</h2>
                <p className="text-slate-500 mt-4 max-w-2xl mx-auto">Passionate individuals committed to making a difference in the healthcare ecosystem.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
                 {[1, 2, 3].map((i) => (
                     <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-100 group">
                         <div className="h-48 bg-slate-200 overflow-hidden">
                             <img 
                                src={`https://images.unsplash.com/photo-${i === 1 ? '1560250097-0b9358e1b3b9' : i === 2 ? '1573496359142-b8d87734a5a2' : '1580489944761-15a19d654956'}?auto=format&fit=crop&w=400&q=80`} 
                                alt="Team Member" 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                             />
                         </div>
                         <div className="p-6 text-center">
                             <h4 className="font-bold text-lg text-slate-900">{i === 1 ? 'Dr. Aditi Rao' : i === 2 ? 'Rohan Mehta' : 'Sneha Kapoor'}</h4>
                             <p className="text-brand-600 text-sm font-medium mb-3">{i === 1 ? 'Founder & CEO' : i === 2 ? 'Head of Operations' : 'Tech Lead'}</p>
                             <p className="text-slate-500 text-sm">Dedicated to improving emergency response times and donor engagement.</p>
                         </div>
                     </div>
                 ))}
            </div>
        </div>
     </div>
  );
};
export default About;