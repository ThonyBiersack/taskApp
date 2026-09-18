import ejs from 'ejs';

const data = {
  activeTasks: [
    {title: 'Test Task', description: 'This is a test', schedule: new Date('2026-08-30T14:30:00')},
    {title: 'Another Task', schedule: new Date('2026-08-31T10:00:00')}
  ],
  doneTasks: [
    {title: 'Completed Task', schedule: new Date('2026-08-29T09:00:00')}
  ],
  stats: {total: 10, completed: 1, inProgress: 9},
  currentPath: '/dashboard',
  currentUser: {username: 'testuser'}
};

try {
  const html = await ejs.renderFile('src/views/page/dashboard.ejs', data);
  if (html.includes('Active Tasks') && html.includes('Completed Tasks') && html.includes('Test Task')) {
    console.log('✓ Dashboard template compiled successfully with all sections');
  } else {
    console.log('✗ Missing expected content in template');
  }
} catch (error) {
  console.error('Template error:', error.message);
  process.exit(1);
}
