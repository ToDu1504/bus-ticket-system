const { Invoice, Trip, Route, User, Vehicle } = require('../models');
const { Op, fn, col, literal } = require('sequelize');
const sequelize = require('../config/db');

const getDateRange = (startDate, endDate) => {
  const where = {};
  if (startDate && endDate) {
    where.created_at = { [Op.between]: [new Date(startDate), new Date(endDate)] };
  } else if (startDate) {
    where.created_at = { [Op.gte]: new Date(startDate) };
  } else if (endDate) {
    where.created_at = { [Op.lte]: new Date(endDate) };
  }
  return where;
};

exports.getOverview = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateWhere = getDateRange(startDate, endDate);
    const [totalUsers, totalRoutes, totalVehicles, totalTrips, invoiceStats] = await Promise.all([
      User.count(),
      Route.count(),
      Vehicle.count(),
      Trip.count(),
      Invoice.findAll({
        attributes: [
          [fn('COUNT', col('id')), 'totalBookings'],
          [fn('SUM', col('total_price')), 'totalRevenue'],
          [fn('SUM', literal(`CASE WHEN booking_status = 'booked' THEN 1 ELSE 0 END`)), 'confirmedBookings'],
          [fn('SUM', literal(`CASE WHEN booking_status = 'cancelled' THEN 1 ELSE 0 END`)), 'cancelledBookings'],
          [fn('SUM', literal(`CASE WHEN booking_status = 'pending' THEN 1 ELSE 0 END`)), 'pendingBookings'],
          [fn('SUM', literal(`CASE WHEN booking_status = 'booked' THEN total_price ELSE 0 END`)), 'confirmedRevenue'],
        ],
        where: dateWhere,
        raw: true
      })
    ]);
    const inv = invoiceStats[0];
    res.json({
      totalUsers, totalRoutes, totalVehicles, totalTrips,
      totalBookings: parseInt(inv.totalBookings) || 0,
      totalRevenue: parseFloat(inv.totalRevenue) || 0,
      confirmedBookings: parseInt(inv.confirmedBookings) || 0,
      cancelledBookings: parseInt(inv.cancelledBookings) || 0,
      pendingBookings: parseInt(inv.pendingBookings) || 0,
      confirmedRevenue: parseFloat(inv.confirmedRevenue) || 0,
    });
  } catch (err) {
    console.error('Stats Overview Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRevenueByMonth = async (req, res) => {
  try {
    const results = await Invoice.findAll({
      attributes: [
        [fn('YEAR', col('created_at')), 'year'],
        [fn('MONTH', col('created_at')), 'month'],
        [fn('SUM', col('total_price')), 'revenue'],
        [fn('COUNT', col('id')), 'bookings'],
      ],
      where: {
        booking_status: { [Op.in]: ['booked', 'pending'] },
        created_at: { [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 11)) }
      },
      group: [fn('YEAR', col('created_at')), fn('MONTH', col('created_at'))],
      order: [[fn('YEAR', col('created_at')), 'ASC'], [fn('MONTH', col('created_at')), 'ASC']],
      raw: true
    });
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push({ year: d.getFullYear(), month: d.getMonth() + 1 });
    }
    const data = months.map(({ year, month }) => {
      const found = results.find(r => parseInt(r.year) === year && parseInt(r.month) === month);
      return {
        label: `${String(month).padStart(2, '0')}/${year}`,
        revenue: found ? parseFloat(found.revenue) : 0,
        bookings: found ? parseInt(found.bookings) : 0,
      };
    });
    res.json(data);
  } catch (err) {
    console.error('Revenue Stats Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTopRoutes = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateWhere = getDateRange(startDate, endDate);
    const results = await Invoice.findAll({
      attributes: [
        [fn('COUNT', col('Invoice.id')), 'bookings'],
        [fn('SUM', col('Invoice.total_price')), 'revenue'],
      ],
      include: [{
        model: Trip,
        attributes: [],
        required: true,
        include: [{
          model: Route,
          attributes: ['origin', 'destination'],
          required: true
        }]
      }],
      where: { ...dateWhere, booking_status: { [Op.in]: ['booked', 'pending'] } },
      group: ['Trip.Route.id'],
      order: [[fn('SUM', col('Invoice.total_price')), 'DESC']],
      limit: 5,
      raw: true
    });
    const data = results.map(r => ({
      route: `${r['Trip.Route.origin']} → ${r['Trip.Route.destination']}`,
      bookings: parseInt(r.bookings),
      revenue: parseFloat(r.revenue),
    }));
    res.json(data);
  } catch (err) {
    console.error('Top Routes Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getBookingStatus = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateWhere = getDateRange(startDate, endDate);
    const results = await Invoice.findAll({
      attributes: ['booking_status', [fn('COUNT', col('id')), 'count']],
      where: dateWhere,
      group: ['booking_status'],
      raw: true
    });
    const data = { booked: 0, pending: 0, cancelled: 0 };
    results.forEach(r => { data[r.booking_status] = parseInt(r.count); });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRecentInvoices = async (req, res) => {
  try {
    // Truy vấn đơn giản nhất để debug lỗi 500
    const invoices = await Invoice.findAll({
      include: [
        { model: User, attributes: ['id', 'full_name', 'email'] },
        { 
          model: Trip, 
          attributes: ['id', 'departure_time'],
          include: [{ model: Route, attributes: ['origin', 'destination'] }] 
        }
      ],
      order: [['id', 'DESC']], // Sử dụng ID để tránh lỗi ambiguous 'created_at'
      limit: 10
    });
    res.json(invoices);
  } catch (err) {
    console.error('FATAL ERROR getRecentInvoices:', err);
    res.status(500).json({ message: 'Server error', detail: err.message });
  }
};
