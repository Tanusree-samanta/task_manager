import React, { useState, useEffect } from 'react';
import { Task, Project, TaskPriority, RecurringFrequency, Subtask } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Partial<Task>) => void;
  editingTask?: Task | null;
  projects: Project[];
  defaultDueDate?: string;
  defaultProjectId?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTask,
  projects,
  defaultDueDate,
  defaultProjectId,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [projectId, setProjectId] = useState<string>('');
  const [category, setCategory] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [reminder, setReminder] = useState('');
  const [recurring, setRecurring] = useState<RecurringFrequency>('none');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [titleError, setTitleError] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setDueDate(editingTask.dueDate || '');
      setDueTime(editingTask.dueTime || '');
      setPriority(editingTask.priority);
      setProjectId(editingTask.projectId || '');
      setCategory(editingTask.category || '');
      setTagsInput(editingTask.tags.join(', '));
      setReminder(editingTask.reminder || '');
      setRecurring(editingTask.recurring || 'none');
      setSubtasks(editingTask.subtasks || []);
      setNotes(editingTask.notes || '');
      setShowMoreOptions(
        Boolean(
          editingTask.reminder ||
            (editingTask.recurring && editingTask.recurring !== 'none') ||
            editingTask.notes ||
            editingTask.category
        )
      );
    } else {
      setTitle('');
      setDescription('');
      setDueDate(defaultDueDate || new Date().toISOString().split('T')[0]);
      setDueTime('');
      setPriority('medium');
      setProjectId(defaultProjectId || '');
      setCategory('');
      setTagsInput('');
      setReminder('');
      setRecurring('none');
      setSubtasks([]);
      setNotes('');
      setShowMoreOptions(false);
    }
    setTitleError(false);
  }, [editingTask, isOpen, defaultDueDate, defaultProjectId]);

  if (!isOpen) return null;

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtaskTitle.trim()) {
      setSubtasks([
        ...subtasks,
        {
          id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          title: newSubtaskTitle.trim(),
          completed: false,
        },
      ]);
      setNewSubtaskTitle('');
    }
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks(
      subtasks.map((st) => (st.id === id ? { ...st, completed: !st.completed } : st))
    );
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((st) => st.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setTitleError(true);
      return;
    }

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
      priority,
      projectId: projectId || undefined,
      category: category.trim() || undefined,
      tags: parsedTags,
      reminder: reminder || undefined,
      recurring,
      subtasks,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity animate-fadeIn"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-xl max-h-[92vh] bg-white rounded-2xl shadow-modal border border-[#E8E4DC] flex flex-col overflow-hidden z-50 animate-fadeIn">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8E4DC] flex items-center justify-between bg-[#FDFCFB]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F0EBE2] text-[#65513B] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">
                {editingTask ? 'edit_note' : 'add_task'}
              </span>
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-[#292820] leading-tight">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>
              <p className="text-[12px] text-[#77766F] leading-none mt-0.5">
                {editingTask ? 'Update details and subtasks' : 'Add to your daily workflow'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#77766F] hover:bg-[#F0EBE2] hover:text-[#292820] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Task Title (Required) */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label
                htmlFor="modal-task-title"
                className="text-xs font-semibold text-[#292820]"
              >
                Task Title <span className="text-[#B45345]">*</span>
              </label>
              <span className="text-[11px] text-[#77766F]">{title.length}/200</span>
            </div>
            <input
              id="modal-task-title"
              type="text"
              required
              maxLength={200}
              autoFocus
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError(false);
              }}
              placeholder="e.g. Build FastAPI endpoint for user tasks"
              className={`w-full h-11 px-3.5 rounded-xl bg-[#F7F5F0] text-[#292820] placeholder-[#77766F] border text-sm outline-none transition-all ${
                titleError
                  ? 'border-[#B45345] ring-2 ring-[#B45345]/20 bg-[#FDF5F4]'
                  : 'border-[#E8E4DC] focus:bg-white focus:border-[#65513B]'
              }`}
            />
            {titleError && (
              <p className="text-[11px] text-[#B45345] mt-1">Please enter a task title.</p>
            )}
          </div>

          {/* Description (Optional) */}
          <div>
            <label
              htmlFor="modal-task-desc"
              className="text-xs font-semibold text-[#292820] block mb-1"
            >
              Description <span className="text-[#77766F] font-normal">(Optional)</span>
            </label>
            <textarea
              id="modal-task-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add technical context, specifications, or links..."
              className="w-full p-3 rounded-xl bg-[#F7F5F0] text-[#292820] placeholder-[#77766F] border border-[#E8E4DC] focus:bg-white focus:border-[#65513B] text-sm outline-none resize-none transition-all"
            />
          </div>

          {/* Due Date & Time, Priority, Project (Core Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Due Date */}
            <div>
              <label className="text-xs font-semibold text-[#292820] block mb-1">
                Due Date
              </label>
              <div className="relative flex items-center">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#F7F5F0] text-[#292820] border border-[#E8E4DC] focus:bg-white focus:border-[#65513B] text-xs outline-none"
                />
              </div>
            </div>

            {/* Due Time */}
            <div>
              <label className="text-xs font-semibold text-[#292820] block mb-1">
                Time
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-[#F7F5F0] text-[#292820] border border-[#E8E4DC] focus:bg-white focus:border-[#65513B] text-xs outline-none"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="text-xs font-semibold text-[#292820] block mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full h-10 px-3 rounded-xl bg-[#F7F5F0] text-[#292820] border border-[#E8E4DC] focus:bg-white focus:border-[#65513B] text-xs outline-none cursor-pointer"
              >
                <option value="low">Low (Routine)</option>
                <option value="medium">Medium (Standard)</option>
                <option value="high">High (Priority)</option>
              </select>
            </div>
          </div>

          {/* Project Selector */}
          <div>
            <label className="text-xs font-semibold text-[#292820] block mb-1">
              Project
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-[#F7F5F0] text-[#292820] border border-[#E8E4DC] focus:bg-white focus:border-[#65513B] text-xs outline-none cursor-pointer"
            >
              <option value="">No Project (General)</option>
              {projects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subtasks Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#292820] flex items-center gap-1.5">
                <span>Subtasks</span>
                {subtasks.length > 0 && (
                  <span className="text-[11px] text-[#77766F] font-normal">
                    ({subtasks.filter((s) => s.completed).length} of {subtasks.length} completed)
                  </span>
                )}
              </label>
            </div>

            {/* Subtask list */}
            {subtasks.length > 0 && (
              <div className="space-y-1.5 mb-2.5">
                {subtasks.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#F7F5F0] border border-[#E8E4DC]/70 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => handleToggleSubtask(st.id)}
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-colors cursor-pointer ${
                          st.completed
                            ? 'bg-[#4E795C] border-[#4E795C] text-white'
                            : 'border-[#77766F] hover:border-[#292820] bg-white'
                        }`}
                      >
                        {st.completed && (
                          <span className="material-symbols-outlined text-[12px]">check</span>
                        )}
                      </button>
                      <span
                        className={`truncate ${
                          st.completed ? 'line-through text-[#77766F]' : 'text-[#292820]'
                        }`}
                      >
                        {st.title}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(st.id)}
                      className="text-[#77766F] hover:text-[#B45345] p-0.5 cursor-pointer ml-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add subtask input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                placeholder="+ Add a subtask step..."
                className="flex-1 h-9 px-3 rounded-lg bg-[#F7F5F0] text-xs text-[#292820] placeholder-[#77766F] border border-[#E8E4DC] focus:bg-white focus:border-[#65513B] outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask(e);
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="h-9 px-3 rounded-lg bg-[#F0EBE2] hover:bg-[#E8E4DC] text-[#292820] text-xs font-medium cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* More options toggle */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              className="text-xs font-semibold text-[#65513B] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{showMoreOptions ? 'Hide advanced options' : 'More options'}</span>
              <span
                className={`material-symbols-outlined text-[16px] transition-transform ${
                  showMoreOptions ? 'rotate-180' : ''
                }`}
              >
                expand_more
              </span>
            </button>
          </div>

          {/* Collapsible Advanced Options */}
          {showMoreOptions && (
            <div className="p-3.5 rounded-xl bg-[#F7F5F0] border border-[#E8E4DC] space-y-3 animate-fadeIn text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Category */}
                <div>
                  <label className="font-semibold text-[#292820] block mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Engineering, Research"
                    className="w-full h-9 px-3 rounded-lg bg-white border border-[#E8E4DC] text-[#292820] outline-none"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="font-semibold text-[#292820] block mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Docker, Python, API"
                    className="w-full h-9 px-3 rounded-lg bg-white border border-[#E8E4DC] text-[#292820] outline-none"
                  />
                </div>

                {/* Reminder */}
                <div>
                  <label className="font-semibold text-[#292820] block mb-1">Reminder</label>
                  <input
                    type="time"
                    value={reminder}
                    onChange={(e) => setReminder(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-white border border-[#E8E4DC] text-[#292820] outline-none"
                  />
                </div>

                {/* Recurring */}
                <div>
                  <label className="font-semibold text-[#292820] block mb-1">Repeat</label>
                  <select
                    value={recurring}
                    onChange={(e) => setRecurring(e.target.value as RecurringFrequency)}
                    className="w-full h-9 px-3 rounded-lg bg-white border border-[#E8E4DC] text-[#292820] outline-none cursor-pointer"
                  >
                    <option value="none">Does not repeat</option>
                    <option value="daily">Daily</option>
                    <option value="weekdays">Every weekday (Mon-Fri)</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <label className="font-semibold text-[#292820] block mb-1">
                  Private Notes &amp; Checklist
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional thoughts or reference links..."
                  className="w-full p-2.5 rounded-lg bg-white border border-[#E8E4DC] text-[#292820] outline-none resize-none"
                />
              </div>
            </div>
          )}
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-[#E8E4DC] bg-[#FDFCFB] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-xl text-xs font-medium text-[#77766F] hover:bg-[#F0EBE2] hover:text-[#292820] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="h-9 px-5 rounded-xl bg-[#65513B] text-white hover:bg-[#493A2B] active:scale-95 transition-all text-xs font-semibold shadow-soft cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">check</span>
            <span>{editingTask ? 'Save Changes' : 'Create Task'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
