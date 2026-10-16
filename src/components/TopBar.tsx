import React from 'react';
import { ActivePage, AppNotification } from '../types';
import { AVATAR_URL } from './Sidebar';

interface TopBarProps {
  activePage: ActivePage;
  onOpenMobileSidebar: () => void;
  onOpenSearch: () => void;
  onOpenAddTask: () => void;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  onNavigate: (page: ActivePage) => void;
  isSidebarCollapsed: boolean;
}

const PAGE_TITLES: Record<ActivePage, { title: string; subtitle?: string }> = {
  home: { title: 'Dashboard', subtitle: 'Welcome back' },
  tasks: { title: 'My Tasks', subtitle: 'Prioritize & organize' },
  today: { title: 'Today', subtitle: 'Focus on daily work' },
  upcoming: { title: 'Upcoming', subtitle: 'Scheduled ahead' },
  calendar: { title: 'Calendar', subtitle: 'Plan by date' },
  projects: { title: 'Projects', subtitle: 'Organize by goals' },
  notes: { title: 'Notes', subtitle: 'Quick capture & ideas' },
  habits: { title: 'Habits & Goals', subtitle: 'Build momentum' },
  insights: { title: 'Insights', subtitle: 'Productivity trends' },
  settings: { title: 'Settings', subtitle: 'Preferences & account' },
};

export const TopBar: React.FC<TopBarProps> = ({
  activePage,
  onOpenMobileSidebar,
  onOpenSearch,
  onOpenAddTask,
  notifications,
  onOpenNotifications,
  onNavigate,
  isSidebarCollapsed,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;
  const current = PAGE_TITLES[activePage] || { title: 'DevOpsForge' };

  return (
    <header
      className={`fixed top-0 right-0 z-20 h-16 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E8E4DC] px-4 md:px-8 flex items-center justify-between transition-all duration-300 left-0 ${
        isSidebarCollapsed ? 'md:left-18' : 'md:left-60'
      }`}
    >
      {/* Left: Mobile Menu & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open menu"
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-[#292820] hover:bg-[#F0EBE2] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        <div>
          <h1 className="text-[18px] md:text-[20px] font-bold text-[#292820] tracking-tight leading-tight">
            {current.title}
          </h1>
          {current.subtitle && (
            <span className="text-[12px] text-[#77766F] font-normal hidden sm:block leading-none">
              {current.subtitle}
            </span>
          )}
        </div>
      </div>

      {/* Right: Search, Quick Add, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search button / input */}
        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Search"
          className="flex items-center gap-2 h-9 px-3 rounded-xl bg-[#F7F5F0] hover:bg-[#F0EBE2] text-[#77766F] hover:text-[#292820] transition-colors border border-[#E8E4DC]/60 cursor-pointer text-xs"
        >
          <span className="material-symbols-outlined text-[18px]">search</span>
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden lg:inline px-1.5 py-0.5 text-[10px] font-mono bg-white rounded border border-[#E8E4DC] text-[#77766F]">
            ⌘K
          </kbd>
        </button>

        {/* Quick Add Button */}
        <button
          type="button"
          onClick={onOpenAddTask}
          className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-[#65513B] text-white hover:bg-[#493A2B] active:scale-95 transition-all text-xs font-semibold shadow-soft cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>New Task</span>
        </button>

        {/* Notifications */}
        <button
          type="button"
          onClick={onOpenNotifications}
          aria-label="Notifications"
          className="relative w-9 h-9 flex items-center justify-center rounded-xl text-[#77766F] hover:bg-[#F0EBE2] hover:text-[#292820] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#B45345] ring-2 ring-white" />
          )}
        </button>

        {/* Profile Avatar */}
        <button
          type="button"
          onClick={() => onNavigate('settings')}
          aria-label="Profile"
          className="w-9 h-9 flex items-center justify-center rounded-full cursor-pointer hover:ring-2 hover:ring-[#65513B]/30 transition-all ml-1"
        >
          <img
            src={AVATAR_URL}
            alt="Alex Chen"
            className="w-8 h-8 rounded-full object-cover ring-1 ring-[#E8E4DC]"
          />
        </button>
      </div>
    </header>
  );
};
