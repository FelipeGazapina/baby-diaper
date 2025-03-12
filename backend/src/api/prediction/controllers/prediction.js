'use strict';

/**
 * prediction controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const predictionLogic = require('../../../prediction-logic');

module.exports = createCoreController('api::prediction.prediction', ({ strapi }) => ({
  async generatePrediction(ctx) {
    try {
      const { babyId, daysToPredict } = ctx.request.body;
      
      if (!babyId || !daysToPredict) {
        return ctx.badRequest('Missing required fields: babyId and daysToPredict are required');
      }
      
      // Buscar dados do bebê
      const baby = await strapi.entityService.findOne('api::baby.baby', babyId, {
        populate: ['measurements', 'diaperUsages'],
      });
      
      if (!baby) {
        return ctx.notFound('Baby not found');
      }
      
      // Gerar previsão
      const prediction = predictionLogic.generatePrediction(
        baby,
        baby.diaperUsages,
        baby.measurements,
        daysToPredict
      );
      
      // Salvar a previsão no banco de dados
      const savedPrediction = await strapi.entityService.create('api::prediction.prediction', {
        data: prediction,
      });
      
      return savedPrediction;
    } catch (error) {
      return ctx.badRequest(`Error generating prediction: ${error.message}`);
    }
  },
})); 