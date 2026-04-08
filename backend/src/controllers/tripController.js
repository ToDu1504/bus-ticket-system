const { Trip, Route, Vehicle } = require('../models');
const { Op } = require('sequelize');


exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.findAll({ include: [Route, Vehicle] });
    res.status(200).json(trips);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id, { include: [Route, Vehicle] });
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.status(200).json(trip);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.searchTrips = async (req, res) => {
  try {
    const { origin, destination, date } = req.query;
    
    const tripWhere = {};
    const routeWhere = {};

    if (origin) {
      routeWhere.origin = { [Op.like]: `%${origin}%` };
    }
    if (destination) {
      routeWhere.destination = { [Op.like]: `%${destination}%` };
    }
    if (date) {
      // Filter for the entire day: from YYYY-MM-DD 00:00:00 to YYYY-MM-DD 23:59:59
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      tripWhere.departure_time = {
        [Op.between]: [startOfDay, endOfDay]
      };
    }

    const trips = await Trip.findAll({
      where: tripWhere,
      include: [
        {
          model: Route,
          where: Object.keys(routeWhere).length > 0 ? routeWhere : undefined
        },
        {
          model: Vehicle
        }
      ]
    });
    res.status(200).json(trips);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createTrip = async (req, res) => {
  try {
    const trip = await Trip.create(req.body);
    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    await trip.update(req.body);
    res.status(200).json(trip);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    await trip.destroy();
    res.status(200).json({ message: 'Trip deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
