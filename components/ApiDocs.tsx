import React, { useState } from 'react';
import { Copy, Check, Terminal, Lock, Globe, Database, Server } from 'lucide-react';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface Endpoint {
  id: string;
  method: Method;
  path: string;
  title: string;
  description: string;
  params?: Array<{ name: string; type: string; required: boolean; desc: string }>;
  body?: string;
  response: string;
  codes: Array<{ code: number; desc: string }>;
}

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  endpoints: Endpoint[];
}

const API_DATA: Section[] = [
  {
    id: 'auth',
    title: 'Authentication',
    icon: <Lock className="w-4 h-4" />,
    endpoints: [
      {
        id: 'login',
        method: 'POST',
        path: '/api/v1/auth/login',
        title: 'User Login',
        description: 'Authenticate a user and return a JWT token.',
        body: JSON.stringify({
          email: "user@example.com",
          password: "securepassword123"
        }, null, 2),
        response: JSON.stringify({
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI...",
          user: {
            id: "usr_123",
            name: "Rahul Verma",
            role: "donor"
          }
        }, null, 2),
        codes: [
          { code: 200, desc: 'Login successful' },
          { code: 401, desc: 'Invalid credentials' }
        ]
      },
      {
        id: 'register',
        method: 'POST',
        path: '/api/v1/auth/register',
        title: 'Register Donor',
        description: 'Create a new donor account.',
        body: JSON.stringify({
          name: "Priya Singh",
          email: "priya@example.com",
          bloodGroup: "O+",
          location: "New York, NY"
        }, null, 2),
        response: JSON.stringify({
          message: "Registration successful",
          userId: "usr_456"
        }, null, 2),
        codes: [
          { code: 201, desc: 'Account created' },
          { code: 400, desc: 'Email already exists' }
        ]
      }
    ]
  },
  {
    id: 'donors',
    title: 'Donor Management',
    icon: <Globe className="w-4 h-4" />,
    endpoints: [
      {
        id: 'list-donors',
        method: 'GET',
        path: '/api/v1/donors',
        title: 'List Donors',
        description: 'Retrieve a list of active donors with optional filtering.',
        params: [
          { name: 'blood_group', type: 'string', required: false, desc: 'Filter by blood group (e.g., A+)' },
          { name: 'lat', type: 'float', required: false, desc: 'Latitude for location search' },
          { name: 'lng', type: 'float', required: false, desc: 'Longitude for location search' },
          { name: 'radius', type: 'int', required: false, desc: 'Search radius in km (default: 10)' }
        ],
        response: JSON.stringify({
          data: [
            {
              id: "usr_123",
              name: "Rahul Verma",
              bloodGroup: "A+",
              distance: "2.5km",
              status: "available"
            }
          ],
          pagination: {
            page: 1,
            total: 45
          }
        }, null, 2),
        codes: [
          { code: 200, desc: 'Success' }
        ]
      },
      {
        id: 'get-donor',
        method: 'GET',
        path: '/api/v1/donors/:id',
        title: 'Get Donor Details',
        description: 'Get public profile information of a specific donor.',
        response: JSON.stringify({
          id: "usr_123",
          name: "Rahul Verma",
          bloodGroup: "A+",
          lastDonation: "2023-05-12",
          stats: {
            totalDonations: 12,
            livesSaved: 36
          }
        }, null, 2),
        codes: [
          { code: 200, desc: 'Success' },
          { code: 404, desc: 'Donor not found' }
        ]
      }
    ]
  },
  {
    id: 'requests',
    title: 'Blood Requests',
    icon: <Database className="w-4 h-4" />,
    endpoints: [
      {
        id: 'create-request',
        method: 'POST',
        path: '/api/v1/requests',
        title: 'Create Request',
        description: 'Create a new emergency blood request broadcast.',
        body: JSON.stringify({
          patientName: "Anjali Devi",
          bloodGroup: "B-",
          hospital: "General Hospital",
          units: 2,
          urgency: "critical",
          location: {
            lat: 40.7128,
            lng: -74.0060
          }
        }, null, 2),
        response: JSON.stringify({
          requestId: "req_789",
          status: "broadcasted",
          recipientsCount: 142
        }, null, 2),
        codes: [
          { code: 201, desc: 'Request created' },
          { code: 403, desc: 'Quota exceeded' }
        ]
      }
    ]
  },
  {
    id: 'admin',
    title: 'Admin Operations',
    icon: <Server className="w-4 h-4" />,
    endpoints: [
      {
        id: 'update-inventory',
        method: 'PUT',
        path: '/api/v1/admin/inventory',
        title: 'Update Inventory',
        description: 'Update blood stock levels for a specific blood bank.',
        body: JSON.stringify({
          bloodGroup: "O+",
          units: 5,
          operation: "add", // or "remove"
          notes: "Restocked from donation camp #44"
        }, null, 2),
        response: JSON.stringify({
          success: true,
          newBalance: 125
        }, null, 2),
        codes: [
          { code: 200, desc: 'Inventory updated' },
          { code: 401, desc: 'Unauthorized' }
        ]
      }
    ]
  }
];

