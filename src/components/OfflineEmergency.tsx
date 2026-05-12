import React, { useState } from 'react';
import { AlertTriangle, Phone, MessageSquare, Map, BookOpen, Navigation, ShieldAlert, WifiOff } from 'lucide-react';
import { Geolocation } from '@capacitor/geolocation';
import { useLanguage } from '../contexts/LanguageContext';

export function OfflineEmergency() {
  const [locationStatus, setLocationStatus] = useState<string>('');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { t } = useLanguage();

  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSOS = async () => {
    setLocationStatus('Fetching location...');
    let locationText = 'Location unavailable.';
    try {
      // Request permissions first (required for Android/iOS)
      const permissions = await Geolocation.checkPermissions();
      if (permissions.location !== 'granted') {
        const request = await Geolocation.requestPermissions();
        if (request.location !== 'granted') {
          throw new Error('Location permission denied by user');
        }
      }

      // Fetch position with high accuracy
      const coordinates = await Geolocation.getCurrentPosition({ 
        timeout: 15000,
        enableHighAccuracy: true 
      });
      locationText = `Lat: ${coordinates.coords.latitude}, Lng: ${coordinates.coords.longitude}`;
      setLocationStatus('Location found!');
    } catch (e) {
      console.error('Error getting location', e);
      setLocationStatus('Could not get location. Sending SMS without coordinates.');
    }

    const message = `EMERGENCY SOS: I need immediate assistance. ${locationText}`;
    // Using 112 as a generic emergency number, can be customized
    window.open(`sms:112?body=${encodeURIComponent(message)}`, '_system');
    
    setTimeout(() => setLocationStatus(''), 3000);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 bg-slate-50 min-h-screen pb-24">
      <header className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="text-red-600" /> {t('emergency.title')}
          </h2>
          <p className="text-sm md:text-base text-slate-500 mt-2">{t('emergency.subtitle')}</p>
        </div>
        {isOffline && (
          <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm font-bold border border-amber-200">
            <WifiOff size={16} /> {t('common.offline')}
          </div>
        )}
      </header>

      {/* SOS Section */}
      <div className="bg-red-50 border border-red-200 p-6 rounded-2xl shadow-sm text-center">
        <h3 className="text-xl font-bold text-red-900 mb-2">{t('emergency.sos_title')}</h3>
        <p className="text-red-700 mb-6 text-sm">{t('emergency.sos_desc')}</p>
        
        <button 
          onClick={handleSOS}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2 mx-auto w-full md:w-auto text-lg"
        >
          <MessageSquare size={24} />
          {t('emergency.sos_button')}
        </button>
        {locationStatus && (
          <p className="text-red-600 text-sm mt-3 font-medium">{locationStatus}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Emergency Contacts */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Phone className="text-teal-600" /> {t('emergency.contacts')}
          </h3>
          <div className="space-y-3">
            {[
              { name: 'National Emergency', number: '112' },
              { name: 'Ambulance', number: '102' },
              { name: 'Disaster Management (NDMA)', number: '1078' },
              { name: 'Fire Department', number: '101' },
              { name: 'Local Police', number: '100' },
              { name: 'Women Helpline', number: '1091' }
            ].map((contact, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-medium text-slate-700">{contact.name}</span>
                <a 
                  href={`tel:${contact.number}`}
                  className="bg-teal-100 text-teal-700 px-4 py-1.5 rounded-lg font-bold text-sm hover:bg-teal-200 transition-colors flex items-center gap-2"
                >
                  <Phone size={14} />
                  {contact.number}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Guidelines */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BookOpen className="text-teal-600" /> {t('emergency.guidelines')}
          </h3>
          <div className="space-y-3">
            <details className="group bg-slate-50 rounded-xl border border-slate-100 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-4 font-medium cursor-pointer text-slate-700">
                Flood Response
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="p-4 pt-0 text-sm text-slate-600 space-y-2">
                <p>• Move to higher ground immediately.</p>
                <p>• Do not walk or drive through flood waters.</p>
                <p>• Disconnect electrical appliances.</p>
              </div>
            </details>
            <details className="group bg-slate-50 rounded-xl border border-slate-100 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-4 font-medium cursor-pointer text-slate-700">
                Earthquake Protocol
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="p-4 pt-0 text-sm text-slate-600 space-y-2">
                <p>• DROP, COVER, and HOLD ON.</p>
                <p>• Stay away from glass, windows, and outside doors.</p>
                <p>• If outdoors, move away from buildings and streetlights.</p>
              </div>
            </details>
            <details className="group bg-slate-50 rounded-xl border border-slate-100 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-4 font-medium cursor-pointer text-slate-700">
                Fire Evacuation
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <div className="p-4 pt-0 text-sm text-slate-600 space-y-2">
                <p>• Get out, stay out, and call for help.</p>
                <p>• Crawl low under any smoke to your exit.</p>
                <p>• Before opening a door, feel the doorknob and door.</p>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Last Downloaded Risk Map */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Map className="text-teal-600" /> {t('emergency.map')}
          </h3>
          <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-1 rounded-md">Cached: Today, 08:00 AM</span>
        </div>
        
        <div className="w-full h-80 bg-slate-200 rounded-xl overflow-hidden relative border border-slate-300 flex items-center justify-center">
          {/* Realistic Map Background */}
          <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/India_location_map.svg/1709px-India_location_map.svg.png')] bg-cover bg-center opacity-60"></div>
          
          <div className="z-10 text-center bg-white/90 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-white/50 max-w-xs">
            <Navigation className="mx-auto text-teal-600 mb-3" size={36} />
            <p className="text-slate-800 font-bold text-lg">Offline Map Area: New Delhi</p>
            <p className="text-slate-600 text-sm mt-1">High Risk Zones Highlighted</p>
            <button className="mt-4 bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-teal-700 transition-colors w-full">
              Open Full Offline Map
            </button>
          </div>

          {/* Simulated Risk Zones */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-500/40 rounded-full blur-md border-2 border-red-500 animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-orange-500/40 rounded-full blur-md border-2 border-orange-500"></div>
          
          {/* User Location Pin */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-bounce"></div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
