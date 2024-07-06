import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import {Text} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import RNPickerSelect from 'react-native-picker-select';
import Background from '../../../components/Background';
import Logo from '../../../components/Logo';
import ComponentHeader from '../../../components/ComponentHeader';
import Button from '../../../components/Button';
import TextInput from '../../../components/TextInput';
import BackButton from '../../../components/BackButton';
import {theme} from '../../../core/theme';
import {emailValidator} from '../../helpers/emailValidator';
import {passwordValidator} from '../../helpers/passwordValidator';
import {firstNameValidator} from '../../helpers/firstNameValidator';
import navigationStrings from '../../../consts/navigationStrings';
import {lastNameValidator} from '../../helpers/lastNameValidator';
import {phoneValidator} from '../../helpers/phoneValidator';
import {otpValidator} from '../../helpers/otpValidator';
import OtpInputs from 'react-native-otp-inputs';
import RNOtpVerify from 'react-native-otp-verify';
import COLORS from '../../../consts/colors';
import {
  checkEmailPhoneExistence,
  generateEmailOtp,
  validateOtp,
} from '../../../services/AuthServices';

export default function RegisterScreen({navigation}) {
  const [step, setStep] = useState(1); // Track current step of registration
  const [firstName, setFirstName] = useState({value: '', error: ''});
  const [lastName, setLastName] = useState({value: '', error: ''});
  const [contact, setContact] = useState({value: '', error: ''});
  const [contactType, setContactType] = useState(''); // To store whether it's an email or phone
  const [resendCountdown, setResendCountdown] = useState(10);
  const [canResend, setCanResend] = useState(false);
  const [phone, setPhone] = useState({
    value: '+256',
    label: 'Uganda UG (+256)',
    error: '',
  });
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState({value: '', error: ''});
  const [otp, setOtp] = useState({value: '', error: ''});
  const [verificationId, setVerificationId] = useState(null);
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    RNOtpVerify.getOtp()
      .then(p => RNOtpVerify.addListener(otpHandler))
      .catch(p => console.log(p));

    return () => RNOtpVerify.removeListener();
  }, []);
  const otpHandler = message => {
    if (message) {
      const otpMatch = /(\d{6})/g.exec(message);
      if (otpMatch && otpMatch[1]) {
        const otp = otpMatch[1];
        setOtp({value: otp, error: ''});
      } else {
        setOtp({value: '', error: 'No OTP received'});
      }
    } else {
      setOtp({value: '', error: 'Message not received yet'});
    }
  };
  const checkEmailAlreadyThere = async email => {
    const response = await checkEmailPhoneExistence(email);
    return response;
  };
  const checkPhoneAlreadyThere = async phone => {
    const response = await checkEmailPhoneExistence(phone);
    return response;
  };
  useEffect(() => {
    fetch('https://restcountries.com/v2/all')
      .then(response => response.json())
      .then(data => {
        const countryData = data.map(country => ({
          label:
            country.name +
            ' ' +
            country.alpha2Code +
            ` (+` +
            country.callingCodes[0] +
            `)`,
          value: country.callingCodes[0] ? `+${country.callingCodes[0]}` : '',
          key: country.alpha2Code,
        }));
        setCountries(countryData);
      })
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    const isEmail = contact.value.includes('@');
    setContactType(isEmail ? 'email' : 'phone');
  }, [contact.value]);

  const onNextStep = async () => {
    switch (step) {
      case 1: // Determine if contact is email or phone
        const contactError =
          contactType === 'email'
            ? emailValidator(contact.value)
            : phoneValidator(contact.value);
        if (contactError) {
          setContact({...contact, error: contactError});
          return;
        }
        Keyboard.dismiss();
        setLoading(true);
        if (contactType === 'email') {
          const result = await checkEmailAlreadyThere(contact.value);
          if (result.status === 200) {
            setContact({...contact, error: result.data});
            setLoading(false);
            return;
          }
          const resp = await generateEmailOtp(contact.value);
          console.log('resp', resp);
          setTimeout(() => {
            setLoading(false);
            ToastAndroid.show(
              'OTP sent to your email at ' + contact.value,
              ToastAndroid.LONG,
            );
            setStep(2);
            startResendCountdown();
          }, 1000);
        } else if (contactType === 'phone') {
          const result = await checkPhoneAlreadyThere(contact.value);
          if (result.status === 200) {
            setContact({...contact, error: result.data});
            setLoading(false);
            return;
          }
          const confirmation = await auth().signInWithPhoneNumber(
            contact.value,
          );
          setVerificationId(confirmation.verificationId);
          setLoading(false);
          ToastAndroid.show('OTP sent to your phone', ToastAndroid.LONG);
          setStep(2);
          startResendCountdown();
        }
        setStep(2);
        break;
      case 2: // Validate OTP
        const otpError = otpValidator(otp.value);
        if (otpError) {
          setOtp({...otp, error: otpError});
          return;
        }
        if (!otp.value || otp.value.length !== 6) {
          setOtp({...otp, error: 'Please enter a valid 6-digit OTP'});
          return;
        }

        try {
          Keyboard.dismiss();
          if (contactType === 'email') {
            const resp = await validateOtp({
              email: contact.value,
              otp: otp.value,
            });
            if (resp.status === 200) {
              Alert.alert('Email verified');
            } else {
              Alert.alert('Invalid OTP, please try again');
              return;
            }
            setTimeout(() => {
              setStep(3);
            }, 1000);
          } else if (contactType === 'phone') {
            const credential = auth.PhoneAuthProvider.credential(
              verificationId,
              otp.value,
            );
            await auth().signInWithCredential(credential);
            Alert.alert('Phone number verified');
            setStep(3);
          }
        } catch (error) {
          Alert.alert('Invalid OTP, please try again');
          return;
        }
        break;
      case 3: // Prompt user for first name, last name, and password
        const firstNameError = firstNameValidator(firstName.value);
        const lastNameError = lastNameValidator(lastName.value);
        const passwordError = passwordValidator(password.value);
        if (firstNameError || lastNameError || passwordError) {
          setFirstName({...firstName, error: firstNameError});
          setLastName({...lastName, error: lastNameError});
          setPassword({...password, error: passwordError});
          return;
        }
        setStep(4);
        break;
      case 4: // Prompt for the other contact method
        if (contactType === 'email') {
          const phoneError = phoneValidator(phone.value);
          if (phoneError) {
            setPhone({...phone, error: phoneError});
            return;
          }
          setLoading(true);
          const confirmation = await auth().signInWithPhoneNumber(phone.value);
          setVerificationId(confirmation.verificationId);
          setLoading(false);
          ToastAndroid.show('OTP sent to your phone', ToastAndroid.SHORT);
          setStep(5);
        } else if (contactType === 'phone') {
          const emailError = emailValidator(contact.value);
          if (emailError) {
            setContact({...contact, error: emailError});
            return;
          }
          const resp = await generateEmailOtp(contact.value);
          console.log('resp', resp);
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            Alert.alert('OTP sent to your email');
            setStep(6);
          }, 1000);
        }
        break;
      case 5:
        const otpError2 = otpValidator(otp.value);
        if (otpError2) {
          setOtp({...otp, error: otpError2});
          return;
        }
        try {
          Keyboard.dismiss();
          if (contactType === 'email') {
            const resp = await validateOtp({
              email: contact.value,
              otp: otp.value,
            });
            if (resp.status === 200) {
              Alert.alert('Email verified');
            } else {
              Alert.alert('Invalid OTP, please try again');
              return;
            }
            setTimeout(async () => {
              await submitForm();
              navigation.reset({
                index: 0,
                routes: [{name: navigationStrings.AUTH}],
              });
            }, 1000);
          } else if (contactType === 'phone') {
            const credential = auth.PhoneAuthProvider.credential(
              verificationId,
              otp.value,
            );
            await auth().signInWithCredential(credential);
            await submitForm();
            navigation.reset({
              index: 0,
              routes: [{name: navigationStrings.AUTH}],
            });
          }
        } catch (error) {
          Alert.alert('Invalid OTP, please try again');
        }
        break;
      default:
        break;
    }
  };

  const onPrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const submitForm = async () => {
    const data = {
      firstName: firstName.value,
      lastName: lastName.value,
      phone: phone.value,
      email: contactType === 'email' ? contact.value : email.value,
      password: password.value,
      isMobileAccess: true,
    };
    console.log('data: ', data);
    const result = await registerUser(data);
    console.log('result', result);
    if (result?.status === 201) {
      Alert.alert(result?.response?.data?.message);
    } else {
      Alert.alert(result?.response?.data?.message);
      return;
    }
  };

  const selectCountry = phoneCode => {
    setPhone({value: phoneCode, error: ''});
  };
  const onResendOtp = async () => {
    setCanResend(false);
    startResendCountdown();
    if (contactType === 'email') {
      const resp = await generateEmailOtp(contact.value);
      if (resp.status === 200) {
        ToastAndroid.show('OTP resent to your email', ToastAndroid.LONG);
      } else {
        Alert.alert('Error resending OTP. Please try again.');
      }
    } else if (contactType === 'phone') {
      const confirmation = await auth().signInWithPhoneNumber(contact.value);
      setVerificationId(confirmation.verificationId);
      ToastAndroid.show('OTP resent to your phone', ToastAndroid.LONG);
    }
  };
  const startResendCountdown = () => {
    setResendCountdown(10);
    const interval = setInterval(() => {
      setResendCountdown(prevCountdown => {
        if (prevCountdown <= 1) {
          clearInterval(interval);
          setCanResend(true);
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };
  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <ComponentHeader>Create Account</ComponentHeader>
      {step === 1 && (
        <TextInput
          label="Email or Phone"
          returnKeyType="next"
          value={contact.value}
          onChangeText={text => setContact({value: text, error: ''})}
          error={!!contact.error}
          errorText={contact.error}
          autoCapitalize="none"
          autoCompleteType="email"
        />
      )}
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={COLORS.dark} />
        </View>
      )}
      {step === 2 && (
        <>
          <Text style={styles.otpLabel}>Enter OTP</Text>
          <OtpInputs
            autofillFromClipboard
            autofillListenerIntervalMS={400}
            autoFocus
            handleChange={code => setOtp({value: code, error: ''})}
            numberOfInputs={6}
            style={styles.otpContainer}
            inputStyles={styles.otpInput}
          />
          {!!otp.error && <Text style={styles.errorText}>{otp.error}</Text>}
          <View style={styles.resendContainer}>
            <Text>Resend OTP in {resendCountdown} seconds</Text>
            <TouchableOpacity
              onPress={onResendOtp}
              disabled={!canResend}
              style={styles.resendButton}>
              <Text style={{color: canResend ? COLORS.primary : COLORS.gray}}>
                Resend OTP
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {step === 3 && (
        <>
          <TextInput
            label="First Name"
            returnKeyType="next"
            value={firstName.value}
            onChangeText={text => setFirstName({value: text, error: ''})}
            error={!!firstName.error}
            errorText={firstName.error}
          />
          <TextInput
            label="Last Name"
            returnKeyType="next"
            value={lastName.value}
            onChangeText={text => setLastName({value: text, error: ''})}
            error={!!lastName.error}
            errorText={lastName.error}
          />
          <TextInput
            label="Password"
            returnKeyType="done"
            value={password.value}
            onChangeText={text => setPassword({value: text, error: ''})}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry
          />
        </>
      )}
      {step === 4 && (
        <>
          {contactType === 'email' ? (
            <RNPickerSelect
              onValueChange={value => selectCountry(value)}
              items={countries}
              placeholder={{label: 'Uganda UG (+256)', value: null}}
              style={pickerSelectStyles}
            />
          ) : (
            <TextInput
              label="Email"
              returnKeyType="next"
              value={contact.value}
              onChangeText={text => setContact({value: text, error: ''})}
              error={!!contact.error}
              errorText={contact.error}
              autoCapitalize="none"
              autoCompleteType="email"
              textContentType="emailAddress"
              keyboardType="email-address"
            />
          )}
          <TextInput
            label="Phone"
            returnKeyType="next"
            value={phone.value}
            onChangeText={text => setPhone({value: text, error: ''})}
            error={!!phone.error}
            errorText={phone.error}
            autoCapitalize="none"
            autoCompleteType="tel"
            keyboardType="phone-pad"
          />
        </>
      )}
      {step === 5 && (
        <>
          <Text style={styles.otpLabel}>Enter OTP</Text>
          <OtpInputs
            autofillFromClipboard
            autofillListenerIntervalMS={400}
            autoFocus
            handleChange={code => setOtp({value: code, error: ''})}
            numberOfInputs={6}
            style={styles.otpContainer}
            inputStyles={styles.otpInput}
          />
          {!!otp.error && <Text style={styles.errorText}>{otp.error}</Text>}

          <View style={styles.resendContainer}>
            <Text>Resend OTP in {resendCountdown} seconds</Text>
            <TouchableOpacity
              onPress={onResendOtp}
              disabled={!canResend}
              style={styles.resendButton}>
              <Text style={{color: canResend ? COLORS.primary : COLORS.gray}}>
                Resend OTP
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      <View style={styles.buttonContainer}>
        {step > 1 && (
          <Button
            mode="contained"
            onPress={onPrevious}
            style={{width: '49%', marginHorizontal: 4}}>
            Previous
          </Button>
        )}
        <Button
          mode="contained"
          onPress={onNextStep}
          style={[
            styles.button,
            {width: step === 1 ? '100%' : '49%', marginHorizontal: 4},
          ]}>
          {step === 5 ? 'Sign Up' : step === 2 ? 'Verify OTP' : 'Next'}
        </Button>
      </View>

      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity
          onPress={() => navigation.replace(navigationStrings.SIGNIN)}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    marginHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  otpInput: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
    width: 40,
    marginRight: 4,
    textAlign: 'center',
    fontSize: 18,
  },
  otpLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.colors.text,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.error,
    marginTop: 4,
  },
  loader: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  resendButton: {
    padding: 8,
  },
});
