export const en = {
	common: {
		welcome: 'Welcome',
		welcomeBack: 'Welcome back, {{name}}',
		name: 'Name',
		actions: 'Actions',
		noNameSet: 'No name set',
		dashboard: 'Dashboard',
		sending: 'Sending...',
		login: 'Login',
		logout: 'Logout',
		email: 'Email',
		password: 'Password',
		submit: 'Submit',
		cancel: 'Cancel',
		save: 'Save',
		delete: 'Delete',
		edit: 'Edit',
		create: 'Create',
		search: 'Search',
		loading: 'Loading...',
		error: 'Error',
		success: 'Success',
		saving: 'Saving...',
		saveChanges: 'Save Changes',
		na: 'N/A'
	},
	 docs: {
		sections: 'Documentation Sections',
		employee: {
			goals: {
				title: 'Managing Goals',
				content: 'In this section, you can learn how to create, modify, and track individual goals in the system.'
			},
			performance: {
				title: 'Performance Overview',
				content: 'Review your performance indicators, scores, and development opportunities.'
			},
			profile: {
				title: 'Profile Settings',
				content: 'Modify your personal data, password, and other profile settings.'
			}
		}
		},
  auth: {
    signIn: 'Sign In',
    signInTo: 'Sign in to PerformancePro',
    passwordsDontMatch: 'Passwords do not match',
    newPassword: 'New Password',
    confirmNewPassword: 'Confirm New Password',
    setNewPassword: 'Set new password',
    setNewPasswordInstructions: 'Please enter your new password below.',
    resetting: 'Resetting...',
    resetSuccess: 'Password has been reset successfully',
    resetFailed: 'Failed to reset password',
    backToLogin: 'Back to login',
    signingIn: 'Signing in...',
    signUp: 'Sign Up',
    createAccount: 'Create account',
    creatingAccount: 'Creating account...',
    forgotPassword: 'Forgot Password?',
    resetPassword: 'Reset Password',
    resetPasswordInstructions: 'Enter your email address and we\'ll send you instructions to reset your password.',
    sendResetInstructions: 'Send Reset Instructions',
    resetInstructionsSent: 'Password reset instructions have been sent to your email',
    resetInstructionsFailed: 'Failed to send reset instructions',
    noAccount: 'Don\'t have an account?',
    hasAccount: 'Already have an account?',
    emailAddress: 'Email address',
    passwordRequirement: 'Password must be at least 6 characters long',
    inviteEmailSubject: "Invitation to the PerformancePro system",
    inviteEmailBody: "You have been invited to the PerformancePro system. Please click the link below to set up your password:",
    passwordResetSent: "Password setup link sent to: {{email}}",
    setupInstructions: "To log in to the system for the first time, follow the instructions in the email."
  },
  goals: {
    title: 'Goals',
    pageTitle: 'Own Goals and Evaluations',
    weight: "Weight",
    allocatedWeight: 'Allocated goals weight',
    allocableWeight: 'Allocable goals weight',
    totalWeight: 'Total weight',
    weightWarning: 'The total weight of the goals should be exactly 100%',
    noDueDate: 'No due date',
    noGoals: 'No goals found',
    dueInDays: 'Due in {{days}} days',
    dueToday: 'Due today',
    overdueDays: 'Overdue by {{days}} days',
    evaluation: {
      score: 'Score',
      summary: 'Summary Evaluation',
      overallEvaluation: 'Overall Evaluation',
      furtherSuggestions: 'Further Suggestions',
      noEvaluationProvided: 'No evaluation provided yet.',
      noSuggestionsProvided: 'No suggestions provided yet.',
      deleteConfirmation: 'Are you sure you want to delete this goal? This action cannot be undone.',
      scoreFormat: 'Score: {{score}}/5',
      hr: {
        organizationOverview: 'Organization Overview',
        totalEmployees: 'Total Employees',
        topPerformers: 'Top Performers',
        needsImprovement: 'Needs Improvement',
        organizationDistribution: 'Organization Distribution'
        },          
      impact: {
        title: 'Goals and Their Impact',
        subtitle: 'Goals are weighted by importance and evaluated on a 1-5 scale',
        impact: 'Impact',
        noGoals: 'No goals found'
      },
      radar: {
        title: 'Goal Performance Distribution',
        weight: 'Weight',
        noGoals: 'No goals found',
        dragAndDrop: 'Drag and drop goals to assign them to managers'
      },
      performance: {
        title: 'Performance Score',
        score: 'Score',
        ownOverview: 'Own Performance Overview',
        subtitle: 'Based on weighted average of goal evaluation scores',
        outOf: 'out of',
        gradeLevel: 'Grade Level',
        currentLevel: 'Current Level',
        scoreRange: 'Score Range',
        grade: 'Grade',
        level: 'Level',
        grades: {
          unsatisfactory: 'Unsatisfactory',
          weak: 'Weak',
          normal: 'Normal',
          good: 'Good',
          excellent: 'Excellent'
        }
      },
      metrics: {
        title: 'Performance Metrics',
        totalGoals: 'Total Goals',
        completedGoals: 'Completed Goals',
        inProgressGoals: 'In Progress Goals',
        overdueGoals: 'Overdue Goals',
        noGoals: 'No goals found',
        description: 'Overview of goal completion status'
      },
      status: {
        pending: 'Pending',
        in_progress: 'In Progress',
        inProgress: 'In Progress',
        completed: 'Completed'
      },
      manager: {
        title: 'Team Performance Overview',
        teamMembers: 'Total Team Members',
        pendingEvaluations: 'Pending Evaluations',
        completedEvaluations: 'Completed Evaluations',
        averageScore: 'Average Score',
        gradeDistribution: 'Grade Distribution',
        employee: 'employee',
        employees: 'employees',
        topPerformers: 'Top Performers',
        needsImprovement: 'Needs Improvement',
        score: 'Score',
        noData: 'No data available',
        loading: 'Loading manager overview...'
      },
      report: {
        title: 'Performance Report',
        employeeInfo: 'Employee Information',
        filename: 'performance_report',
        employee: 'employee'
      }
    },
    form: {
      title: 'Title',
      description: 'Description',
      status: 'Status',
      weight: 'Weight (%)',
      evaluationScore: 'Evaluation Score (1-5)',
      evaluationNotes: 'Evaluation Notes',
      dueDate: 'Due Date',
      evaluationCycle: 'Evaluation Cycle',
      selectCycle: 'Select an evaluation cycle',
      onlyManagersCanModify: '(Only managers and admins can modify)',
      onlyVisibleToManagers: '(Only visible to managers and admins)',
      addEvaluationNotes: 'Add evaluation notes here...',
      cancel: 'Cancel',
      deleteGoal: 'Delete Goal',
      update: 'Update Goal',
      create: 'Create Goal'
    },
    status: {
      pending: 'Pending',
      in_progress: 'In Progress',
      inProgress: 'In Progress',
      completed: 'Completed'
    }
  },
  admin: {
    systemOverview: 'System Overview',
    title: 'Admin',
    evaluation: {
      loading: 'Loading subordinates...',
      allEmployees: 'All Employees',
      noEmployees: 'No employees found', 
      noTeamMembers: 'No team members to evaluate',
      status: 'Evaluation Status',
      subordinates: 'Evaluation of Subordinates',
      statuses: {
        awaiting_goal_setting: 'Awaiting Goal Setting',
        awaiting_evaluation: 'Awaiting Evaluation',
        awaiting_approval: 'Awaiting Approval',
        finalized: 'Finalized'
      },
      detail: {
        loading: 'Loading evaluation details...',
        userNotFound: 'User not found',
        backToTeam: 'Back to Team Members',
        currentPhase: 'Current phase of the evaluation process',
        currentStatus: 'Current Status',
        deleteConfirmation: 'Are you sure you want to delete this goal? This action cannot be undone.',
        statusDescriptions: {
          awaiting_goal_setting: 'Employee needs to set their goals',
          awaiting_evaluation: 'Goals are ready for evaluation',
          awaiting_approval: 'Evaluation needs manager approval',
          finalized: 'Evaluation process is complete'
        }
      }
    },
    users: {
      title: 'Users',
      total: 'Total Users',
      active: 'Active Users',
      inactive: 'Inactive Users',
      status: 'Status',
      pendingChanges: 'You have pending changes to the organization structure',
      unassignedUsers: 'Unassigned Team Members',
      dragAndDropInstructions: 'Drag and drop users to assign them to managers • Only managers can have direct reports • Changes wont be applied until you save them',
      noTeamMembers: 'No team members found',
      activePercentage: '{{percentage}}% active',
      invite: 'Invite User',
      sendInvite: 'Send Invitation',
      edit: 'Edit User',
      delete: 'Delete User',
      management: 'User Management',
      listView: 'List View',
      orgChart: 'Org Chart',
      bulkUpload: {
        title: 'Bulk Upload Users',
        description: 'Upload multiple users at once using an Excel file. Download the template below for the correct format.',
        downloadTemplate: 'Download Template',
        dropzone: 'Click to upload or drag and drop',
        fileTypes: 'XLSX or XLS files only',
        uploading: 'Uploading...',
        uploadingProgress: 'Uploading {{current}}/{{total}} users',
        required: 'required',
        requiredColumns: 'Required Columns',
        noValidUsers: 'No valid users found in the uploaded file'
      },
      invitationSent: 'Invitation sent to {{email}}!',
      invitationFailed: 'Failed to send invitation',
      deleteSuccess: 'User deleted successfully!',
      updateSuccess: 'Profile updated successfully!',
      filters: {
        title: 'Filters',
        organization: 'Organization',
        allOrganizations: 'All Organizations',
        role: 'Role',
        allRoles: 'All Roles',
        manager: 'Manager',
        allManagers: 'All Managers',
        clearFilters: 'Clear Filters'
      },
      table: {
        user: 'User',
        organization: 'Organization',
        role: 'Role',
        manager: 'Manager',
        status: 'Status',
        actions: 'Actions',
        noOrg: 'No Organization',
        noManager: 'No Manager',
        unnamed: 'Unnamed Employee'
      }
    },
    roles: {
      employee: 'Employee',
      manager: 'Manager',
      hrAdmin: 'HR Admin',
      companyAdmin: 'Company Admin',
      superadmin: 'Superadmin'
    },
    organizations: {
      title: 'Organizations',
      withoutAdmin: '{{count}} without admin',
      new: 'New Organization',
      edit: 'Edit Organization',
      delete: 'Delete Organization',
      noOrganization: 'No Organization',
      createSuccess: 'Organization created successfully!',
      deleteSuccess: 'Organization deleted successfully!',
      adminAddSuccess: 'Admin added successfully!',
      table: {
        organization: 'Organization',
        admins: 'Admins',
        totalUsers: 'Total Users',
        created: 'Created',
        adminCount: '{{count}} admins',
        userCount: '{{count}} users'
        },
      addAdmin: 'Add administrator'
    },
    cycles: {
      title: 'Evaluation Cycles',
      createTitle: 'Create Evaluation Cycle',
      table: {
        name: 'Name',
        startDate: 'Start Date',
        endDate: 'End Date', 
        status: 'Status',
        actions: 'Actions'
      },
      form: {
        cycleName: 'Cycle Name',
        cycleNamePlaceholder: 'e.g., 2025 Annual Review',
        startDate: 'Start Date',
        endDate: 'End Date',
        create: 'Create Cycle',
        creating: 'Creating...',
        cancel: 'Cancel'
      },
      new: 'New Cycle',
      edit: 'Edit Cycle',
      delete: 'Delete Cycle',
      createSuccess: 'Evaluation cycle created successfully!',
      deleteSuccess: 'Evaluation cycle deleted successfully!',
      statusUpdateSuccess: 'Cycle {{name}} {{status}} successfully',
      activated: 'activated',
      deactivated: 'deactivated'
    },
    welcomeMessage: {
      title: 'Welcome Message',
      edit: 'Edit Message',
      noMessage: 'No welcome message set. Click "Edit Message" to add one.',
      updateSuccess: 'Welcome message updated successfully!',
      description: 'This message will be displayed at the top of the dashboard for all users in your organization.',
      placeholder: 'Enter your organization\'s welcome message...'
    },
    download: {
      title: 'Download Results',
      description: 'Export comprehensive performance data for selected evaluation cycle and employees',
      button: 'Download Excel Report',
      selectCycle: 'Select Evaluation Cycle',
      selectEmployee: 'Select Employee',
      allEmployees: 'All Employees',
      preparingDownload: 'Preparing Download...',
      downloadError: 'Failed to download results. Please try again.'
     }
  },
  profile: {
    title: 'Profile',
    personalInfo: 'Personal Information',
    fullName: 'Full Name',
    fullNamePlaceholder: 'John Doe',
    department: 'Department',
    departmentPlaceholder: 'e.g., Engineering',
    jobLevel: 'Job Level',
    jobLevelPlaceholder: 'e.g., Senior',
    jobName: 'Job Name',
    jobNamePlaceholder: 'e.g., Software Engineer',
    position: 'Position',
    role: 'Role',
    theme: 'Theme',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode'
  }
};
