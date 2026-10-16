import React, { useState, useEffect } from 'react';
import { Task, Project, Note, ActivePage } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  projects: Project[];
  notes: Note[];
  onSelectTask: (task: Task) => void;
  onSelectProject: (projectId: string) => void;
  onNavigate: (page: ActivePage) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  tasks,
  projects,
  notes,
  onSelectTask,
  onSelectProject,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // Toggle or open search
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingTasks = q
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      )
    : [];

  const matchingProjects = q
    ? projects.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      )
    : [];

  const matchingNotes = q
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
      )
    : [];

  const hasResults =
    matchingTasks.length > 0 || matchingProjects.length > 0 || matchingNotes.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
      />

      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-modal border border-[#E8E4DC] overflow-hidden z-50 animate-fadeIn">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E8E4DC]">
          <span className="material-symbols-outlined text-[20px] text-[#77766F] mr-2.5">
            search
          </span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across tasks, projects, notes, and tags..."
            className="w-full bg-transparent text-sm text-[#292820] placeholder-[#77766F] outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#77766F] hover:bg-[#F0EBE2] hover:text-[#292820] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Search Results or Shortcuts */}
        <div className="max-h-96 overflow-y-auto p-3">
          {!q ? (
            <div className="p-3 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#77766F]">
                Quick Navigation
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { page: 'today' as ActivePage, label: 'Today', icon: 'today' },
                  { page: 'tasks' as ActivePage, label: 'My Tasks', icon: 'check_circle' },
                  { page: 'upcoming' as ActivePage, label: 'Upcoming', icon: 'calendar_month' },
                  { page: 'calendar' as ActivePage, label: 'Calendar', icon: 'event' },
                  { page: 'projects' as ActivePage, label: 'Projects', icon: 'folder_open' },
                  { page: 'notes' as ActivePage, label: 'Notes', icon: 'description' },
                ].map((item) => (
                  <button
                    key={item.page}
                    type="button"
                    onClick={() => {
                      onNavigate(item.page);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-[#F7F5F0] hover:bg-[#F0EBE2] text-left text-xs text-[#292820] flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#65513B]">
                      {item.icon}
                    </span>
                    <span className="font-semibold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : hasResults ? (
            <div className="space-y-4">
              {/* Tasks Results */}
              {matchingTasks.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#77766F] px-2">
                    Tasks ({matchingTasks.length})
                  </span>
                  {matchingTasks.slice(0, 5).map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        onSelectTask(t);
                        onClose();
                      }}
                      className="p-2.5 rounded-xl hover:bg-[#F7F5F0] cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="min-w-0 pr-2">
                        <span
                          className={`text-xs font-semibold block truncate ${
                            t.completed ? 'line-through text-[#77766F]' : 'text-[#292820]'
                          }`}
                        >
                          {t.title}
                        </span>
                        {t.dueDate && (
                          <span className="text-[11px] text-[#77766F]">Due {t.dueDate}</span>
                        )}
                      </div>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#F0EBE2] text-[#65513B]">
                        {t.priority}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Projects Results */}
              {matchingProjects.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#77766F] px-2">
                    Projects ({matchingProjects.length})
                  </span>
                  {matchingProjects.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onSelectProject(p.id);
                        onClose();
                      }}
                      className="p-2.5 rounded-xl hover:bg-[#F7F5F0] cursor-pointer flex items-center gap-2.5 transition-colors"
                    >
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: p.color }}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {p.icon || 'folder'}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#292820]">{p.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Notes Results */}
              {matchingNotes.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#77766F] px-2">
                    Notes ({matchingNotes.length})
                  </span>
                  {matchingNotes.slice(0, 3).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        onNavigate('notes');
                        onClose();
                      }}
                      className="p-2.5 rounded-xl hover:bg-[#F7F5F0] cursor-pointer transition-colors"
                    >
                      <span className="text-xs font-bold text-[#292820] block">{n.title}</span>
                      <p className="text-[11px] text-[#77766F] line-clamp-1 mt-0.5">
                        {n.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-[#77766F]">
              No items matching "{query}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
