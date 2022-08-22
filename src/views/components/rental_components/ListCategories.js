import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import COLORS from '../../../consts/colors';

const ListCategories = () => {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = React.useState(0);
  const categoryList = ['Rentals', 'Hostels', 'Hotels', 'Houses', 'Land'];
  return (
    <View style={style.categoryListContainer}>
      {categoryList.map((category, index) => (
        <Pressable key={index} onPress={() => setSelectedCategoryIndex(index)}>
          <Text
            style={[
              style.categoryListText,
              index == selectedCategoryIndex && style.activeCategoryListText,
            ]}>
            {category}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};
const style = StyleSheet.create({
  categoryListContainer: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  categoryListText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.grey,
    paddingBottom: 5,
  },
  activeCategoryListText: {
    color: COLORS.dark,
    paddingBottom: 5,
    borderBottomWidth: 1,
  },
});
export default ListCategories;
