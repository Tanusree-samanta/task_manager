export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'completed';
export type RecurringFrequency = 'none' | 'daily' | 'weekdays' | 'weekly' | 'monthly';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TaskPriority;
  dueDate?: string; // YYYY-MM-DD or display date
  dueTime?: string; // HH:MM
  projectId?: string;
  category?: string;
  tags: string[];
  reminder?: string;
  recurring?: RecurringFrequency;
  subtasks: Subtask[];
  notes?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  targetDate?: string;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  projectId?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Habit {
  id: string;
  title: string;
  targetDaysPerWeek: number;
  completedDates: string[]; // YYYY-MM-DD
  streak: number;
  color: string;
}

export interface Goal {
  id: string;
  title: string;
  targetDate?: string;
  progress: number; // 0 - 100
  projectId?: string;
  category?: string;
}

export type ActivePage =
  | 'home'
  | 'tasks'
  | 'today'
  | 'upcoming'
  | 'calendar'
  | 'projects'
  | 'notes'
  | 'habits'
  | 'insights'
  | 'settings';

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'task' | 'reminder' | 'project' | 'system';
  read: boolean;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  defaultTaskView: 'list' | 'board';
  defaultSort: 'due' | 'priority' | 'title' | 'recent';
  weekStart: 'monday' | 'sunday';
  displayName: string;
  email: string;
  reminderEnabled: boolean;
  compactSidebar: boolean;
}
