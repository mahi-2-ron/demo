import React from 'react';
import { Shield, FileText, HelpCircle, Cookie, Lock } from 'lucide-react';

interface SupportProps {
  page: 'help' | 'privacy' | 'terms' | 'cookie-policy';
}

const Support: React.FC<SupportProps> = ({ page }) => {
  const content = {
    help: {
      title: "Help Center",
      icon: <HelpCircle className="w-12 h-12 text-brand-500" />,
      text: "How can we assist you today? Browse our frequently asked questions or contact support.",
      sections: [
        { title: "How do I donate?", content: "Register on our platform, find a nearby center on the 'Find Donors' page, and book a slot or visit directly." },
        { title: "Is it safe?", content: "Yes, all donation centers listed are verified and follow strict hygiene protocols. Using the app to find donors is secure." },
        { title: "Emergency Requests", content: "Use the 'Emergency' button in the navbar to broadcast a request to all nearby donors immediately. This should only be used for critical situations." },
        { title: "Contact Support", content: "You can reach us at help@rakhtsetu.com or call +1 (555) 123-4567 for immediate assistance." }
      ]
    },
    privacy: {
      title: "Privacy Policy",
      icon: <Lock className="w-12 h-12 text-brand-500" />,
      text: "We value your privacy and are committed to protecting your personal data.",
      sections: [
        { title: "Data Collection", content: "We collect basic profile information (Name, Blood Group, Contact) and location data to connect donors with recipients efficiently." },
        { title: "Data Usage", content: "Your data is used solely for matching blood requests and is never sold to third parties. Location data is used to calculate distance to donation centers or requests." },
        { title: "Security", content: "We use industry-standard encryption to protect your personal information stored in our databases." },
        { title: "User Rights", content: "You have the right to access, modify, or delete your data at any time by contacting our support team." }
      ]
    },
    terms: {
      title: "Terms of Service",
      icon: <FileText className="w-12 h-12 text-brand-500" />,
      text: "Please read these terms carefully before using the RakhtSetu platform.",
      sections: [
        { title: "Acceptance", content: "By accessing this platform, you agree to be bound by these Terms of Service and our Privacy Policy." },
        { title: "User Conduct", content: "Users must provide accurate information. Misuse of the emergency request feature or harassment of donors/recipients will result in immediate ban." },
        { title: "Liability", content: "RakhtSetu is a connecting platform and is not liable for medical procedures, quality of blood, or interactions between donors and recipients." },
        { title: "Modifications", content: "We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of new terms." }
      ]
    },
    'cookie-policy': {
      title: "Cookie Policy",
      icon: <Cookie className="w-12 h-12 text-brand-500" />,
      text: "We use cookies to enhance your experience and analyze platform usage.",
      sections: [
        { title: "Essential Cookies", content: "These cookies are required for the platform to function properly, such as keeping you logged in and remembering your preferences." },
        { title: "Analytics Cookies", content: "These help us understand how visitors interact with the website, allowing us to improve functionality and user experience." },
        { title: "Management", content: "You can control cookie preferences through your browser settings. However, disabling certain cookies may limit your ability to use platform features." }
      ]
    }
  };

  const data = content[page];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 text-white p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
            <div className="relative z-10 flex flex-col items-center">
                <div className="bg-white/10 p-4 rounded-full mb-6 backdrop-blur-sm">
                    {data.icon}
                </div>
                <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
                <p className="text-slate-300 max-w-lg">{data.text}</p>
            </div>
        </div>

        <div className="p-8 md:p-12 space-y-8">
            {data.sections.map((section, idx) => (
                <div key={idx} className="border-b border-slate-100 pb-8 last:border-0 last:pb-0">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{section.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{section.content}</p>
                </div>
            ))}
        </div>
        
        <div className="bg-slate-50 p-6 text-center border-t border-slate-200">
            <p className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </div>
    </div>
  );
};

export default Support;