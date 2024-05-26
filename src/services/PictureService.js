import axiosClient from './api/api';
import RNFS from 'react-native-fs';
import {bURL} from './api/api';
export const rentalPictures = async imageNames => {
  try {
    const response = await axiosClient.post(`/pictures/rental/all`, imageNames);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const rentalPicUrls = async imageNames => {
  try {
    const response = await axiosClient.post(
      `/pictures/rentalImgUrls/all`,
      imageNames,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchAndCacheImage = async filename => {
  try {
    const localFile = `${RNFS.DocumentDirectoryPath}/${filename}`;
    const fileExists = await RNFS.exists(localFile);
    const url = bURL + `/api/property/images/${filename}`;
    if (fileExists) {
      return `file://${localFile}`;
    }
    await RNFS.downloadFile({
      fromUrl: url,
      toFile: localFile,
      headers: {
        'Content-type': 'application/json',
        'Api-Key': '	4RPJln2MkX0_2UAEmMhN7sAfQkFDCzfpK91hAu3LM5I',
      },
    }).promise;
    return `file://${localFile}`;
  } catch (error) {
    console.log('---ERROR---', error);
    throw error;
  }
};
