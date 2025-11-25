import React from 'react';
import { Database, Key, Link as LinkIcon, Table, Hash, Calendar, Type, CheckSquare, Shield, MapPin, Mail } from 'lucide-react';

interface SchemaField {
  name: string;
  type: string;
  icon: React.ReactNode;
  constraints?: string[];
  relation?: string;
  desc?: string;
}

interface SchemaCollection {
  name: string;
  description: string;
  fields: SchemaField[];
}

const SCHEMA_DATA: SchemaCollection[] = [
  {
    name: 'Donors',
    description: 'Stores registered blood donor profiles and eligibility status.',
    fields: [
      { name: '_id', type: 'ObjectId', icon: <Key className="w-3 h-3" />, constraints: ['PK', 'Unique'] },
      { name: 'full_name', type: 'String', icon: <Type className="w-3 h-3" />, constraints: ['Required'] },
      { name: 'email', type: 'String', icon: <Mail className="w-3 h-3" />, constraints: ['Unique', 'Index'] },
      { name: 'password_hash', type: 'String', icon: <Hash className="w-3 h-3" />, desc: 'Bcrypt hash' },
      { name: 'blood_group', type: 'Enum', icon: <Type className="w-3 h-3" />, constraints: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
      { name: 'location', type: 'GeoJSON', icon: <MapPin className="w-3 h-3" />, desc: 'Point { type: "Point", coordinates: [lng, lat] }', constraints: ['2dsphere Index'] },
      { name: 'phone', type: 'String', icon: <Hash className="w-3 h-3" /> },
      { name: 'last_donation_date', type: 'Date', icon: <Calendar className="w-3 h-3" /> },
      { name: 'is_available', type: 'Boolean', icon: <CheckSquare className="w-3 h-3" />, desc: 'Toggle for visibility' },
      { name: 'med_history', type: 'Array<String>', icon: <Table className="w-3 h-3" /> }
    ]
  },
  {
    name: 'BloodRequests',
    description: 'Emergency and standard blood requests initiated by users or hospitals.',
    fields: [
      { name: '_id', type: 'ObjectId', icon: <Key className="w-3 h-3" />, constraints: ['PK'] },
      { name: 'patient_name', type: 'String', icon: <Type className="w-3 h-3" /> },
      { name: 'blood_group', type: 'String', icon: <Type className="w-3 h-3" />, constraints: ['Required'] },
      { name: 'units_required', type: 'Integer', icon: <Hash className="w-3 h-3" /> },
      { name: 'status', type: 'Enum', icon: <CheckSquare className="w-3 h-3" />, constraints: ['Pending', 'Fulfilled', 'Cancelled'] },
      { name: 'hospital_id', type: 'ObjectId', icon: <LinkIcon className="w-3 h-3" />, relation: 'Hospitals' },
      { name: 'requester_id', type: 'ObjectId', icon: <LinkIcon className="w-3 h-3" />, relation: 'Donors' },
      { name: 'urgency', type: 'Enum', icon: <Shield className="w-3 h-3" />, constraints: ['Critical', 'High', 'Medium'] },
      { name: 'created_at', type: 'Date', icon: <Calendar className="w-3 h-3" />, constraints: ['Default: Now'] }
    ]
  },
  {
    name: 'Hospitals',
    description: 'Registered medical facilities and blood banks.',
    fields: [
      { name: '_id', type: 'ObjectId', icon: <Key className="w-3 h-3" />, constraints: ['PK'] },
      { name: 'name', type: 'String', icon: <Type className="w-3 h-3" />, constraints: ['Index'] },
      { name: 'address', type: 'String', icon: <MapPin className="w-3 h-3" /> },
      { name: 'location', type: 'GeoJSON', icon: <MapPin className="w-3 h-3" />, constraints: ['2dsphere Index'] },
      { name: 'contact_info', type: 'Object', icon: <Hash className="w-3 h-3" />, desc: '{ phone, email, website }' },
      { name: 'inventory', type: 'Array<Object>', icon: <Table className="w-3 h-3" />, desc: '[{ group: "A+", units: 50 }, ...]' }
    ]
  },
  {
    name: 'Notifications',
    description: 'System alerts, donation requests, and reminders.',
    fields: [
      { name: '_id', type: 'ObjectId', icon: <Key className="w-3 h-3" />, constraints: ['PK'] },
      { name: 'recipient_id', type: 'ObjectId', icon: <LinkIcon className="w-3 h-3" />, relation: 'Donors' },
      { name: 'message', type: 'String', icon: <Type className="w-3 h-3" /> },
      { name: 'type', type: 'Enum', icon: <Shield className="w-3 h-3" />, constraints: ['Emergency', 'Reminder', 'Info'] },
      { name: 'is_read', type: 'Boolean', icon: <CheckSquare className="w-3 h-3" />, constraints: ['Default: false'] },
      { name: 'related_request_id', type: 'ObjectId', icon: <LinkIcon className="w-3 h-3" />, relation: 'BloodRequests' }
    ]
  },
  {
    name: 'Admin',
    description: 'Staff accounts for platform management.',
    fields: [
      { name: '_id', type: 'ObjectId', icon: <Key className="w-3 h-3" />, constraints: ['PK'] },
      { name: 'username', type: 'String', icon: <Type className="w-3 h-3" />, constraints: ['Unique'] },
      { name: 'role', type: 'String', icon: <Shield className="w-3 h-3" />, constraints: ['SuperAdmin', 'Moderator'] },
      { name: 'permissions', type: 'Array<String>', icon: <Table className="w-3 h-3" /> }
    ]
  }
];

const DatabaseSchema: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4">
            <Database className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Database Schema</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Visual representation of the RakhtSetu data model. The platform uses a NoSQL document structure (MongoDB) optimized for geospatial queries and real-time updates.
          </p>
        </div>

        {/* Schema Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {SCHEMA_DATA.map((collection) => (
            <div key={collection.name} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              {/* Card Header */}
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                   <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                     <Table className="w-4 h-4 text-slate-500" />
                     {collection.name}
                   </h3>
                   <p className="text-xs text-slate-500 mt-1">{collection.description}</p>
                </div>
              </div>

              {/* Fields List */}
              <div className="divide-y divide-slate-100 text-sm">
                 {collection.fields.map((field, idx) => (
                    <div key={idx} className="p-3 hover:bg-slate-50 transition-colors flex items-start justify-between gap-4 group">
                       {/* Left: Name & Type */}
                       <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                             <span className="text-slate-400">{field.icon}</span>
                             <span className="font-mono font-semibold text-indigo-900">{field.name}</span>
                             {field.relation && (
                                <span className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">
                                   <LinkIcon className="w-3 h-3" /> Ref: {field.relation}
                                </span>
                             )}
                          </div>
                          {field.desc && (
                             <p className="text-slate-500 text-xs pl-5">{field.desc}</p>
                          )}
                       </div>

                       {/* Right: Type & Constraints */}
                       <div className="text-right shrink-0">
                          <span className="font-mono text-xs text-slate-500 block mb-1">{field.type}</span>
                          <div className="flex flex-wrap justify-end gap-1">
                             {field.constraints?.map(c => (
                                <span key={c} className={`text-[10px] px-1.5 rounded border ${
                                   c === 'PK' ? 'bg-amber-50 text-amber-700 border-amber-100 font-bold' :
                                   c === 'Unique' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                   c === 'Required' ? 'bg-red-50 text-red-700 border-red-100' :
                                   'bg-slate-100 text-slate-600 border-slate-200'
                                }`}>
                                   {c}
                                </span>
                             ))}
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
              
              {/* Card Footer decorative */}
              <div className="mt-auto h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-50"></div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-12 border-t border-slate-200 pt-8">
           <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">Legend</h4>
           <div className="flex flex-wrap gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                 <Key className="w-4 h-4 text-amber-500" /> <span>Primary Key (PK)</span>
              </div>
              <div className="flex items-center gap-2">
                 <LinkIcon className="w-4 h-4 text-blue-500" /> <span>Foreign Key / Reference</span>
              </div>
              <div className="flex items-center gap-2">
                 <MapPin className="w-4 h-4 text-slate-500" /> <span>Geospatial Data</span>
              </div>
              <div className="flex items-center gap-2">
                 <span className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-100 rounded text-xs">Unique</span> <span>Unique Constraint</span>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default DatabaseSchema;