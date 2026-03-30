import axiosInstance from './axiosInstance';

export const searchTripsApi = async (params) => {
  const response = await axiosInstance.get('/trips/search', { params });
  return response.data;
};
