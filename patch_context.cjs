const fs = require('fs');
const path = require('path');

const contextPath = path.join(__dirname, 'frontend/src/context/SentraContext.tsx');
let content = fs.readFileSync(contextPath, 'utf8');

// 1. Add listener
const listenerCode = `
    socket.on('action_sync', (data: any) => {
      switch(data.type) {
        case 'review_alert':
          setAlerts(prev => prev.map(a => a.id === data.payload.alertId ? { ...a, ...data.payload.updates } : a));
          break;
        case 'create_intervention':
          setInterventions(prev => {
            if (prev.some(i => i.id === data.payload.intervention.id)) return prev;
            return [data.payload.intervention, ...prev];
          });
          if(data.payload.appointment) {
            setAppointments(prev => {
              if (prev.some(a => a.id === data.payload.appointment.id)) return prev;
              return [data.payload.appointment, ...prev];
            });
          }
          if(data.payload.notification) {
            setNotifications(prev => {
              if (prev.some(n => n.id === data.payload.notification.id)) return prev;
              return [data.payload.notification, ...prev];
            });
          }
          break;
        case 'update_appointment':
          setAppointments(prev => prev.map(a => a.id === data.payload.appointmentId ? { ...a, status: data.payload.status } : a));
          if(data.payload.notification) {
            setNotifications(prev => {
              if (prev.some(n => n.id === data.payload.notification.id)) return prev;
              return [data.payload.notification, ...prev];
            });
          }
          break;
      }
    });
`;
content = content.replace("socket.off('notification_added');", "socket.off('notification_added');\n      socket.off('action_sync');");
content = content.replace("socket.on('notification_added', (notif: NotificationItem) => {", listenerCode + "\n    socket.on('notification_added', (notif: NotificationItem) => {");

// 2. Patch reviewAlert
content = content.replace("setAuditLogs(prev => [audit, ...prev]);\n  };", `setAuditLogs(prev => [audit, ...prev]);
    socket.emit('action_sync', {
      type: 'review_alert',
      payload: {
        alertId,
        updates: {
          status: action === 'closed' ? 'closed' : 'reviewed',
          counsellorNotes: notes,
          reviewedBy: 'Dr. Ananya Raman (Senior Clinical Counsellor)',
          reviewedAt: timestamp
        }
      }
    });
  };`);

// 3. Patch createIntervention
const createIntMatch = `    // If intervention schedules an appointment, add to Appointments table
    if (scheduleAppointment) {
      const newAppt: AppointmentRecord = {`;
const createIntReplace = `    let newAppt: AppointmentRecord | undefined;
    let victimNotif: NotificationItem | undefined;

    // If intervention schedules an appointment, add to Appointments table
    if (scheduleAppointment) {
      newAppt = {`;
content = content.replace(createIntMatch, createIntReplace);
content = content.replace(`const victimNotif: NotificationItem = {`, `victimNotif = {`);

const createIntEndMatch = `setAuditLogs(prev => [audit, ...prev]);
  };

  const confirmAppointment`;
const createIntEndReplace = `setAuditLogs(prev => [audit, ...prev]);

    socket.emit('action_sync', {
      type: 'create_intervention',
      payload: {
        intervention: newIntervention,
        appointment: newAppt,
        notification: victimNotif
      }
    });
  };

  const confirmAppointment`;
content = content.replace(createIntEndMatch, createIntEndReplace);

// 4. Patch confirmAppointment
const confirmApptMatch = `setAuditLogs(prev => [audit, ...prev]);
  };

  const requestRescheduleAppointment`;
const confirmApptReplace = `setAuditLogs(prev => [audit, ...prev]);

    socket.emit('action_sync', {
      type: 'update_appointment',
      payload: { appointmentId, status: 'confirmed' }
    });
  };

  const requestRescheduleAppointment`;
content = content.replace(confirmApptMatch, confirmApptReplace);

// 5. Patch requestRescheduleAppointment
const reschedMatch = `setNotifications(prev => [notif, ...prev]);
  };

  const updateConsent`;
const reschedReplace = `setNotifications(prev => [notif, ...prev]);

    socket.emit('action_sync', {
      type: 'update_appointment',
      payload: { appointmentId, status: 'rescheduled', notification: notif }
    });
  };

  const updateConsent`;
content = content.replace(reschedMatch, reschedReplace);

fs.writeFileSync(contextPath, content);
console.log('Successfully patched SentraContext.tsx');
