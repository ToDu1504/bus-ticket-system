const sequelize = require('../config/db');
const User = require('./User');
const Route = require('./Route');
const Vehicle = require('./Vehicle');
const Trip = require('./Trip');
const Invoice = require('./Invoice');

// Relationships

// A Trip belongs to a Route
Trip.belongsTo(Route, { foreignKey: 'route_id' });
Route.hasMany(Trip, { foreignKey: 'route_id' });

// A Trip belongs to a Vehicle
Trip.belongsTo(Vehicle, { foreignKey: 'vehicle_id' });
Vehicle.hasMany(Trip, { foreignKey: 'vehicle_id' });

// An Invoice belongs to a User
Invoice.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Invoice, { foreignKey: 'user_id' });

// An Invoice belongs to a Trip
Invoice.belongsTo(Trip, { foreignKey: 'trip_id' });
Trip.hasMany(Invoice, { foreignKey: 'trip_id' });

module.exports = {
  sequelize,
  User,
  Route,
  Vehicle,
  Trip,
  Invoice
};
