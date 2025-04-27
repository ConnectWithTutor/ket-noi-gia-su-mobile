//API gọi dữ liệu
// Hook này sử dụng axios để gọi API và trả về dữ liệu, trạng thái loading và lỗi nếu có
import { useEffect, useState } from 'react';
import axios from 'axios';
import Constants from 'expo-constants';

// Lấy thông tin từ config (app.config.js)
const { apiBaseUrl, apiKey } = Constants.expoConfig?.extra || {};

// Kiểm tra cấu hình API base URL
if (!apiBaseUrl) {
  console.warn("⚠️ API base URL is not defined in app.config.js (extra.apiBaseUrl)");
}

// Tạo instance axios
const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    Authorization: `Bearer ${apiKey ?? ''}`,
    'Content-Type': 'application/json',
  },
});

// Định nghĩa kiểu kết quả trả về của hook
interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Hook useFetch dùng generic type T cho dữ liệu động
const useFetch = <T>(url: string): FetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await api.get(url);
        if (isMounted) {
          setData(response.data);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Clean-up function để tránh memory leak
    return () => {
      isMounted = false;
    };
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
