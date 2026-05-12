import React, { useEffect, useState } from 'react';
import { AlertTriangle, MapPin, Clock, Shield, Droplets, Wind, Activity, Bell, RefreshCw, BarChart3, CheckCircle, XCircle, Search, Brain } from 'lucide-react';
import { Alert, ZoneRiskStatus, UserRole } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const vulnerabilityData = [
  { name: 'Hospitals', value: 31, color: '#f43f5e' },
  { name: 'Schools', value: 197, color: '#f59e0b' },
  { name: 'Roads (km)', value: 790, color: '#10b981' },
  { name: 'Population', value: 1580000, color: '#3b82f6' },
];

const riskTrendData = [
  { time: '10:00', score: 20 },
  { time: '11:00', score: 25 },
  { time: '12:00', score: 45 },
  { time: '13:00', score: 60 },
  { time: '14:00', score: 80 },
  { time: '15:00', score: 75 },
];

const zoneRiskData: ZoneRiskStatus[] = [
  {
    zone: 'Central Delhi',
    riskScore: 45,
    riskLevel: 'Low',
    classificationType: 'Normal',
    confidence: 0.92,
    explanation: 'No significant waterlogging observed in key areas.',
    metrics: { rainfall: '12mm', riverLevel: '4m' }
  },
  {
    zone: 'West Delhi',
    riskScore: 65,
    riskLevel: 'Moderate',
    classificationType: 'Urban Flood',
    confidence: 0.85,
    explanation: 'Water accumulation detected in low-lying residential zones.',
    metrics: { rainfall: '45mm', riverLevel: '5.2m' }
  },
  {
    zone: 'North East Delhi',
    riskScore: 88,
    riskLevel: 'High',
    classificationType: 'River Overflow',
    confidence: 0.94,
    explanation: 'River levels exceeding danger mark; potential embankment breach.',
    metrics: { rainfall: '120mm', riverLevel: '7m' }
  }
];

interface DashboardProps {
  userRole?: UserRole;
  alerts?: Alert[];
  updateAlertStatus?: (id: number, status: string) => void;
}

