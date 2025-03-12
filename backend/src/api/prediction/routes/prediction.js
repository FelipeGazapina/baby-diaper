'use strict';

/**
 * prediction router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::prediction.prediction', {
  config: {
    find: {},
    findOne: {},
    create: {},
    update: {},
    delete: {},
  }
}); 