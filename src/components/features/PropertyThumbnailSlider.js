import React, {useState, useEffect} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import Swiper from 'react-native-swiper';
import {rentalPictures} from '../../services/PictureService';

const defaultImage = require('../../assets/house.jpg');

const PropertyThumbnailSlider = ({pics}) => {
  const [photos, setPhotos] = useState([{uri: defaultImage}]);

  useEffect(() => {
    const fetchImages = async () => {
      if (pics.length > 0) {
        const picUrls = pics.map(pic => pic.picUrl);
        const response = await rentalPictures(picUrls);
        setPhotos(response);
      }
    };
    fetchImages();
  }, [pics]);

  return (
    <Swiper
      loop={true}
      showsButtons={true}
      showsPagination={false}
      autoplay={true}>
      {photos &&
        photos.map((photo, index) => (
          <View key={index}>
            <Image
              key={index}
              source={{uri: photo}}
              style={{width: 200, height: 200}}
            />
          </View>
        ))}
    </Swiper>
  );
};

const styles = StyleSheet.create({
  photo: {
    width: '100%',
    height: '100%',
  },
});

export default PropertyThumbnailSlider;
