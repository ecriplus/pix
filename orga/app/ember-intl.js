export const formats = {
  formatTime: {
    hhmm: {
      hour: 'numeric',
      minute: 'numeric',
    },
    hhmmss: {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    },
  },
  formatDate: {
    hhmmss: {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    },
    L: {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    },
    LL: {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
    LLL: {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
    medium: {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  },
  formatNumber: {
    EUR: {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
    USD: {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  },
};
