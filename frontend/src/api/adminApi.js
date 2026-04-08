import axiosInstance from './axiosInstance';

// Vehicles
export const getVehiclesApi = async () => (await axiosInstance.get('/vehicles')).data;
export const createVehicleApi = async (data) => (await axiosInstance.post('/vehicles', data)).data;
export const deleteVehicleApi = async (id) => (await axiosInstance.delete(`/vehicles/${id}`)).data;

// Routes
export const getRoutesApi = async () => (await axiosInstance.get('/routes')).data;
export const createRouteApi = async (data) => (await axiosInstance.post('/routes', data)).data;
export const deleteRouteApi = async (id) => (await axiosInstance.delete(`/routes/${id}`)).data;

// Trips
export const getTripsApi = async () => (await axiosInstance.get('/trips')).data;
export const createTripApi = async (data) => (await axiosInstance.post('/trips', data)).data;
export const deleteTripApi = async (id) => (await axiosInstance.delete(`/trips/${id}`)).data;

// Users
export const getUsersApi = async () => (await axiosInstance.get('/users')).data;
export const updateUserRoleApi = async (id, role) => (await axiosInstance.put(`/users/${id}/role`, { role })).data;
export const deleteUserApi = async (id) => (await axiosInstance.delete(`/users/${id}`)).data;

// Statistics
export const getStatsOverviewApi = async (params) => (await axiosInstance.get('/stats/overview', { params })).data;
export const getRevenueByMonthApi = async () => (await axiosInstance.get('/stats/revenue-by-month')).data;
export const getTopRoutesApi = async (params) => (await axiosInstance.get('/stats/top-routes', { params })).data;
export const getBookingStatusApi = async (params) => (await axiosInstance.get('/stats/booking-status', { params })).data;
export const getRecentInvoicesApi = async () => (await axiosInstance.get('/stats/recent-invoices')).data;
