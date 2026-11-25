import axios from 'axios';

export const base_url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9080';

export const clientServer = axios.create({
  baseURL: base_url,
});

export function getApiError(error, fallbackMessage = 'Something went wrong') {
  return error?.response?.data || { message: error?.message || fallbackMessage };
}
