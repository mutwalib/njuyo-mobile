import React, {useState} from 'react';

import Logo from '../../../components/Logo';
import ComponentHeader from '../../../components/ComponentHeader';
import Button from '../../../components/Button';
import TextInput from '../../../components/TextInput';
import BackButton from '../../../components/BackButton';
import Background from '../../../components/Background';
import {emailValidator} from '../../helpers/emailValidator';

export default function ResetPasswordScreen({navigation}) {
  const [email, setEmail] = useState({value: '', error: ''});
  const sendResetPasswordEmail = () => {
    const emailError = emailValidator(email.value);
    if (emailError) {
      setEmail({...email, error: emailError});
      return;
    }
    navigation.navigate('LoginScreen');
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <ComponentHeader>Restore Password</ComponentHeader>
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
        description="You will receive email with password reset link."
      />
      <Button
        mode="contained"
        onPress={sendResetPasswordEmail}
        style={{marginTop: 16}}>
        Send Instructions
      </Button>
    </Background>
  );
}
