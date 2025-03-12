/**
 * Lógica para prever o uso futuro de fraldas com base no histórico
 * e no crescimento do bebê.
 */

module.exports = {
  /**
   * Calcula a média diária de uso de fraldas com base no histórico
   * @param {Array} diaperUsages - Histórico de uso de fraldas
   * @returns {Number} - Média diária de uso
   */
  calculateDailyAverage(diaperUsages) {
    if (!diaperUsages || diaperUsages.length === 0) {
      return 0;
    }

    const totalDiapers = diaperUsages.reduce((sum, usage) => sum + usage.quantity, 0);
    const uniqueDates = new Set(diaperUsages.map(usage => usage.date.toISOString().split('T')[0]));
    
    return totalDiapers / uniqueDates.size;
  },

  /**
   * Prevê o tamanho futuro da fralda com base no peso atual e taxa de crescimento
   * @param {Array} measurements - Histórico de medidas do bebê
   * @param {Number} daysInFuture - Número de dias no futuro para prever
   * @returns {String} - Tamanho previsto da fralda
   */
  predictFutureSize(measurements, daysInFuture) {
    if (!measurements || measurements.length < 2) {
      return null;
    }

    // Ordenar medidas por data
    const sortedMeasurements = [...measurements].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    // Calcular taxa de crescimento diária (kg/dia)
    const firstMeasurement = sortedMeasurements[0];
    const lastMeasurement = sortedMeasurements[sortedMeasurements.length - 1];
    const daysDifference = (new Date(lastMeasurement.date) - new Date(firstMeasurement.date)) / (1000 * 60 * 60 * 24);
    
    if (daysDifference === 0) {
      return this.getSizeByWeight(lastMeasurement.weight);
    }

    const weightGrowthRate = (lastMeasurement.weight - firstMeasurement.weight) / daysDifference;
    
    // Prever peso futuro
    const predictedWeight = lastMeasurement.weight + (weightGrowthRate * daysInFuture);
    
    // Determinar tamanho com base no peso previsto
    return this.getSizeByWeight(predictedWeight);
  },

  /**
   * Determina o tamanho da fralda com base no peso do bebê
   * @param {Number} weight - Peso do bebê em kg
   * @returns {String} - Tamanho da fralda
   */
  getSizeByWeight(weight) {
    if (weight < 4) return 'RN';
    if (weight < 6) return 'P';
    if (weight < 10) return 'M';
    if (weight < 13) return 'G';
    if (weight < 15) return 'XG';
    return 'XXG';
  },

  /**
   * Calcula a quantidade estimada de fraldas para um período futuro
   * @param {Number} dailyAverage - Média diária de uso de fraldas
   * @param {Number} days - Número de dias para prever
   * @returns {Number} - Quantidade estimada de fraldas
   */
  calculateEstimatedQuantity(dailyAverage, days) {
    return Math.ceil(dailyAverage * days);
  },

  /**
   * Gera uma previsão completa de uso de fraldas
   * @param {Object} baby - Dados do bebê
   * @param {Array} diaperUsages - Histórico de uso de fraldas
   * @param {Array} measurements - Histórico de medidas
   * @param {Number} daysToPredict - Número de dias para prever
   * @returns {Object} - Previsão de uso de fraldas
   */
  generatePrediction(baby, diaperUsages, measurements, daysToPredict) {
    const dailyAverage = this.calculateDailyAverage(diaperUsages);
    const estimatedQuantity = this.calculateEstimatedQuantity(dailyAverage, daysToPredict);
    const estimatedSize = this.predictFutureSize(measurements, daysToPredict);
    
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + daysToPredict);
    
    return {
      baby: baby.id,
      startDate: today,
      endDate: endDate,
      estimatedQuantity,
      estimatedSize
    };
  }
}; 