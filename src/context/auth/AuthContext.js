import axios from 'axios';
import axiosInstance from '../../services/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalState from '../GlobalState';
import {LOGOUT, LOCAL_LOGIN, LOGIN, SIGNUP} from './types';
const initialState = {
  token: null,
  userId: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case LOCAL_LOGIN:
    case LOGIN:
      return {
        ...state,
        token: action.payload.token,
        userId: action.payload.userId,
      };
    case LOGOUT:
      return {
        ...state,
        token: null,
        userId: null,
      };
    default:
      return state;
  }
};
const tryLocalLogin = dispatch => async () => {
  try {
    const data = await AsyncStorage.getItem('userData');
    const userData = JSON.parse(data);
    const expirationDate = new Date(userData?.expirationDate);

    if (
      userData?.token &&
      userData?.userId &&
      !(expirationDate <= new Date())
    ) {
      dispatch({
        type: LOCAL_LOGIN,
        payload: {token: userData.token, userId: userData.userId},
      });
      const remainingTime = expirationDate.getTime() - new Date().getTime();
      setLogoutTimer(remainingTime, dispatch);
    }
  } catch (err) {
    console.log(err);
  }
};

const signUp = async data => {
  try {
    const result = await axiosInstance('/api/auth/signup', {
      method: 'POST',
      headers: {
        contentType: 'application/json',
      },
      data: data,
    });
    return result;
  } catch (err) {
    console.log(err);
  }
};

const login =
  dispatch =>
  async ({email, password}) => {
    try {
      const response = await axios.post(
        '',
        {email, password, returnSecureToken: true},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const expirationDate = new Date(
        new Date().getTime() + parseInt(response.data.expiresIn) * 1000,
      );

      console.log(expirationDate);
      saveDataToStorage(
        response.data.idToken,
        response.data.localId,
        expirationDate,
      );

      dispatch({
        type: LOGIN,
        payload: {token: response.data.idToken, userId: response.data.localId},
      });
      setLogoutTimer(parseInt(response.data.expiresIn) * 1000, dispatch);

      console.log('SUCCESS: ', response.data);
    } catch (err) {
      console.log('ERROR: ', err.response.data);
      throw err;
    }
  };

const logout = dispatch => async () => {
  await AsyncStorage.removeItem('userData');
  clearLogoutTimer();
  dispatch({type: LOGOUT});
};

let logoutTimer;

const setLogoutTimer = (expirationDate, dispatch) => {
  logoutTimer = setTimeout(() => {
    dispatch({type: LOGOUT});
  }, expirationDate);
};

const clearLogoutTimer = () => {
  if (logoutTimer) {
    clearTimeout(logoutTimer);
  }
};

const saveDataToStorage = async (token, userId, expirationDate) => {
  await AsyncStorage.setItem(
    'userData',
    JSON.stringify({
      token,
      userId,
      expirationDate: expirationDate.toISOString(),
    }),
  );
};

export const {Context, Provider} = GlobalState(authReducer, initialState, {
  signUp,
  login,
  tryLocalLogin,
  logout,
});
