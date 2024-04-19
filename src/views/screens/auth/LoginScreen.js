import React, {useEffect, useState} from 'react';
import {TouchableOpacity, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import Background from '../../../components/Background';
import Logo from '../../../components/Logo';
import ComponentHeader from '../../../components/ComponentHeader';
import Button from '../../../components/Button';
import TextInput from '../../../components/TextInput';
import BackButton from '../../../components/BackButton';
import PasswordInput from '../../../components/PasswordInput';
import {theme} from '../../../core/theme';
import {emailValidator} from '../../helpers/emailValidator';
import {passwordValidator} from '../../helpers/passwordValidator';
import navigationStrings from '../../../consts/navigationStrings';
import {loginUser, whoAmI} from '../../../services/AuthServices';
import {checkBooked} from '../../../services/RentalService';
import {setStoredJwt} from '../../../services/AuthServices';
import {useDispatch} from 'react-redux';
import {initAuth, login, logout} from '../../../store/authSlice';
import {fetchUserAsync, setUser} from '../../../store/userSlice';
export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState({value: '', error: ''});
  const [password, setPassword] = useState({value: '', error: ''});
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUserData = async () => {
      const result = await whoAmI();
      if (result !== null) {
        if (result.id) {
          const data = {uId: result.id, rId: rental.id};
          const resp = await checkBooked(data);
          if (resp?.data === true) {
          }
        }
      }
    };
    fetchUserData();
  }, []);
  const onLoginPressed = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError) {
      setEmail({...email, error: emailError});
      setPassword({...password, error: passwordError});
      return;
    }
    setIsLoading(true);
    const userData = {email: email.value, password: password.value};
    try {
      const response = await loginUser(userData);
      const token = response?.data?.accessToken;

      if (response?.status === 401 || response?.status === 406) {
        alert(response.data);
        setIsLoading(false);
        return;
      }
      dispatch(login(token));
      if (token) {
        const response = await whoAmI();
        dispatch(setUser(response));
      }
      alert('Login Successful');
      setIsLoading(false);
      navigation.reset({
        index: 0,
        routes: [{name: 'Main'}],
      });
    } catch (error) {
      alert('Login Failed');
      setIsLoading(false);
      console.error('Login error:', error);
    }
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <ComponentHeader>Welcome back.</ComponentHeader>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={text => setEmail({value: text, error: ''})}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <PasswordInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={text => setPassword({value: text, error: ''})}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}>
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={onLoginPressed}>
        {isLoading ? 'Submitting...' : 'Login'}
      </Button>
      <View style={styles.row}>
        <Text>New to us?</Text>
        <TouchableOpacity
          onPress={() => navigation.replace(navigationStrings.SIGNUP)}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});
