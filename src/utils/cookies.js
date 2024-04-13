import AsyncStorage from '@react-native-async-storage/async-storage';

export const setCookie = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error('Error setting cookie:', error);
  }
};

export const getCookie = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    console.error('Error getting cookie:', error);
    return null;
  }
};

export const clearCookie = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing cookie:', error);
  }
};
