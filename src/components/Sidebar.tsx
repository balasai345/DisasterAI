import React from 'react';
import { Home, Users, Settings, Activity, BarChart3, LogOut, Shield, Brain, X, ShieldAlert, Globe } from 'lucide-react';
import { UserRole } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: UserRole;
  onLogout: () => void;
  isMobileMenuOpen?: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
}

export function Sidebar({ activeTab, setActiveTab, userRole = 'admin', onLogout, isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
  const { t, language, setLanguage } = useLanguage();

  const allMenuItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: Home, roles: ['admin', 'operator', 'viewer'] },
    { id: 'analysis', label: t('nav.analysis'), icon: Brain, roles: ['admin', 'operator', 'viewer'] },
    { id: 'emergency', label: t('nav.emergency'), icon: ShieldAlert, roles: ['admin', 'operator', 'viewer'] },
    { id: 'benchmarking', label: t('nav.benchmarking'), icon: BarChart3, roles: ['admin', 'operator'] },
    { id: 'stakeholders', label: t('nav.stakeholders'), icon: Users, roles: ['admin', 'operator'] },
    { id: 'users', label: t('nav.users'), icon: Shield, roles: ['admin'] },
    { id: 'configuration', label: t('nav.configuration'), icon: Settings, roles: ['admin'] },
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(userRole));

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen?.(false)}
        />
      )}
      
      <div className={`w-64 bg-white text-slate-600 h-screen fixed left-0 top-0 flex flex-col shadow-xl z-50 border-r border-slate-200 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2 text-slate-800">
              <Shield className="text-teal-600 fill-teal-600" />
              DisasterAI
            </h1>
            <p className="text-xs text-slate-400 mt-1">{t('common.system_admin')}</p>
          </div>
          <button 
            className="md:hidden p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen?.(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen?.(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
              activeTab === item.id 
                ? 'bg-teal-50 text-teal-700 border-l-4 border-teal-600' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </button>
        ))}
        
        <div className="mt-8 pt-4 border-t border-slate-100 space-y-2">
          {/* Language Switcher */}
          <div className="px-4 py-2 flex items-center gap-3 text-sm font-medium text-slate-500">
            <Globe size={18} />
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-transparent border-none focus:ring-0 text-slate-600 font-bold cursor-pointer outline-none"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="te">తెలుగు (Telugu)</option>
            </select>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
            <span>{t('nav.logout')}</span>
          </button>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-100 bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
            {userRole.substring(0, 2).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-800 truncate">{userRole}</p>
            <p className="text-xs text-teal-600 font-medium">{t('common.online')}</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
