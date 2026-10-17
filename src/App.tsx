/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ActivePage,
  Task,
  Project,
  Note,
  Habit,
  Goal,
  AppNotification,
  UserSettings,
} from './types';
import { api, taskApi } from './services/api';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { TaskModal } from './components/TaskModal';
import { TaskDetailPanel } from './components/TaskDetailPanel';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { HelpModal } from './components/HelpModal';
import { Toast } from './components/Toast';

// Views
import { HomeView } from './components/views/HomeView';
import { MyTasksView } from './components/views/MyTasksView';
import { TodayView } from './components/views/TodayView';
import { UpcomingView } from './components/views/UpcomingView';
import { CalendarView } from './components/views/CalendarView';
import { ProjectsView } from './components/views/ProjectsView';
import { NotesView } from './components/views/NotesView';
import { HabitsView } from './components/views/HabitsView';
import { InsightsView } from './components/views/InsightsView';
import { SettingsView } from './components/views/SettingsView';

export default function App() {
  // Application Data States
  const [tasks, setTasks] = useState<Task[]>(() => api.getTasks());
  const [projects, setProjects] = useState<Project[]>(() => api.getProjects());
  const [notes, setNotes] = useState<Note[]>(() => api.getNotes());
  const [habits, setHabits] = useState<Habit[]>(() => api.getHabits());
  const [goals, setGoals] = useState<Goal[]>(() => api.getGoals());
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    api.getNotifications()
  );
  const [settings, setSettings] = useState<UserSettings>(() => api.getSettings());

  // UI Navigation & Modals
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    settings.compactSidebar || false
  );

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultTaskDate, setDefaultTaskDate] = useState<string | undefined>();
  const [defaultTaskProjectId, setDefaultTaskProjectId] = useState<string | undefined>();

  const [selectedTaskDetail, setSelectedTaskDetail] = useState<Task | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState('Task status updated');
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [lastToggledTaskId, setLastToggledTaskId] = useState<string | null>(null);

  // Initial load from FastAPI backend with fallback to cached tasks
  useEffect(() => {
    let isMounted = true;
    taskApi
      .fetchTasks()
      .then((serverTasks) => {
        if (isMounted && Array.isArray(serverTasks) && serverTasks.length > 0) {
          setTasks(serverTasks);
        }
      })
      .catch((err) => {
        console.info(
          'FastAPI server offline or unreachable; using local cached storage:',
          err.message
        );
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Persistence effects
  useEffect(() => api.saveTasks(tasks), [tasks]);
  useEffect(() => api.saveProjects(projects), [projects]);
  useEffect(() => api.saveNotes(notes), [notes]);
  useEffect(() => api.saveHabits(habits), [habits]);
  useEffect(() => api.saveGoals(goals), [goals]);
  useEffect(() => api.saveNotifications(notifications), [notifications]);
  useEffect(() => api.saveSettings(settings), [settings]);

  // Apply the selected theme globally; System follows the operating system preference.
  useEffect(() => {
    const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = () => {
      const theme = settings.theme === 'system'
        ? (colorScheme.matches ? 'dark' : 'light')
        : settings.theme;
      document.documentElement.dataset.theme = theme;
    };

    applyTheme();
    if (settings.theme !== 'system') return;

    colorScheme.addEventListener('change', applyTheme);
    return () => colorScheme.removeEventListener('change', applyTheme);
  }, [settings.theme]);

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  const showToast = (message: string, taskId?: string) => {
    setToastMessage(message);
    if (taskId) setLastToggledTaskId(taskId);
    setIsToastOpen(true);
  };

  // Task Handlers with FastAPI integration
  const handleToggleTask = (taskId: string) => {
    const target = tasks.find((t) => t.id === taskId);
    const nextCompleted = target ? !target.completed : true;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted
              ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : undefined,
          };
        }
        return t;
      })
    );

    const msg = target?.completed ? 'Task reopened' : 'Task marked as completed';
    showToast(msg, taskId);

    // Call FastAPI backend asynchronously
    taskApi.updateTask(taskId, { completed: nextCompleted }).catch((err) => {
      console.warn('Backend update deferred (offline mode):', err.message);
    });

    // Keep detail panel in sync if viewing
    if (selectedTaskDetail && selectedTaskDetail.id === taskId) {
      setSelectedTaskDetail((prev) =>
        prev ? { ...prev, completed: nextCompleted } : null
      );
    }
  };

  const handleUndoTask = () => {
    if (lastToggledTaskId) {
      handleToggleTask(lastToggledTaskId);
      setIsToastOpen(false);
    }
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    const currentTask = tasks.find((t) => t.id === taskId);
    if (!currentTask) return;

    const updatedSubtasks = currentTask.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, subtasks: updatedSubtasks } : t))
    );

    // Sync subtasks to FastAPI
    taskApi.updateTask(taskId, { subtasks: updatedSubtasks }).catch((err) => {
      console.warn('Backend subtask update deferred (offline mode):', err.message);
    });

    if (selectedTaskDetail && selectedTaskDetail.id === taskId) {
      setSelectedTaskDetail((prev) =>
        prev ? { ...prev, subtasks: updatedSubtasks } : null
      );
    }
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      // Update
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id
            ? { ...t, ...taskData, updatedAt: new Date().toISOString() }
            : t
        )
      );
      showToast('Task updated successfully');

      // Sync to FastAPI
      taskApi.updateTask(editingTask.id, taskData).catch((err) => {
        console.warn('Backend update deferred (offline mode):', err.message);
      });

      if (selectedTaskDetail && selectedTaskDetail.id === editingTask.id) {
        setSelectedTaskDetail((prev) =>
          prev ? { ...prev, ...taskData, updatedAt: new Date().toISOString() } : null
        );
      }
    } else {
      // Create new task
      const tempId = `task-${Date.now()}`;
      const newTask: Task = {
        id: tempId,
        title: taskData.title || 'Untitled Task',
        description: taskData.description,
        completed: false,
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
        dueTime: taskData.dueTime,
        projectId: taskData.projectId,
        category: taskData.category,
        tags: taskData.tags || [],
        reminder: taskData.reminder,
        recurring: taskData.recurring || 'none',
        subtasks: taskData.subtasks || [],
        notes: taskData.notes,
        createdAt: new Date().toISOString(),
      };

      setTasks((prev) => [newTask, ...prev]);
      showToast('New task created');

      // Post to FastAPI
      taskApi
        .createTask(newTask)
        .then((created) => {
          setTasks((prev) => prev.map((t) => (t.id === tempId ? created : t)));
        })
        .catch((err) => {
          console.warn('Backend task create deferred (offline mode):', err.message);
        });
    }

    setEditingTask(null);
    setDefaultTaskDate(undefined);
    setDefaultTaskProjectId(undefined);
  };

  const handleQuickAddTask = (title: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const tempId = `task-${Date.now()}`;
    const newTask: Task = {
      id: tempId,
      title,
      completed: false,
      priority: 'medium',
      dueDate: todayStr,
      tags: [],
      subtasks: [],
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast('Task added for Today');

    // Post to FastAPI
    taskApi
      .createTask(newTask)
      .then((created) => {
        setTasks((prev) => prev.map((t) => (t.id === tempId ? created : t)));
      })
      .catch((err) => {
        console.warn('Backend task create deferred (offline mode):', err.message);
      });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (selectedTaskDetail && selectedTaskDetail.id === taskId) {
      setSelectedTaskDetail(null);
    }
    showToast('Task deleted');

    // Delete in FastAPI
    taskApi.deleteTask(taskId).catch((err) => {
      console.warn('Backend task delete deferred (offline mode):', err.message);
    });
  };

  const handleDuplicateTask = (task: Task) => {
    const duplicated: Task = {
      ...task,
      id: `task-${Date.now()}`,
      title: `${task.title} (Copy)`,
      completed: false,
      completedAt: undefined,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [duplicated, ...prev]);
    showToast('Task duplicated');

    // Post duplicate to FastAPI
    taskApi.createTask(duplicated).catch((err) => {
      console.warn('Backend task create deferred (offline mode):', err.message);
    });
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  // Project Handlers
  const handleCreateProject = (projectData: Partial<Project>) => {
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: projectData.name || 'Untitled Project',
      description: projectData.description,
      color: projectData.color || '#65513B',
      icon: projectData.icon || 'folder',
      targetDate: projectData.targetDate,
      createdAt: new Date().toISOString(),
    };
    setProjects((prev) => [...prev, newProject]);
    showToast('Project created');
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    setTasks((prev) =>
      prev.map((t) => (t.projectId === projectId ? { ...t, projectId: undefined } : t))
    );
    showToast('Project deleted');
  };

  // Notes Handlers
  const handleCreateNote = (noteData: Partial<Note>) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: noteData.title || 'Untitled Note',
      content: noteData.content || '',
      isPinned: noteData.isPinned || false,
      projectId: noteData.projectId,
      tags: noteData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
    showToast('Note saved');
  };

  const handleUpdateNote = (noteId: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, ...updates } : n))
    );
    showToast('Note updated');
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    showToast('Note deleted');
  };

  // Habits Handlers
  const handleToggleHabitToday = (habitId: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const isDone = h.completedDates.includes(todayStr);
          const nextDates = isDone
            ? h.completedDates.filter((d) => d !== todayStr)
            : [...h.completedDates, todayStr];
          return {
            ...h,
            completedDates: nextDates,
            streak: isDone ? Math.max(0, h.streak - 1) : h.streak + 1,
          };
        }
        return h;
      })
    );
    showToast('Habit updated');
  };

  const handleCreateHabit = (habitData: Partial<Habit>) => {
    const newHabit: Habit = {
      id: `habit-${Date.now()}`,
      title: habitData.title || 'New Habit',
      targetDaysPerWeek: habitData.targetDaysPerWeek || 5,
      completedDates: [],
      streak: 0,
      color: habitData.color || '#65513B',
    };
    setHabits((prev) => [...prev, newHabit]);
    showToast('Habit created');
  };

  const handleCreateGoal = (goalData: Partial<Goal>) => {
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title: goalData.title || 'New Goal',
      targetDate: goalData.targetDate,
      progress: goalData.progress || 0,
      projectId: goalData.projectId,
      category: goalData.category,
    };
    setGoals((prev) => [...prev, newGoal]);
    showToast('Goal created');
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#292820] antialiased flex flex-col font-sans selection:bg-[#F0EBE2]">
      {/* Sidebar (Desktop persistent + Mobile drawer) */}
      <Sidebar
        activePage={activePage}
        onNavigate={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        tasks={tasks}
        settings={settings}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => {
          const next = !isSidebarCollapsed;
          setIsSidebarCollapsed(next);
          setSettings((prev) => ({ ...prev, compactSidebar: next }));
        }}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Top Header Bar */}
      <TopBar
        activePage={activePage}
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAddTask={() => {
          setEditingTask(null);
          setDefaultTaskDate(undefined);
          setDefaultTaskProjectId(undefined);
          setIsTaskModalOpen(true);
        }}
        notifications={notifications}
        settings={settings}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onNavigate={(page) => setActivePage(page)}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      {/* Main Content View Container */}
      <main
        className={`flex-1 pt-16 transition-all duration-300 ${
          isSidebarCollapsed ? 'md:pl-18' : 'md:pl-60'
        }`}
      >
        <div className="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
          {activePage === 'home' && (
            <HomeView
              tasks={tasks}
              projects={projects}
              notes={notes}
              onToggleTask={handleToggleTask}
              onOpenTaskModal={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              onSelectTask={(task) => setSelectedTaskDetail(task)}
              onNavigate={(page) => setActivePage(page)}
              onSaveQuickNote={(noteTitle, noteContent) =>
                handleCreateNote({ title: noteTitle, content: noteContent })
              }
            />
          )}

          {activePage === 'tasks' && (
            <MyTasksView
              tasks={tasks}
              projects={projects}
              defaultView={settings.defaultTaskView}
              defaultSort={settings.defaultSort}
              onToggleTask={handleToggleTask}
              onOpenTaskModal={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              onSelectTask={(task) => setSelectedTaskDetail(task)}
              onEditTask={handleOpenEdit}
              onDeleteTask={handleDeleteTask}
              onDuplicateTask={handleDuplicateTask}
            />
          )}

          {activePage === 'today' && (
            <TodayView
              tasks={tasks}
              projects={projects}
              onToggleTask={handleToggleTask}
              onQuickAddTask={handleQuickAddTask}
              onSelectTask={(task) => setSelectedTaskDetail(task)}
              onOpenTaskModal={() => {
                setEditingTask(null);
                setDefaultTaskDate(new Date().toISOString().split('T')[0]);
                setIsTaskModalOpen(true);
              }}
            />
          )}

          {activePage === 'upcoming' && (
            <UpcomingView
              tasks={tasks}
              projects={projects}
              onToggleTask={handleToggleTask}
              onSelectTask={(task) => setSelectedTaskDetail(task)}
              onOpenTaskModal={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
            />
          )}

          {activePage === 'calendar' && (
            <CalendarView
              tasks={tasks}
              weekStart={settings.weekStart}
              onSelectTask={(task) => setSelectedTaskDetail(task)}
              onOpenTaskModalWithDate={(dateStr) => {
                setEditingTask(null);
                setDefaultTaskDate(dateStr);
                setIsTaskModalOpen(true);
              }}
            />
          )}

          {activePage === 'projects' && (
            <ProjectsView
              projects={projects}
              tasks={tasks}
              onSelectTask={(task) => setSelectedTaskDetail(task)}
              onToggleTask={handleToggleTask}
              onOpenTaskModalWithProject={(projId) => {
                setEditingTask(null);
                setDefaultTaskProjectId(projId);
                setIsTaskModalOpen(true);
              }}
              onCreateProject={handleCreateProject}
              onDeleteProject={handleDeleteProject}
            />
          )}

          {activePage === 'notes' && (
            <NotesView
              notes={notes}
              projects={projects}
              onCreateNote={handleCreateNote}
              onUpdateNote={handleUpdateNote}
              onDeleteNote={handleDeleteNote}
            />
          )}

          {activePage === 'habits' && (
            <HabitsView
              habits={habits}
              goals={goals}
              projects={projects}
              onToggleHabitToday={handleToggleHabitToday}
              onCreateHabit={handleCreateHabit}
              onCreateGoal={handleCreateGoal}
            />
          )}

          {activePage === 'insights' && (
            <InsightsView tasks={tasks} projects={projects} />
          )}

          {activePage === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={(updates) =>
                setSettings((prev) => ({ ...prev, ...updates }))
              }
            />
          )}
        </div>
      </main>

      {/* Task Creation & Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
          setDefaultTaskDate(undefined);
          setDefaultTaskProjectId(undefined);
        }}
        onSave={handleSaveTask}
        editingTask={editingTask}
        projects={projects}
        defaultDueDate={defaultTaskDate}
        defaultProjectId={defaultTaskProjectId}
      />

      {/* Task Detail Slide-over Panel */}
      <TaskDetailPanel
        task={selectedTaskDetail}
        onClose={() => setSelectedTaskDetail(null)}
        onToggleComplete={handleToggleTask}
        onToggleSubtask={handleToggleSubtask}
        onEdit={(task) => {
          setSelectedTaskDetail(null);
          handleOpenEdit(task);
        }}
        onDelete={(taskId) => {
          handleDeleteTask(taskId);
          setSelectedTaskDetail(null);
        }}
        projects={projects}
      />

      {/* Global Search Modal (⌘K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        tasks={tasks}
        projects={projects}
        notes={notes}
        onSelectTask={(task) => setSelectedTaskDetail(task)}
        onSelectProject={() => {
          setActivePage('projects');
        }}
        onNavigate={(page) => setActivePage(page)}
      />

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
        onClearAll={() => setNotifications([])}
      />

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Accessible Toast Notification */}
      <Toast
        isOpen={isToastOpen}
        message={toastMessage}
        onUndo={lastToggledTaskId ? handleUndoTask : undefined}
        onClose={() => setIsToastOpen(false)}
      />
    </div>
  );
}
