import React, { useState } from 'react';
import { Task, Project, Note, ActivePage } from '../../types';

interface HomeViewProps {
  tasks: Task[];
  projects: Project[];
  notes: Note[];
  onToggleTask: (taskId: string) => void;
  onOpenTaskModal: () => void;
  onSelectTask: (task: Task) => void;
  onNavigate: (page: ActivePage) => void;
  onSaveQuickNote: (title: string, content: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  tasks,
  projects,
  notes,
  onToggleTask,
  onOpenTaskModal,
  onSelectTask,
  onNavigate,
  onSaveQuickNote,
}) => {
  const [quickNoteText, setQuickNoteText] = useState('');
  const [quickNoteSaved, setQuickNoteSaved] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const formattedToday = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  // Calculate stats
  const todayTasks = tasks.filter((t) => t.dueDate === todayStr);
  const todayPending = todayTasks.filter((t) => !t.completed);
  const completedTotal = tasks.filter((t) => t.completed).length;
  const upcomingTasks = tasks
    .filter((t) => !t.completed && t.dueDate && t.dueDate > todayStr)
    .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));

  // Weekly progress calculation
  const totalTasksCount = tasks.length;
  const completionRate =
    totalTasksCount > 0 ? Math.round((completedTotal / totalTasksCount) * 100) : 0;

  // Day bars for weekly progress
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekData = [
    { day: 'Mon', completed: 3, total: 4 },
    { day: 'Tue', completed: 4, total: 5 },
    { day: 'Wed', completed: 2, total: 3 },
    { day: 'Thu', completed: 5, total: 6 },
    { day: 'Fri', completed: 3, total: 4 },
    { day: 'Sat', completed: 1, total: 1 },
    { day: 'Sun', completed: 1, total: 2 },
  ];

  const handleQuickNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickNoteText.trim()) {
      onSaveQuickNote('Quick Capture', quickNoteText.trim());
      setQuickNoteText('');
      setQuickNoteSaved(true);
      setTimeout(() => setQuickNoteSaved(false), 2000);
    }
  };

  const getProject = (projectId?: string) => {
    return projects.find((p) => p.id === projectId);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-2xl shadow-soft border border-[#E8E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#77766F] block">
            {formattedToday}
          </span>
          <h2 className="text-[24px] sm:text-[28px] font-bold text-[#292820] tracking-tight mt-0.5">
            Good morning, Alex!
          </h2>
          <p className="text-sm text-[#77766F] mt-1">
            Let's make today productive. You have{' '}
            <strong className="text-[#292820] font-semibold">
              {todayPending.length} task{todayPending.length === 1 ? '' : 's'}
            </strong>{' '}
            scheduled for today.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenTaskModal}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#65513B] text-white hover:bg-[#493A2B] active:scale-95 transition-all text-sm font-semibold shadow-soft cursor-pointer self-start sm:self-center"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>New Task</span>
        </button>
      </div>

      {/* 4 Simple Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Tasks for Today */}
        <div
          onClick={() => onNavigate('today')}
          className="bg-white p-4 sm:p-5 rounded-2xl shadow-soft border border-[#E8E4DC] hover:border-[#65513B]/40 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#77766F]">Tasks for Today</span>
            <div className="w-8 h-8 rounded-lg bg-[#F0EBE2] text-[#65513B] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">today</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-[26px] sm:text-[30px] font-bold text-[#292820]">
              {todayTasks.length}
            </span>
            <span className="text-xs text-[#77766F]">
              {todayPending.length} pending
            </span>
          </div>
        </div>

        {/* Card 2: Completed Tasks */}
        <div
          onClick={() => onNavigate('tasks')}
          className="bg-white p-4 sm:p-5 rounded-2xl shadow-soft border border-[#E8E4DC] hover:border-[#4E795C]/40 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#77766F]">Completed Tasks</span>
            <div className="w-8 h-8 rounded-lg bg-[#EBF2EB] text-[#4E795C] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-[26px] sm:text-[30px] font-bold text-[#292820]">
              {completedTotal}
            </span>
            <span className="text-xs font-semibold text-[#4E795C] bg-[#EBF2EB] px-2 py-0.5 rounded-full">
              Done
            </span>
          </div>
        </div>

        {/* Card 3: Upcoming Tasks */}
        <div
          onClick={() => onNavigate('upcoming')}
          className="bg-white p-4 sm:p-5 rounded-2xl shadow-soft border border-[#E8E4DC] hover:border-[#B98236]/40 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#77766F]">Upcoming Tasks</span>
            <div className="w-8 h-8 rounded-lg bg-[#FDF4E7] text-[#B98236] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-[26px] sm:text-[30px] font-bold text-[#292820]">
              {upcomingTasks.length}
            </span>
            <span className="text-xs text-[#77766F]">scheduled</span>
          </div>
        </div>

        {/* Card 4: Weekly Progress */}
        <div
          onClick={() => onNavigate('insights')}
          className="bg-white p-4 sm:p-5 rounded-2xl shadow-soft border border-[#E8E4DC] hover:border-[#65513B]/40 transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#77766F]">Weekly Progress</span>
            <div className="w-8 h-8 rounded-lg bg-[#F0EBE2] text-[#65513B] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">trending_up</span>
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-[26px] sm:text-[30px] font-bold text-[#292820]">
              {completionRate}%
            </span>
            <span className="text-xs text-[#77766F]">rate</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (My Day & Upcoming) | Right Column (Progress & Notes) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Day Checklist */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-soft border border-[#E8E4DC]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#65513B]">
                  check_box
                </span>
                <h3 className="text-[18px] font-bold text-[#292820]">My Day</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F0EBE2] text-[#65513B]">
                  {todayTasks.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('today')}
                className="text-xs font-semibold text-[#65513B] hover:underline cursor-pointer"
              >
                Open Today View &rarr;
              </button>
            </div>

            {/* Tasks list or empty state */}
            {todayTasks.length > 0 ? (
              <div className="space-y-2">
                {todayTasks.map((task) => {
                  const proj = getProject(task.projectId);
                  return (
                    <div
                      key={task.id}
                      className={`group flex items-start justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                        task.completed
                          ? 'bg-[#F7F5F0]/60 border-[#E8E4DC]/60 opacity-80'
                          : 'bg-white border-[#E8E4DC] hover:border-[#65513B]/40 hover:shadow-soft'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleTask(task.id);
                          }}
                          className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                            task.completed
                              ? 'bg-[#4E795C] border-[#4E795C] text-white'
                              : 'border-[#77766F] hover:border-[#65513B] bg-white'
                          }`}
                        >
                          {task.completed && (
                            <span className="material-symbols-outlined text-[14px]">check</span>
                          )}
                        </button>
                        <div
                          onClick={() => onSelectTask(task)}
                          className="min-w-0 flex-1"
                        >
                          <span
                            className={`text-sm font-semibold block leading-tight ${
                              task.completed
                                ? 'line-through text-[#77766F]'
                                : 'text-[#292820] group-hover:text-[#65513B]'
                            }`}
                          >
                            {task.title}
                          </span>

                          <div className="flex items-center gap-2 mt-1 flex-wrap text-xs">
                            {task.dueTime && (
                              <span className="text-[#77766F] flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-[13px]">
                                  schedule
                                </span>
                                {task.dueTime}
                              </span>
                            )}
                            <span
                              className={`px-1.5 py-0.2 rounded text-[10px] font-semibold uppercase ${
                                task.priority === 'high'
                                  ? 'bg-[#FAECEB] text-[#B45345]'
                                  : task.priority === 'medium'
                                  ? 'bg-[#FDF4E7] text-[#B98236]'
                                  : 'bg-[#F0EBE2] text-[#77766F]'
                              }`}
                            >
                              {task.priority}
                            </span>
                            {proj && (
                              <span className="text-[#77766F] text-[11px] flex items-center gap-1">
                                <span
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{ backgroundColor: proj.color }}
                                />
                                {proj.name}
                              </span>
                            )}
                            {task.subtasks.length > 0 && (
                              <span className="text-[11px] text-[#77766F] flex items-center gap-0.5">
                                <span className="material-symbols-outlined text-[12px]">
                                  checklist
                                </span>
                                {task.subtasks.filter((s) => s.completed).length}/
                                {task.subtasks.length}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Friendly Empty State */
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#F0EBE2] text-[#65513B] flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-[24px]">sunny</span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#292820]">
                    Your day is looking clear!
                  </h4>
                  <p className="text-xs text-[#77766F] mt-0.5">
                    Add a task whenever you're ready.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenTaskModal}
                  className="px-4 py-2 rounded-xl bg-[#65513B] text-white text-xs font-semibold hover:bg-[#493A2B] transition-colors cursor-pointer"
                >
                  Create your first task
                </button>
              </div>
            )}
          </div>

          {/* Upcoming Section Preview */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-soft border border-[#E8E4DC]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#B98236]">
                  event_upcoming
                </span>
                <h3 className="text-[18px] font-bold text-[#292820]">Coming Up Next</h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('upcoming')}
                className="text-xs font-semibold text-[#65513B] hover:underline cursor-pointer"
              >
                View all &rarr;
              </button>
            </div>

            {upcomingTasks.length > 0 ? (
              <div className="divide-y divide-[#E8E4DC]/60">
                {upcomingTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    className="py-3 flex items-center justify-between hover:bg-[#F7F5F0] px-2 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="min-w-0 pr-2">
                      <span className="text-sm font-semibold text-[#292820] block truncate">
                        {task.title}
                      </span>
                      <span className="text-xs text-[#77766F] mt-0.5 block">
                        Due: {task.dueDate} {task.dueTime ? `at ${task.dueTime}` : ''}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-[#F0EBE2] text-[#65513B] shrink-0">
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#77766F] py-2">
                No future tasks scheduled. Enjoy the focus time!
              </p>
            )}
          </div>
        </div>

        {/* Right Column (1 Col wide) */}
        <div className="space-y-6">
          {/* Quick Notes Widget */}
          <div className="bg-white p-5 rounded-2xl shadow-soft border border-[#E8E4DC] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#65513B]">
                  edit_note
                </span>
                <h3 className="text-[17px] font-bold text-[#292820]">Quick Notes</h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('notes')}
                className="text-xs font-semibold text-[#65513B] hover:underline cursor-pointer"
              >
                All Notes &rarr;
              </button>
            </div>

            <form onSubmit={handleQuickNoteSubmit} className="space-y-2">
              <textarea
                rows={3}
                value={quickNoteText}
                onChange={(e) => setQuickNoteText(e.target.value)}
                placeholder="Capture an idea, reminder, or snippet..."
                className="w-full p-3 rounded-xl bg-[#F7F5F0] border border-[#E8E4DC] text-xs text-[#292820] placeholder-[#77766F] outline-none focus:bg-white focus:border-[#65513B] transition-all resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#4E795C] font-semibold">
                  {quickNoteSaved && 'Saved to Notes!'}
                </span>
                <button
                  type="submit"
                  disabled={!quickNoteText.trim()}
                  className="px-3.5 py-1.5 rounded-lg bg-[#65513B] text-white text-xs font-semibold hover:bg-[#493A2B] disabled:opacity-40 transition-all cursor-pointer"
                >
                  Save Note
                </button>
              </div>
            </form>

            {/* Pinned note preview */}
            {notes.length > 0 && (
              <div className="pt-2 border-t border-[#E8E4DC]/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#77766F] block mb-1.5">
                  Recent Note
                </span>
                <div
                  onClick={() => onNavigate('notes')}
                  className="p-2.5 rounded-xl bg-[#FDFCFB] border border-[#E8E4DC] hover:border-[#65513B]/40 cursor-pointer transition-colors"
                >
                  <span className="text-xs font-semibold text-[#292820] block truncate">
                    {notes[0].title}
                  </span>
                  <p className="text-[11px] text-[#77766F] line-clamp-2 mt-0.5">
                    {notes[0].content}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Weekly Progress Chart */}
          <div className="bg-white p-5 rounded-2xl shadow-soft border border-[#E8E4DC] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[17px] font-bold text-[#292820]">Weekly Rhythm</h3>
              <span className="text-xs text-[#77766F]">This Week</span>
            </div>

            <p className="text-xs text-[#77766F]">
              Completed tasks across the last 7 days.
            </p>

            {/* Chart bars */}
            <div className="pt-3">
              <div className="flex items-end justify-between h-28 px-1 pb-1">
                {weekData.map((d, i) => {
                  const heightPct = Math.round((d.completed / 6) * 100);
                  const isToday = i === 4; // Friday
                  return (
                    <div key={d.day} className="flex flex-col items-center gap-1 flex-1">
                      <div className="h-20 w-full flex items-end justify-center">
                        <div
                          className={`w-3.5 rounded-t-sm transition-all duration-300 ${
                            isToday ? 'bg-[#4E795C]' : 'bg-[#65513B]'
                          }`}
                          style={{ height: `${Math.max(15, heightPct)}%` }}
                          title={`${d.day}: ${d.completed} completed`}
                        />
                      </div>
                      <span
                        className={`text-[11px] ${
                          isToday ? 'font-bold text-[#292820]' : 'text-[#77766F]'
                        }`}
                      >
                        {d.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 border-t border-[#E8E4DC]/60 flex items-center justify-between text-xs">
              <span className="text-[#77766F]">Goal: 4 tasks / day</span>
              <span className="text-[#4E795C] font-semibold">On Pace</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
