import React from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
// Define the number of skeleton cards to be shown
const SKELETON_CARD_COUNT = 6;
// Dummy data for skeleton cards (you can use any placeholder data)
const skeletonData = Array.from({length: SKELETON_CARD_COUNT}, (_, index) => ({
  id: String(index),
}));
const SkeletonCard = () => {
  return (
    <View style={styles.card}>
      <View style={styles.imageSkeleton} />
      <View style={styles.titleSkeleton} />
      <View style={styles.priceSkeleton} />
    </View>
  );
};

const SkeletonLoading = () => {
  return (
    <FlatList
      data={skeletonData}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={() => <SkeletonCard />}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  card: {
    width: 150,
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginHorizontal: 5,
    padding: 10,
  },
  imageSkeleton: {
    width: '100%',
    height: '60%',
    backgroundColor: '#d0d0d0',
    borderRadius: 8,
    marginBottom: 10,
  },
  titleSkeleton: {
    width: '80%',
    height: 12,
    backgroundColor: '#d0d0d0',
    borderRadius: 4,
    marginBottom: 8,
  },
  priceSkeleton: {
    width: '60%',
    height: 12,
    backgroundColor: '#d0d0d0',
    borderRadius: 4,
  },
});

export default SkeletonLoading;
