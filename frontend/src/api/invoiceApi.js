import axiosInstance from './axiosInstance';

export const createInvoiceApi = async (data) => (await axiosInstance.post('/invoices', data)).data;
export const getMyInvoicesApi = async () => (await axiosInstance.get('/invoices/my')).data;
export const cancelInvoiceApi = async (id) => (await axiosInstance.delete(`/invoices/${id}`)).data;
export const confirmInvoiceApi = async (id) => (await axiosInstance.put(`/invoices/${id}/confirm`)).data;


// For staff/admin
export const getAllInvoicesApi = async () => (await axiosInstance.get('/invoices')).data;
