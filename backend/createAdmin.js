const bcrypt = require('bcryptjs');
const { User } = require('./src/models');

async function createAdmin() {
  try {
    const existingAdmin = await User.findOne({ where: { email: 'admin@system.com' } });
    if (existingAdmin) {
      console.log('Admin already exists: admin@system.com / admin123');
      process.exit(0);
    }
    
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('admin123', salt);
    
    await User.create({
      full_name: 'System Administrator',
      email: 'admin@system.com',
      phone: '0123456789',
      password: password,
      role: 'admin',
      is_active: true
    });
    console.log('Admin account created successfully: admin@system.com / admin123');
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err);
    process.exit(1);
  }
}

createAdmin();
