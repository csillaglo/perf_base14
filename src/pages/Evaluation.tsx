import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useCycleStore } from '../stores/cycleStore';
import type { Profile, Goal, EvaluationStatus, EvaluationCycle } from '../types/database';

interface UserWithEmail extends Profile {
  email: string;
  average_score?: number;
  evaluation_status?: EvaluationStatus;
}

export function Evaluation() {
  const { t } = useTranslation();
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [subordinates, setSubordinates] = useState<UserWithEmail[]>([]);
  const [evaluationCycles, setEvaluationCycles] = useState<EvaluationCycle[]>([]);
  const { selectedCycleId, setSelectedCycleId } = useCycleStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvaluationCycles();
  }, []);

  useEffect(() => {
    if (selectedCycleId) {
      fetchSubordinates();
    }
  }, [selectedCycleId]);

  const fetchEvaluationCycles = async () => {
    try {
      const { data, error } = await supabase
        .from('evaluation_cycles')
        .select('*')
        .eq('status', 'active')
        .order('start_date', { ascending: false });

      if (error) throw error;
      setEvaluationCycles(data || []);

      if (data && data.length > 0 && !selectedCycleId) {
        setSelectedCycleId(data[0].id);
      }
    } catch (err) {
      console.error('Error fetching evaluation cycles:', err);
      setError(err.message);
    }
  };

  const fetchSubordinates = async () => {
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('status', 'active');  // Only fetch active users

      // HR admin sees all users from their organization, managers see only their direct reports
      if (role === 'hr_admin' && user.organization_id) {
        query = query.eq('organization_id', user.organization_id);
      } else if (role === 'manager') {
        query = query.eq('manager_id', user.id);
      }

      const { data: profiles, error: profilesError } = await query;

      if (profilesError) throw profilesError;

      // Get emails for subordinates
      const { data: emailData, error: emailsError } = await supabase
        .rpc('get_user_emails');

      if (emailsError) throw emailsError;

      // Create email map
      const emailMap = new Map(emailData.map((item: any) => [item.id, item.email]));

      // Get goals for all subordinates for the selected cycle
      const { data: allGoals, error: goalsError } = await supabase
        .from('goals')
        .select('*')
        .eq('cycle_id', selectedCycleId)
        .in('user_id', (profiles || []).map(p => p.id));

      if (goalsError) throw goalsError;

      // Calculate average scores and get latest evaluation status
      const scoreMap = new Map();
      const statusMap = new Map();
      if (allGoals) {
        // Group goals by user
        const goalsByUser = allGoals.reduce((acc, goal) => {
          if (!acc.has(goal.user_id)) {
            acc.set(goal.user_id, []);
          }
          acc.get(goal.user_id).push(goal);
          return acc;
        }, new Map<string, Goal[]>());

        // Calculate weighted average for each user
        for (const [userId, userGoals] of goalsByUser.entries()) {
          const totalWeight = userGoals.reduce((sum, goal) => sum + (goal.weight || 0), 0);
          if (totalWeight > 0) {
            const weightedScore = userGoals.reduce((sum, goal) => {
              const normalizedScore = ((goal.evaluation_score || 1) / 5) * 100;
              return sum + (normalizedScore * (goal.weight || 0) / totalWeight);
            }, 0);
            scoreMap.set(userId, Math.round(weightedScore));
          }

          // Track the latest evaluation status
          statusMap.set(userId, userGoals[0]?.evaluation_status || 'awaiting_goal_setting');
        }
      }

      // Combine profiles with emails, scores, and status
      const subordinatesWithData = (profiles || []).map(profile => ({
        ...profile,
        email: emailMap.get(profile.id) || t('common.na'),
        average_score: scoreMap.get(profile.id),
        evaluation_status: statusMap.get(profile.id) || 'awaiting_goal_setting'
      }));

      // Sort by name
      subordinatesWithData.sort((a, b) => 
        (a.full_name || '').localeCompare(b.full_name || '')
      );

      setSubordinates(subordinatesWithData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: EvaluationStatus) => {
    switch (status) {
      case 'awaiting_goal_setting':
        return 'text-gray-600 bg-gray-100';
      case 'awaiting_evaluation':
        return 'text-yellow-800 bg-yellow-100';
      case 'awaiting_approval':
        return 'text-blue-800 bg-blue-100';
      case 'finalized':
        return 'text-green-800 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatStatus = (status: EvaluationStatus) => {
    return t(`admin.evaluation.statuses.${status}`);
  };

  if (loading) {
    return <div className="text-center py-8">{t('admin.evaluation.loading')}</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
        {t('common.error')}: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-100 rounded-lg p-2">
            <Users className="h-6 w-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {role === 'hr_admin' 
              ? t('admin.evaluation.allEmployees')
              : t('admin.evaluation.subordinates')}
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {t('goals.form.evaluationCycle')}
          </span>
          <select
            value={selectedCycleId}
            onChange={(e) => setSelectedCycleId(e.target.value)}
            className="block min-w-[300px] rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-11 py-2.5"
            required
          >
            {evaluationCycles
              .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
              .map(cycle => (
                <option key={cycle.id} value={cycle.id}>
                  {cycle.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {subordinates.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {role === 'hr_admin' 
            ? t('admin.evaluation.noEmployees')
            : t('admin.evaluation.noTeamMembers')}
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.name')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.email')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('profile.department')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('goals.evaluation.score')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('admin.evaluation.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subordinates.map((subordinate) => (
                <tr 
                  key={subordinate.id}
                  onClick={() => navigate(`/evaluation/${subordinate.id}`)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {subordinate.full_name || t('common.noNameSet')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{subordinate.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {subordinate.department || '-'}
                      {subordinate.job_name && (
                        <div className="text-xs text-gray-400">
                          {subordinate.job_name}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {subordinate.average_score !== undefined ? (
                      <div className={`text-sm font-medium ${
                        subordinate.average_score >= 80 ? 'text-green-600' :
                        subordinate.average_score >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {subordinate.average_score}%
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">
                        {t('goals.noGoals')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      getStatusColor(subordinate.evaluation_status || 'awaiting_goal_setting')
                    }`}>
                      {formatStatus(subordinate.evaluation_status || 'awaiting_goal_setting')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end">
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