const MethodBadge: React.FC<{ method: Method }> = ({ method }) => {
  const colors = {
    GET: 'bg-blue-100 text-blue-700 border-blue-200',
    POST: 'bg-green-100 text-green-700 border-green-200',
    PUT: 'bg-orange-100 text-orange-700 border-orange-200',
    DELETE: 'bg-red-100 text-red-700 border-red-200'
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${colors[method]}`}>
      {method}
    </span>
  );
};

const CodeBlock: React.FC<{ code: string; label?: string }> = ({ code, label }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative rounded-lg bg-slate-900 overflow-hidden my-4">
      {label && (
        <div className="px-4 py-2 bg-slate-800 text-slate-400 text-xs font-mono border-b border-slate-700 flex justify-between items-center">
          {label}
        </div>
      )}
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono text-slate-300">
          <code>{code}</code>
        </pre>
      </div>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-md bg-white/10 hover:bg-white/20 text-white opacity-0 group-hover:opacity-100 transition-all"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
};

const ApiDocs: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('auth');

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <div className="bg-slate-900 text-white py-12 px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4 text-brand-400">
            <Terminal className="w-8 h-8" />
            <span className="font-mono font-bold">v1.0.0</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">RakhtSetu API Documentation</h1>
          <p className="text-slate-400 max-w-2xl text-lg">
            Comprehensive guide for developers to integrate with the RakhtSetu platform. 
            Our API follows RESTful principles and returns JSON responses.
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-8">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Modules</h3>
              <nav className="space-y-1">
                {API_DATA.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className={activeSection === section.id ? 'text-brand-600' : 'text-slate-400'}>
                      {section.icon}
                    </span>
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="bg-slate-100 rounded-xl p-4">
              <h4 className="text-sm font-bold text-slate-900 mb-2">Need Help?</h4>
              <p className="text-xs text-slate-500 mb-3">
                Contact our developer support team for API key access and integration assistance.
              </p>
              <a href="mailto:dev@rakhtsetu.com" className="text-xs font-bold text-brand-600 hover:text-brand-700">
                Contact Support &rarr;
              </a>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 space-y-16 pb-20">
          {API_DATA.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-200">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
              </div>

              <div className="space-y-12">
                {section.endpoints.map((endpoint) => (
                  <div key={endpoint.id} className="grid lg:grid-cols-2 gap-8">
                    
                    {/* Left Col: Info */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <MethodBadge method={endpoint.method} />
                        <code className="text-sm font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded">
                          {endpoint.path}
                        </code>
                      </div>
                      
                      <h3 className="text-lg font-bold text-slate-900">{endpoint.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{endpoint.description}</p>

                      {endpoint.params && (
                        <div className="mt-6">
                          <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">Query Parameters</h4>
                          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                            <table className="w-full text-sm text-left">
                              <thead className="bg-slate-50 text-slate-500 font-medium">
                                <tr>
                                  <th className="px-4 py-2">Name</th>
                                  <th className="px-4 py-2">Type</th>
                                  <th className="px-4 py-2">Required</th>
                                  <th className="px-4 py-2">Description</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {endpoint.params.map((param) => (
                                  <tr key={param.name}>
                                    <td className="px-4 py-2 font-mono text-brand-600">{param.name}</td>
                                    <td className="px-4 py-2 text-slate-500">{param.type}</td>
                                    <td className="px-4 py-2">
                                      {param.required ? (
                                        <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Yes</span>
                                      ) : (
                                        <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">No</span>
                                      )}
                                    </td>
                                    <td className="px-4 py-2 text-slate-600">{param.desc}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      <div className="mt-6">
                         <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">Response Codes</h4>
                         <div className="space-y-2">
                            {endpoint.codes.map(code => (
                               <div key={code.code} className="flex items-center gap-3 text-sm">
                                  <span className={`font-mono font-bold w-10 ${code.code >= 200 && code.code < 300 ? 'text-green-600' : 'text-red-600'}`}>
                                    {code.code}
                                  </span>
                                  <span className="text-slate-600">{code.desc}</span>
                               </div>
                            ))}
                         </div>
                      </div>
                    </div>

                    {/* Right Col: Code */}
                    <div className="space-y-4">
                      {endpoint.body && (
                        <CodeBlock code={endpoint.body} label="Request Body (JSON)" />
                      )}
                      <CodeBlock code={endpoint.response} label="Response (200 OK)" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
};

export default ApiDocs;