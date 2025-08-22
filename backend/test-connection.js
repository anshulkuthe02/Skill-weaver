const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('🔄 Testing database connection...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillweave');
    console.log('✅ Successfully connected to MongoDB');
    
    // Test basic operations
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📊 Found ${collections.length} collections in database`);
    
    await mongoose.connection.close();
    console.log('🔐 Database connection closed');
    
    console.log('\n🎉 Database connection test passed!');
    console.log('✨ Your backend is ready to run!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('\n💡 Tips:');
    console.log('   - Make sure MongoDB is running locally');
    console.log('   - Check your MONGODB_URI in .env file');
    console.log('   - For local MongoDB: mongodb://localhost:27017/skillweave');
    console.log('   - For MongoDB Atlas: mongodb+srv://...');
  }
}

testConnection();
