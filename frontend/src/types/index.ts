// Types for the application
export interface Problem {
  id: string; // Or number, depending on your DB schema
  number: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  intuition?: string;
  implementation?: string; // If you store this separately
  implementation_language?: string; // New field for implementation language
  url?: string; // New field for LeetCode URL
  time_complexity?: string; // New field for Time Complexity
  space_complexity?: string; // New field for Space Complexity
  created_at?: string;
  updated_at?: string;
}

export interface Implementation {
  language: string;
  code: string;
  time_complexity?: string;
  space_complexity?: string;
}

export interface TodoItem {
  id: string; // Or number
  problem_number: number;
  problem_title: string;
  deadline: string; // ISO date string
  priority: 'Low' | 'Medium' | 'High';
  notes?: string;
  completed: boolean;
  user_id?: string; // If you associate todos with users
  created_at?: string;
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