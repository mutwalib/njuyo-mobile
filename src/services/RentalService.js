import axiosClient from './api/api';
const getAllRentals = async () => {
  try {
    const response = axiosClient.get(`/property/rentals`);
    console.log(response, "all rentals");
    return response;
  } catch (error) {
    console.error('Error fetching rentals:', error);
    throw error;
  }
};
export const getPagedRentals = async (page, size) => {
  try {
    const response = await axiosClient.get(
      `/property/rentals?page=${page}&size=${size}`,
    );
    if (!response.data) {
      return [];
    }
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error fetching rentals:', error);
    throw error;
  }
};
export const getMyRentals = async userId => {
  try {
    const response = await axiosClient.get(`/property/my-rentals/${userId}`);
    return response;
  } catch (error) {
    throw error;
  }
};
export const getRentalByExternalId = async externalId => {
  try {
    const response = await axiosClient.get(`/property/rental/${externalId}`);
    return response;
  } catch (error) {
    throw error;
  }
};
export const getRentalById = async id => {
  try {
    const response = await axiosClient.get(`/property/single-rental/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

const upload = (file, onUploadProgress) => {
  let formData = new FormData();
  formData.append('file', file);
  return axiosClient.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};

export const createRental = async propertyData => {
  console.log(propertyData);
  const formData = new FormData();
  const files = propertyData.files;
  formData.append('property', propertyData.property);
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }
  return axiosClient
    .post('/property/create/rental', formData, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => {
      return response;
    })
    .catch(error => {
      return error;
    });
};
export const updateRental = async updateData => {
  const formData = new FormData();
  const files = updateData.files;
  formData.append('property', updateData.property);
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }
  return axiosClient
    .put(`/property/rental/edit/${updateData.id}`, formData, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => {
      response.status === 202 ? response : null;
    })
    .catch(error => {
      return error;
    });
};
export const bookRental = async ({rentalId, userId}) => {
  return axiosClient
    .post(
      '/property/rental/book',
      {propertyId: rentalId, customerId: userId},
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    .then(response => {
      return response;
    })
    .catch(error => {
      return error;
    });
};
export const getMyBookings = async userId => {
  try {
    return axiosClient.get(`/booking/customer/${userId}`);
  } catch (error) {
    throw error;
  }
};
export const getBookingsOnRental = async rentalId => {
  return axiosClient.get(`/booking/rental/${rentalId}`);
};
export const scheduleAppointment = async appointmentData => {
  return axiosClient
    .post(
      '/booking/rental/schedule',
      {
        rentalId: appointmentData.rentalId,
        customerId: appointmentData.customerId,
        bookingId: appointmentData.bookingId,
        scheduleDate: appointmentData.scheduleDate,
        scheduleTime: appointmentData.scheduleTime,
        fulfilled: appointmentData.fulfilled,
        rescheduleCount: appointmentData.rescheduleCount,
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    .then(response => {
      return response;
    })
    .catch(error => {
      return error;
    });
};
export const cancelAppointment = async ({bookingId}) => {
  const response = await axiosClient.delete(
    `/booking/rental/appointment/delete/${bookingId}`,
  );
  return response;
};
export const receiveBooking = async bookId => {
  try {
    const response = await axiosClient.post(
      `/booking/rental/receive/${bookId}`,
    );
    return response;
  } catch (error) {
    throw error;
  }
};
export const getSchedule = async indivBooking => {
  try {
    const response = await axiosClient.post(
      `/booking/rental/appointment/${indivBooking.bookId}`,
    );
    return response;
  } catch (error) {
    throw error;
  }
};
export const getRentalsNearYou = async location => {
  try {
    const [extractedLatitude, extractedLongitude] = location
      .split(',')
      .map(Number);
    const page = 0;
    const size = 10;
    const response = await axiosClient.get(
      `/property/rental/nearest?latitude=${extractedLatitude}&longitude=${extractedLongitude}&page=${page}&size=${size}`,
    );
    if (response?.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    throw error;
  }
};
export const cancelBooking = async data => {
  try {
    const response = await axiosClient.post(
      `/booking/rental/cancel/${data.rentalId}/${data.customerId}`,
    );
    return response;
  } catch (error) {
    throw error;
  }
};
export const cancelBookingByBookingId = async data => {
  try {
    const response = await axiosClient.post(
      `/booking/rental/cancel_by_booking_id/${data.bookId}`,
    );
    return response;
  } catch (error) {
    throw error;
  }
};
export const rejectBooking = async ({bookingId, reason}) => {
  try {
    const response = await axiosClient.put(
      `/booking/rental/reject/${bookingId}/${reason}`,
    );
    return response;
  } catch (error) {
    throw error;
  }
};
export const checkBooked = async data => {
  try {
    const rentalId = data.rId;
    const userId = data.uId;
    const response = await axiosClient.post(
      `/booking/rental/checkBooked/${userId}/${rentalId}`,
    );
    return response;
  } catch (error) {}
};
export const getBooking = async data => {
  try {
    const rentalId = data.rId;
    const userId = data.uId;
    const response = await axiosClient.post(
      `/booking/rental/booking/${userId}/${rentalId}`,
    );
    return response;
  } catch (error) {}
};
export const deleteRental = async data => {
  try {
    const rentalId = data.id;
    const userId = data.userId;
    const response = await axiosClient.delete(
      `/property/rental/delete/${userId}/${rentalId}`,
    );
    return response;
  } catch (error) {
    throw error;
  }
};
export const deletePicture = async picId => {
  await axiosClient
    .delete(`/pictures/delete/rental/${picId}`)
    .then(response => {
      response.status === 204 ? response : null;
    })
    .catch(error => {
      return error;
    });
};
export const getRentalFrequencies = async () => {
  try {
    return await axiosClient.get(`/property/frequency`);
  } catch (error) {
    throw error;
  }
};
export const getProspects = async userId => {
  try {
    debugger;
    const response = await axiosClient.get(
      `/booking/rental/prospects/${userId}`,
    );
    return response;
  } catch (error) {
    throw error;
  }
};
export const addTakenRental = async data => {
  try {
    const response = await axiosClient.get(
      `/property/rental/taken/${data.customerId}/${data.rentalId}`,
    );
    return response;
  } catch (error) {
    debugger;
    return error;
  }
};
export const customerConfirmInspection = async booking => {
  try {
    const response = await axiosClient.post(
      `/property/rental/inspect/customer/${booking.customerId}/${booking.rentalId}`,
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
export const ownerConfirmInspection = async booking => {
  try {
    const response = await axiosClient.post(
      `/property/rental/inspect/owner/${booking.customerId}/${booking.rentalId}`,
    );
    return response;
  } catch (error) {
    return error.response;
  }
};
const RentalService = {
  getAllRentals,
  getRentalByExternalId,
};
export default RentalService;
