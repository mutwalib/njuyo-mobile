import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../../../consts';
import BackHeader from '../../../Navigation/BackHeader';
import { useSelector } from 'react-redux';

const EditProfile = ({ navigation }) => {
  const user = useSelector(state => state.user.user);
  const [firstName, setFirstName] = useState(user ? user.firstName : '');
  const [lastName, setLastName] = useState(user ? user.lastName : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [phone, setPhone] = useState(user ? user.phone : '');

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader navigation={navigation} title="Edit Profile" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.avatarContainer}>
          {/* Your Avatar Component */}
        </View>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>First Name</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                value={firstName}
                onChangeText={value => setFirstName(value)}
                style={styles.textInput}
                editable={false}
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Last Name</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                value={lastName}
                onChangeText={value => setLastName(value)}
                style={styles.textInput}
                editable={false}
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                value={email}
                onChangeText={value => setEmail(value)}
                style={styles.textInput}
                editable={false}
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                value={phone}
                onChangeText={value => setPhone(value)}
                style={styles.textInput}
                editable={true}
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
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 22,
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

export default EditProfile;
