import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text } from 'react-native-paper';

import Background from '../../../components/Background';
import Logo from '../../../components/Logo';
import ComponentHeader from '../../../components/ComponentHeader';
import Button from '../../../components/Button';
import TextInput from '../../../components/TextInput';
import BackButton from '../../../components/BackButton';
import { theme } from '../../../core/theme';
import { emailValidator } from '../../helpers/emailValidator';
import { passwordValidator } from '../../helpers/passwordValidator';
import { firstNameValidator } from '../../helpers/firstNameValidator';
import navigationStrings from '../../../consts/navigationStrings';
import { lastNameValidator } from '../../helpers/lastNameValidator';
import { phoneValidator } from '../../helpers/phoneValidator';
import { registerUser } from '../../../services/AuthServices';

export default function RegisterScreen({ navigation }) {
  const [step, setStep] = useState(1); // Track current step of registration
  const [firstName, setFirstName] = useState({ value: '', error: '' });
  const [lastName, setLastName] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' });
  const [phone, setPhone] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });

  const onNextStep = async () => {
    switch (step) {
      case 1: // Validate and proceed to next step
        const firstNameError = firstNameValidator(firstName.value);
        const lastNameError = lastNameValidator(lastName.value);
        if (firstNameError || lastNameError) {
          setFirstName({ ...firstName, error: firstNameError });
          setLastName({ ...lastName, error: lastNameError });
          return;
        }
        setStep(2);
        break;
      case 2: // Validate and proceed to next step
        const phoneError = phoneValidator(phone.value);
        if (phoneError) {
          setPhone({ ...phone, error: phoneError });
          return;
        }
        setStep(3);
        break;
      case 3: // Validate and complete registration
        const emailError = emailValidator(email.value);
        const passwordError = passwordValidator(password.value);
        if (emailError || passwordError) {
          setEmail({ ...email, error: emailError });
          setPassword({ ...password, error: passwordError });
          return;
        }
        await submitForm();
        // Register user here
        navigation.reset({ index: 0, routes: [{ name: navigationStrings.AUTH }] });
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
            onChangeText={(text) => setFirstName({ value: text, error: '' })}
            error={!!firstName.error}
            errorText={firstName.error}
          />
          <TextInput
            label="Last Name"
            returnKeyType="next"
            value={lastName.value}
            onChangeText={(text) => setLastName({ value: text, error: '' })}
            error={!!lastName.error}
            errorText={lastName.error}
          />
        </>
      )}
      {step === 2 && (
        <TextInput
          label="Phone"
          returnKeyType="next"
          value={phone.value}
          onChangeText={(text) => setPhone({ value: text, error: '' })}
          error={!!phone.error}
          errorText={phone.error}
          autoCapitalize="none"
          autoCompleteType="tel"
          keyboardType="phone-pad"
        />
      )}
      {step === 3 && (
        <>
          <TextInput
            label="Email"
            returnKeyType="next"
            value={email.value}
            onChangeText={(text) => setEmail({ value: text, error: '' })}
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
            onChangeText={(text) => setPassword({ value: text, error: '' })}
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
            style={{ width: '49%', marginHorizontal: 4 }}>
            Previous
          </Button>
        )}
        <Button
          mode="contained"
          onPress={onNextStep}
          style={[
            styles.button,
            { width: step === 1 ? '100%' : '49%', marginHorizontal: 4 },
          ]}>
          {step === 3 ? 'Sign Up' : 'Next'}
        </Button>
      </View>

      {step !== 1 && (
        <View style={styles.row}>
          <Text>Already have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.replace(navigationStrings.SIGNIN)}>
            <Text style={styles.link}>Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </Background>
  );
}

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
});
