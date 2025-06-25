import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import { CaseSensitive, CloudSnow } from 'lucide-react-native';


const BASE_URL = 'https://temucs-tzaoj.ondigitalocean.app/api/';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));



export const login = async (username, password) => {
  try {
    const response = await api.post('/users/login', { username, password });
    const { token } = response.data;

    console.log("Token dari login:", token);

    const decoded = jwtDecode(token); 
    console.log("Decoded JWT:", decoded);

    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('userData', JSON.stringify(decoded));

    return { success: true, token, user: decoded };

  } catch (error) {
    console.error('Login gagal:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Login gagal',
    };
  }
};

export const registerUser = async (payload) => {
  try {
    const response = await api.post('/users/register', payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Terjadi kesalahan validasi');
  }
};

export const verifyOtp = async ({ email, otp }) => {
  const response = await api.post('/users/verify-otp', { email, otp });
  return response.data;
};

export const verifyOtpForgot = async (email, otp) => {
  const response = await api.post('/users/verify-otp-forgot', { email, otp });
  return response.data;
};


export const resendOtp = async (email, token) => {
  try {
    const { data } = await api.post(
      '/users/resend-otp',        
      { email },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        'Terjadi kesalahan saat mengirim ulang OTP'
    );
  }
};


export const resetPassword = async ({ email, newPassword }) => {
  try {
    const response = await api.post('/users/reset-password', { email, newPassword });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Gagal terhubung ke server');
  }
};

export const forgotPassword = async (email) => {
  try {
    const { data, status } = await api.post('/users/forgot-password', { email });
    if (status !== 200) throw new Error('Terjadi kesalahan. Silakan coba lagi.');
    return data;
  } catch (err) {
    const rawMessage = err?.response?.data?.message || '';

    if (rawMessage === 'User tidak ditemukan') {
      throw new Error('Sepertinya Emailmu belum terdaftar.');
    }

    throw new Error('Gagal mengirim OTP. Silakan coba lagi nanti.');
  }
};




export const changePassword = async (token, oldPassword, newPassword) => {
  try {
    const response = await api.post(
      '/users/change-password',
      { oldPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    

    const message = error?.response?.data?.message?.toLowerCase() || '';
    if (message.includes('password lama salah')) {
      throw new Error('Password lama tidak sesuai');
    }
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error('Terjadi kesalahan saat mengubah password');
  }
};


export const getStoredUser = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) return null;

    const response = await api.get('/users/profile');
    return response.data;
  } catch (err) {
    console.error('Gagal ambil profile user:', err);
    return null;
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (err) {
    console.error('Gagal membaca token:', err);
    return null;
  }
};

export const isTokenExpired = async () => {
  try {
    const token = await getToken();
    if (!token) return true;
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch (err) {
    console.error('Gagal mengecek token:', err);
    return true;
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userData');
    return true;
  } catch (err) {
    console.error('Gagal logout:', err);
    return false;
  }
};

export const getDashboardData = async () => {
  try {
    const response = await api.get('/dashboard');
    return response.data;
  } catch (error) {
    console.error('Gagal ambil data dashboard:', error.response?.data || error.message);
    return null;
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error) {
    console.error('Gagal ambil profil:', error.response?.data || error.message);
    throw error;
  }
};

export const getAllBranches = async () => {
  try {
    const response = await api.get('/branch');
    return response.data;
  } catch (error) {
    console.error('Gagal ambil data cabang:', error.response?.data || error.message);
    throw error;
  }
};

export const getBranchById = async (branchId) => {
  try {
    const response = await api.get(`/branch/${branchId}`);
    return response.data;
  } catch (error) {
    console.error('Gagal ambil detail cabang:', error.response?.data || error.message);
    throw error;
  }
};

export const getAllServices = async () => {
  try {
    const response = await api.get('/service/user');
    return response.data;
  } catch (error) {
    console.error('Gagal ambil data layanan:', error.response?.data || error.message);
    throw error;
  }
};

export const getAllDocuments = async () => {
  try {
    const response = await api.get('/document/user');
    return response.data;
  } catch (error) {
    console.error('Gagal ambil dokumen:', error.response?.data || error.message);
    throw error;
  }
};

export const getServiceDocuments = async () => {
  try {
    const response = await api.get('/documents/by-services/user');
    return response.data;
  } catch (error) {
    console.error('Gagal ambil service-document:', error.response?.data || error.message);
    throw error;
  }
};

export const getDocumentsByServiceIds = async (serviceIds) => {
  try {
    const response = await api.post('/documents/by-services/user', { serviceIds });
    return response.data;
  } catch (error) {
    console.error('Gagal ambil dokumen by serviceIds:', error.response?.data || error.message);
    return { data: [] };
  }
};

export const bookOnlineQueue = async (payload) => {
  try {
    const response = await api.post('/queue/book-online', payload);
    return response.data;
  } catch (error) {
    //console.error('Error saat memesan antrian:', error.response?.data || error.message);
    throw error;
  }
};

export const getQueueTicketById = async (ticketId) => {
  try {
    const response = await api.get(`/queue/ticket/${ticketId}`);
    console.log(ticketId);
    console.log(response.data);
    
    
    return response.data;
  } catch (error) {
    console.error(`Gagal ambil tiket antrean dengan ID ${ticketId}:`, error.response?.data || error.message);
    throw error;
  }
};


export const getQueueHistory = async () => {
  try {
    const response = await api.get('/queue/history');
    return response.data;
  } catch (error) {
    console.error('Gagal ambil riwayat antrian:', error.response?.data || error.message);
    throw error;
  }
};

export const cancelQueueById = async (ticketId) => {
  try {
    const response = await api.patch(`/queue/${ticketId}/cancel`);
    return response.data;
  } catch (error) {
    console.error(`Gagal membatalkan antrean dengan ID ${ticketId}:`, error.response?.data || error.message);
    throw error;
  }
};

export const getAllQueues = async () => {
  try {
    const response = await api.get('/queue');
    // console.log('response dari /queue:', response.data);
    return response.data.data; 
  } catch (error) {
    console.error('Gagal mengambil data antrean:', error);
    throw error;
  }
};



