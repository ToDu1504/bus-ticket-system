import axiosInstance from './axiosInstance';

export const loginApi = async (data) => {
  const response = await axiosInstance.post('/auth/login', data);
  return response.data;
};

export const registerApi = async (data) => {
  const response = await axiosInstance.post('/auth/register', data);
  return response.data;
};

export const getProfileApi = async () => (await axiosInstance.get('/auth/profile')).data;
export const updateProfileApi = async (data) => (await axiosInstance.put('/auth/profile', data)).data;
export const changePasswordApi = async (data) => (await axiosInstance.put('/auth/change-password', data)).data;

