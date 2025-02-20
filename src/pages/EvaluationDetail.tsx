import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useCycleStore } from '../stores/cycleStore';
import type { Profile, Goal, EvaluationStatus } from '../types/database';
import { GoalStatus } from '../components/goals/GoalStatus';
import { GoalScore } from '../components/goals/GoalScore';
import { PerformanceScore } from '../components/performance/PerformanceScore';
import { Modal } from '../components/admin/Modal';
import { GoalForm } from '../components/goals/GoalForm';
import { GoalList } from '../components/goals/GoalList';

interface UserWithGoals extends Profile {
  email: string;
  goals: Goal[];
}

export function EvaluationDetail() {
  const { t } = useTranslation();
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const { selectedCycleId } = useCycleStore();
  const [subordinate, setSubordinate] = useState<UserWithGoals | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    weight: 0,
    evaluation_score: 1,
    due_date: '',
    status: 'pending',
    evaluation_status: 'awaiting_goal_setting' as EvaluationStatus,
    cycle_id: selectedCycleId,
  });

  useEffect(() => {
    fetchSubordinateDetails();
  }, [userId, selectedCycleId]);

  const fetchSubordinateDetails = async () => {
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .eq('status', 'active');

      // Add role-specific conditions
      if (role === 'manager') {
        query = query.eq('manager_id', user.id);
      } else if (role === 'hr_admin') {
        query = query.eq('organization_id', user.organization_id);
      }

      const { data: profile, error: profileError } = await query.single();

      if (profileError) throw profileError;
      if (!profile) throw new Error(t('admin.evaluation.detail.userNotFound'));

      // Get email
      const { data: emailData, error: emailError } = await supabase
        .rpc('get_user_emails');

      if (emailError) throw emailError;

      const email = emailData.find((item: any) => item.id === userId)?.email || t('common.na');

      // Get goals for the selected cycle
      const { data: goals, error: goalsError } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .eq('cycle_id', selectedCycleId)
        .order('created_at', { ascending: false });

      if (goalsError) throw goalsError;

      setSubordinate({
        ...profile,
        email,
        goals: goals || [],
      });
    } catch (err: any) {
      console.error('Error fetching subordinate details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoalClick = (goal: Goal) => {
    setSelectedGoal(goal);
    setEditForm({
      title: goal.title,
      description: goal.description || '',
      weight: goal.weight || 0,
      evaluation_score: goal.evaluation_score || 1,
      due_date: goal.due_date || '',
      status: goal.status || 'pending',
      evaluation_status: goal.evaluation_status || 'awaiting_goal_setting',
      cycle_id: goal.cycle_id || selectedCycleId,
    });
    setIsEditing(true);
  };

  const handleUpdateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal) return;

    try {
      const { error } = await supabase
        .from('goals')
        .update({
          title: editForm.title,
          description: editForm.description,
          weight: editForm.weight,
          evaluation_score: editForm.evaluation_score,
          due_date: editForm.due_date || null,
          status: editForm.status,
          evaluation_status: editForm.evaluation_status,
          cycle_id: editForm.cycle_id,
        })
        .eq('id', selectedGoal.id);

      if (error) throw error;

      await fetchSubordinateDetails();
      setIsEditing(false);
      setSelectedGoal(null);
    } catch (err: any) {
      console.error('Error updating goal:', err);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !selectedCycleId) return;

    try {
      const { error } = await supabase
        .from('goals')
        .insert([{
          title: editForm.title,
          description: editForm.description,
          weight: editForm.weight,
          evaluation_score: 1,
          due_date: editForm.due_date || null,
          user_id: userId,
          status: editForm.status,
          evaluation_status: editForm.evaluation_status,
          cycle_id: selectedCycleId,
        }]);

      if (error) throw error;

      await fetchSubordinateDetails();
      setIsEditing(false);
      setSelectedGoal(null);
      setEditForm({
        title: '',
        description: '',
        weight: 0,
        evaluation_score: 1,
        due_date: '',
        status: 'pending',
        evaluation_status: 'awaiting_goal_setting',
        cycle_id: selectedCycleId,
      });
    } catch (err: any) {
      console.error('Error creating goal:', err);
    }
  };

  const handleDeleteGoal = async () => {
    if (!selectedGoal) return;

    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', selectedGoal.id);

      if (error) throw error;

      await fetchSubordinateDetails();
      setShowDeleteConfirm(false);
      setIsEditing(false);
      setSelectedGoal(null);
    } catch (err) {
      console.error('Error deleting goal:', err);
    }
  };

  const handleNewGoal = () => {
    setSelectedGoal(null);
    setEditForm({
      title: '',
      description: '',
      weight: 0,
      evaluation_score: 1,
      due_date: '',
      status: 'pending',
      evaluation_status: 'awaiting_goal_setting',
      cycle_id: selectedCycleId,
    });
    setIsEditing(true);
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

  const handleStatusChange = async (newStatus: EvaluationStatus) => {
    try {
      const { error } = await supabase
        .from('goals')
        .update({ evaluation_status: newStatus })
        .eq('user_id', userId)
        .eq('cycle_id', selectedCycleId);

      if (error) throw error;

      await fetchSubordinateDetails();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const getCurrentStatus = (): EvaluationStatus => {
    if (!subordinate?.goals.length) return 'awaiting_goal_setting';
    const statusCounts = subordinate.goals.reduce((acc, goal) => {
      acc[goal.evaluation_status] = (acc[goal.evaluation_status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(statusCounts).reduce((a, b) => 
      statusCounts[a] > statusCounts[b[0]] ? a : b[0]
    , 'awaiting_goal_setting') as EvaluationStatus;
  };

  const calculateTotalWeight = () => {
    return subordinate?.goals.reduce((sum, goal) => sum + (goal.weight || 0), 0) || 0;
  };

  if (loading) {
    return <div className="text-center py-8">{t('admin.evaluation.detail.loading')}</div>;
  }

  if (error || !subordinate) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
        {t('common.error')}: {error || t('admin.evaluation.detail.userNotFound')}
      </div>
    );
  }

  const currentStatus = getCurrentStatus();
  const totalWeight = calculateTotalWeight();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/evaluation')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t('admin.evaluation.detail.backToTeam')}
        </button>
        <button
          onClick={handleNewGoal}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('goals.form.create')}
        </button>
      </div>

      {/* User Info Card */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">
            {subordinate.full_name || t('common.noNameSet')}
          </h1>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-500">{subordinate.email}</p>
            {subordinate.department && (
              <p className="text-sm text-gray-500">
                {t('profile.department')}: <span className="font-medium">{subordinate.department}</span>
              </p>
            )}
            {subordinate.job_name && (
              <p className="text-sm text-gray-500">
                {t('profile.position')}: <span className="font-medium">{subordinate.job_name}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Split View Container */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Goals List - Left Side (2/3) */}
        <div className="lg:w-2/3">
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className={`text-sm font-medium ${totalWeight === 100 ? 'text-green-600' : 'text-red-600'}`}>
                {t('goals.allocatedWeight')}: <span className="font-bold">{totalWeight}%</span>
                {totalWeight !== 100 && (
                  <span className="ml-2">
                    • {t('goals.allocableWeight')}: <span className="font-bold">{100 - totalWeight}%</span>
                  </span>
                )}
              </div>
              {totalWeight !== 100 && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t('goals.weightWarning')}
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {subordinate.goals.map((goal) => (
                  <li key={goal.id}>
                    <div 
                      className="px-4 py-4 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => handleGoalClick(goal)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">{goal.title}</p>
                              <GoalStatus status={goal.status} />
                            </div>
                            <div className="ml-2 flex-shrink-0">
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {t('goals.weight')}: {goal.weight}%
                              </p>
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400">{goal.description}</p>
                            <div className="mt-2">
                              <GoalScore score={goal.evaluation_score || 1} />
                            </div>
                          </div>
                        </div>
                        <div className="ml-5 flex-shrink-0">
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            {t('goals.dueDate')}: {goal.due_date ? new Date(goal.due_date).toLocaleDateString() : t('goals.noDueDate')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Side (1/3) */}
        <div className="lg:w-1/3 space-y-6">
          {/* Performance Overview Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">{t('admin.evaluation.detail.performance')}</h2>
            <PerformanceScore goals={subordinate.goals} />
          </div>
          
          {/* Evaluation Status Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-medium text-gray-900">{t('admin.evaluation.status')}</h2>
                <p className="text-sm text-gray-500">{t('admin.evaluation.detail.currentPhase')}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('admin.evaluation.detail.currentStatus')}
                </label>
                <select
                  value={currentStatus}
                  onChange={(e) => handleStatusChange(e.target.value as EvaluationStatus)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="awaiting_goal_setting">{t('admin.evaluation.statuses.awaiting_goal_setting')}</option>
                  <option value="awaiting_evaluation">{t('admin.evaluation.statuses.awaiting_evaluation')}</option>
                  <option value="awaiting_approval">{t('admin.evaluation.statuses.awaiting_approval')}</option>
                  <option value="finalized">{t('admin.evaluation.statuses.finalized')}</option>
                </select>
              </div>

              <div className={`rounded-md p-4 ${getStatusColor(currentStatus)}`}>
                <p className="text-sm font-medium">
                  {formatStatus(currentStatus)}
                </p>
                <p className="text-xs mt-1">
                  {t(`admin.evaluation.detail.statusDescriptions.${currentStatus}`)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit/Create Goal Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => {
          setIsEditing(false);
          setSelectedGoal(null);
        }}
        title={selectedGoal ? t('goals.form.update') : t('goals.form.create')}
      >
        <GoalForm
          formData={editForm}
          onChange={(field, value) => setEditForm(prev => ({ ...prev, [field]: value }))}
          onSubmit={selectedGoal ? handleUpdateGoal : handleCreateGoal}
          onCancel={() => {
            setIsEditing(false);
            setSelectedGoal(null);
          }}
          onDelete={() => setShowDeleteConfirm(true)}
          isEditing={!!selectedGoal}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title={t('goals.form.deleteGoal')}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            {t('admin.evaluation.detail.deleteConfirmation')}
          </p>
          {selectedGoal && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium text-gray-900">{selectedGoal.title}</h3>
              {selectedGoal.description && (
                <p className="mt-1 text-sm text-gray-500">{selectedGoal.description}</p>
              )}
            </div>
          )}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {t('common.cancel')}
            </button>
            <button
              type="button"
              onClick={handleDeleteGoal}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {t('goals.form.deleteGoal')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
