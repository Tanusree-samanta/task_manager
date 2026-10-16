import React from 'react';
import { AppNotification } from '../types';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-16 pr-3 sm:pr-8">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/25 backdrop-blur-[1px] transition-opacity"
      />

      {/* Popover */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-modal border border-[#E8E4DC] overflow-hidden z-50 animate-fadeIn">
        <div className="px-4 py-3 border-b border-[#E8E4DC] flex items-center justify-between bg-[#FDFCFB]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#65513B]">
              notifications
            </span>
            <h3 className="text-xs font-bold text-[#292820]">Notifications</h3>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <button
              type="button"
              onClick={onMarkAllRead}
              className="text-[#65513B] font-semibold hover:underline cursor-pointer"
            >
              Mark all read
            </button>
            <span className="text-[#E8E4DC]">•</span>
            <button
              type="button"
              onClick={onClearAll}
              className="text-[#77766F] hover:text-[#B45345] cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="max-h-80 overflow-y-auto divide-y divide-[#E8E4DC]/60">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 hover:bg-[#F7F5F0] transition-colors ${
                  !n.read ? 'bg-[#FDF4E7]/30' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-[#292820]">{n.title}</span>
                  <span className="text-[10px] text-[#77766F] shrink-0">{n.time}</span>
                </div>
                <p className="text-[11px] text-[#77766F] mt-0.5 leading-relaxed">
                  {n.description}
                </p>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-[#77766F]">
              No notifications at this time.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
