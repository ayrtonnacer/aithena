export interface TaskStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  estimatedDurationMinutes: number;
  completed: boolean;
  actualDurationSeconds?: number;
}

export interface Task {
  id: string;
  name: string;
  steps: TaskStep[];
  currentStepIndex: number;
  createdAt: string;
  completedAt?: string;
  totalEstimatedMinutes: number;
  totalActualSeconds: number;
}

export interface CompletedTask {
  name: string;
  date: string;
  totalTimeMinutes: number;
  stepsCompleted: number;
  totalSteps: number;
}

export interface AppState {
  userName: string | null;
  activeTask: Task | null;
  history: CompletedTask[];
}
