import { supabase } from './supabase';
import { Problem, TodoItem, DashboardStats } from '../types';

// Problems Service
export const problemsService = {
  async getAllProblems() {
    return await supabase
      .from('problems')
      .select('*')
      .order('number', { ascending: true });
  },

  async getProblemById(id: string) {
    return await supabase
      .from('problems')
      .select('*')
      .eq('id', id)
      .single();
  },

  async createProblem(problem: Omit<Problem, 'id' | 'created_at' | 'updated_at'>) {
    return await supabase
      .from('problems')
      .insert([problem])
      .select('*')
      .single();
  },

  // Update an existing problem
  async updateProblem(id: string, problem: Partial<Omit<Problem, 'id' | 'created_at' | 'updated_at'>>) {
    return await supabase
      .from('problems')
      .update(problem)
      .eq('id', id)
      .select(); // Removed .single()
  },

  async deleteProblem(id: string) {
    return await supabase
      .from('problems')
      .delete()
      .eq('id', id);
  },

  async searchProblems(query: string) {
    return await supabase
      .from('problems')
      .select('*')
      .or(`title.ilike.%${query}%,tags.cs.{${query}}`)
      .order('number', { ascending: true });
  },

  async filterProblems(difficulty?: string, tags?: string[]) {
    let query = supabase.from('problems').select('*');
    
    if (difficulty && difficulty !== 'All') {
      query = query.eq('difficulty', difficulty);
    }
    
    if (tags && tags.length > 0) {
      query = query.overlaps('tags', tags);
    }
    
    return await query.order('number', { ascending: true });
  }
};

// Todos Service
export const todosService = {
  async getAllTodos() {
    return await supabase
      .from('todos')
      .select('*')
      .order('deadline', { ascending: true });
  },

  async createTodo(todo: Omit<TodoItem, 'id' | 'created_at' | 'updated_at' | 'completed'>) {
    return await supabase
      .from('todos')
      .insert([{ ...todo, completed: false }])
      .select()
      .single();
  },

  async updateTodo(id: string, todo: Partial<TodoItem>) {
    return await supabase
      .from('todos')
      .update(todo)
      .eq('id', id)
      .select()
      .single();
  },

  async markComplete(id: string) {
    return await supabase
      .from('todos')
      .update({ completed: true })
      .eq('id', id);
  },

  async deleteTodo(id: string) {
    return await supabase
      .from('todos')
      .delete()
      .eq('id', id);
  },

  async getUpcomingTodos(limit: number = 5) {
    return await supabase
      .from('todos')
      .select('*')
      .eq('completed', false)
      .order('deadline', { ascending: true })
      .limit(limit);
  }
};

// Dashboard Service
export const dashboardService = {
  async getStats(): Promise<{ data: DashboardStats | null; error: any }> {
    try {
      // Get all problems
      const { data: problems, error: problemsError } = await problemsService.getAllProblems();
      if (problemsError) throw problemsError;

      // Get upcoming todos
      const { data: todos, error: todosError } = await todosService.getUpcomingTodos();
      if (todosError) throw todosError;

      if (!problems) {
        return { data: null, error: 'No problems found' };
      }

      // Calculate stats
      const totalProblems = problems.length;
      const easyCount = problems.filter(p => p.difficulty === 'Easy').length;
      const mediumCount = problems.filter(p => p.difficulty === 'Medium').length;
      const hardCount = problems.filter(p => p.difficulty === 'Hard').length;
      
      // Get recent problems (last 5)
      const recentProblems = problems
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

      // Calculate tag distribution
      const tagDistribution: { [tag: string]: number } = {};
      problems.forEach(problem => {
        problem.tags.forEach((tag: string) => {
            tagDistribution[tag] = (tagDistribution[tag] || 0) + 1;
        });
      });

      const stats: DashboardStats = {
        totalProblems,
        easyCount,
        mediumCount,
        hardCount,
        recentProblems,
        upcomingTodos: todos || [],
        tagDistribution
      };

      return { data: stats, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};