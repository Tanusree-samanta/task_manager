import { Task, Project, Note, Habit, Goal, AppNotification, UserSettings } from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'DevOps Learning',
    description: 'Master Docker, Kubernetes, CI/CD pipelines, and cloud automation.',
    color: '#65513B',
    icon: 'terminal',
    targetDate: '2026-11-15',
    createdAt: '2026-10-01T09:00:00Z',
  },
  {
    id: 'proj-2',
    name: 'College Assignments',
    description: 'Distributed systems coursework, algorithms, and semester projects.',
    color: '#4E795C',
    icon: 'school',
    targetDate: '2026-11-30',
    createdAt: '2026-10-05T10:00:00Z',
  },
  {
    id: 'proj-3',
    name: 'Portfolio Projects',
    description: 'Build full-stack showcase applications with FastAPI and modern React.',
    color: '#B98236',
    icon: 'rocket_launch',
    targetDate: '2026-12-20',
    createdAt: '2026-10-10T14:00:00Z',
  },
  {
    id: 'proj-4',
    name: 'Personal Goals',
    description: 'Reading list, health habits, financial planning, and productivity rituals.',
    color: '#77766F',
    icon: 'favorite',
    targetDate: '2026-12-31',
    createdAt: '2026-10-12T08:00:00Z',
  },
];

// Helper to get formatted date string for today, tomorrow, etc.
const getOffsetDate = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

