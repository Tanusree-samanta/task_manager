import React from 'react';
import { ActivePage, Task, UserSettings } from '../types';

interface SidebarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  tasks: Task[];
  settings: UserSettings;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenHelp: () => void;
}

export const LOGO_URL =
  'https://lh3.googleusercontent.com/aida/AEtjO1V9m-6OOv0_m8VYWl96sAPK-FR_kL1RIG2UKA49X5sLGCOxS3g1GnZM8o19RlzvfX6zKPzy8bOjtTM3A8i_uIdWtACKQ3Dn9GVM5XVNnhGGgP5tVP-PB3P_MDYUiz2b7N_18SkgMeusB2BpEVbgNPxXLJtjPYBh126vc-KXBq04IezvlufhUP2ICSGAUdKZXKsfha9Ft2VUv9ypGKNOjEFXvMnzmvnU29UzMRyRFlwLNnOmX5Grq_rPGFc';

export const AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA2H6KEE66mBB8Mudcms7Ug968C2LxcEzprXX3DrETOfPmeS8BXdqoiCMhANL4qnEbpVxvPCUe_TV684tS_hv3CnfCsjbXZDJRG-arZIKiyYPjZhCP2O20ED3Cl848Y74QLQ9G5DFAi-foTjSEvyzyh_m429BXptTebtybghKw18WyI4HUELnmxQqRR-U6kQEssPwRjfkDLtYT3RcoluvXd0CpR3yJBXr09aanhigR12D_W72rpcDYb';

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  tasks,
  settings,
  isMobileOpen,
  onCloseMobile,
  isCollapsed,
  onToggleCollapse,
  onOpenHelp,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const pendingCount = tasks.filter((t) => !t.completed).length;
  const todayPendingCount = tasks.filter((t) => !t.completed && t.dueDate === todayStr).length;

  const navItems: { page: ActivePage; label: string; icon: string; count?: number }[] = [
    { page: 'home', label: 'Home', icon: 'cottage' },
    { page: 'tasks', label: 'My Tasks', icon: 'check_circle', count: pendingCount },
    { page: 'today', label: 'Today', icon: 'today', count: todayPendingCount },
    { page: 'upcoming', label: 'Upcoming', icon: 'calendar_month' },
    { page: 'calendar', label: 'Calendar', icon: 'event' },
    { page: 'projects', label: 'Projects', icon: 'folder_open' },
    { page: 'notes', label: 'Notes', icon: 'description' },
    { page: 'habits', label: 'Habits & Goals', icon: 'verified' },
    { page: 'insights', label: 'Insights', icon: 'insights' },
    { page: 'settings', label: 'Settings', icon: 'settings' },
  ];

  const content = (
    <div className="flex flex-col h-full bg-[#FFFFFF] border-r border-[#E8E4DC]">
      {/* Brand & Collapse Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#E8E4DC]/60">
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <img
            src={LOGO_URL}
            alt="DevOpsForge"
            className="w-8 h-8 object-contain rounded-md"
          />
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-[17px] text-[#292820] tracking-tight leading-tight">
                DevOpsForge
              </span>
              <span className="text-[11px] text-[#77766F] font-medium leading-none">
                Friendly Task Manager
              </span>
            </div>
          )}
        </div>

        {/* Desktop collapse toggle button */}
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden md:flex w-8 h-8 items-center justify-center rounded-lg text-[#77766F] hover:bg-[#F0EBE2] hover:text-[#292820] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isCollapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close sidebar"
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-[#77766F] hover:bg-[#F0EBE2] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = activePage === item.page;
          return (
            <button
              key={item.page}
              type="button"
              onClick={() => {
                onNavigate(item.page);
                onCloseMobile();
              }}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#F0EBE2] text-[#65513B] font-semibold shadow-soft'
                  : 'text-[#292820] hover:bg-[#F7F5F0] hover:text-[#493A2B]'
              } ${isCollapsed ? 'justify-center px-0' : 'justify-between'}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`material-symbols-outlined text-[20px] transition-colors ${
                    isActive ? 'text-[#65513B]' : 'text-[#77766F]'
                  }`}
                >
                  {item.icon}
                </span>
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!isCollapsed && item.count !== undefined && item.count > 0 && (
                <span
                  className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-[#65513B] text-white'
                      : 'bg-[#F0EBE2] text-[#77766F]'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer: Help & Profile */}
      <div className="p-3 border-t border-[#E8E4DC]/60 space-y-1.5 bg-[#FDFCFB]">
        {/* Help Link */}
        <button
          type="button"
          onClick={onOpenHelp}
          className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-[#77766F] hover:bg-[#F0EBE2] hover:text-[#292820] transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="Help & Shortcuts"
        >
          <span className="material-symbols-outlined text-[16px]">help</span>
          {!isCollapsed && <span>Help &amp; Shortcuts</span>}
        </button>

        {/* Profile Card */}
        <div
          onClick={() => {
            onNavigate('settings');
            onCloseMobile();
          }}
          className={`flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#F0EBE2] transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={`${settings.displayName} (Settings)`}
        >
          <img
            src={AVATAR_URL}
            alt={settings.displayName || 'Profile avatar'}
            className="w-8 h-8 rounded-full object-cover ring-1 ring-[#E8E4DC]"
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <span className="text-[13px] font-semibold text-[#292820] block truncate">
                {settings.displayName}
              </span>
              <span className="text-[11px] text-[#77766F] block truncate">
                {settings.email}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:block fixed top-0 left-0 bottom-0 z-30 transition-all duration-300 ${
          isCollapsed ? 'w-18' : 'w-60'
        }`}
      >
        {content}
      </aside>

      {/* Mobile Drawer (Slide-out) */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/35 backdrop-blur-[2px] transition-opacity animate-fadeIn"
          />
          <div className="relative w-4/5 max-w-xs h-full shadow-2xl z-50 animate-fadeIn">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
