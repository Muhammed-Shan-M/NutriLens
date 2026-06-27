const mongoose = require('mongoose');
const { Types } = mongoose;
mongoose.connect('mongodb+srv://muhammedshanm999nutritionapp:QTX86exvbvzmDjJ@cluster0.dsvbvh5.mongodb.net/nutrilens').then(async () => {
  const db = mongoose.connection.db;
  
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 6);

  console.log('Dates:', start, end);

  // Let's print all meals and their dates to see if there's a timezone issue
  const allMeals = await db.collection('meals').find({}).toArray();
  console.log('All meals createdAt:');
  allMeals.forEach(m => console.log(m._id, m.createdAt, m.userId, typeof m.userId, m.userId instanceof Types.ObjectId));

  const userId = '6a3fa116680bdc01e5ea76b6'; 

  const results = await db.collection('meals').aggregate([
    {
      $match: {
        userId: new Types.ObjectId(userId),
        createdAt: { $gte: start, $lte: end }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        totalCalories: { $sum: '$totalCalories' },
        mealCount: { $sum: 1 }
      }
    }
  ]).toArray();
  console.log('Results:', results);
  process.exit(0);
});
