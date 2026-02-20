// utils/chartUtils.js
/**
 * Deep clone utility to ensure objects are mutable for Nivo charts
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (Array.isArray(obj)) return obj.map(item => deepClone(item));
  
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
};

/**
 * Prepare data for Nivo charts by ensuring all objects are mutable
 */
export const prepareNivoData = (data) => {
  return JSON.parse(JSON.stringify(data));
};

// Fixed CurrentMonthLoginChart data preparation
export const prepareCurrentMonthData = (data, theme) => {
  const clonedData = prepareNivoData(data);
  
  return [{
    id: "logins",
    color: theme.palette.primary.main,
    data: clonedData.map((d) => ({
      x: d.dayNumber,
      y: d.logins,
      label: d.dateLabel
    }))
  }];
};

// Fixed WeeklyLoginChart data preparation
export const prepareWeeklyData = (data, theme) => {
  const clonedData = prepareNivoData(data);
  
  return [{
    id: "logins",
    color: theme.palette.primary.main,
    data: clonedData.map((item, index) => ({
      x: index + 1,
      y: item.logins,
      day: item.day
    }))
  }];
};

// Fixed MonthlyLoginChart data preparation
export const prepareMonthlyData = (counts, year, month, theme) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthShort = monthNames[month];

  return [{
    id: "logins",
    color: theme.palette.primary.main,
    data: counts.map((count, index) => ({
      x: index + 1,
      y: count,
      label: `${monthShort} ${index + 1}, ${year}`
    }))
  }];
};

// Fixed SessionsHealthChart data preparation
export const prepareSessionsHealthData = (sessions, theme) => {
  const activeCount = sessions.filter(s => s.is_active).length;
  const inactiveCount = sessions.filter(s => !s.is_active).length;
  const expiredCount = sessions.filter(s => s.expired).length;

  return [
    {
      status: 'Active',
      count: activeCount,
      color: theme.palette.success?.main || '#4caf50'
    },
    {
      status: 'Inactive',
      count: inactiveCount,
      color: theme.palette.warning?.main || '#ff9800'
    },
    {
      status: 'Expired',
      count: expiredCount,
      color: theme.palette.error.main
    }
  ];
};

// Fixed HeatMap data preparation
export const prepareHeatMapData = (allsessions) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Create matrix to count logins
  const activityMatrix = {};
  days.forEach(day => {
    activityMatrix[day] = {};
    hours.forEach(hour => {
      activityMatrix[day][hour] = 0;
    });
  });

  // Process sessions data
  if (Array.isArray(allsessions)) {
    allsessions.forEach(session => {
      if (!session?.created_at) return;

      // Parse date directly - browser will interpret in local timezone
      const date = new Date(session.created_at);
      
      const dayOfWeek = date.getDay();
      const hour = date.getHours();

      const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const dayName = days[dayIndex];

      activityMatrix[dayName][hour]++;
    });
  }

  // Convert to Nivo heatmap format
  return days.map(day => ({
    id: day,
    data: hours.map(hour => ({
      x: `${hour}:00`,
      y: activityMatrix[day][hour]
    }))
  }));
};