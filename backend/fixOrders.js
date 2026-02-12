import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './models/order.model.js';
import User from './models/user.model.js';

dotenv.config();

const fixOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to database');

    // Find all orders with null user
    const ordersWithNullUser = await Order.find({ user: null });
    console.log(`Found ${ordersWithNullUser.length} orders with null user`);

    if (ordersWithNullUser.length === 0) {
      console.log('No orders to fix!');
      process.exit(0);
    }

    // Get a test user to assign to these orders
    const testUser = await User.findOne({ role: 'user' });
    
    if (!testUser) {
      console.log('No user found in database. Please create a user first.');
      process.exit(1);
    }

    console.log(`Will assign orders to user: ${testUser.fullName} (${testUser.email})`);

    // Update all orders with null user
    const result = await Order.updateMany(
      { user: null },
      { user: testUser._id }
    );

    console.log(`Updated ${result.modifiedCount} orders`);
    console.log('Done! Refresh your app to see the changes.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixOrders();
