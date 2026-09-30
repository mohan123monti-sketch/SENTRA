const fs = require('fs');
const path = require('path');

const contextPath = path.join(__dirname, 'frontend/src/context/SentraContext.tsx');
let content = fs.readFileSync(contextPath, 'utf8');

const injectionStr = `
    // Hydrate all realtime state from the backend
    Promise.all([
      fetch('http://localhost:3001/api/cases').then(res => res.json()),
      fetch('http://localhost:3001/api/alerts').then(res => res.json()),
      fetch('http://localhost:3001/api/interventions').then(res => res.json()),
      fetch('http://localhost:3001/api/appointments').then(res => res.json()),
      fetch('http://localhost:3001/api/notifications').then(res => res.json())
    ]).then(([casesData, alertsData, interventionsData, appointmentsData, notificationsData]) => {
      if (casesData.length) setCases(casesData.map(c => ({...c, officialUpdates: JSON.parse(c.officialUpdates || '[]')})));
      if (alertsData.length) setAlerts(alertsData);
      if (interventionsData.length) setInterventions(interventionsData);
      if (appointmentsData.length) setAppointments(appointmentsData);
      if (notificationsData.length) setNotifications(notificationsData);
    }).catch(err => console.error('Failed to hydrate generic state:', err));
`;

if (!content.includes('http://localhost:3001/api/cases')) {
  // Insert inside the useEffect that currently has getCheckInsFromDB
  const targetStr = `}).catch(err => console.warn('Could not hydrate victim profile from DB:', err));`;
  content = content.replace(targetStr, targetStr + "\\n" + injectionStr);
  fs.writeFileSync(contextPath, content);
  console.log('Successfully injected state hydration into SentraContext.tsx');
} else {
  console.log('Hydration already present.');
}
