const mongoose = require('mongoose');
const { config } = require('./src/config');
const { AnalyticsService } = require('./src/modules/analytics/services/Analytics.service');
const { AnalyticsRepository } = require('./src/modules/analytics/repositories/Analytics.repository');
const { UserRepository } = require('./src/modules/auth/repositories/User.repository');

mongoose.connect('mongodb+srv://muhammedshanm999nutritionapp:QTX86exvbvzmDjJ@cluster0.dsvbvh5.mongodb.net/nutrilens').then(async () => {
  const service = new AnalyticsService(new AnalyticsRepository(), new UserRepository());
  const res = await service.getAnalytics('6a3fa116680bdc01e5ea76b6', '7d');
  console.log(JSON.stringify(res, null, 2));
  process.exit(0);
});
