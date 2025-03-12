'use strict';

/**
 * diaper-usage router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::diaper-usage.diaper-usage', {
  config: {
    find: {},
    findOne: {},
    create: {},
    update: {},
    delete: {},
  }
}); 