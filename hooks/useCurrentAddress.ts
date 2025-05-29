import * as Location from 'expo-location';

/**
 * Lấy địa chỉ hiện tại của thiết bị (chuỗi string)
 */
export interface CurrentAddressResult {
  fullAddress: string;
  latitude: number;
  longitude: number;
}

export const getCurrentAddress = async (): Promise<CurrentAddressResult> => {
  try {
    // Yêu cầu quyền truy cập vị trí
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Không được cấp quyền truy cập vị trí');
    }

    // Lấy tọa độ hiện tại
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    // Chuyển tọa độ sang địa chỉ
    const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });

    if (reverseGeocode.length > 0) {
      const place = reverseGeocode[0];
      const fullAddress = `${place.name ?? ''}, ${place.street ?? ''}, ${place.city ?? ''}, ${place.region ?? ''}, ${place.country ?? ''}`;
      return {
        fullAddress,
        latitude,
        longitude,
      };
    } else {
      throw new Error('Không tìm thấy địa chỉ từ tọa độ');
    }
  } catch (error) {
    console.error('Lỗi khi lấy địa chỉ:', error);
    throw error;
  }
};
