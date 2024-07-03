import {View} from 'react-native';
import React from 'react';
import RBSheet from 'react-native-raw-bottom-sheet';
import COLORS from '../consts/colors';

const BottomSheet = ({bottomSheetRef, children}) => {
  return (
    <RBSheet
      ref={bottomSheetRef}
      height={500}
      openDuration={250}
      closeOnDragDown={true}
      closeOnPressBack={true}
      closeOnPressMask={true}
      customStyles={{
        wrapper: {
          backgroundColor: 'rgba(0,0,0,0.5)',
        },
        draggableIcon: {
          backgroundColor: COLORS.gray,
          width: 100,
        },
        container: {
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        },
      }}>
      <View style={{alignContent: 'center', alignItems: 'center'}}>
        {children}
      </View>
    </RBSheet>
  );
};

export default BottomSheet;
