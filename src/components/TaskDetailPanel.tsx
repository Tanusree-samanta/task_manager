import React from 'react';
import { Task, Project } from '../types';

interface TaskDetailPanelProps {
  task: Task | null;
  onClose: () => void;
  onToggleComplete: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  projects: Project[];
}

export const TaskDetailPanel: React.FC<TaskDetailPanelProps> = ({
  task,
  onClose,
  onToggleComplete,
  onToggleSubtask,
  onEdit,
  onDelete,
  projects,
}) => {
  if (!task) return null;

  const project = projects.find((p) => p.id === task.projectId);
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const priorityColors = {
    low: { bg: 'bg-[#F0EBE2]', text: 'text-[#77766F]', border: 'border-[#E8E4DC]' },
    medium: { bg: 'bg-[#FDF4E7]', text: 'text-[#B98236]', border: 'border-[#F5E0C2]' },
    high: { bg: 'bg-[#FAECEB]', text: 'text-[#B45345]', border: 'border-[#F3D1CF]' },
  };

  const priorityStyle = priorityColors[task.priority] || priorityColors.medium;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dimmed backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/35 backdrop-blur-[1px] transition-opacity animate-fadeIn"
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl border-l border-[#E8E4DC] flex flex-col z-50 overflow-hidden animate-fadeIn">
        {/* Header toolbar */}
        <div className="h-16 px-6 border-b border-[#E8E4DC] flex items-center justify-between bg-[#FDFCFB]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleComplete(task.id)}
              className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                task.completed
                  ? 'bg-[#4E795C] border-[#4E795C] text-white'
                  : 'border-[#77766F] hover:border-[#65513B] bg-white'
              }`}
              title={task.completed ? 'Reopen task' : 'Mark task completed'}
            >
              {task.completed && (
                <span className="material-symbols-outlined text-[16px]">check</span>
              )}
            </button>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                task.completed
                  ? 'bg-[#EBF2EB] text-[#4E795C]'
                  : 'bg-[#F0EBE2] text-[#77766F]'
              }`}
            >
              {task.completed ? 'Completed' : 'Pending'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onEdit(task)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#77766F] hover:bg-[#F0EBE2] hover:text-[#292820] transition-colors cursor-pointer"
              title="Edit Task"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </button>
            <button
              type="button"
              onClick={() => onDelete(task.id)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#77766F] hover:bg-[#FAECEB] hover:text-[#B45345] transition-colors cursor-pointer"
              title="Delete Task"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#77766F] hover:bg-[#F0EBE2] hover:text-[#292820] transition-colors cursor-pointer"
              title="Close panel"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Scrollable details content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title & Description */}
          <div>
            <h2
              className={`text-[20px] font-bold tracking-tight ${
                task.completed ? 'line-through text-[#77766F]' : 'text-[#292820]'
              }`}
            >
              {task.title}
            </h2>
            {task.description && (
              <p className="text-[14px] text-[#77766F] mt-2 whitespace-pre-wrap leading-relaxed">
                {task.description}
              </p>
            )}
          </div>

          {/* Properties Meta Table */}
          <div className="p-4 rounded-xl bg-[#F7F5F0] border border-[#E8E4DC] space-y-3 text-xs">
            {/* Priority */}
            <div className="flex items-center justify-between">
              <span className="text-[#77766F] font-medium flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">flag</span>
                Priority
              </span>
              <span
                className={`font-semibold px-2 py-0.5 rounded-full border ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border} capitalize`}
              >
                {task.priority} Priority
              </span>
            </div>

            {/* Due Date & Time */}
            <div className="flex items-center justify-between">
              <span className="text-[#77766F] font-medium flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">event</span>
                Due Date
              </span>
              <span className="text-[#292820] font-semibold">
                {task.dueDate ? `${task.dueDate}${task.dueTime ? ` at ${task.dueTime}` : ''}` : 'No date set'}
              </span>
            </div>

            {/* Project */}
            {project && (
              <div className="flex items-center justify-between">
                <span className="text-[#77766F] font-medium flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">folder</span>
                  Project
                </span>
                <span className="text-[#292820] font-semibold flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  {project.name}
                </span>
              </div>
            )}

            {/* Recurring */}
            {task.recurring && task.recurring !== 'none' && (
              <div className="flex items-center justify-between">
                <span className="text-[#77766F] font-medium flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">sync</span>
                  Repeats
                </span>
                <span className="text-[#292820] font-semibold capitalize">
                  {task.recurring}
                </span>
              </div>
            )}
          </div>

          {/* Subtasks Progress & Checklist */}
          {totalSubtasks > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#292820] flex items-center gap-1.5">
                  <span>Subtasks</span>
                  <span className="text-xs font-normal text-[#77766F]">
                    ({completedSubtasks} of {totalSubtasks})
                  </span>
                </h3>
                <span className="text-xs font-semibold text-[#65513B]">
                  {progressPercent}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-[#F0EBE2] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#4E795C] rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Subtask list */}
              <div className="space-y-1.5 pt-1">
                {task.subtasks.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => onToggleSubtask(task.id, st.id)}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#F7F5F0] transition-colors cursor-pointer"
                  >
                    <button
                      type="button"
                      className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                        st.completed
                          ? 'bg-[#4E795C] border-[#4E795C] text-white'
                          : 'border-[#77766F] bg-white'
                      }`}
                    >
                      {st.completed && (
                        <span className="material-symbols-outlined text-[12px]">check</span>
                      )}
                    </button>
                    <span
                      className={`text-xs ${
                        st.completed ? 'line-through text-[#77766F]' : 'text-[#292820]'
                      }`}
                    >
                      {st.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes or Checklist */}
          {task.notes && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-[#292820] uppercase tracking-wider">
                Notes
              </h3>
              <div className="p-3.5 rounded-xl bg-[#FDFCFB] border border-[#E8E4DC] text-xs text-[#292820] whitespace-pre-wrap leading-relaxed">
                {task.notes}
              </div>
            </div>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-[#292820] uppercase tracking-wider">
                Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#F0EBE2] text-[#65513B] border border-[#E8E4DC]/80"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="pt-4 border-t border-[#E8E4DC]/60 text-[11px] text-[#77766F] space-y-0.5">
            <div>Created on {new Date(task.createdAt).toLocaleDateString()}</div>
            {task.completedAt && <div>Completed: {task.completedAt}</div>}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#E8E4DC] bg-[#FDFCFB] flex items-center justify-between">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F0EBE2] text-[#292820] hover:bg-[#E8E4DC] text-xs font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            <span>Edit Task</span>
          </button>
          <button
            type="button"
            onClick={() => onToggleComplete(task.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-semibold transition-all shadow-soft cursor-pointer ${
              task.completed
                ? 'bg-[#77766F] hover:bg-[#493A2B]'
                : 'bg-[#4E795C] hover:bg-[#3D5F48]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {task.completed ? 'replay' : 'check'}
            </span>
            <span>{task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
