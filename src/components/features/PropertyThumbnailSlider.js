import React, {useState, useEffect} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import Swiper from 'react-native-swiper';
import axiosClient, {bURL} from '../../services/api/api';
import axios from 'axios';

const defaultImage = require('../../assets/house.jpg');
const PropertyThumbnailSlider = ({pics}) => {
  const [photos, setPhotos] = useState([]);
  useEffect(() => {
    const fetchImages = async () => {

      if (pics.length > 0) {
        try {
          console.log(pics);
          const imageUrls = await Promise.all(
            pics.map(async pic => {
              const response = await axios.get(
                bURL + `/uploads/rentals/${pic.picUrl}`,
                {
                  headers: {
                    'Content-Type': 'application/json',
                    'Api-Key': '4RPJln2MkX0_2UAEmMhN7sAfQkFDCzfpK91hAu3LM5I',
                  },
                },
              );
              return response.data;
            }),
          );
          if (imageUrls.length > 0) {
            setPhotos({uri: imageUrls[0]});
          } else {
            setPhotos(defaultImage);
          }
        } catch (error) {
          console.error('Error fetching images:', error);
          setPhotos(defaultImage);
        }
      } else {
        setPhotos(defaultImage);
      }
      console.log(photos, 'photos');
    };
    fetchImages();
  }, [pics]);
  return (
    <Swiper
      loop={true}
      showsButtons={true}
      showsPagination={false}
      autoplay={true}>
      {photos.map((photo, index) => (
        <View key={index}>
          <Image source={{uri: photo}} style={styles.photo} />
        </View>
      ))}
    </Swiper>
  );
};

export default PropertyThumbnailSlider;
const styles = StyleSheet.create({
  photo: {
    width: '100%',
    height: '100%',
  },
});
