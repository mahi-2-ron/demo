import React, { useEffect, useRef, useState } from 'react';
import * as L from 'leaflet';
import { Locate, Loader2 } from 'lucide-react';

interface Donor {
  id: number;
  name: string;
  bloodGroup: string;
  coordinates: [number, number];
  status: string;
  location: string;
  avatar: string;
}

interface MapProps {
  className?: string;
  donors?: Donor[];
}

const LOCATIONS = [
  { 
    name: "Red Cross Center", 
    coords: [28.6139, 77.2090] as [number, number],
    donors: 1240, 
    status: "High Availability",
    urgent: false
  },
  { 
    name: "Mumbai City Hospital", 
    coords: [19.0760, 72.8777] as [number, number],
    donors: 850, 
    status: "Moderate Availability",
    urgent: true
  },
  { 
    name: "Bangalore Blood Bank", 
    coords: [12.9716, 77.5946] as [number, number],
    donors: 920, 
    status: "High Availability",
    urgent: false
  }
];

const BloodMap: React.FC<MapProps> = ({ className, donors = [] }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userCircleRef = useRef<L.Circle | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const donorMarkersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      // Initialize Map
      const map = L.map(mapContainerRef.current).setView([20.5937, 78.9629], 5); // Center on India
      mapInstanceRef.current = map;

      // Add OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // --- 1. RENDER BLOOD CENTERS ---
      const createCenterIcon = (isUrgent: boolean) => {
        const color = isUrgent ? '#ef4444' : '#dc2626';
        const pulseClass = isUrgent ? 'animate-pulse' : '';
        
        return L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div class="relative w-8 h-8 -translate-x-4 -translate-y-8 group cursor-pointer ${pulseClass}">
               <svg viewBox="0 0 24 24" fill="${color}" class="w-full h-full drop-shadow-md transform transition-transform group-hover:scale-110">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
               </svg>
               ${isUrgent ? '<span class="absolute -top-1 -right-1 flex h-3 w-3"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>' : ''}
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32]
        });
      };

      LOCATIONS.forEach(loc => {
        const marker = L.marker(loc.coords, { icon: createCenterIcon(loc.urgent) }).addTo(map);
        marker.bindPopup(`
          <div class="p-1 min-w-[150px]">
            <h3 class="font-bold text-slate-800 text-base mb-1">${loc.name}</h3>
            <div class="flex items-center gap-2 mb-2">
               <span class="text-xs font-bold px-2 py-0.5 rounded-full ${loc.urgent ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}">
                 ${loc.status}
               </span>
            </div>
            <p class="text-sm text-slate-600">Inventory: <b>${loc.donors} units</b></p>
          </div>
        `);
      });
    }
  }, []);

  // --- 2. RENDER DONORS WHENEVER PROP CHANGES ---
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing donor markers
    donorMarkersRef.current.forEach(marker => map.removeLayer(marker));
    donorMarkersRef.current = [];
    
    // Add new donor markers
    donors.forEach(donor => {
       const createDonorIcon = () => L.divIcon({
          className: 'donor-marker',
          html: `
            <div class="relative w-10 h-10 -translate-x-5 -translate-y-5 group cursor-pointer hover:z-50">
               <div class="w-10 h-10 rounded-full border-2 border-white shadow-lg overflow-hidden bg-white transition-transform group-hover:scale-110">
                  <img src="${donor.avatar}" class="w-full h-full object-cover" />
               </div>
               <div class="absolute -bottom-1 -right-1 bg-brand-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white shadow-sm">
                  ${donor.bloodGroup}
               </div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
          popupAnchor: [0, -20]
       });

       const marker = L.marker(donor.coordinates, { icon: createDonorIcon() }).addTo(map);
       marker.bindPopup(`
          <div class="p-1 min-w-[140px] text-center">
             <div class="font-bold text-slate-900">${donor.name}</div>
             <div class="text-xs text-slate-500 mb-2">${donor.location}</div>
             <button class="w-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold py-1.5 rounded transition-colors">
                Contact Donor
             </button>
          </div>
       `);
       
       donorMarkersRef.current.push(marker);
    });

  }, [donors]);

  const handleMyLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const map = mapInstanceRef.current;

        if (map) {
          if (userMarkerRef.current) map.removeLayer(userMarkerRef.current);
          if (userCircleRef.current) map.removeLayer(userCircleRef.current);

          const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: `
              <div class="relative flex items-center justify-center w-6 h-6">
                <span class="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping"></span>
                <span class="relative inline-flex rounded-full h-4 w-4 bg-blue-600 border-2 border-white shadow-sm"></span>
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });

          const marker = L.marker([latitude, longitude], { icon: userIcon })
            .addTo(map)
            .bindPopup("<b>You are here</b>")
            .openPopup();
          
          userMarkerRef.current = marker;

          const circle = L.circle([latitude, longitude], {
            radius: 5000,
            color: '#2563eb',
            fillColor: '#3b82f6',
            fillOpacity: 0.1,
            weight: 1,
            dashArray: '5, 10'
          }).addTo(map);
          
          userCircleRef.current = circle;

          map.flyTo([latitude, longitude], 13, {
            animate: true,
            duration: 1.5
          });
        }
        setIsLocating(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location. Please check browser permissions.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className={`relative w-full h-full rounded-xl overflow-hidden shadow-inner bg-slate-100 z-0 ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* My Location Button */}
      <button 
        onClick={handleMyLocation}
        disabled={isLocating}
        className="absolute top-4 right-4 z-[400] bg-white p-2.5 rounded-lg shadow-md border border-slate-200 hover:bg-slate-50 text-slate-700 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group"
        title="Use My Location"
      >
        {isLocating ? (
            <Loader2 className="w-5 h-5 animate-spin text-brand-600" />
        ) : (
            <Locate className="w-5 h-5 group-hover:text-brand-600 transition-colors" />
        )}
      </button>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur p-4 rounded-xl shadow-xl text-xs z-[400] border border-slate-200">
         <div className="font-bold mb-3 text-slate-800 text-sm border-b border-slate-100 pb-2">Map Legend</div>
         <div className="space-y-2">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span>Blood Bank / Center</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 border-2 border-red-200 animate-pulse rounded-full"></div>
                <span>Urgent Shortage</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-600 border border-white"></div>
                <span>Active Donor</span>
            </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600 border border-white"></div>
                <span>Your Location</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default BloodMap;
