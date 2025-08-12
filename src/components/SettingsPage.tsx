import React, { useState } from 'react';
import { ArrowLeft, Moon, Sun, Monitor, Bell, Shield, Palette, Globe } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsPageProps {
  onBack: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    desktop: true,
    reminders: true,
  });

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <div className="flex-1 overflow-auto bg-black">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={onBack}
            className="p-2 text-gold-400 hover:text-gold-300 transition-colors mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-serif font-bold text-white">Settings</h1>
        </div>

        <div className="space-y-6">
          {/* Appearance */}
          <div className="bg-black-800 border border-gold-600/20 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Palette className="w-5 h-5 text-gold-500 mr-3" />
              <h2 className="text-lg font-semibold text-white">Appearance</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gold-300 mb-3">
                  Theme
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {themeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTheme(option.value as any)}
                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                        theme === option.value
                          ? 'bg-gold-500/20 border-gold-500/50 text-gold-400'
                          : 'bg-black-700 border-gold-600/30 text-gold-300 hover:bg-gold-500/10'
                      }`}
                    >
                      <option.icon className="w-5 h-5" />
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-black-800 border border-gold-600/20 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Bell className="w-5 h-5 text-gold-500 mr-3" />
              <h2 className="text-lg font-semibold text-white">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-white capitalize">
                      {key === 'push' ? 'Push Notifications' : 
                       key === 'desktop' ? 'Desktop Notifications' :
                       key === 'email' ? 'Email Notifications' : 'Task Reminders'}
                    </h3>
                    <p className="text-xs text-gold-400">
                      {key === 'email' ? 'Receive updates via email' :
                       key === 'push' ? 'Mobile push notifications' :
                       key === 'desktop' ? 'Browser notifications' :
                       'Reminders for due tasks'}
                    </p>
                  </div>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-gold-500' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-black-800 border border-gold-600/20 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Shield className="w-5 h-5 text-gold-500 mr-3" />
              <h2 className="text-lg font-semibold text-white">Privacy & Security</h2>
            </div>
            
            <div className="space-y-4">
              <button className="w-full text-left p-3 bg-black-700 border border-gold-600/30 rounded-lg text-gold-300 hover:bg-gold-500/10 transition-colors">
                <div className="font-medium">Data Export</div>
                <div className="text-sm text-gold-400">Download all your data</div>
              </button>
              
              <button className="w-full text-left p-3 bg-black-700 border border-gold-600/30 rounded-lg text-gold-300 hover:bg-gold-500/10 transition-colors">
                <div className="font-medium">Clear Cache</div>
                <div className="text-sm text-gold-400">Clear local storage and cache</div>
              </button>
            </div>
          </div>

          {/* Language & Region */}
          <div className="bg-black-800 border border-gold-600/20 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Globe className="w-5 h-5 text-gold-500 mr-3" />
              <h2 className="text-lg font-semibold text-white">Language & Region</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gold-300 mb-2">
                  Language
                </label>
                <select className="w-full px-3 py-2 bg-black-700 border border-gold-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500">
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gold-300 mb-2">
                  Time Zone
                </label>
                <select className="w-full px-3 py-2 bg-black-700 border border-gold-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500">
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;