import React, {useState, useEffect} from 'react';
import {View, Image} from 'react-native';
import Swiper from 'react-native-swiper';
import axiosClient from '../../services/api/api';

const defaultImage = require('../../assets/house.jpg');

const PropertyThumbnailSlider = ({pics}) => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imagePromises = pics.map(async pic => {
          try {
            const response = await axiosClient.get(
              `/property/images/${pic.picUrl}`,
              {
                responseType: 'blob',
              },
            );
            if (response !== null) {
              const uri = `data:image/png;base64,${response.data}`; // Assuming the response is in base64 format
              return uri;
            }
          } catch (error) {
            console.error(error);
          }
        });
        const resolvedImages = await Promise.all(imagePromises);
        setPhotos(resolvedImages);
      } catch (error) {
        console.error(error);
      }
    };

    if (pics.length > 0) {
      fetchImages();
    } else {
      setPhotos([defaultImage]);
    }
  }, [pics]);

  return (
    <>
      <Swiper
        loop={true}
        showsButtons={true} // Assuming you want to show navigation buttons
        showsPagination={false} // Assuming you don't want pagination
        autoplay={true} // Assuming you want autoplay
      >
        {photos.map((photo, index) => (
          <View key={index}>
            <Image
              source={{uri: photo}}
              style={{width: '100%', height: '100%'}}
            />
          </View>
        ))}
      </Swiper>
    </>
  );
};

export default PropertyThumbnailSlider;
