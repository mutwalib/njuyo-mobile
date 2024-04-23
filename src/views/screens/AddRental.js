import React, {useState, useRef} from 'react';
import {View, Text, TextInput, Button, TouchableOpacity} from 'react-native';

const AddRental = () => {
  const imageInputRefs = Array.from({length: 8}, () => useRef());
  const [page, setPage] = useState(0);
  const [image, setImage] = useState();
  const [preview, setPreviewImg] = useState();
  const [villages, setVillages] = useState([]);
  const [village, setVillage] = useState('');
  const [lat, setLat] = useState(0.0);
  const [longi, setLongi] = useState(0.0);
  const [location, setLocation] = useState();
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [descValue, setDescValue] = useState('');
  const [wordCount, setWordCount] = useState(0);

  const handleChangeDesc = text => {
    const inputValue = text;
    const words = inputValue.split(/\s+/).filter(word => word !== '');
    const currentWordCount = words.length;
    if (currentWordCount <= 1000) {
      setDescValue(inputValue);
      setWordCount(currentWordCount);
    }
  };

  const goNextPage = () => {
    if (page === 6) return;
    setPage(page + 1);
  };

  const goBack = () => {
    if (page === 0) return;
    setPage(page - 1);
  };

  const handleImageUpload = identifier => {
    // Implement your image upload logic here
  };

  const onSubmit = async () => {
    // Implement your form submission logic here
  };
  return (
    <View>
      {page === 0 && (
        <View>
          {/* Step 1: Rental Details */}
          <Text>Rental Details</Text>
          {/* Form inputs for rental details */}
          <TextInput
            placeholder="Enter rental description"
            value={descValue}
            onChangeText={handleChangeDesc}
          />
          {/* Other rental details inputs */}
        </View>
      )}
      {page === 1 && (
        <View>
          {/* Step 2: Location */}
          <Text>Location</Text>
          {/* Form inputs for location */}
          {/* Village selection, current location checkbox, etc. */}
        </View>
      )}
      {/* Other steps */}
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        {page !== 0 && (
          <TouchableOpacity onPress={goBack}>
            <Text>Back</Text>
          </TouchableOpacity>
        )}
        {page !== 6 && (
          <TouchableOpacity onPress={goNextPage}>
            <Text>Next</Text>
          </TouchableOpacity>
        )}
        {page === 6 && (
          <TouchableOpacity onPress={onSubmit}>
            <Text>Submit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
export default AddRental;
