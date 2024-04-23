import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS, FONTS} from '../../../consts';
import BackHeader from '../../../Navigation/BackHeader';

const ChangePassword = ({navigation}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader navigation={navigation} title={`Change Password`} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Current Password</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                value={oldPassword}
                placeholder='Enter Old Password'
                onChangeText={value => setOldPassword(value)}
                style={styles.textInput}
                secureTextEntry
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                value={password}
                placeholder='Enter New Password'
                onChangeText={value => setPassword(value)}
                style={styles.textInput}
                secureTextEntry
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                value={confirmPassword}
                placeholder='Re-enter New Password'
                onChangeText={value => setConfirmPassword(value)}
                style={styles.textInput}
                secureTextEntry
              />
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    ...FONTS.h4,
    marginBottom: 6,
  },
  textInputContainer: {
    height: 44,
    width: '100%',
    borderColor: COLORS.secondaryGray,
    borderWidth: 1,
    borderRadius: 4,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: COLORS.primary,
    height: 44,
    width: '100%',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    ...FONTS.body3,
    color: COLORS.white,
  },
});

export default ChangePassword;
