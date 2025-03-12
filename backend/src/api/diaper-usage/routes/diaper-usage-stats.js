module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/diaper-usage-stats/:babyId',
      handler: 'diaper-usage.getStats',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
}; 