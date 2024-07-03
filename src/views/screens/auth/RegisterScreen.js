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
import COLORS from '../../../consts/colors';

export default function RegisterScreen({navigation}) {
  const [step, setStep] = useState(1); // Track current step of registration
  const [firstName, setFirstName] = useState({value: '', error: ''});
  const [lastName, setLastName] = useState({value: '', error: ''});
  const [email, setEmail] = useState({value: '', error: ''});
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
  // const [selectedCountry, setSelectedCountry] = useState({
  //   name: 'Uganda',
  //   phoneCode: '+256',
  // });

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

  const onNextStep = async () => {
    switch (step) {
      case 1: // Validate and proceed to next step
        const firstNameError = firstNameValidator(firstName.value);
        const lastNameError = lastNameValidator(lastName.value);
        if (firstNameError || lastNameError) {
          setFirstName({...firstName, error: firstNameError});
          setLastName({...lastName, error: lastNameError});
          return;
        }
        setStep(2);
        break;
      case 2: // Validate and proceed to next step
        const phoneError = phoneValidator(phone.value);
        if (phoneError) {
          setPhone({...phone, error: phoneError});
          return;
        }
        // Send OTP using Firebase
        try {
          Keyboard.dismiss();
          setLoading(true);
          const confirmation = await auth().signInWithPhoneNumber(phone.value);
          console.log('confirmation', confirmation);
          setVerificationId(confirmation.verificationId);
          // Alert.alert('OTP sent to your phone');
          setLoading(false);
          ToastAndroid.show('OTP sent to your phone', ToastAndroid.SHORT);
          setStep(3);
        } catch (error) {
          Alert.alert(error.message);
        }
        break;
      case 3: // Verify OTP
        const otpError = otpValidator(otp.value);
        if (otpError) {
          setOtp({...otp, error: otpError});
          return;
        }
        try {
          Keyboard.dismiss();
          const credential = auth.PhoneAuthProvider.credential(
            verificationId,
            otp.value,
          );
          await auth().signInWithCredential(credential);
          Alert.alert('Phone number verified');
          setStep(4);
        } catch (error) {
          Alert.alert('Invalid OTP, please try again');
        }
        break;
      case 4: // Validate and complete registration
        const emailError = emailValidator(email.value);
        const passwordError = passwordValidator(password.value);
        if (emailError || passwordError) {
          setEmail({...email, error: emailError});
          setPassword({...password, error: passwordError});
          return;
        }
        Keyboard.dismiss();
        await submitForm();
        // Register user here
        navigation.reset({index: 0, routes: [{name: navigationStrings.AUTH}]});
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
      email: email.value,
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

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <ComponentHeader>Create Account</ComponentHeader>
      {step === 1 && (
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
        </>
      )}
      {step === 2 && (
        <>
          <RNPickerSelect
            onValueChange={value => selectCountry(value)}
            items={countries}
            placeholder={{label: 'Uganda UG (+256)', value: null}}
            style={pickerSelectStyles}
          />
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
          {loading && (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color={COLORS.dark} />
            </View>
          )}
        </>
      )}
      {step === 3 && (
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
        </>
      )}
      {step === 4 && (
        <>
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
          {step === 4 ? 'Sign Up' : 'Next'}
        </Button>
      </View>

      {/* {step !== 1 && ( */}
      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity
          onPress={() => navigation.replace(navigationStrings.SIGNIN)}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
      {/* )} */}
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
});
