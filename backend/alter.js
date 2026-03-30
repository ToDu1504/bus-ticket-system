const sequelize = require('./src/config/db');

async function alterDb() {
  try {
    console.log('Altering booking_status ENUM...');
    await sequelize.query("ALTER TABLE invoices MODIFY COLUMN booking_status ENUM('pending', 'booked', 'cancelled') DEFAULT 'pending';");
    console.log('Success!');
    process.exit(0);
  } catch (err) {
    console.error('Error altering table:', err.message);
    process.exit(1);
  }
}

alterDb();
