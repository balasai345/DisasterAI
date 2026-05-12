import React from 'react';
import { Home, Brain, BarChart3, Users, Settings, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { UserRole } from '../types';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole?: UserRole;
}

export function BottomNav({ activeTab, setActiveTab, userRole = 'admin' }: BottomNavProps) {
  const { t } = useLanguage();

  const allNavItems = [
    { id: 'dashboard', icon: Home, label: t('nav.home'), roles: ['admin', 'operator', 'viewer'] },
    { id: 'analysis', icon: Brain, label: t('nav.ml'), roles: ['admin', 'operator', 'viewer'] },
    { id: 'emergency', icon: ShieldAlert, label: t('nav.sos'), roles: ['admin', 'operator', 'viewer'] },
    { id: 'stakeholders', icon: Users, label: t('nav.team'), roles: ['admin', 'operator'] },
    { id: 'configuration', icon: Settings, label: t('nav.settings'), roles: ['admin'] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center px-2 py-3 z-50 pb-[env(safe-area-inset-bottom)]">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center w-16 gap-1 transition-colors ${
              isActive ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-teal-50' : ''}`}>
              <item.icon size={20} className={isActive ? 'fill-teal-600/20' : ''} />
            </div>
            <span className={`text-[10px] font-medium ${isActive ? 'text-teal-700' : 'text-slate-500'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
