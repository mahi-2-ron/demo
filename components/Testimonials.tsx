import React from 'react';
import { Quote } from 'lucide-react';

const ReviewCard: React.FC<{ name: string; role: string; quote: string; image: string }> = ({ name, role, quote, image }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <Quote className="w-8 h-8 text-brand-200 mb-4" />
    <p className="text-slate-600 mb-6 leading-relaxed italic">"{quote}"</p>
    <div className="flex items-center gap-4">
      <img src={image} alt={name} className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-100" />
      <div>
        <h5 className="font-bold text-slate-900">{name}</h5>
        <span className="text-xs text-brand-600 font-semibold uppercase tracking-wide">{role}</span>
      </div>
    </div>
  </div>
);

const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">Voices of RakhtSetu</h2>
          <p className="text-slate-500 mt-2">Hear from our community of heroes and survivors.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <ReviewCard 
            name="Rohan Gupta"
            role="Regular Donor"
            quote="The app makes it so easy to find donation camps. I've donated 5 times this year thanks to the notifications!"
            image="https://picsum.photos/100/100?random=10"
          />
          <ReviewCard 
            name="Ananya Iyer"
            role="Recipient"
            quote="When my father needed surgery, we were panicked. RakhtSetu connected us to an O- donor in 20 minutes. Forever grateful."
            image="https://picsum.photos/100/100?random=11"
          />
          <ReviewCard 
            name="Vikram Singh"
            role="Volunteer"
            quote="Volunteering with RakhtSetu has been life-changing. Seeing the impact of technology on saving lives is incredible."
            image="https://picsum.photos/100/100?random=12"
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;