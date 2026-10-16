import React, { useState } from 'react';
import { Task, Project } from '../../types';

interface TodayViewProps {
  tasks: Task[];
  projects: Project[];
  onToggleTask: (taskId: string) => void;
  onQuickAddTask: (title: string) => void;
  onSelectTask: (task: Task) => void;
  onOpenTaskModal: () => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  tasks,
  projects,
  onToggleTask,
  onQuickAddTask,
  onSelectTask,
  onOpenTaskModal,
}) => {
  const [quickInput, setQuickInput] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);

  const todayStr = new Date().toISOString().split('T')[0];
  const formattedToday = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Filter tasks
  const overdueTasks = tasks.filter((t) => !t.completed && t.dueDate && t.dueDate < todayStr);
  const dueTodayTasks = tasks.filter((t) => !t.completed && t.dueDate === todayStr);
  const completedTodayTasks = tasks.filter((t) => t.completed && t.dueDate === todayStr);

  const totalDayTasks = dueTodayTasks.length + completedTodayTasks.length;
  const completionPercent =
    totalDayTasks > 0 ? Math.round((completedTodayTasks.length / totalDayTasks) * 100) : 0;

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickInput.trim()) {
      onQuickAddTask(quickInput.trim());
      setQuickInput('');
    }
  };

  const getProject = (projectId?: string) => {
    return projects.find((p) => p.id === projectId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl shadow-soft border border-[#E8E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#77766F] block">
            {formattedToday}
          </span>
          <h2 className="text-[24px] sm:text-[28px] font-bold text-[#292820] tracking-tight mt-0.5">
            Today's Focus
          </h2>
          <p className="text-sm text-[#77766F] mt-1">
            {dueTodayTasks.length === 0
              ? 'All clear for today! Take a breather or plan ahead.'
              : `${dueTodayTasks.length} task${dueTodayTasks.length === 1 ? '' : 's'} remaining today.`}
          </p>
        </div>

        {/* Daily Completion Spark Summary */}
        <div className="flex items-center gap-3 bg-[#F7F5F0] px-4 py-2.5 rounded-xl border border-[#E8E4DC]/80 self-start sm:self-center">
          <div className="w-9 h-9 rounded-full bg-[#EBF2EB] text-[#4E795C] flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
          </div>
          <div>
            <span className="text-xs font-bold text-[#292820] block">
              {completedTodayTasks.length} of {totalDayTasks} completed
            </span>
            <div className="w-24 h-1.5 bg-[#E8E4DC] rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-[#4E795C] rounded-full transition-all duration-300"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add Field */}
      <form
        onSubmit={handleQuickSubmit}
        className="relative flex items-center bg-white rounded-2xl shadow-soft border border-[#E8E4DC] p-1.5 focus-within:border-[#65513B] transition-all"
      >
        <span className="material-symbols-outlined text-[20px] text-[#77766F] pl-3">
          add_circle
        </span>
        <input
          type="text"
          value={quickInput}
          onChange={(e) => setQuickInput(e.target.value)}
          placeholder="+ Add task for today (press Enter to create)..."
          className="w-full bg-transparent px-3 py-2 text-sm text-[#292820] placeholder-[#77766F] outline-none"
        />
        <button
          type="submit"
          disabled={!quickInput.trim()}
          className="flex items-center justify-center h-8 w-8 rounded-xl bg-[#65513B] text-white hover:bg-[#493A2B] disabled:opacity-30 transition-all cursor-pointer mr-1"
        >
          <span className="material-symbols-outlined text-[16px]">keyboard_return</span>
        </button>
      </form>

      {/* Overdue Section (Alert Banner) */}
      {overdueTasks.length > 0 && (
        <div className="bg-[#FAECEB] rounded-2xl p-4 sm:p-5 border border-[#F3D1CF] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#B45345]">
              <span className="material-symbols-outlined text-[20px]">warning</span>
              <h3 className="text-sm font-bold">
                {overdueTasks.length} Overdue Task{overdueTasks.length === 1 ? '' : 's'}
              </h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white text-[#B45345]">
              Action Required
            </span>
          </div>

          <div className="space-y-2">
            {overdueTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className="flex items-start justify-between p-3 bg-white rounded-xl border border-[#F3D1CF] hover:shadow-soft cursor-pointer transition-all"
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleTask(task.id);
                    }}
                    className="mt-0.5 w-5 h-5 rounded-lg border border-[#B45345] hover:bg-[#FAECEB] flex items-center justify-center cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px] text-transparent hover:text-[#B45345]">
                      check
                    </span>
                  </button>
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-[#292820] block">
                      {task.title}
                    </span>
                    <span className="text-xs text-[#B45345] font-medium flex items-center gap-1 mt-0.5">
                      <span>Was due: {task.dueDate}</span>
                      {task.dueTime && <span>at {task.dueTime}</span>}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FAECEB] text-[#B45345]">
                  High Priority
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Due Today List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-[#292820] uppercase tracking-wider flex items-center gap-1.5">
            <span>Due Today</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F0EBE2] text-[#65513B]">
              {dueTodayTasks.length}
            </span>
          </h3>
          <button
            type="button"
            onClick={onOpenTaskModal}
            className="text-xs font-semibold text-[#65513B] hover:underline cursor-pointer"
          >
            + Add with details
          </button>
        </div>

        {dueTodayTasks.length > 0 ? (
          <div className="space-y-2">
            {dueTodayTasks.map((task) => {
              const proj = getProject(task.projectId);
              return (
                <div
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  className="group flex items-start justify-between p-3.5 bg-white rounded-xl border border-[#E8E4DC] hover:border-[#65513B]/40 hover:shadow-soft transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleTask(task.id);
                      }}
                      className="mt-0.5 w-5 h-5 rounded-lg border border-[#77766F] hover:border-[#65513B] bg-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px] opacity-0 group-hover:opacity-40">
                        check
                      </span>
                    </button>
                    <div className="min-w-0 flex-1">
                      <span className="text-sm font-semibold text-[#292820] group-hover:text-[#65513B] block leading-tight">
                        {task.title}
                      </span>
                      {task.description && (
                        <p className="text-xs text-[#77766F] line-clamp-1 mt-0.5">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-2 flex-wrap text-xs">
                        {task.dueTime && (
                          <span className="text-[#77766F] text-[11px] flex items-center gap-0.5 bg-[#F7F5F0] px-1.5 py-0.5 rounded">
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
                          <span className="text-[#77766F] text-[11px] flex items-center gap-1 bg-[#F0EBE2] px-2 py-0.5 rounded-md">
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
          <div className="bg-white p-6 rounded-2xl border border-[#E8E4DC] text-center text-xs text-[#77766F]">
            No pending tasks for today.
          </div>
        )}
      </div>

      {/* Completed Today Accordion */}
      {completedTodayTasks.length > 0 && (
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center justify-between w-full text-xs font-bold text-[#77766F] uppercase tracking-wider px-1 cursor-pointer"
          >
            <span>Completed Today ({completedTodayTasks.length})</span>
            <span
              className={`material-symbols-outlined text-[18px] transition-transform ${
                showCompleted ? 'rotate-0' : '-rotate-90'
              }`}
            >
              keyboard_arrow_down
            </span>
          </button>

          {showCompleted && (
            <div className="space-y-1.5">
              {completedTodayTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/70 border border-[#E8E4DC]/70 opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleTask(task.id);
                      }}
                      className="w-5 h-5 rounded-lg bg-[#4E795C] text-white flex items-center justify-center cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    </button>
                    <span className="text-sm text-[#77766F] line-through truncate">
                      {task.title}
                    </span>
                  </div>
                  {task.completedAt && (
                    <span className="text-[11px] text-[#77766F] shrink-0 ml-2">
                      Completed {task.completedAt}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
