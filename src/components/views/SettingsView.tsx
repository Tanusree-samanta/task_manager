import React, { useState } from 'react';
import { UserSettings } from '../../types';
import { AVATAR_URL, LOGO_URL } from '../Sidebar';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (updates: Partial<UserSettings>) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [displayName, setDisplayName] = useState(settings.displayName);
  const [email, setEmail] = useState(settings.email);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({ displayName, email });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-[24px] sm:text-[28px] font-bold text-[#292820] tracking-tight">
          Settings &amp; Preferences
        </h2>
        <p className="text-sm text-[#77766F] mt-0.5">
          Customize your workspace appearance, task defaults, and profile.
        </p>
      </div>

      {/* Appearance Section */}
      <div className="bg-white p-6 rounded-2xl shadow-soft border border-[#E8E4DC] space-y-4">
        <h3 className="text-base font-bold text-[#292820] flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-[#65513B]">
            palette
          </span>
          Appearance &amp; Theme
        </h3>

        <div className="grid grid-cols-3 gap-3 pt-1">
          {[
            { id: 'light', label: 'Warm Light', icon: 'light_mode', desc: 'Tactile paper aesthetic' },
            { id: 'dark', label: 'Dark Mode', icon: 'dark_mode', desc: 'Reduced low-light strain' },
            { id: 'system', label: 'System Match', icon: 'contrast', desc: 'Follow OS appearance' },
          ].map((theme) => {
            const isSelected = settings.theme === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => onUpdateSettings({ theme: theme.id as 'light' | 'dark' | 'system' })}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#65513B] bg-[#F0EBE2]/70 ring-1 ring-[#65513B]'
                    : 'border-[#E8E4DC] bg-[#F7F5F0] hover:bg-white'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] text-[#65513B] block mb-1">
                  {theme.icon}
                </span>
                <span className="text-xs font-bold text-[#292820] block">{theme.label}</span>
                <span className="text-[11px] text-[#77766F] block mt-0.5">{theme.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Task Preferences */}
      <div className="bg-white p-6 rounded-2xl shadow-soft border border-[#E8E4DC] space-y-4">
        <h3 className="text-base font-bold text-[#292820] flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-[#65513B]">
            tune
          </span>
          Task Defaults
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Default Task View */}
          <div>
            <label className="text-xs font-semibold text-[#292820] block mb-1.5">
              Default Task View
            </label>
            <select
              value={settings.defaultTaskView}
              onChange={(e) =>
                onUpdateSettings({ defaultTaskView: e.target.value as 'list' | 'board' })
              }
              className="w-full h-10 px-3 rounded-xl bg-[#F7F5F0] border border-[#E8E4DC] text-xs text-[#292820] outline-none cursor-pointer"
            >
              <option value="list">List View (Compact)</option>
              <option value="board">Board View (Kanban)</option>
            </select>
          </div>

          {/* Default Sort */}
          <div>
            <label className="text-xs font-semibold text-[#292820] block mb-1.5">
              Default Sort Order
            </label>
            <select
              value={settings.defaultSort}
              onChange={(e) =>
                onUpdateSettings({
                  defaultSort: e.target.value as 'due' | 'priority' | 'title' | 'recent',
                })
              }
              className="w-full h-10 px-3 rounded-xl bg-[#F7F5F0] border border-[#E8E4DC] text-xs text-[#292820] outline-none cursor-pointer"
            >
              <option value="due">Due date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
              <option value="recent">Recently created</option>
            </select>
          </div>

          {/* Week Start */}
          <div>
            <label className="text-xs font-semibold text-[#292820] block mb-1.5">
              Start of the Week
            </label>
            <select
              value={settings.weekStart}
              onChange={(e) =>
                onUpdateSettings({ weekStart: e.target.value as 'monday' | 'sunday' })
              }
              className="w-full h-10 px-3 rounded-xl bg-[#F7F5F0] border border-[#E8E4DC] text-xs text-[#292820] outline-none cursor-pointer"
            >
              <option value="monday">Monday</option>
              <option value="sunday">Sunday</option>
            </select>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="bg-white p-6 rounded-2xl shadow-soft border border-[#E8E4DC] space-y-4">
        <h3 className="text-base font-bold text-[#292820] flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-[#65513B]">
            person
          </span>
          Profile
        </h3>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={AVATAR_URL}
              alt="Alex Chen"
              className="w-14 h-14 rounded-full object-cover ring-2 ring-[#E8E4DC]"
            />
            <div>
              <span className="text-sm font-bold text-[#292820] block">{displayName}</span>
              <span className="text-xs text-[#77766F] block">{email}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#292820] block mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#F7F5F0] border border-[#E8E4DC] text-xs text-[#292820] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#292820] block mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#F7F5F0] border border-[#E8E4DC] text-xs text-[#292820] outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-[#4E795C] font-semibold">
              {savedSuccess && 'Profile updated successfully!'}
            </span>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#65513B] text-white hover:bg-[#493A2B] text-xs font-semibold shadow-soft cursor-pointer"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* About & Backend Readiness */}
      <div className="bg-white p-6 rounded-2xl shadow-soft border border-[#E8E4DC] space-y-3">
        <div className="flex items-center gap-3">
          <img src={LOGO_URL} alt="DevOpsForge" className="w-10 h-10 object-contain" />
          <div>
            <h3 className="text-base font-bold text-[#292820]">DevOpsForge</h3>
            <span className="text-xs text-[#77766F] font-mono">v2.14.0 Production Build</span>
          </div>
        </div>

        <p className="text-xs text-[#77766F] leading-relaxed">
          An architectural, friendly, and feature-rich personal task manager and habits tracker.
          Designed to cleanly connect to a Python FastAPI backend and PostgreSQL database.
        </p>

        <div className="p-3 bg-[#F7F5F0] rounded-xl border border-[#E8E4DC] text-xs text-[#292820] font-mono space-y-1">
          <div className="text-[11px] text-[#77766F] uppercase font-bold tracking-wider font-sans">
            FastAPI REST Endpoints
          </div>
          <div>GET/POST /api/tasks</div>
          <div>PATCH/DELETE /api/tasks/{'{task_id}'}</div>
          <div>GET/POST /api/projects</div>
        </div>
      </div>
    </div>
  );
};
