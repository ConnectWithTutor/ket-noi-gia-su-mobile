import { Platform } from "react-native";

/**
 * Checks if the device is connected to the internet
 */
export const isConnected = async (): Promise<boolean> => {
  if (Platform.OS === "web") {
    return navigator.onLine;
  }
  
  // For native platforms, we would use NetInfo
  // Since we can't install custom packages, we'll just return true for 
  
  return true;
};

/**
 * Formats API error messages for display
 */
export const formatApiError = (error: any): string => {
  if (typeof error === "string") return error;
  
  if (error?.message) return error.message;
  
  if (error?.error) return error.error;
  
  return "An unexpected error occurred";
};

/**
 * Helper to handle API loading states and errors
 */
export const withApiHandler = async <T>(
  apiCall: () => Promise<T>,
  onSuccess: (data: T) => void,
  onError: (error: string) => void,
  onLoading?: (loading: boolean) => void
): Promise<void> => {
  try {
    onLoading?.(true);
    const data = await apiCall();
    onSuccess(data);
  } catch (error: any) {
    onError(formatApiError(error));
  } finally {
    onLoading?.(false);
  }
};