const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const routeRoutes = require('./routes/route.routes');
const vehicleRoutes = require('./routes/vehicle.routes');
const tripRoutes = require('./routes/trip.routes');
const invoiceRoutes = require('./routes/invoice.routes');
const statsRoutes = require('./routes/stats.routes');

// Root endpoint for testing
app.get('/', (req, res) => {
  res.send('Bus Ticket Management API is running...');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/stats', statsRoutes);

module.exports = app;