export function Dashboard({ userRole = 'operator', alerts = [], updateAlertStatus }: DashboardProps) {
  const [stats, setStats] = useState({ totalAlerts: 3, highRiskAlerts: 1 });

  // Simulate fetching stats (or just use mock data directly)
  useEffect(() => {
    // In a real app, we would fetch from API
    // fetch('/api/stats').then(...).catch(...)
    // For now, we use the mock data initialized in state
  }, []);

  const handleStatusUpdate = (id: number, newStatus: string) => {
    if (updateAlertStatus) {
      updateAlertStatus(id, newStatus);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-red-100 text-red-700 border-red-200';
      case 'investigating': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'resolved': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Activity className="text-teal-600" />
            Flood Monitoring & Response Dashboard
          </h2>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-4 w-full lg:w-auto">
          <div className="flex-1 lg:flex-none px-3 md:px-4 py-2 bg-green-50 text-green-700 rounded-lg text-xs md:text-sm font-bold border border-green-100 flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            LAST UPDATE: {new Date().toLocaleTimeString()}
          </div>
          <div className="flex-1 lg:flex-none px-3 md:px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-xs md:text-sm font-bold border border-blue-100 text-center">
            DATA SOURCES: 4 Active
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Column - Risk Score & Status */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          {/* Overall Risk Score */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">Overall Risk Score</h3>
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
              {/* Simulated Gauge */}
              <div className="w-full h-full rounded-full border-[12px] border-slate-100 border-t-teal-500 border-r-teal-500 transform -rotate-45"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-slate-800">33</span>
                <span className="text-sm font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded mt-2">MODERATE</span>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 flex items-center gap-2"><Droplets size={14}/> Rainfall</span>
                <span className="font-bold text-slate-700">120 mm</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[60%]"></div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 flex items-center gap-2"><Activity size={14}/> River Level</span>
                <span className="font-bold text-slate-700">7 m</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full w-[40%]"></div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 flex items-center gap-2"><Wind size={14}/> Soil Moisture</span>
                <span className="font-bold text-slate-700">0.80</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full w-[80%]"></div>
              </div>
            </div>
          </div>

          {/* AI Analysis Insights */}
          {alerts.length > 0 && alerts[0].explanation && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                <Brain size={16} className="text-purple-500" /> AI Analysis
              </h3>
              
              <div className="mb-4">
                <p className="text-xs text-slate-500 mb-1 font-semibold">Latest Assessment:</p>
                <p className="text-sm text-slate-700 italic border-l-2 border-purple-300 pl-3 py-1 bg-purple-50 rounded-r">
                  "{alerts[0].explanation}"
                </p>
              </div>

              {alerts[0].image_data && alerts[0].regions && alerts[0].regions.length > 0 && (
                <div className="relative rounded-lg overflow-hidden border border-slate-200">
                  <img 
                    src={alerts[0].image_data} 
                    alt="Analysis" 
                    className="w-full h-48 object-cover"
                  />
                  {alerts[0].regions.map((region, idx) => (
                    <div
                      key={idx}
                      className="absolute border-2 border-red-500 bg-red-500/20 flex items-start justify-start"
                      style={{
                        top: `${(region.ymin / 1000) * 100}%`,
                        left: `${(region.xmin / 1000) * 100}%`,
                        width: `${((region.xmax - region.xmin) / 1000) * 100}%`,
                        height: `${((region.ymax - region.ymin) / 1000) * 100}%`,
                      }}
                    >
                      <span className="bg-red-600 text-white text-[10px] px-1 font-bold shadow-sm">
                        {region.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Zone Risk Status List */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">Zone Risk Status</h3>
            <div className="space-y-3">
              {zoneRiskData.map((zone) => (
                <div key={zone.zone} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-slate-700 text-sm">{zone.zone}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        <span className="font-semibold">Type:</span> {zone.classificationType}
                      </p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      zone.riskLevel === 'High' || zone.riskLevel === 'Critical' ? 'bg-red-100 text-red-700' :
                      zone.riskLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {zone.riskLevel}
                    </span>
                  </div>
                  
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        zone.riskScore > 75 ? 'bg-red-500' : 
                        zone.riskScore > 50 ? 'bg-yellow-500' : 'bg-green-500'
                      }`} 
                      style={{ width: `${zone.riskScore}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Score: {zone.riskScore}/100</span>
                    <span>Conf: {(zone.confidence * 100).toFixed(0)}%</span>
                  </div>

                  <p className="text-xs text-slate-600 italic border-l-2 border-slate-300 pl-2 mt-1">
                    "{zone.explanation}"
                  </p>
                  
                  <div className="flex gap-3 mt-1 pt-2 border-t border-slate-200">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Droplets size={10} /> {zone.metrics.rainfall}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Activity size={10} /> {zone.metrics.riverLevel}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column - Map */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800">Flood Hazard Map</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-xs bg-teal-50 text-teal-700 font-bold rounded hover:bg-teal-100">Reset View</button>
                <button className="px-3 py-1 text-xs bg-slate-100 text-slate-600 font-bold rounded hover:bg-slate-200">Legend</button>
                <button className="px-3 py-1 text-xs bg-slate-100 text-slate-600 font-bold rounded hover:bg-slate-200 flex items-center gap-1">
                  <RefreshCw size={12} /> Refresh
                </button>
              </div>
            </div>
            
            <div className="flex-1 bg-slate-100 rounded-xl relative overflow-hidden group min-h-[500px]">
              <MapContainer center={[28.6139, 77.2090]} zoom={12} style={{ height: '100%', width: '100%', zIndex: 10 }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {alerts.map((alert) => {
                  if (!alert.lat || !alert.lng) return null;
                  
                  const color = alert.severity === 'Critical' ? '#ef4444' : 
                                alert.severity === 'High' ? '#f97316' : 
                                alert.severity === 'Medium' ? '#eab308' : '#22c55e';
                                
                  return (
                    <CircleMarker 
                      key={alert.id} 
                      center={[alert.lat, alert.lng]} 
                      pathOptions={{ color, fillColor: color, fillOpacity: 0.5 }} 
                      radius={15}
                    >
                      <Popup>
                        <div className="font-sans">
                          <h4 className="font-bold text-slate-800">{alert.type}</h4>
                          <p className="text-sm text-slate-600">{alert.location}</p>
                          <p className="text-xs font-bold mt-1" style={{ color }}>{alert.severity} Risk</p>
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                })}
              </MapContainer>

              {/* Legend Overlay */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-sm border border-slate-200 text-xs z-[1000]">
                <p className="font-bold mb-2 text-slate-700">Risk Zones</p>
                <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 bg-red-500 rounded"></div> Critical</div>
                <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 bg-orange-500 rounded"></div> High</div>
                <div className="flex items-center gap-2 mb-1"><div className="w-3 h-3 bg-yellow-500 rounded"></div> Medium</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded"></div> Low</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Alerts & Stats */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          
          {/* Emergency Alerts */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
              <Bell size={16} /> Emergency Alerts
            </h3>
            
            <div className="space-y-3">
              {alerts.length === 0 ? (
                <div className="p-3 bg-green-50 border border-green-100 rounded-lg flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-bold text-green-700">System Idle</span>
                </div>
              ) : (
                alerts.map(alert => (
                  <div key={alert.id} className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={14} className={alert.severity === 'Critical' ? 'text-red-500' : 'text-orange-500'} />
                        <span className="text-xs font-bold text-slate-700">{alert.type}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getStatusColor(alert.status)}`}>
                        {alert.status}
                      </span>
                    </div>
                    
                    <div className="text-xs text-slate-500 space-y-1 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin size={10} /> {alert.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={10} /> {new Date(alert.timestamp).toLocaleTimeString()}
                      </div>
                    </div>

                    {(userRole === 'admin' || userRole === 'operator') && (
                      <div className="flex gap-2 mt-2 pt-2 border-t border-slate-100">
                        {alert.status !== 'Resolved' && (
                          <button 
                            onClick={() => handleStatusUpdate(alert.id, 'Resolved')}
                            className="flex-1 py-1 text-[10px] bg-green-50 text-green-700 hover:bg-green-100 rounded border border-green-200 font-medium transition-colors"
                          >
                            Resolve
                          </button>
                        )}
                        {alert.status === 'Active' && (
                          <button 
                            onClick={() => handleStatusUpdate(alert.id, 'Investigating')}
                            className="flex-1 py-1 text-[10px] bg-yellow-50 text-yellow-700 hover:bg-yellow-100 rounded border border-yellow-200 font-medium transition-colors"
                          >
                            Investigate
                          </button>
                        )}
                        {alert.status === 'Resolved' && (
                          <button 
                            onClick={() => handleStatusUpdate(alert.id, 'Active')}
                            className="flex-1 py-1 text-[10px] bg-red-50 text-red-700 hover:bg-red-100 rounded border border-red-200 font-medium transition-colors"
                          >
                            Reopen
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}

              {(userRole === 'admin' || userRole === 'operator') && (
                <button className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-slate-900 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-200 mt-4">
                  <AlertTriangle size={16} /> ACTIVATE HIGH-RISK ALERT
                </button>
              )}
            </div>
          </div>

          {/* Vulnerability Summary */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">Vulnerability Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-sm text-slate-600">Total Hospitals</span>
                <span className="font-bold text-teal-600">36709</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-sm text-slate-600">Total Schools</span>
                <span className="font-bold text-teal-600">230780</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-sm text-slate-600">Total Roads</span>
                <span className="font-bold text-teal-600">924120 km</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-sm text-slate-600">Total Population</span>
                <span className="font-bold text-teal-600">1,848,240,000</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-xl border border-red-100">
                <span className="text-sm text-red-600 font-bold">High Risk Zones</span>
                <span className="font-bold text-red-600">429</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Row - Charts */}
        <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <BarChart3 className="text-teal-600" /> Infrastructure Vulnerability
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vulnerabilityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Activity className="text-teal-600" /> Risk Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={riskTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" tick={{fontSize: 12}} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#0d9488" strokeWidth={3} dot={{r: 4}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
