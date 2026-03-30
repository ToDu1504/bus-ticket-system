const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Route = sequelize.define('Route', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  origin: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  destination: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  distance_km: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  duration_min: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  base_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'routes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Route;
