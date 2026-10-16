import React, { useState } from 'react';
import { Project, Task } from '../../types';

interface ProjectsViewProps {
  projects: Project[];
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onToggleTask: (taskId: string) => void;
  onOpenTaskModalWithProject: (projectId: string) => void;
  onCreateProject: (proj: Partial<Project>) => void;
  onDeleteProject: (projectId: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  tasks,
  onSelectTask,
  onToggleTask,
  onOpenTaskModalWithProject,
  onCreateProject,
  onDeleteProject,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#65513B');
  const [icon, setIcon] = useState('folder');
  const [targetDate, setTargetDate] = useState('');

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const projectTasks = selectedProject
    ? tasks.filter((t) => t.projectId === selectedProject.id)
    : [];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreateProject({
        name: name.trim(),
        description: description.trim() || undefined,
        color,
        icon,
        targetDate: targetDate || undefined,
      });
      setName('');
      setDescription('');
      setTargetDate('');
      setIsCreateModalOpen(false);
    }
  };

  const colorPresets = ['#65513B', '#4E795C', '#B98236', '#B45345', '#333F4C', '#77766F'];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {selectedProject && (
              <button
                type="button"
                onClick={() => setSelectedProjectId(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#F0EBE2] text-[#77766F] hover:text-[#292820] cursor-pointer"
                title="Back to all projects"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>
            )}
            <h2 className="text-[24px] sm:text-[28px] font-bold text-[#292820] tracking-tight">
              {selectedProject ? selectedProject.name : 'Projects'}
            </h2>
          </div>
          <p className="text-sm text-[#77766F] mt-0.5">
            {selectedProject
              ? selectedProject.description || 'Project deliverables and active tasks.'
              : 'Organize your tasks by areas of focus, courses, or milestones.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          {selectedProject ? (
            <button
              type="button"
              onClick={() => onOpenTaskModalWithProject(selectedProject.id)}
              className="flex items-center gap-1.5 h-10 px-4 rounded-xl bg-[#65513B] text-white hover:bg-[#493A2B] text-xs font-semibold shadow-soft cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Add Project Task</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 h-10 px-4 rounded-xl bg-[#65513B] text-white hover:bg-[#493A2B] text-xs font-semibold shadow-soft cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>New Project</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content: Projects Grid or Single Project Detail */}
      {!selectedProject ? (
        /* Projects List Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => {
            const projTasks = tasks.filter((t) => t.projectId === proj.id);
            const completed = projTasks.filter((t) => t.completed).length;
            const total = projTasks.length;
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <div
                key={proj.id}
                onClick={() => setSelectedProjectId(proj.id)}
                className="bg-white p-5 rounded-2xl shadow-soft border border-[#E8E4DC] hover:border-[#65513B]/40 hover:shadow-card transition-all cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                        style={{ backgroundColor: proj.color }}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {proj.icon || 'folder'}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[#292820]">{proj.name}</h3>
                    </div>

                    {proj.targetDate && (
                      <span className="text-[11px] text-[#77766F] font-medium bg-[#F7F5F0] px-2 py-0.5 rounded-full border border-[#E8E4DC]/60">
                        Due {proj.targetDate}
                      </span>
                    )}
                  </div>

                  {proj.description && (
                    <p className="text-xs text-[#77766F] mt-2 line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>
                  )}
                </div>

                {/* Progress bar and task stats */}
                <div className="space-y-1.5 pt-2 border-t border-[#E8E4DC]/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#77766F]">
                      {completed} of {total} tasks completed
                    </span>
                    <span className="font-semibold text-[#292820]">{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#F0EBE2] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${progress}%`, backgroundColor: proj.color }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Single Project Detail View */
        <div className="space-y-6">
          {/* Project Overview Card */}
          <div className="bg-white p-6 rounded-2xl shadow-soft border border-[#E8E4DC] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: selectedProject.color }}
                >
                  <span className="material-symbols-outlined text-[22px]">
                    {selectedProject.icon || 'folder'}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#292820]">
                    {selectedProject.name}
                  </h3>
                  <span className="text-xs text-[#77766F]">
                    {projectTasks.filter((t) => t.completed).length} of {projectTasks.length} tasks completed
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (confirm(`Delete project "${selectedProject.name}"?`)) {
                    onDeleteProject(selectedProject.id);
                    setSelectedProjectId(null);
                  }
                }}
                className="text-xs text-[#B45345] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
                <span>Delete Project</span>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-[#77766F]">
                <span>Overall Progress</span>
                <span className="font-bold text-[#292820]">
                  {projectTasks.length > 0
                    ? Math.round(
                        (projectTasks.filter((t) => t.completed).length / projectTasks.length) * 100
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#F0EBE2] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      projectTasks.length > 0
                        ? (projectTasks.filter((t) => t.completed).length / projectTasks.length) * 100
                        : 0
                    }%`,
                    backgroundColor: selectedProject.color,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Project Task List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#292820] uppercase tracking-wider px-1">
              Tasks in this Project ({projectTasks.length})
            </h3>

            {projectTasks.length > 0 ? (
              <div className="space-y-2">
                {projectTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    className="flex items-start justify-between p-3.5 bg-white rounded-xl border border-[#E8E4DC] hover:shadow-soft transition-all cursor-pointer"
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
                      <div className="min-w-0 flex-1">
                        <span
                          className={`text-sm font-semibold block leading-tight ${
                            task.completed ? 'line-through text-[#77766F]' : 'text-[#292820]'
                          }`}
                        >
                          {task.title}
                        </span>
                        <div className="flex items-center gap-2 mt-1 text-xs text-[#77766F]">
                          {task.dueDate && <span>Due: {task.dueDate}</span>}
                          <span className="uppercase text-[10px] font-bold">
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-[#E8E4DC] text-center space-y-2">
                <p className="text-xs text-[#77766F]">No tasks in this project yet.</p>
                <button
                  type="button"
                  onClick={() => onOpenTaskModalWithProject(selectedProject.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#65513B] text-white text-xs font-semibold cursor-pointer"
                >
                  Add First Task
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Project Creation Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsCreateModalOpen(false)}
            className="fixed inset-0 bg-black/35 backdrop-blur-[1px]"
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-modal border border-[#E8E4DC] p-6 space-y-4 z-50 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-3">
              <h3 className="text-base font-bold text-[#292820]">Create New Project</h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-[#77766F] hover:text-[#292820] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-[#292820] block mb-1">
                  Project Name <span className="text-[#B45345]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Distributed Systems Lab"
                  className="w-full h-10 px-3 rounded-xl bg-[#F7F5F0] border border-[#E8E4DC] text-xs text-[#292820] outline-none focus:bg-white focus:border-[#65513B]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#292820] block mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Goals, target outcomes, or sprint scope..."
                  className="w-full p-2.5 rounded-xl bg-[#F7F5F0] border border-[#E8E4DC] text-xs text-[#292820] outline-none resize-none focus:bg-white focus:border-[#65513B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#292820] block mb-1">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-[#F7F5F0] border border-[#E8E4DC] text-xs text-[#292820] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#292820] block mb-1">
                    Color Accent
                  </label>
                  <div className="flex items-center gap-1.5 pt-1">
                    {colorPresets.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                          color === c ? 'ring-2 ring-offset-1 ring-[#65513B]' : ''
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8E4DC] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-medium text-[#77766F] hover:bg-[#F0EBE2] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#65513B] text-white text-xs font-semibold hover:bg-[#493A2B] cursor-pointer"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
