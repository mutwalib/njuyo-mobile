import axiosClient, {bURL} from './api/api';
import axios from 'axios';
// import {Jwt} from 'jsonwebtoken';
import {getCookie, setCookie, clearCookie} from '../utils/cookies';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const loginUser = async formData => {
  console.log(formData);
  return await axiosClient
    .post(
      `/auth/signin`,
      JSON.stringify({
        phoneOrEmail: formData.email,
        password: formData.password,
      }),
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
    .then(response => {
      return response;
    })
    .catch(error => {
      return error.response;
    });
};
export const registerUser = async data => {
  return await axiosClient
    .post(
      `/auth/signup`,
      JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        password: data.password,
        isMobileAccess: data.isMobileAccess,
      }),
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
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
export const applyForAgentRole = async ({userId, roleName}) => {
  return await axiosClient.post(
    `/users/apply-role`,
    {
      userId: userId,
      roleName: roleName,
    },
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  );
};
export const getApplyAgent = async userId => {
  try {
    const response = await axiosClient.get(`/users/applied-role/${userId}`);
    return response;
  } catch (error) {
    return error;
  }
};
export const whoAmI = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      return null;
    }
    const response = await axios.get(bURL + `/api/users/me`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });
    return response.data;
  } catch (e) {
    console.log('e:', e);
    return null;
  }
};
export const isStoredJwt = () => Boolean(localStorage.getItem('token'));
export const setStoredJwt = async accessToken =>
  setCookie('token', accessToken, 365); // 365 days expiry
// export function verifyToken(jwtToken) {
//   try {
//     return Jwt.verifyToken(jwtToken, SECRET_KEY);
//   } catch (e) {
//     console.log('e:', e);
//     return e;
//   }
// }
export const logOut = async () => {
  try {
    const token = getCookie('token');
    if (!token) {
      return null;
    }
    const response = await axios.post(bURL + `/api/auth/logout`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    });
    clearCookie('token');
    return response;
  } catch (error) {
    console.error();
  }
};
export const handleGoogleLogin = async googleData => {
  try {
    const response = await axiosClient.post(
      `/auth/google-login`,
      JSON.stringify({
        accessToken: googleData.accessToken,
      }),
    );
    return response;
  } catch (error) {
    return console.error();
  }
};
export const forgotPassword = async email => {
  try {
    debugger;
    const response = await axiosClient.post(`/auth/forgot-password`, {email});
    return response;
  } catch (error) {
    return console.error();
  }
};
export const checkSecureToken = async token => {
  try {
    const response = await axiosClient.post(`/auth/token-validation`, {
      secureToken: token,
    });
    return response;
  } catch (error) {
    return console.error();
  }
};
export const validateEmail = async token => {
  try {
    const response = await axiosClient.get(`/auth/email-validation/${token}`);
    debugger;
    return response;
  } catch (error) {
    return error;
  }
};
export const updatePassword = async data => {
  try {
    const response = await axiosClient.post(
      `/auth/update-password`,
      JSON.stringify({secureToken: data.token, password: data.newPassword}),
    );
    return response;
  } catch (error) {
    return console.error();
  }
};
