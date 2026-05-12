import React, { useState } from 'react';
import { Save, Bell, Shield, Database, Mail, Smartphone, Globe, Check } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export function Configuration() {
  const { settings, setSettings } = useData();
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleNestedChange = (parentKey: 'emailNotifications' | 'smsNotifications', childKey: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [childKey]: value
      }
    }));
  };

  const handleLevelChange = (parentKey: 'emailNotifications' | 'smsNotifications', level: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        levels: {
          ...prev[parentKey].levels,
          [level]: value
        }
      }
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Settings saved successfully!");
    }, 600);
  };

  const severityLevels = [
    { id: 'low', label: 'Low', color: 'bg-green-100 text-green-700' },
    { id: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'high', label: 'High', color: 'bg-orange-100 text-orange-700' },
    { id: 'critical', label: 'Critical', color: 'bg-red-100 text-red-700' }
  ];

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">System Configuration</h1>
          <p className="text-sm md:text-base text-slate-500 mt-1">Configure thresholds, notifications, and system settings.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full md:w-auto bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm disabled:opacity-70"
        >
          <Save size={18} />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Detection Thresholds */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <Shield className="text-teal-600 w-5 h-5" />
            <h2 className="font-semibold text-slate-800">Detection Thresholds</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">Flood Confidence Threshold</label>
                <span className="text-sm font-bold text-teal-600">{settings.floodThreshold}%</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="99" 
                value={settings.floodThreshold}
                onChange={(e) => handleChange('floodThreshold', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <p className="text-xs text-slate-500 mt-1">Minimum confidence score required to trigger a flood alert.</p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">Wildfire Confidence Threshold</label>
                <span className="text-sm font-bold text-orange-600">{settings.wildfireThreshold}%</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="99" 
                value={settings.wildfireThreshold}
                onChange={(e) => handleChange('wildfireThreshold', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
              <p className="text-xs text-slate-500 mt-1">Minimum confidence score required to trigger a wildfire alert.</p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <Bell className="text-teal-600 w-5 h-5" />
            <h2 className="font-semibold text-slate-800">Notifications & Alerts</h2>
          </div>
          <div className="p-6 space-y-6">
            
            {/* Email Notifications */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">Email Notifications</div>
                    <div className="text-xs text-slate-500">Send alerts to registered stakeholder emails</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.emailNotifications.enabled}
                    onChange={(e) => handleNestedChange('emailNotifications', 'enabled', e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>
              
              {settings.emailNotifications.enabled && (
                <div className="ml-14 p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Notify on severity:</p>
                  <div className="flex flex-wrap gap-3">
                    {severityLevels.map(level => (
                      <label key={`email-${level.id}`} className="flex items-center gap-2 cursor-pointer">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                          settings.emailNotifications.levels[level.id as keyof typeof settings.emailNotifications.levels] 
                            ? 'bg-teal-600 border-teal-600' 
                            : 'bg-white border-slate-300'
                        }`}>
                          {settings.emailNotifications.levels[level.id as keyof typeof settings.emailNotifications.levels] && <Check size={14} className="text-white" />}
                        </div>
                        <input 
                          type="checkbox" 
                          className="hidden"
                          checked={settings.emailNotifications.levels[level.id as keyof typeof settings.emailNotifications.levels]}
                          onChange={(e) => handleLevelChange('emailNotifications', level.id, e.target.checked)}
                        />
                        <span className={`text-xs font-medium px-2 py-1 rounded ${level.color}`}>{level.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="h-px bg-slate-100 w-full"></div>

            {/* SMS Notifications */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">SMS Alerts</div>
                    <div className="text-xs text-slate-500">Send urgent alerts via SMS to emergency contacts</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.smsNotifications.enabled}
                    onChange={(e) => handleNestedChange('smsNotifications', 'enabled', e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>

              {settings.smsNotifications.enabled && (
                <div className="ml-14 p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Notify on severity:</p>
                  <div className="flex flex-wrap gap-3">
                    {severityLevels.map(level => (
                      <label key={`sms-${level.id}`} className="flex items-center gap-2 cursor-pointer">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                          settings.smsNotifications.levels[level.id as keyof typeof settings.smsNotifications.levels] 
                            ? 'bg-teal-600 border-teal-600' 
                            : 'bg-white border-slate-300'
                        }`}>
                          {settings.smsNotifications.levels[level.id as keyof typeof settings.smsNotifications.levels] && <Check size={14} className="text-white" />}
                        </div>
                        <input 
                          type="checkbox" 
                          className="hidden"
                          checked={settings.smsNotifications.levels[level.id as keyof typeof settings.smsNotifications.levels]}
                          onChange={(e) => handleLevelChange('smsNotifications', level.id, e.target.checked)}
                        />
                        <span className={`text-xs font-medium px-2 py-1 rounded ${level.color}`}>{level.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="h-px bg-slate-100 w-full"></div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                  <Globe size={20} />
                </div>
                <div>
                  <div className="font-medium text-slate-900">Auto-Dispatch</div>
                  <div className="text-xs text-slate-500">Automatically notify nearest response teams for Critical alerts</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.autoDispatch}
                  onChange={(e) => handleChange('autoDispatch', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
            <Database className="text-teal-600 w-5 h-5" />
            <h2 className="font-semibold text-slate-800">Data & API</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data Retention (Days)</label>
              <select 
                value={settings.dataRetentionDays}
                onChange={(e) => handleChange('dataRetentionDays', parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="7">7 Days</option>
                <option value="30">30 Days</option>
                <option value="90">90 Days</option>
                <option value="365">1 Year</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">API Key</label>
              <div className="flex gap-2">
                <input 
                  type="password" 
                  value={settings.apiKey}
                  readOnly
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 font-mono text-sm"
                />
                <button className="px-4 py-2 text-sm font-medium text-teal-600 hover:bg-teal-50 rounded-lg transition-colors border border-teal-200">
                  Regenerate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
