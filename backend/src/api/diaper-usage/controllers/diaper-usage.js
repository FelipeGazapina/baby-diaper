'use strict';

/**
 * diaper-usage controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const predictionLogic = require('../../../prediction-logic');

module.exports = createCoreController('api::diaper-usage.diaper-usage', ({ strapi }) => ({
  async getStats(ctx) {
    try {
      const { babyId } = ctx.params;
      
      if (!babyId) {
        return ctx.badRequest('Missing required parameter: babyId');
      }
      
      // Buscar dados do bebê
      const baby = await strapi.entityService.findOne('api::baby.baby', babyId, {
        populate: ['measurements', 'diaperUsages'],
      });
      
      if (!baby) {
        return ctx.notFound('Baby not found');
      }
      
      // Calcular média diária
      const dailyAverage = predictionLogic.calculateDailyAverage(baby.diaperUsages);
      
      // Calcular médias semanais e mensais
      const weeklyAverage = dailyAverage * 7;
      const monthlyAverage = dailyAverage * 30;
      
      // Determinar tamanho atual
      let currentSize = null;
      if (baby.measurements && baby.measurements.length > 0) {
        // Ordenar medidas por data (mais recente primeiro)
        const sortedMeasurements = [...baby.measurements].sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        
        // Usar a medida mais recente para determinar o tamanho atual
        const latestMeasurement = sortedMeasurements[0];
        currentSize = predictionLogic.getSizeByWeight(latestMeasurement.weight);
        
        // Estimar próximo tamanho
        const nextSizeEstimation = {
          size: predictionLogic.predictFutureSize(baby.measurements, 30),
          estimatedDate: new Date(new Date().setDate(new Date().getDate() + 30))
        };
        
        return {
          dailyAverage,
          weeklyAverage,
          monthlyAverage,
          currentSize,
          nextSizeEstimation
        };
      }
      
      return {
        dailyAverage,
        weeklyAverage,
        monthlyAverage,
        currentSize: null,
        nextSizeEstimation: null
      };
    } catch (error) {
      return ctx.badRequest(`Error getting stats: ${error.message}`);
    }
  },
})); 