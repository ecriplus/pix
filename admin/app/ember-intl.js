export const formats = {
  formatDate: {
    // DD/MM/YYYY HH:mm
    medium: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'UTC',
    },
    // DD/MM/YYYY HH:mm:ss
    long: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: 'UTC',
    },
  },
  formatTime: {
    // HH:mm:ss
    long: {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZone: 'UTC',
    },
  },
};
