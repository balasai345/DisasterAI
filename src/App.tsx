/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Shield, Menu } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { UploadAnalysis } from './components/UploadAnalysis';
import { Benchmarking } from './components/Benchmarking';
import { OfflineEmergency } from './components/OfflineEmergency';
import { Login } from './components/Login';
import { LandingPage } from './components/LandingPage';
import { Stakeholders } from './components/Stakeholders';
import { Users } from './components/Users';
import { Configuration } from './components/Configuration';
import { Register } from './components/Register';
import { UserRole, Alert } from './types';
import { LanguageProvider } from './contexts/LanguageContext';
import { DataProvider } from './contexts/DataContext';

const mockAlerts: Alert[] = [
  {
    id: 1,
    type: 'River Overflow',
    severity: 'Critical',
    location: 'Yamuna Bank',
    lat: 28.6270,
    lng: 77.2650,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    confidence: 0.95,
    image_data: '',
    status: 'Active'
  },
  {
    id: 2,
    type: 'Urban Flood',
    severity: 'High',
    location: 'ITO Junction',
    lat: 28.6289,
    lng: 77.2400,
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    confidence: 0.88,
    image_data: '',
    status: 'Investigating'
  },
  {
    id: 3,
    type: 'Waterlogging',
    severity: 'Medium',
    location: 'Connaught Place',
    lat: 28.6304,
    lng: 77.2177,
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    confidence: 0.75,
    image_data: '',
    status: 'Resolved'
  }
];

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('operator');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('operator');
    setActiveTab('dashboard');
  };

  const addAlert = (alert: Omit<Alert, 'id' | 'timestamp'>) => {
    const newAlert: Alert = {
      ...alert,
      id: Date.now(),
      timestamp: new Date().toISOString(),
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const updateAlertStatus = (id: number, status: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />} 
      />
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} 
      />

      {/* Protected Dashboard Route */}
      <Route 
        path="/dashboard" 
        element={
          isAuthenticated ? (
            <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 font-sans">
              {/* Mobile Header */}
              <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-xl">
                  <Shield className="text-teal-600 fill-teal-600" />
                  DisasterAI
                </div>
                <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <Menu size={24} />
                </button>
              </div>

              <Sidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                userRole={userRole} 
                onLogout={handleLogout}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
              />
              
              <main className="flex-1 md:ml-64 w-full max-w-[100vw] pb-20 md:pb-0">
                {activeTab === 'dashboard' && (
                  <Dashboard 
                    userRole={userRole} 
                    alerts={alerts} 
                    updateAlertStatus={updateAlertStatus} 
                  />
                )}
                {activeTab === 'analysis' && ['admin', 'operator', 'viewer'].includes(userRole) && <UploadAnalysis addAlert={addAlert} />}
                {activeTab === 'benchmarking' && ['admin', 'operator'].includes(userRole) && <Benchmarking />}
                {activeTab === 'emergency' && <OfflineEmergency />}
                {activeTab === 'stakeholders' && ['admin', 'operator'].includes(userRole) && <Stakeholders />}
                {activeTab === 'users' && userRole === 'admin' && <Users />}
                {activeTab === 'configuration' && userRole === 'admin' && <Configuration />}
              </main>

              <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} />
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <DataProvider>
        <Router>
          <AppContent />
        </Router>
      </DataProvider>
    </LanguageProvider>
  );
}
