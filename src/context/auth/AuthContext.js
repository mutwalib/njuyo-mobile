import GlobalState from '../GlobalState';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const result = await api('/api/auth/signup', {
    method: 'POST',
    headers: {
      contentType: 'application/json',
    },
    data: data,
  });
  return result;
};

const login =
  dispatch =>
  async ({email, password}) => {
    try {
      const response = await axios.post(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCPrUOcTWvUSZ4n5kuTSier5YFuF2DfgQY',
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
  await AsyncStorage.removeItem('shopUserData');
  clearLogoutTimer();
  dispatch({type: LOGOUT});
};
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
