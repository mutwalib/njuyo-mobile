import axiosClient from './api/api';

export const rentalPictures = async (imageNames) => {
  try {
    const response = await axiosClient.post(`/pictures/rental/all`, imageNames);
    return response.data;
  } catch (error) {
    throw error;
  }
};
