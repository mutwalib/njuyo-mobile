import React, {useEffect} from 'react';
import {View, Text, BackHandler, StyleSheet} from 'react-native';
import Button from '../../components/Button';
import COLORS from '../../consts/colors';
const ExitScreen = () => {
  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  const handleExit = () => {
    BackHandler.exitApp();
  };
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={styles.notice}>
        <Text style={styles.text}>
          App needs access to your location. Enable location and try again!
        </Text>
      </View>
      <Button style={styles.button} onPress={handleExit}>
        Close
      </Button>
    </View>
  );
};
const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.red,
    marginTop: 50,
    width: 'auto',
  },
  notice: {
    marginHorizontal: 9,
    alignItems: 'center',
    alignContent: 'center',
  },
  text: {alignContent: 'center', alignItems: 'center'},
});
export default ExitScreen;
