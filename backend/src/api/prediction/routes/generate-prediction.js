module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/generate-prediction',
      handler: 'prediction.generatePrediction',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
}; 