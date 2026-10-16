import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '⌘ + K', desc: 'Global Search across tasks, projects, notes' },
    { key: 'Enter', desc: 'Confirm & save quick task input' },
    { key: 'Esc', desc: 'Close any active modal or panel' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/35 backdrop-blur-[1px] transition-opacity"
      />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-modal border border-[#E8E4DC] p-6 space-y-4 z-50 animate-fadeIn">
        <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#65513B]">
              help
            </span>
            <h3 className="text-base font-bold text-[#292820]">Help &amp; Shortcuts</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#77766F] hover:text-[#292820] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#77766F]">
            Keyboard Shortcuts
          </h4>
          <div className="space-y-2">
            {shortcuts.map((s) => (
              <div
                key={s.key}
                className="flex items-center justify-between p-2 rounded-lg bg-[#F7F5F0] text-xs"
              >
                <span className="text-[#292820]">{s.desc}</span>
                <kbd className="px-2 py-0.5 rounded bg-white border border-[#E8E4DC] font-mono text-[11px] font-bold text-[#65513B]">
                  {s.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-[#E8E4DC] text-xs text-[#77766F] space-y-1 leading-relaxed">
          <p>
            <strong>Tip:</strong> DevOpsForge is designed to keep daily tasks simple and
            distraction-free while giving you powerful subtasks, project organization, and habit tracking when you need it.
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#65513B] text-white text-xs font-semibold hover:bg-[#493A2B] cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
