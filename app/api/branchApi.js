import axios from 'axios';
import { API_BASE_URL } from '../constants/apiConfig';

export const fetchBranches = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/branch`);
  return response.data;
};
