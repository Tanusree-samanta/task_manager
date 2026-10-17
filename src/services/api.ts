import {
  Task,
  Project,
  Note,
  Habit,
  Goal,
  AppNotification,
  UserSettings,
} from '../types';
import {
  INITIAL_TASKS,
  INITIAL_PROJECTS,
  INITIAL_NOTES,
  INITIAL_HABITS,
  INITIAL_GOALS,
  INITIAL_NOTIFICATIONS,
  DEFAULT_SETTINGS,
} from '../data/initialData';

const KEYS = {
  TASKS: 'devopsforge_tasks_v2',
  PROJECTS: 'devopsforge_projects_v2',
  NOTES: 'devopsforge_notes_v2',
  HABITS: 'devopsforge_habits_v2',
  GOALS: 'devopsforge_goals_v2',
  NOTIFICATIONS: 'devopsforge_notifications_v2',
  SETTINGS: 'devopsforge_settings_v2',
};

// Configurable API base URL (VITE_API_URL or defaults to /api proxied to FastAPI on port 8000)
export const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string) || '/api';

// Helper for local storage
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return fallback;
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
}

// In-flight request tracker to prevent duplicate submissions
const inFlightRequests = new Set<string>();

/**
 * Dedicated FastAPI Tasks REST Client
 */
export const taskApi = {
  /**
   * Check FastAPI health and database connectivity
   */
  async checkHealth(): Promise<{ status: string; service: string; database: string }> {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`Health check returned HTTP ${res.status}`);
    }
    return res.json();
  },

  /**
   * GET /api/tasks
   * Fetch all tasks from FastAPI backend with fallback to cached storage.
   */
  async fetchTasks(params?: {
    completed?: boolean;
    priority?: string;
    projectId?: string;
    search?: string;
  }): Promise<Task[]> {
    const query = new URLSearchParams();
    if (params?.completed !== undefined) query.set('completed', String(params.completed));
    if (params?.priority) query.set('priority', params.priority);
    if (params?.projectId) query.set('projectId', params.projectId);
    if (params?.search) query.set('search', params.search);

    const url = `${API_BASE_URL}/tasks${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch tasks: HTTP ${res.status}`);
    }

    const tasks: Task[] = await res.json();
    // Cache to storage
    saveToStorage(KEYS.TASKS, tasks);
    return tasks;
  },

  /**
   * GET /api/tasks/{task_id}
   */
  async fetchTaskById(taskId: string): Promise<Task> {
    const res = await fetch(`${API_BASE_URL}/tasks/${encodeURIComponent(taskId)}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new Error(`Task ${taskId} not found: HTTP ${res.status}`);
    }
    return res.json();
  },

  /**
   * POST /api/tasks
   */
  async createTask(taskData: Partial<Task>): Promise<Task> {
    const lockKey = `create-${taskData.title}`;
    if (inFlightRequests.has(lockKey)) {
      throw new Error('Task creation already in flight. Please wait.');
    }
    inFlightRequests.add(lockKey);

    try {
      const res = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const detail = errorData?.detail || `HTTP ${res.status}`;
        throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
      }

      return await res.json();
    } finally {
      inFlightRequests.delete(lockKey);
    }
  },

  /**
   * PATCH /api/tasks/{task_id}
   */
  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    const lockKey = `update-${taskId}`;
    if (inFlightRequests.has(lockKey)) {
      throw new Error('Task update already in flight.');
    }
    inFlightRequests.add(lockKey);

    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${encodeURIComponent(taskId)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const detail = errorData?.detail || `HTTP ${res.status}`;
        throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
      }

      return await res.json();
    } finally {
      inFlightRequests.delete(lockKey);
    }
  },

  /**
   * DELETE /api/tasks/{task_id}
   */
  async deleteTask(taskId: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/tasks/${encodeURIComponent(taskId)}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });

    if (!res.ok && res.status !== 404) {
      throw new Error(`Failed to delete task: HTTP ${res.status}`);
    }
  },
};

/**
 * Combined storage and API service layer.
 */
export const api = {
  // Synchronous initial cache getters for instant UI render
  getTasks: (): Task[] => loadFromStorage(KEYS.TASKS, INITIAL_TASKS),
  saveTasks: (tasks: Task[]): void => saveToStorage(KEYS.TASKS, tasks),

  // Projects
  getProjects: (): Project[] => loadFromStorage(KEYS.PROJECTS, INITIAL_PROJECTS),
  saveProjects: (projects: Project[]): void => saveToStorage(KEYS.PROJECTS, projects),

  // Notes
  getNotes: (): Note[] => loadFromStorage(KEYS.NOTES, INITIAL_NOTES),
  saveNotes: (notes: Note[]): void => saveToStorage(KEYS.NOTES, notes),

  // Habits
  getHabits: (): Habit[] => loadFromStorage(KEYS.HABITS, INITIAL_HABITS),
  saveHabits: (habits: Habit[]): void => saveToStorage(KEYS.HABITS, habits),

  // Goals
  getGoals: (): Goal[] => loadFromStorage(KEYS.GOALS, INITIAL_GOALS),
  saveGoals: (goals: Goal[]): void => saveToStorage(KEYS.GOALS, goals),

  // Notifications
  getNotifications: (): AppNotification[] =>
    loadFromStorage(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
  saveNotifications: (notifs: AppNotification[]): void =>
    saveToStorage(KEYS.NOTIFICATIONS, notifs),

  // Settings
  getSettings: (): UserSettings => {
    const loaded = loadFromStorage<Partial<UserSettings>>(KEYS.SETTINGS, DEFAULT_SETTINGS);
    return { ...DEFAULT_SETTINGS, ...loaded };
  },
  saveSettings: (settings: UserSettings): void => saveToStorage(KEYS.SETTINGS, settings),
};
