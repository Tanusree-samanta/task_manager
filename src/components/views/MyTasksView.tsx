import React, { useState } from 'react';
import { Task, Project, TaskPriority } from '../../types';

interface MyTasksViewProps {
  tasks: Task[];
  projects: Project[];
  defaultView: ViewType;
  defaultSort: SortType;
  onToggleTask: (taskId: string) => void;
  onOpenTaskModal: () => void;
  onSelectTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onDuplicateTask: (task: Task) => void;
}

type FilterType = 'all' | 'pending' | 'completed' | 'high' | 'today';
type SortType = 'due' | 'priority' | 'title' | 'recent';
type GroupByType = 'none' | 'dueDate' | 'priority' | 'project' | 'status';
type ViewType = 'list' | 'board';

export const MyTasksView: React.FC<MyTasksViewProps> = ({
  tasks,
  projects,
  defaultView,
  defaultSort,
  onToggleTask,
  onOpenTaskModal,
  onSelectTask,
  onEditTask,
  onDeleteTask,
  onDuplicateTask,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>(defaultSort);
  const [groupBy, setGroupBy] = useState<GroupByType>('none');
  const [viewMode, setViewMode] = useState<ViewType>(defaultView);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  // Counts
  const totalCount = tasks.length;
  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const highPriorityCount = tasks.filter((t) => t.priority === 'high' && !t.completed).length;
  const dueTodayCount = tasks.filter((t) => t.dueDate === todayStr).length;

  // Filter
  const filteredTasks = tasks.filter((task) => {
    // Search filter
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      task.title.toLowerCase().includes(q) ||
      (task.description && task.description.toLowerCase().includes(q)) ||
      task.tags.some((t) => t.toLowerCase().includes(q)) ||
      (task.category && task.category.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    // Filter pill
    if (activeFilter === 'pending') return !task.completed;
    if (activeFilter === 'completed') return task.completed;
    if (activeFilter === 'high') return task.priority === 'high';
    if (activeFilter === 'today') return task.dueDate === todayStr;
    return true;
  });

  // Sort
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const order: Record<TaskPriority, number> = { high: 1, medium: 2, low: 3 };
      return order[a.priority] - order[b.priority];
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    // Default: due
    return (a.dueDate || '9999').localeCompare(b.dueDate || '9999');
  });

  const getProject = (projectId?: string) => {
    return projects.find((p) => p.id === projectId);
  };

  // Grouping helper
  const renderGroupedTasks = () => {
    if (groupBy === 'none') {
      return renderTaskList(sortedTasks);
    }

    if (groupBy === 'priority') {
      const priorities: TaskPriority[] = ['high', 'medium', 'low'];
      return (
        <div className="space-y-6">
          {priorities.map((p) => {
            const groupTasks = sortedTasks.filter((t) => t.priority === p);
            if (groupTasks.length === 0) return null;
            return (
              <div key={p} className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      p === 'high'
                        ? 'bg-[#B45345]'
                        : p === 'medium'
                        ? 'bg-[#B98236]'
                        : 'bg-[#77766F]'
                    }`}
                  />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#292820]">
                    {p} Priority ({groupTasks.length})
                  </h3>
                </div>
                {renderTaskList(groupTasks)}
              </div>
            );
          })}
        </div>
      );
    }

    if (groupBy === 'status') {
      const pending = sortedTasks.filter((t) => !t.completed);
      const completed = sortedTasks.filter((t) => t.completed);
      return (
        <div className="space-y-6">
          {pending.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#292820] px-1">
                Pending ({pending.length})
              </h3>
              {renderTaskList(pending)}
            </div>
          )}
          {completed.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#4E795C] px-1">
                Completed ({completed.length})
              </h3>
              {renderTaskList(completed)}
            </div>
          )}
        </div>
      );
    }

    if (groupBy === 'project') {
      return (
        <div className="space-y-6">
          {projects.map((proj) => {
            const groupTasks = sortedTasks.filter((t) => t.projectId === proj.id);
            if (groupTasks.length === 0) return null;
            return (
              <div key={proj.id} className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: proj.color }}
                  />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#292820]">
                    {proj.name} ({groupTasks.length})
                  </h3>
                </div>
                {renderTaskList(groupTasks)}
              </div>
            );
          })}
          {/* General tasks without project */}
          {(() => {
            const noProjTasks = sortedTasks.filter((t) => !t.projectId);
            if (noProjTasks.length === 0) return null;
            return (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#77766F] px-1">
                  General ({noProjTasks.length})
                </h3>
                {renderTaskList(noProjTasks)}
              </div>
            );
          })()}
        </div>
      );
    }

    return renderTaskList(sortedTasks);
  };

  const renderTaskList = (taskList: Task[]) => (
    <div className="space-y-2">
      {taskList.map((task) => {
        const proj = getProject(task.projectId);
        const isMenuOpen = activeMenuId === task.id;

        return (
          <div
            key={task.id}
            className={`group flex items-start justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
              task.completed
                ? 'bg-[#F7F5F0]/60 border-[#E8E4DC]/60 opacity-80'
                : 'bg-white border-[#E8E4DC] hover:border-[#65513B]/40 hover:shadow-soft'
            }`}
          >
            <div className="flex items-start gap-3 min-w-0 flex-1">
              {/* Checkbox */}
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

              {/* Task Details */}
              <div onClick={() => onSelectTask(task)} className="min-w-0 flex-1">
                <span
                  className={`text-sm font-semibold block leading-tight ${
                    task.completed
                      ? 'line-through text-[#77766F]'
                      : 'text-[#292820] group-hover:text-[#65513B]'
                  }`}
                >
                  {task.title}
                </span>

                {task.description && (
                  <p className="text-xs text-[#77766F] line-clamp-1 mt-0.5">
                    {task.description}
                  </p>
                )}

                {/* Badges */}
                <div className="flex items-center gap-2 mt-2 flex-wrap text-xs">
                  {/* Priority */}
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

                  {/* Due Date */}
                  {task.dueDate && (
                    <span className="text-[#77766F] text-[11px] flex items-center gap-1 bg-[#F7F5F0] px-1.5 py-0.5 rounded border border-[#E8E4DC]/60">
                      <span className="material-symbols-outlined text-[13px]">event</span>
                      {task.dueDate === todayStr ? 'Today' : task.dueDate}
                      {task.dueTime ? ` at ${task.dueTime}` : ''}
                    </span>
                  )}

                  {/* Project */}
                  {proj && (
                    <span className="text-[#77766F] text-[11px] flex items-center gap-1 bg-[#F0EBE2] px-2 py-0.5 rounded-md font-medium">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: proj.color }}
                      />
                      {proj.name}
                    </span>
                  )}

                  {/* Subtasks Count */}
                  {task.subtasks.length > 0 && (
                    <span className="text-[11px] text-[#77766F] flex items-center gap-0.5 bg-[#F7F5F0] px-1.5 py-0.5 rounded">
                      <span className="material-symbols-outlined text-[12px]">checklist</span>
                      {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}
                    </span>
                  )}

                  {/* Recurring badge */}
                  {task.recurring && task.recurring !== 'none' && (
                    <span
                      className="text-[11px] text-[#65513B] flex items-center gap-0.5"
                      title={`Repeats ${task.recurring}`}
                    >
                      <span className="material-symbols-outlined text-[13px]">sync</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* More actions menu */}
            <div className="relative ml-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenuId(isMenuOpen ? null : task.id);
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#77766F] hover:bg-[#F0EBE2] hover:text-[#292820] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">more_vert</span>
              </button>

              {isMenuOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-9 w-40 bg-white rounded-xl shadow-modal border border-[#E8E4DC] py-1 z-30 text-xs animate-fadeIn"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMenuId(null);
                      onSelectTask(task);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#F7F5F0] flex items-center gap-2 text-[#292820]"
                  >
                    <span className="material-symbols-outlined text-[15px]">visibility</span>
                    <span>View Details</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMenuId(null);
                      onEditTask(task);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#F7F5F0] flex items-center gap-2 text-[#292820]"
                  >
                    <span className="material-symbols-outlined text-[15px]">edit</span>
                    <span>Edit Task</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMenuId(null);
                      onDuplicateTask(task);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#F7F5F0] flex items-center gap-2 text-[#292820]"
                  >
                    <span className="material-symbols-outlined text-[15px]">content_copy</span>
                    <span>Duplicate</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMenuId(null);
                      onToggleTask(task.id);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#F7F5F0] flex items-center gap-2 text-[#292820]"
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {task.completed ? 'replay' : 'check'}
                    </span>
                    <span>{task.completed ? 'Reopen' : 'Complete'}</span>
                  </button>
                  <div className="h-px bg-[#E8E4DC]/60 my-1" />
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMenuId(null);
                      setTaskToDelete(task.id);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#FAECEB] text-[#B45345] flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[15px]">delete</span>
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  // Board View (Kanban columns: To Do, In Progress, Completed)
  const renderBoardView = () => {
    const todoTasks = sortedTasks.filter((t) => !t.completed && t.subtasks.every((s) => !s.completed));
    const inProgressTasks = sortedTasks.filter(
      (t) => !t.completed && t.subtasks.some((s) => s.completed)
    );
    const completedBoardTasks = sortedTasks.filter((t) => t.completed);

    const columns = [
      { id: 'todo', title: 'To Do', items: todoTasks, color: '#65513B' },
      { id: 'progress', title: 'In Progress', items: inProgressTasks, color: '#B98236' },
      { id: 'done', title: 'Completed', items: completedBoardTasks, color: '#4E795C' },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col) => (
          <div
            key={col.id}
            className="bg-[#F7F5F0] p-4 rounded-2xl border border-[#E8E4DC] flex flex-col min-h-[400px]"
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: col.color }}
                />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#292820]">
                  {col.title}
                </h3>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white text-[#77766F] border border-[#E8E4DC]/80">
                {col.items.length}
              </span>
            </div>

            <div className="space-y-2 flex-1 overflow-y-auto">
              {col.items.map((task) => {
                const proj = getProject(task.projectId);
                return (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    className="p-3 bg-white rounded-xl border border-[#E8E4DC] hover:border-[#65513B]/40 hover:shadow-soft transition-all cursor-pointer space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-[#292820] line-clamp-2">
                        {task.title}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleTask(task.id);
                        }}
                        className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                          task.completed
                            ? 'bg-[#4E795C] border-[#4E795C] text-white'
                            : 'border-[#77766F]'
                        }`}
                      >
                        {task.completed && (
                          <span className="material-symbols-outlined text-[10px]">check</span>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#77766F]">
                      <span className="capitalize">{task.priority}</span>
                      {proj && <span>{proj.name}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[24px] sm:text-[28px] font-bold text-[#292820] tracking-tight">
            My Tasks
          </h2>
          <p className="text-sm text-[#77766F] mt-0.5">
            Manage, filter, and prioritize your daily workflow.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenTaskModal}
          className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-[#65513B] text-white hover:bg-[#493A2B] text-xs font-semibold shadow-soft cursor-pointer self-start sm:self-center"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>New Task</span>
        </button>
      </div>

      {/* Toolbar: Search, Filters, Sort, Group, View Switcher */}
      <div className="bg-white p-4 rounded-2xl shadow-soft border border-[#E8E4DC] space-y-3">
        {/* Top Toolbar Row: Search + View & Sort controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined text-[18px] text-[#77766F] absolute left-3 top-2.5">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, tag, or category..."
              className="w-full h-9 pl-9 pr-8 rounded-xl bg-[#F7F5F0] border border-[#E8E4DC] text-xs text-[#292820] placeholder-[#77766F] outline-none focus:bg-white focus:border-[#65513B]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-[#77766F] hover:text-[#292820] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">cancel</span>
              </button>
            )}
          </div>

          {/* Right controls: Sort, Group, View mode */}
          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 bg-[#F7F5F0] border border-[#E8E4DC] rounded-xl px-2 h-9 text-xs text-[#292820]">
              <span className="material-symbols-outlined text-[16px] text-[#77766F]">sort</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortType)}
                className="bg-transparent outline-none cursor-pointer pr-1"
                aria-label="Sort tasks by"
              >
                <option value="due">Due date</option>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
                <option value="recent">Recently created</option>
              </select>
            </div>

            {/* Group By Dropdown */}
            <div className="flex items-center gap-1 bg-[#F7F5F0] border border-[#E8E4DC] rounded-xl px-2 h-9 text-xs text-[#292820]">
              <span className="material-symbols-outlined text-[16px] text-[#77766F]">
                table_rows
              </span>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value as GroupByType)}
                className="bg-transparent outline-none cursor-pointer pr-1"
                aria-label="Group tasks by"
              >
                <option value="none">No Grouping</option>
                <option value="priority">Priority</option>
                <option value="status">Status</option>
                <option value="project">Project</option>
              </select>
            </div>

            {/* View switcher (List vs Board) */}
            <div className="flex items-center bg-[#F7F5F0] border border-[#E8E4DC] rounded-xl p-0.5 h-9">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                title="List view"
                className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-[#65513B] shadow-soft'
                    : 'text-[#77766F] hover:text-[#292820]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('board')}
                title="Board view"
                className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'board'
                    ? 'bg-white text-[#65513B] shadow-soft'
                    : 'text-[#77766F] hover:text-[#292820]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">view_kanban</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {[
            { id: 'all' as FilterType, label: 'All', count: totalCount },
            { id: 'pending' as FilterType, label: 'Pending', count: pendingCount },
            { id: 'completed' as FilterType, label: 'Completed', count: completedCount },
            { id: 'high' as FilterType, label: 'High Priority', count: highPriorityCount },
            { id: 'today' as FilterType, label: 'Due Today', count: dueTodayCount },
          ].map((chip) => {
            const isActive = activeFilter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setActiveFilter(chip.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#65513B] text-white shadow-soft font-semibold'
                    : 'bg-[#F7F5F0] text-[#77766F] hover:bg-[#F0EBE2] hover:text-[#292820]'
                }`}
              >
                <span>{chip.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive
                      ? 'bg-white/20 text-white font-bold'
                      : 'bg-[#E8E4DC] text-[#77766F]'
                  }`}
                >
                  {chip.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Task Content: List or Board */}
      {sortedTasks.length > 0 ? (
        viewMode === 'list' ? (
          renderGroupedTasks()
        ) : (
          renderBoardView()
        )
      ) : (
        /* Empty State */
        <div className="bg-white p-12 rounded-2xl shadow-soft border border-[#E8E4DC] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#F0EBE2] text-[#65513B] flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[24px]">search_off</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-[#292820]">No matching tasks</h3>
            <p className="text-xs text-[#77766F] mt-1 max-w-sm mx-auto">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveFilter('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-[#F0EBE2] hover:bg-[#E8E4DC] text-[#292820] text-xs font-semibold transition-colors cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setTaskToDelete(null)}
            className="fixed inset-0 bg-black/35 backdrop-blur-[1px]"
          />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-modal border border-[#E8E4DC] p-5 space-y-4 z-50 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FAECEB] text-[#B45345] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">warning</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#292820]">Delete this task?</h3>
                <p className="text-xs text-[#77766F]">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setTaskToDelete(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-[#77766F] hover:bg-[#F0EBE2] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteTask(taskToDelete);
                  setTaskToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#B45345] text-white text-xs font-semibold hover:bg-[#964034] cursor-pointer"
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
