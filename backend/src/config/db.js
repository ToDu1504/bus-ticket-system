const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: false,
    define: {
      timestamps: false // We will handle created_at / updated_at in models if needed, or use default but map correctly.
    }
  }
);

module.exports = sequelize;
