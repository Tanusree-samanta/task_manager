import React from 'react';
import { Task, Project } from '../../types';

interface UpcomingViewProps {
  tasks: Task[];
  projects: Project[];
  onToggleTask: (taskId: string) => void;
  onSelectTask: (task: Task) => void;
  onOpenTaskModal: () => void;
}

export const UpcomingView: React.FC<UpcomingViewProps> = ({
  tasks,
  projects,
  onToggleTask,
  onSelectTask,
  onOpenTaskModal,
}) => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  // Helper dates
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const in7Days = new Date(today);
  in7Days.setDate(in7Days.getDate() + 7);
  const in7DaysStr = in7Days.toISOString().split('T')[0];

  // Filter future pending tasks
  const futureTasks = tasks
    .filter((t) => !t.completed && t.dueDate && t.dueDate > todayStr)
    .sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));

  const tomorrowTasks = futureTasks.filter((t) => t.dueDate === tomorrowStr);
  const thisWeekTasks = futureTasks.filter(
    (t) => t.dueDate && t.dueDate > tomorrowStr && t.dueDate <= in7DaysStr
  );
  const laterTasks = futureTasks.filter((t) => t.dueDate && t.dueDate > in7DaysStr);

  const getProject = (projectId?: string) => {
    return projects.find((p) => p.id === projectId);
  };

  const renderGroup = (title: string, groupTasks: Task[], icon: string) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <span className="material-symbols-outlined text-[18px] text-[#65513B]">{icon}</span>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#292820]">
          {title} ({groupTasks.length})
        </h3>
      </div>

      <div className="space-y-2">
        {groupTasks.map((task) => {
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
                    <span className="text-[#77766F] text-[11px] flex items-center gap-1 bg-[#F7F5F0] px-2 py-0.5 rounded border border-[#E8E4DC]/60 font-medium">
                      <span className="material-symbols-outlined text-[13px]">event</span>
                      {task.dueDate} {task.dueTime ? `at ${task.dueTime}` : ''}
                    </span>
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
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-soft border border-[#E8E4DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[24px] sm:text-[28px] font-bold text-[#292820] tracking-tight">
            Upcoming Schedule
          </h2>
          <p className="text-sm text-[#77766F] mt-1">
            Chronological overview of scheduled tasks, deadlines, and milestones.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenTaskModal}
          className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-[#65513B] text-white hover:bg-[#493A2B] text-xs font-semibold shadow-soft cursor-pointer self-start sm:self-center"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Schedule Task</span>
        </button>
      </div>

      {/* Task Groups */}
      {futureTasks.length > 0 ? (
        <div className="space-y-6">
          {tomorrowTasks.length > 0 &&
            renderGroup('Tomorrow', tomorrowTasks, 'wb_twilight')}
          {thisWeekTasks.length > 0 &&
            renderGroup('This Week', thisWeekTasks, 'date_range')}
          {laterTasks.length > 0 && renderGroup('Later', laterTasks, 'next_plan')}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white p-12 rounded-2xl shadow-soft border border-[#E8E4DC] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#F0EBE2] text-[#65513B] flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[24px]">event_available</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-[#292820]">No upcoming tasks scheduled</h3>
            <p className="text-xs text-[#77766F] mt-1 max-w-sm mx-auto">
              Plan ahead by scheduling tasks with a future due date.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenTaskModal}
            className="px-4 py-2 rounded-xl bg-[#65513B] text-white text-xs font-semibold hover:bg-[#493A2B] transition-colors cursor-pointer"
          >
            Schedule a task
          </button>
        </div>
      )}
    </div>
  );
};
