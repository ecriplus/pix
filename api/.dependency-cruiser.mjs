export default {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'prevent circular dependencies contexts',
      from: { path: '^src/(banner|learning-content|shared)/' },
      to: { circular: true },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
  },
};