export const INITIAL_TASKS: Task[] = [
  // Due Today - Pending
  {
    id: 'task-1',
    title: 'Configure Dockerfile multi-stage build',
    description: 'Optimize production image footprint under 80MB using distroless base.',
    completed: false,
    priority: 'high',
    dueDate: getOffsetDate(0), // Today
    dueTime: '14:00',
    projectId: 'proj-1',
    category: 'Engineering',
    tags: ['Docker', 'DevOps'],
    reminder: '13:30',
    recurring: 'none',
    subtasks: [
      { id: 'sub-1', title: 'Define multi-stage builder in Dockerfile', completed: true },
      { id: 'sub-2', title: 'Set up non-root user permissions', completed: true },
      { id: 'sub-3', title: 'Benchmark layer caching in local runner', completed: false },
    ],
    notes: 'Remember to verify BuildKit cache mounts for package dependencies.',
    createdAt: '2026-10-24T08:00:00Z',
  },
  {
    id: 'task-2',
    title: 'Implement FastAPI task endpoint error handling',
    description: 'Add custom RFC-7807 problem details payloads for uncaught async exceptions.',
    completed: false,
    priority: 'medium',
    dueDate: getOffsetDate(0), // Today
    dueTime: '16:30',
    projectId: 'proj-3',
    category: 'Backend',
    tags: ['FastAPI', 'Python'],
    recurring: 'none',
    subtasks: [
      { id: 'sub-4', title: 'Create global exception handler middleware', completed: true },
      { id: 'sub-5', title: 'Write pytest tests for 404 and 422 validations', completed: false },
    ],
    createdAt: '2026-10-24T09:00:00Z',
  },
  {
    id: 'task-3',
    title: 'Review database migration scripts for PostgreSQL',
    description: 'Verify non-blocking column additions and lock-timeout fallbacks.',
    completed: false,
    priority: 'high',
    dueDate: getOffsetDate(0), // Today
    dueTime: '18:00',
    projectId: 'proj-1',
    category: 'Database',
    tags: ['PostgreSQL', 'Alembic'],
    recurring: 'none',
    subtasks: [
      { id: 'sub-6', title: 'Inspect generated revision SQL script', completed: true },
      { id: 'sub-7', title: 'Run alembic upgrade head on staging sandbox', completed: false },
    ],
    createdAt: '2026-10-24T10:15:00Z',
  },

  // Overdue Task
  {
    id: 'task-overdue',
    title: 'Renew SSL certificates on staging cluster',
    description: 'Cert-manager letsencrypt-staging challenge failed due to DNS rate limits.',
    completed: false,
    priority: 'high',
    dueDate: getOffsetDate(-1), // Yesterday (overdue)
    dueTime: '11:00',
    projectId: 'proj-1',
    category: 'DevOps',
    tags: ['Security', 'Kubernetes'],
    recurring: 'none',
    subtasks: [
      { id: 'sub-8', title: 'Inspect cert-manager pod logs', completed: true },
      { id: 'sub-9', title: 'Trigger HTTP01 challenge fallback', completed: false },
    ],
    createdAt: '2026-10-23T10:00:00Z',
  },

  // Due Tomorrow
  {
    id: 'task-4',
    title: 'Write unit tests for task service layer',
    description: 'FastAPI test client with SQLite in-memory runner for quick execution.',
    completed: false,
    priority: 'medium',
    dueDate: getOffsetDate(1), // Tomorrow
    dueTime: '15:00',
    projectId: 'proj-3',
    category: 'Testing',
    tags: ['Python', 'pytest'],
    recurring: 'none',
    subtasks: [
      { id: 'sub-10', title: 'Mock database session dependencies', completed: false },
      { id: 'sub-11', title: 'Assert schema response model matches API contract', completed: false },
    ],
    createdAt: '2026-10-24T11:00:00Z',
  },

  // Due Later this week
  {
    id: 'task-5',
    title: 'Distributed Systems assignment write-up',
    description: 'Complete synthesis paper on Raft consensus algorithm and log replication.',
    completed: false,
    priority: 'medium',
    dueDate: getOffsetDate(3),
    dueTime: '23:59',
    projectId: 'proj-2',
    category: 'College',
    tags: ['College', 'Paper'],
    recurring: 'none',
    subtasks: [
      { id: 'sub-12', title: 'Draft leader election state diagram', completed: true },
      { id: 'sub-13', title: 'Write section on split votes and randomized timeouts', completed: false },
    ],
    createdAt: '2026-10-22T14:00:00Z',
  },
  {
    id: 'task-6',
    title: 'Setup GitHub Actions CI/CD workflow',
    description: 'Automate linting with Ruff, pytest coverage check, and container image publishing.',
    completed: false,
    priority: 'high',
    dueDate: getOffsetDate(4),
    dueTime: '17:00',
    projectId: 'proj-1',
    category: 'DevOps',
    tags: ['GitHub', 'CI/CD'],
    recurring: 'weekly',
    subtasks: [
      { id: 'sub-14', title: 'Define matrix runner across Python 3.11 and 3.12', completed: false },
    ],
    createdAt: '2026-10-24T08:30:00Z',
  },

  // Completed Tasks Today
  {
    id: 'task-done-1',
    title: 'Morning standup sync with platform team',
    description: 'Reviewed Redis cache cluster latency & pod eviction metrics.',
    completed: true,
    priority: 'medium',
    dueDate: getOffsetDate(0),
    dueTime: '09:00',
    completedAt: '09:15',
    projectId: 'proj-1',
    category: 'Meeting',
    tags: ['Team', 'Standup'],
    recurring: 'weekdays',
    subtasks: [],
    createdAt: '2026-10-24T07:30:00Z',
  },
  {
    id: 'task-done-2',
    title: 'Merge PR #42: Health check endpoint',
    description: 'Liveness and readiness probes configured for staging pods.',
    completed: true,
    priority: 'low',
    dueDate: getOffsetDate(0),
    dueTime: '11:00',
    completedAt: '11:30',
    projectId: 'proj-3',
    category: 'Backend',
    tags: ['Kubernetes', 'PR'],
    recurring: 'none',
    subtasks: [],
    createdAt: '2026-10-24T09:45:00Z',
  },
  {
    id: 'task-done-3',
    title: 'Initialize FastAPI boilerplate with Poetry',
    description: 'Poetry dependencies locked & Ruff config added with sensible defaults.',
    completed: true,
    priority: 'low',
    dueDate: getOffsetDate(-1),
    completedAt: 'Yesterday',
    projectId: 'proj-3',
    category: 'Backend',
    tags: ['FastAPI', 'Setup'],
    recurring: 'none',
    subtasks: [],
    createdAt: '2026-10-23T06:00:00Z',
  },
  {
    id: 'task-done-4',
    title: 'Draft system architecture PRD',
    description: 'Architecture diagrams & SLA bounds documented for semester capstone.',
    completed: true,
    priority: 'medium',
    dueDate: getOffsetDate(-2),
    completedAt: '2 days ago',
    projectId: 'proj-2',
    category: 'College',
    tags: ['Docs'],
    recurring: 'none',
    subtasks: [],
    createdAt: '2026-10-22T05:30:00Z',
  },
  {
    id: 'task-done-5',
    title: 'Audit IAM service accounts for least privilege',
    description: 'Removed excessive viewer roles from automated CI builder machine accounts.',
    completed: true,
    priority: 'high',
    dueDate: getOffsetDate(-3),
    completedAt: '3 days ago',
    projectId: 'proj-1',
    category: 'Security',
    tags: ['Security', 'Cloud'],
    recurring: 'none',
    subtasks: [],
    createdAt: '2026-10-21T11:30:00Z',
  },
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'Docker Buildx Caching Cheatsheet',
    content:
      'Use --cache-from and --cache-to type=gha,mode=max when building images inside GitHub Actions.\n\nKeep COPY pyproject.toml poetry.lock ./ prior to COPY src/ to avoid breaking package install cache on routine code edits.',
    isPinned: true,
    projectId: 'proj-1',
    tags: ['Docker', 'Tips'],
    createdAt: '2026-10-18T10:00:00Z',
    updatedAt: '2026-10-20T14:30:00Z',
  },
  {
    id: 'note-2',
    title: 'PostgreSQL Indexing Checklist',
    content:
      '- Use B-Tree for equality and range queries on UUID / timestamps.\n- Create partial indexes (WHERE deleted_at IS NULL) to save space.\n- Verify query plan with EXPLAIN (ANALYZE, BUFFERS) before deploying migrations.',
    isPinned: true,
    projectId: 'proj-1',
    tags: ['Database', 'Postgres'],
    createdAt: '2026-10-19T09:00:00Z',
    updatedAt: '2026-10-22T16:00:00Z',
  },
  {
    id: 'note-3',
    title: 'Ideas for Semester Capstone Showcase',
    content:
      'Consider building a self-healing microservice runner that listens for Prometheus alerts and restarts unhealthy staging workers automatically.',
    isPinned: false,
    projectId: 'proj-2',
    tags: ['Ideas'],
    createdAt: '2026-10-21T12:00:00Z',
    updatedAt: '2026-10-21T12:00:00Z',
  },
];

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit-1',
    title: 'Study for 30 minutes',
    targetDaysPerWeek: 5,
    completedDates: [getOffsetDate(0), getOffsetDate(-1), getOffsetDate(-2), getOffsetDate(-3)],
    streak: 4,
    color: '#65513B',
  },
  {
    id: 'habit-2',
    title: 'Practice Python / Code Katas',
    targetDaysPerWeek: 4,
    completedDates: [getOffsetDate(0), getOffsetDate(-1), getOffsetDate(-2)],
    streak: 3,
    color: '#4E795C',
  },
  {
    id: 'habit-3',
    title: 'Read technical documentation',
    targetDaysPerWeek: 5,
    completedDates: [getOffsetDate(0), getOffsetDate(-2), getOffsetDate(-3)],
    streak: 1,
    color: '#B98236',
  },
  {
    id: 'habit-4',
    title: 'Daily exercise & stretch',
    targetDaysPerWeek: 6,
    completedDates: [getOffsetDate(-1), getOffsetDate(-2)],
    streak: 2,
    color: '#77766F',
  },
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal-1',
    title: 'Master FastAPI, AsyncPG & PostgreSQL Stack',
    targetDate: '2026-11-20',
    progress: 75,
    projectId: 'proj-3',
    category: 'Backend',
  },
  {
    id: 'goal-2',
    title: 'Deploy Production Kubernetes Cluster on AWS',
    targetDate: '2026-12-05',
    progress: 50,
    projectId: 'proj-1',
    category: 'DevOps',
  },
  {
    id: 'goal-3',
    title: 'Publish Personal Portfolio Site with Projects',
    targetDate: '2026-12-25',
    progress: 40,
    projectId: 'proj-3',
    category: 'Portfolio',
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Task Due Soon',
    description: 'Configure Dockerfile multi-stage build is scheduled for 2:00 PM today.',
    time: '25m ago',
    type: 'reminder',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Task Completed',
    description: 'Merge PR #42: Health check endpoint was marked done.',
    time: '1h ago',
    type: 'task',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Project Milestone',
    description: 'DevOps Learning project reached 60% completion.',
    time: 'Yesterday',
    type: 'project',
    read: true,
  },
];

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'light',
  defaultTaskView: 'list',
  defaultSort: 'due',
  weekStart: 'monday',
  displayName: 'Alex Chen',
  mainId: 'DEV-8492',
  email: 'alex.chen@devopsforge.local',
  role: 'DevOps Engineer',
  avatarUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA2H6KEE66mBB8Mudcms7Ug968C2LxcEzprXX3DrETOfPmeS8BXdqoiCMhANL4qnEbpVxvPCUe_TV684tS_hv3CnfCsjbXZDJRG-arZIKiyYPjZhCP2O20ED3Cl848Y74QLQ9G5DFAi-foTjSEvyzyh_m429BXptTebtybghKw18WyI4HUELnmxQqRR-U6kQEssPwRjfkDLtYT3RcoluvXd0CpR3yJBXr09aanhigR12D_W72rpcDYb',
  reminderEnabled: true,
  compactSidebar: false,
  autoArchiveCompleted: false,
};

