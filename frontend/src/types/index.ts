// Types for the application
export interface Problem {
  id: string;
  number: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  link: string;
  tags: string[];
  intuition: string;
  implementations: Implementation[];
  created_at: string;
  updated_at: string;
}

export interface Implementation {
  language: string;
  code: string;
  time_complexity?: string;
  space_complexity?: string;
}

export interface TodoItem {
  id: string;
  problem_number: number;
  problem_title: string;
  deadline: string;
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface DashboardStats {
  totalProblems: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
  recentProblems: Problem[];
  upcomingTodos: TodoItem[];
  tagDistribution: { [tag: string]: number };
}