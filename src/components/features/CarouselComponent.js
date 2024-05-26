import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Dimensions, Image, StatusBar} from 'react-native';
import Carousel from 'pinar';
import {fetchAndCacheImage} from '../../services/PictureService';

const height = Dimensions.get('window').height;
const defaultImage = require('../../assets/default_house-img.png');
export default function CarouselComponent({pics}) {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      if (pics.length > 0) {
        const imagePromises = pics.map(async pic => {
          const response = await fetchAndCacheImage(pic.picUrl);
          return response ? response : null;
        });
        const resolvedImages = await Promise.all(imagePromises);
        setPhotos(resolvedImages.filter(image => image !== null));
      }
    };
    fetchImages();
  }, [pics]);
  return (
    <View style={styles.carouselContainer}>
      <Carousel
        style={styles.carousel}
        showsControls={false}
        dotStyle={styles.dotStyle}
        activeDotStyle={[styles.dotStyle, {backgroundColor: 'white'}]}>
        {photos.length > 0 ? (
          photos.map((photo, index) => (
            <Image key={index} source={{uri: photo}} style={styles.image} />
          ))
        ) : (
          <Image source={defaultImage} style={styles.photo} />
        )}
      </Carousel>
    </View>
  );
}

const styles = StyleSheet.create({
  dotStyle: {
    width: 30,
    height: 3,
    backgroundColor: 'silver',
    marginHorizontal: 3,
    borderRadius: 3,
  },
  image: {
    height: '100%',
    width: '100%',
    borderRadius: 20,
  },
  carousel: {
    height: '100%',
    width: '100%',
  },
  carouselContainer: {
    height: (height - 190) / 1.9,
    marginHorizontal: 4,
    marginTop: 2,
  },
});
