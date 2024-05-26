import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import COLORS from '../consts/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import icons from '../consts/icons';
const BackHeader = ({title, navigation}) => {
  const handleClose = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
        <TouchableOpacity onPress={handleClose} style={styles.iconContainer}>
          <Image
            resizeMode="contain"
            style={styles.icon}
            source={icons.arrowLeft}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignContent: 'center',
          alignItems: 'center',
          flex: 3,
        }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: 'bold',
            color: COLORS.light,
          }}>
          {title}
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 0,
    backgroundColor: COLORS.black,
    paddingBottom: 8,
    marginBottom: 1,
    paddingVertical: 5,
  },
  iconContainer: {
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.black,
  },
  icon: {
    height: 20,
    width: 20,
    tintColor: COLORS.white,
  },
});
export default BackHeader;
