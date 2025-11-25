import React, { useState } from 'react';
import { AlertTriangle, User, Droplet, Activity, Phone, MapPin, Building, Siren, CheckCircle } from 'lucide-react';

const EmergencyRequest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
      patientName: '',
      bloodGroup: '',
      units: 1,
      severity: 'high',
      hospital: '',
      address: '',
      contact: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newRequest = {
        id: Date.now(),
        patient: formData.patientName,
        type: formData.bloodGroup,
        hospital: formData.hospital,
        units: formData.units,
        urgency: formData.severity === 'high' ? 'Critical' : formData.severity === 'medium' ? 'High' : 'Medium',
        time: 'Just now',
        status: 'pending',
        contact: formData.contact,
        location: formData.address
    };

    // Save to local storage mock DB
    setTimeout(() => {
        const existingRequests = JSON.parse(localStorage.getItem('rakhtsetu_requests') || '[]');
        localStorage.setItem('rakhtsetu_requests', JSON.stringify([newRequest, ...existingRequests]));
        
        setLoading(false);
        setSubmitted(true);
        setFormData({
            patientName: '',
            bloodGroup: '',
            units: 1,
            severity: 'high',
            hospital: '',
            address: '',
            contact: ''
        });
    }, 1500);
  };

  if (submitted) {
      return (
        <div className="min-h-screen bg-red-50/30 pt-20 px-4 flex items-center justify-center animate-fadeIn">
            <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-lg w-full border border-green-100">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Request Broadcasted!</h2>
                <p className="text-slate-600 mb-8">
                    Your emergency request has been sent to all nearby donors and blood banks. You will receive a call on your provided number shortly.
                </p>
                <button 
                    onClick={() => setSubmitted(false)}
                    className="bg-slate-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
                >
                    Raise Another Request
                </button>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-red-50/30 pt-10 pb-20 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-red-100 rounded-full mb-4 animate-pulse-slow">
             <Siren className="w-10 h-10 text-red-600 animate-bounce" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Emergency <span className="text-red-600">Blood Request</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            This request will be immediately broadcasted to all verified donors and blood banks in the vicinity.
          </p>
        </div>

        {/* Warning Box */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl shadow-sm mb-8 flex gap-4 items-start">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
                <h3 className="font-bold text-amber-800">Critical Warning</h3>
                <p className="text-amber-700 text-sm mt-1 leading-relaxed">
                    Please submit this form <strong>only for genuine medical emergencies</strong>. False requests can divert critical resources away from real patients in need. Misuse of this feature may lead to permanent account suspension and legal action.
                </p>
            </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-red-600 to-red-500"></div>
            
            <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
                
                {/* Patient Details Section */}
                <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 pb-2 border-b border-slate-100">
                        <User className="w-5 h-5 text-red-500" />
                        Patient Details
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Patient Name</label>
                            <input 
                                required 
                                name="patientName"
                                value={formData.patientName}
                                onChange={handleChange}
                                type="text" 
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all" 
                                placeholder="Enter patient name" 
                            />
                        </div>
                        <div className="space-y-2">
                             <label className="text-sm font-bold text-slate-700">Required Blood Group</label>
                             <div className="relative">
                                <Droplet className="absolute left-3 top-3 w-5 h-5 text-red-500" />
                                <select 
                                    required 
                                    name="bloodGroup"
                                    value={formData.bloodGroup}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none appearance-none text-slate-600"
                                >
                                    <option value="">Select Blood Group</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                             </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Units Needed</label>
                            <input 
                                required 
                                name="units"
                                value={formData.units}
                                onChange={(e) => setFormData({...formData, units: parseInt(e.target.value)})}
                                type="number" 
                                min="1" 
                                max="20" 
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" 
                                placeholder="e.g. 2" 
                            />
                        </div>
                        <div className="space-y-2">
                             <label className="text-sm font-bold text-slate-700">Emergency Severity</label>
                             <select 
                                required 
                                name="severity"
                                value={formData.severity}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-slate-600"
                             >
                                <option value="high">High - Critical (Immediate)</option>
                                <option value="medium">Medium - Surgery within 24h</option>
                                <option value="low">Low - Scheduled Procedure</option>
                             </select>
                        </div>
                    </div>
                </div>

                {/* Hospital Details Section */}
                <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 pb-2 border-b border-slate-100">
                        <Building className="w-5 h-5 text-red-500" />
                        Hospital & Contact
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                         <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-slate-700">Hospital Name</label>
                            <input 
                                required 
                                name="hospital"
                                value={formData.hospital}
                                onChange={handleChange}
                                type="text" 
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" 
                                placeholder="Full Hospital Name" 
                            />
                        </div>
                         <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-slate-700">Hospital Location / Address</label>
                             <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                <input 
                                    required 
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    type="text" 
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" 
                                    placeholder="Enter full address" 
                                />
                                <button type="button" className="absolute right-2 top-2 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> GPS
                                </button>
                             </div>
                        </div>
                         <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-bold text-slate-700">Contact Person / Number</label>
                             <div className="relative">
                                <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                <input 
                                    required 
                                    name="contact"
                                    value={formData.contact}
                                    onChange={handleChange}
                                    type="tel" 
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" 
                                    placeholder="Attendee Phone Number" 
                                />
                             </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-extrabold text-xl shadow-lg shadow-red-500/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-3 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <>Processing Broadcast...</>
                        ) : (
                            <>
                                <Activity className="w-6 h-6 animate-pulse" />
                                SEND REQUEST NOW
                            </>
                        )}
                    </button>
                    <p className="text-center text-xs text-slate-500 mt-4">By submitting, you agree to our emergency service terms and verify the accuracy of this information.</p>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default EmergencyRequest;