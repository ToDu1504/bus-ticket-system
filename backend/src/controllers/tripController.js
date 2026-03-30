const { Trip, Route, Vehicle } = require('../models');

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
    // simplified search, return all. Expand later based on req.query
    const trips = await Trip.findAll({ include: [Route, Vehicle] });
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
