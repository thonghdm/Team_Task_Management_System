
// plansData.js
export const plans = [
  {
    _id: '1',
    subscription_type: 'Basic',
    price: 0,
    description: 'Ideal for individuals or small teams managing basic tasks',
    features: [
      'Create and manage tasks',
      'Set deadlines and task statuses',
      'Personal task lists',
      'Basic task filtering',
      'Limited email notifications'
    ],
    max_project : 1,
    max_member : 1,
    max_task : 10,
    max_list : 10,
  },
  {
    _id: '67beea3ccfb642d61eddc52b',
    subscription_type: 'Standard',
    price: 15,
    description: 'Enhance productivity with powerful collaboration features',
    features: [
      'Everything in Basic',
      'Team management and role-based permissions',
      'Real-time notifications',
      'Task progress reports',
      'Integration with Google Drive and Slack',
      'Customizable workflows'
    ],
    isPopular: true,
    max_project : 1,
    max_member : 1,
    max_task : 10,
    max_list : 10,
  }
];
