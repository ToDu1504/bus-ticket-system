const { Invoice, Trip, User } = require('../models');

const { Op } = require('sequelize');

exports.createInvoice = async (req, res) => {
  try {
    const { trip_id, seat_number, total_price, payment_method } = req.body;
    
    // 1. Check if the trip exists and has available seats
    const trip = await Trip.findByPk(trip_id);
    if (!trip) return res.status(404).json({ message: 'Không tìm thấy chuyến xe này' });
    if (trip.available_seats <= 0) return res.status(400).json({ message: 'Chuyến xe này đã hết ghế trống!' });

    // 2. Check if the specific seat is already booked (and not cancelled)
    const existingInvoice = await Invoice.findOne({ 
      where: { 
        trip_id, 
        seat_number, 
        booking_status: { [Op.in]: ['booked', 'pending'] }
      } 
    });
    if (existingInvoice) return res.status(400).json({ message: `Ghế số ${seat_number} đã được người khác đặt. Vui lòng chọn ghế khác.` });

    // 3. Create the invoice
    const invoice = await Invoice.create({ ...req.body, user_id: req.user.id });
    
    // 4. Decrement available seats of the trip
    trip.available_seats -= 1;
    await trip.save();

    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({ include: [Trip, User] });
    res.status(200).json(invoices);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMyInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({ where: { user_id: req.user.id }, include: [Trip] });
    res.status(200).json(invoices);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.cancelInvoice = async (req, res) => {
  try {
    let invoice;
    // Admin and Staff can cancel any invoice
    if (req.user.role === 'admin' || req.user.role === 'staff') {
      invoice = await Invoice.findOne({ where: { id: req.params.id } });
    } else {
      // Customers can only cancel their own
      invoice = await Invoice.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    }

    if (!invoice) return res.status(404).json({ message: 'Không tìm thấy hóa đơn hoặc bạn không có quyền' });
    if (invoice.booking_status === 'cancelled') return res.status(400).json({ message: 'Vé này đã được hủy trước đó' });
    
    // 1. Mark invoice as cancelled
    invoice.booking_status = 'cancelled';
    invoice.cancelled_at = new Date();
    await invoice.save();

    // 2. Increment available seats of the trip (give the seat back)
    const trip = await Trip.findByPk(invoice.trip_id);
    if (trip) {
      trip.available_seats += 1;
      await trip.save();
    }

    res.status(200).json({ message: 'Đã hủy vé thành công', invoice });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.confirmInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ where: { id: req.params.id } });
    if (!invoice) return res.status(404).json({ message: 'Không tìm thấy hóa đơn' });
    if (invoice.booking_status !== 'pending') return res.status(400).json({ message: 'Hóa đơn không ở trạng thái chờ xác nhận' });
    
    invoice.booking_status = 'booked';
    invoice.payment_status = 'paid'; // Optionally mark as paid when confirmed
    await invoice.save();

    res.status(200).json({ message: 'Đã xác nhận vé thành công', invoice });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
