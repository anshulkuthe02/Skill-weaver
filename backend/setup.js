#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up SkillWeave Backend...\n');

// Create required directories
const directories = [
  'uploads',
  'uploads/images',
  'uploads/avatars',
  'uploads/portfolios',
  'logs'
];

console.log('📁 Creating directories...');
directories.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`   ✅ Created: ${dir}`);
  } else {
    console.log(`   ✓ Exists: ${dir}`);
  }
});

// Check if .env file exists
console.log('\n🔧 Checking environment configuration...');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('   ✅ .env file found');
} else {
  console.log('   ⚠️ .env file not found');
  console.log('   Please copy and configure the .env file with your settings');
}

// Check Node.js version
console.log('\n🔍 Checking system requirements...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion >= 16) {
  console.log(`   ✅ Node.js version: ${nodeVersion} (OK)`);
} else {
  console.log(`   ❌ Node.js version: ${nodeVersion} (Minimum v16 required)`);
}

// Display next steps
console.log('\n🎯 Next Steps:');
console.log('   1. Configure your .env file with required settings');
console.log('   2. Ensure MongoDB is running');
console.log('   3. Run: npm install');
console.log('   4. Run: npm run seed (optional - to populate templates)');
console.log('   5. Run: npm run dev');

console.log('\n📚 Important Environment Variables:');
console.log('   - MONGODB_URI: Your MongoDB connection string');
console.log('   - JWT_SECRET: Secret key for JWT tokens');
console.log('   - OPENAI_API_KEY: Your OpenAI API key for AI features');
console.log('   - FRONTEND_URL: Your frontend application URL (default: http://localhost:8081)');

console.log('\n✨ Setup complete! Happy coding! ✨\n');
