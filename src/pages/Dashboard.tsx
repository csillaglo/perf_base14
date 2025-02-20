import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useCycleStore } from '../stores/cycleStore';
import { supabase } from '../lib/supabase';
import type { Goal, PerformanceGrade } from '../types/database';
import { WelcomeMessage } from '../components/WelcomeMessage';
import { SubordinateGradeChart } from '../components/performance/SubordinateGradeChart';
import { OwnPerformanceOverview } from '../components/dashboard/OwnPerformanceOverview';
import { SuperAdminOverview } from '../components/dashboard/SuperAdminOverview';
import { ManagerOverview } from '../components/dashboard/ManagerOverview';

interface DashboardStats {
  totalOrganizations: number;
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalAdmins: number;
  totalManagers: number;
  totalEmployees: number;
  organizationsWithoutAdmins: number;
}

interface DashboardData {
  goals: Goal[];
  grades: PerformanceGrade[];
  welcomeMessage: string;
  stats: DashboardStats;
}

const initialStats: DashboardStats = {
  totalOrganizations: 0,
  totalUsers: 0,
  activeUsers: 0,
  inactiveUsers: 0,
  totalAdmins: 0,
  totalManagers: 0,
  totalEmployees: 0,
  organizationsWithoutAdmins: 0,
};

export function Dashboard() {
  const { t } = useTranslation();
  const { user, role } = useAuth();
  const { selectedCycleId } = useCycleStore();
  const [data, setData] = useState<DashboardData>({
    goals: [],
    grades: [],
    welcomeMessage: '',
    stats: initialStats,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (role === 'superadmin') {
        const stats = await fetchSuperadminStats();
        if (mounted) {
          setData(prev => ({ ...prev, stats }));
        }
      } else {
        const [welcomeMessage, goalsData, gradesData] = await Promise.all([
          fetchWelcomeMessage(),
          selectedCycleId ? fetchGoals(selectedCycleId) : Promise.resolve([]),
          fetchGrades()
        ]);

        setData({
          goals: goalsData,
          grades: gradesData,
          welcomeMessage,
          stats: initialStats,
        });
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError(t('common.errorLoading'));
    } finally {
      setLoading(false);
    }
  }, [selectedCycleId, user?.organization_id, role, t]);

  useEffect(() => {
    let mounted = true;
    fetchData();
    return () => {
      mounted = false;
    };
  }, [fetchData]);

  const fetchWelcomeMessage = useCallback(async (): Promise<string> => {
    if (!user?.organization_id) return '';

    try {
      const { data, error } = await supabase
        .from('welcome_messages')
        .select('content')
        .eq('organization_id', user.organization_id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data?.content || '';
    } catch (err) {
      console.error('Error fetching welcome message:', err);
      return '';
    }
  }, [user?.organization_id]);

  const fetchGoals = useCallback(async (cycleId: string): Promise<Goal[]> => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('cycle_id', cycleId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching goals:', err);
      return [];
    }
  }, [user?.id]);

  const fetchGrades = useCallback(async (): Promise<PerformanceGrade[]> => {
    try {
      const { data, error } = await supabase
        .rpc('get_performance_grades', {
          org_id: user.organization_id || null
        });

      if (error) throw error;
      return data || getDefaultGrades();
    } catch (err) {
      console.error('Error fetching grades:', err);
      return getDefaultGrades();
    }
  }, [user?.organization_id]);

  const fetchSuperadminStats = useCallback(async (): Promise<DashboardStats> => {
    try {
      const [orgsResult, usersResult] = await Promise.all([
        supabase.from('organizations').select('*'),
        supabase.from('profiles').select('*')
      ]);

      if (orgsResult.error) throw orgsResult.error;
      if (usersResult.error) throw usersResult.error;

      const orgs = orgsResult.data || [];
      const users = usersResult.data || [];

      const activeUsers = users.filter(u => u.status === 'active');
      const inactiveUsers = users.filter(u => u.status === 'inactive');
      const admins = users.filter(u => u.role === 'company_admin');
      const managers = users.filter(u => u.role === 'manager');
      const employees = users.filter(u => u.role === 'employee');

      const orgsWithoutAdmins = orgs.filter(org => 
        !admins.some(admin => admin.organization_id === org.id)
      ).length;

      return {
        totalOrganizations: orgs.length,
        totalUsers: users.length,
        activeUsers: activeUsers.length,
        inactiveUsers: inactiveUsers.length,
        totalAdmins: admins.length,
        totalManagers: managers.length,
        totalEmployees: employees.length,
        organizationsWithoutAdmins: orgsWithoutAdmins,
      };
    } catch (err) {
      console.error('Error fetching superadmin stats:', err);
      return initialStats;
    }
  }, []);

  const performanceScore = useMemo(() => {
    const totalWeight = data.goals.reduce((sum, goal) => sum + (goal.weight || 0), 0);
    
    if (totalWeight === 0) return 0;

    const weightedScore = data.goals.reduce((sum, goal) => {
      const normalizedScore = ((goal.evaluation_score || 1) / 5) * 100;
      return sum + (normalizedScore * (goal.weight || 0) / totalWeight);
    }, 0);

    return Math.round(weightedScore);
  }, [data.goals]);

  const gradeInfo = useMemo(() => {
    const grade = data.grades.find(g => 
      performanceScore >= g.min_score && performanceScore <= g.max_score
    );
    return grade || { grade_text: 'Not Rated', grade_level: 0 };
  }, [performanceScore, data.grades]);

  if (error) {
    return (
      <div className="text-center py-8 text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">{t('common.loading')}</span>
      </div>
    );
  }

  if (role === 'superadmin') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {t('admin.systemOverview')}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t('common.welcomeBack', { name: user?.full_name || user?.email })}
          </p>
        </div>
        <SuperAdminOverview stats={data.stats} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {t('common.dashboard')}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('common.welcomeBack', { name: user?.full_name || user?.email })}
        </p>
      </div>

      {data.welcomeMessage && (
        <WelcomeMessage message={data.welcomeMessage} />
      )}

      {(role === 'manager' || role === 'hr_admin') && (
        <ManagerOverview 
          grades={data.grades} 
          userRole={role} 
          organizationId={user.organization_id} 
        />
      )}

      <OwnPerformanceOverview
        goals={data.goals}
        performanceScore={performanceScore}
        gradeInfo={gradeInfo}
      />
    </div>
  );
}

function getDefaultGrades(): PerformanceGrade[] {
  return [
    { id: '1', organization_id: null, min_score: 0, max_score: 20, grade_text: 'Unsatisfactory', grade_level: 1, created_at: '', updated_at: '' },
    { id: '2', organization_id: null, min_score: 21, max_score: 40, grade_text: 'Weak', grade_level: 2, created_at: '', updated_at: '' },
    { id: '3', organization_id: null, min_score: 41, max_score: 60, grade_text: 'Normal', grade_level: 3, created_at: '', updated_at: '' },
    { id: '4', organization_id: null, min_score: 61, max_score: 80, grade_text: 'Good', grade_level: 4, created_at: '', updated_at: '' },
    { id: '5', organization_id: null, min_score: 81, max_score: 100, grade_text: 'Excellent', grade_level: 5, created_at: '', updated_at: '' },
  ];
}
