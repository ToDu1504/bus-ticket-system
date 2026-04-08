import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import SearchTrip from '../pages/customer/SearchTrip';
import BookTicket from '../pages/customer/BookTicket';
import StaffDashboard from '../pages/staff/StaffDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';

import AdminLayout from '../components/layout/AdminLayout';
import ManageVehicles from '../pages/admin/ManageVehicles';
import ManageRoutes from '../pages/admin/ManageRoutes';
import ManageTrips from '../pages/admin/ManageTrips';
import ManageUsers from '../pages/admin/ManageUsers';
import ManageStats from '../pages/admin/ManageStats';
import Profile from '../pages/customer/Profile';
import InvoiceHistory from '../pages/customer/InvoiceHistory';

const AppRouter = () => {
  return (
    <Routes>
      {/* App.jsx provides the base layout for these */}
      <Route path="/" element={<SearchTrip />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer Routes (and above) */}
      <Route element={<PrivateRoute allowedRoles={['customer', 'staff', 'admin']} />}>
        <Route path="/book" element={<BookTicket />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-invoices" element={<InvoiceHistory />} />
      </Route>

      {/* Staff Routes (and above) */}
      <Route element={<PrivateRoute allowedRoles={['staff', 'admin']} />}>
        <Route path="/staff" element={<StaffDashboard />} />
      </Route>

      {/* Modern Admin Routes with Layout */}
      <Route element={<PrivateRoute allowedRoles={['admin']} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/vehicles" element={<ManageVehicles />} />
          <Route path="/admin/routes" element={<ManageRoutes />} />
          <Route path="/admin/trips" element={<ManageTrips />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/stats" element={<ManageStats />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;
