import React, {useState} from 'react';
import {Alert, View, ActivityIndicator} from 'react-native';
import Logo from '../../../components/Logo';
import ComponentHeader from '../../../components/ComponentHeader';
import Button from '../../../components/Button';
import TextInput from '../../../components/TextInput';
import BackButton from '../../../components/BackButton';
import Background from '../../../components/Background';
import {forgotPassword} from '../../../services/AuthServices';
import COLORS from '../../../consts/colors';
import {emailValidator} from '../../helpers/emailValidator';

export default function ResetPasswordScreen({navigation}) {
  const [email, setEmail] = useState({value: '', error: ''});
  const [loading, setLoading] = useState(false);
  const sendResetPasswordEmail = async () => {
    setLoading(true);
    const emailError = emailValidator(email.value);
    if (emailError) {
      setEmail({...email, error: emailError});
      setLoading(false);
      return;
    }
    try {
      const response = await forgotPassword(email.value);
      if (response.status === 202) {
        Alert.alert(
          'Success',
          'Password reset email sent. Please check your email at ' +
            email.value,
        );
      } else {
        Alert.alert('Error', 'Failed to send password reset email.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      {loading && (
        <View
          style={{height: 300, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={COLORS.dark} />
        </View>
      )}
      <ComponentHeader>Reset Password</ComponentHeader>
      <TextInput
        label="E-mail address"
        returnKeyType="done"
        value={email.value}
        onChangeText={text => setEmail({value: text, error: ''})}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        description="You will receive an email with password reset link."
      />

      <Button
        mode="contained"
        onPress={sendResetPasswordEmail}
        style={{width: '100%', marginHorizontal: 4}}>
        Send Instructions
      </Button>
    </Background>
  );
}
