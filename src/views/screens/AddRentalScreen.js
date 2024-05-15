import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
  Image,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {RadioButton} from 'react-native-paper';
import {Text, Button, Input} from 'react-native-elements';
import BackHeader from '../../Navigation/BackHeader';
import {createRental, getRentalFrequencies} from '../../services/RentalService';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Icon from '../../consts/Icon';
import Geolocation from '@react-native-community/geolocation';
import Modal from 'react-native-modal';
import COLORS from '../../consts/colors';
import {useNavigation} from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown';
import axiosClient from '../../services/api/api';
import {useSelector} from 'react-redux';
export default function AddRentalScreen() {
  const navigation = useNavigation();
  const owner = useSelector(state => state.user.user);
  const [step, setStep] = useState(1);
  const [rentalFreqs, setRentalFreqs] = useState([]);
  const [isCurrentLocation, setIsCurrentLocation] = useState(true);
  const [villages, setVillages] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState('');
  const [nearVillage, setNearVillage] = useState('');
  const [formData, setFormData] = useState({
    titles: '',
    currency: 'UGX',
    price: '',
    nmonths: '',
    utilities: '',
    frequency: '',
    conditions: '',
    address: '',
    province: '',
    postal_code: '',
    isCurrentlocation: true,
    village: '',
    is_self_contained: true,
    kitchen_inside: true,
    parking: true,
    bedrooms: '',
    livingrooms: '',
    amenities: '',
    toilet: '',
    surface_area: '',
    images: [],
    property_details: '',
    villageId: '',
    latitude: '',
    longitude: '',
  });
  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
  const handleFrequencyChange = frequency => {
    setSelectedFrequency(frequency);
    setFormData({...formData, frequency});
    toggleModal();
  };
  useEffect(() => {
    if (Platform.OS === 'android') {
      requestCameraPermission();
      requestStoragePermission();
    }
    rentalFrequencies();
  }, []);

  const handleNextStep = () => {
    setStep(step + 1);
  };
  const rentalFrequencies = async () => {
    const response = await getRentalFrequencies();
    if (response !== null) {
      if (response?.status === 200) {
        setRentalFreqs(response.data);
      }
    }
  };

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'App needs access to your location.',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Location permission granted');
            getCurrentLocation();
          } else {
            console.log('Location permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        getCurrentLocation();
      }
    };
    const getCurrentLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          console.log(latitude);
          const googleLocation = `${latitude},${longitude}`;
          console.log(googleLocation, 'location');
          setFormData({...formData, latitude: latitude});
          setFormData({...formData, longitude: longitude});
        },
        error => {
          console.log(error.message);
        },
        {enableHighAccuracy: false, timeout: 40000000, maximumAge: 1000000},
      );
    };
    requestLocationPermission();
    // Clean up function
    return () => {
      // Clear any location watch or tasks here if needed
    };
  }, []);

  const handlePreviousStep = () => {
    setStep(step - 1);
  };
  const handleSubmitForm = useCallback(async () => {
    try {
      if (formData.isCurrentlocation) {
        // setFormData({...formData, latitude: location?.latitude});
        // setFormData({...formData, longitude: location?.longitude});
        // setIsLoading(true);
      } 
      // else if (lat === null || longi == null) {
      //   Alert.alert(
      //     'We have not picked your location. Please enable location and try again!',
      //   );
      //   return;
      // }
      if (owner === null) {
        Alert.alert('You are not authenticated to perform this action!');
        return;
      }
      if (!formData.images.length) {
        Alert.alert('Please select at least one image');
        return;
      }

      const rentalData = {
        title: formData.titles,
        owner: owner,
        currency: formData.currency,
        propertyDetails: formData.property_details,
        pricePerMonth: formData.price,
        initialPayMonth: formData.nmonths,
        rentFrequency: formData.frequency,
        utilitiesToPay: formData.utilities,
        amenities: formData.amenities,
        noOfToilets: formData.toilet,
        noOfRooms: formData.bedrooms,
        isParkingAvailable: formData.parking,
        isKitchenIn: formData.kitchen_inside,
        isSelfContained: formData.is_self_contained,
        conditionsOfStay: formData.conditions,
        latitude: formData.isCurrentlocation ? formData?.latitude : 0.0,
        longitude: formData.isCurrentlocation ? formData?.longitude : 0.0,
        villageId: formData.village,
        addressName: formData.address,
        postalCode: formData.postal_code,
        province: formData.province,
      };
      const fileObjects = formData.images.map(image => image.file);
      const propertyData = {
        property: JSON.stringify(rentalData),
        files: fileObjects,
      };
      const resp = await createRental(propertyData);

      if (resp?.status === 202) {
        Alert.alert('Form submited!');
        navigation.goBack();
      } else {
        Alert.alert('Error submitting form. Please try again.');
      }
    } catch (error) {
      console.log('error', error);
      Alert.alert('An error occurred. Please try again.');
    }
  }, [formData, navigation]);

  const handleImageUpload = imageNumber => {
    Alert.alert(
      'Choose Image Source',
      'Select the source for your image',
      [
        {
          text: 'Camera',
          onPress: () => launchCameraAction(imageNumber),
        },
        {
          text: 'Gallery',
          onPress: () => launchImageLibraryAction(imageNumber),
        },
      ],
      {cancelable: true},
    );
  };

  const handleImageRemoval = imageNumber => {
    const filteredImages = formData.images.filter(
      image => image.id !== imageNumber,
    );
    setFormData(prevFormData => ({
      ...prevFormData,
      images: filteredImages,
    }));
  };
  const onSetCurrentLocation = () => {
    setIsCurrentLocation(!isCurrentLocation);
    setUseCurrentLocation(!useCurrentLocation);
  };

  const onSelectVillage = value => {
    setSelectedVillage(value);
  };
  const launchCameraAction = imageNumber => {
    const options = {
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 600,
      quality: 1,
    };
    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        let source = {uri: response.assets?.[0].uri};
        setFormData(prevFormData => ({
          ...prevFormData,
          images: [...prevFormData.images, {id: imageNumber, file: source}],
        }));
      }
    });
  };

  const launchImageLibraryAction = imageNumber => {
    const options = {
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 600,
      quality: 1,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        let source = {uri: response.assets?.[0].uri};
        setFormData(prevFormData => ({
          ...prevFormData,
          images: [...prevFormData.images, {id: imageNumber, file: source}],
        }));
      }
    });
  };
  useEffect(() => {
    axiosClient.get(`/village`).then(response => {
      setVillages(response.data);
    });
  }, []);

  // let locations = [...villages];
  // const filterVillages = useCallback(
  //   inputValue => {
  //     if (locations === null || locations === 'undefined' || locations === '') {
  //       return [];
  //     } else {
  //       return locations.filter(i =>
  //         i.name?.toLowerCase().includes(inputValue.toLowerCase()),
  //       );
  //     }
  //   },
  //   [locations],
  // );
  const loadOptions = (inputValue, callback) => {
    setTimeout(() => {
      callback(filterVillages(inputValue));
    }, 1000);
  };
  // Android Permissions
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app requires access to your camera.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission granted');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'This app requires access to your storage.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage permission granted');
      } else {
        console.log('Storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <View style={styles.container}>
      <BackHeader navigation={navigation} title={`Add Rental`} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          {step === 1 && (
            <>
              <Text h4>Basic Information</Text>
              <Input
                label="Title"
                placeholder="ex: Modern Apartment Downtown..."
                value={formData.titles}
                onChangeText={text => setFormData({...formData, titles: text})}
              />
              <Input
                label="Currency"
                placeholder="Currency"
                value={formData.currency}
                onChangeText={text =>
                  setFormData({...formData, currency: text})
                }
              />
              <Input
                label="Price"
                placeholder="Ex: 500,000"
                value={formData.price}
                keyboardType="numeric"
                onChangeText={text => setFormData({...formData, price: text})}
              />
              <Input
                label="Initial payment (New tenant pay at start)"
                placeholder="Ex: 3 (Ex: Meaning three Months)"
                value={formData.nmonths}
                keyboardType="numeric"
                onChangeText={text => setFormData({...formData, nmonths: text})}
              />
              <Input
                label="Utilities to pay (Client's seperate utilities)"
                placeholder="Ex: Electricity"
                value={formData.utilities}
                onChangeText={text =>
                  setFormData({...formData, utilities: text})
                }
              />
              <View
                style={{
                  width: '100%',
                  paddingStart: 10,
                }}>
                <TouchableOpacity onPress={toggleModal}>
                  <View>
                    <Text style={styles.freqlabel}>
                      Rent Frequency (Rent paid every ...)
                    </Text>
                    <Text style={styles.dropdownText}>
                      {selectedFrequency || (
                        <Text style={{color: 'gray'}}>Select Frequency</Text>
                      )}
                    </Text>
                  </View>
                </TouchableOpacity>
                <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
                  <View style={styles.modalContainer}>
                    {rentalFreqs.map((freq, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleFrequencyChange(freq.name)}
                        style={styles.modalItem}>
                        <Text>{freq.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </Modal>
              </View>
              <Input
                label="Conditions of stay"
                placeholder="Any brief rules"
                multiline={true}
                value={formData.conditions}
                onChangeText={text =>
                  setFormData({...formData, conditions: text})
                }
              />
            </>
          )}
          {step === 2 && (
            <>
              <Text h4>Address Information</Text>
              <Input
                label="Address"
                placeholder="Address of the rental"
                value={formData.address}
                onChangeText={text => setFormData({...formData, address: text})}
              />
              <Input
                label="District"
                placeholder="District of the rental"
                value={formData.province}
                onChangeText={text =>
                  setFormData({...formData, province: text})
                }
              />
              <View style={{width: '100%', alignContent: 'flex-start'}}>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}>
                  <CheckBox
                    value={isCurrentLocation}
                    onValueChange={onSetCurrentLocation}
                  />
                  <Text>Use my current Location for rental location?</Text>
                </View>
                {!useCurrentLocation && (
                  <View style={{width: '100%'}}>
                    <SelectDropdown
                      search={true}
                      data={villages}
                      onSelect={(selectedItem, index) => {
                        setNearVillage(selectedItem.name);
                        setFormData({...formData, villageId: selectedItem.id});
                      }}
                      renderButton={(selectedItem, isOpened) => {
                        return (
                          <View style={styles.dropdownButtonStyle}>
                            <Text style={styles.dropdownButtonTxtStyle}>
                              {(selectedItem && selectedItem.name) ||
                                'Select rental village'}
                            </Text>
                            <Icon
                              type="fa"
                              name={isOpened ? 'chevron-up' : 'chevron-down'}
                              style={styles.dropdownButtonArrowStyle}
                            />
                          </View>
                        );
                      }}
                      renderItem={(item, index, isSelected) => {
                        return (
                          <View
                            style={{
                              ...styles.dropdownItemStyle,
                              ...(isSelected && {backgroundColor: '#D2D9DF'}),
                            }}>
                            <Text style={styles.dropdownItemTxtStyle}>
                              {item.name}
                            </Text>
                          </View>
                        );
                      }}
                      showsVerticalScrollIndicator={false}
                      dropdownStyle={styles.dropdownMenuStyle}
                    />
                  </View>
                )}
              </View>
            </>
          )}
          {step === 3 && (
            <>
              <Text h4>Property Information</Text>
              <View style={styles.radioGroup}>
                <Text style={{marginStart: 0}}>Is it Self Contained?</Text>
                <View style={styles.radioButton}>
                  <RadioButton.Android
                    value={true}
                    status={
                      formData.is_self_contained ? 'checked' : 'unchecked'
                    }
                    onPress={() =>
                      setFormData({...formData, is_self_contained: true})
                    }
                    color="#007BFF"
                  />
                  <Text style={styles.radioLabel}>Yes</Text>
                </View>
                <View style={styles.radioButton}>
                  <RadioButton.Android
                    value={false}
                    status={
                      !formData.is_self_contained ? 'checked' : 'unchecked'
                    }
                    onPress={() =>
                      setFormData({...formData, is_self_contained: false})
                    }
                    color="#007BFF"
                  />
                  <Text style={styles.radioLabel}>No</Text>
                </View>
              </View>
              <View style={styles.radioGroup}>
                <Text style={{paddingStart: 0}}>Kitchen Inside?</Text>
                <View style={styles.radioButton}>
                  <RadioButton.Android
                    value={true}
                    status={formData.kitchen_inside ? 'checked' : 'unchecked'}
                    onPress={() =>
                      setFormData({...formData, kitchen_inside: true})
                    }
                    color="#007BFF"
                  />
                  <Text style={styles.radioLabel}>Yes</Text>
                </View>
                <View style={styles.radioButton}>
                  <RadioButton.Android
                    value={false}
                    status={!formData.kitchen_inside ? 'checked' : 'unchecked'}
                    onPress={() =>
                      setFormData({...formData, kitchen_inside: false})
                    }
                    color="#007BFF"
                  />
                  <Text style={styles.radioLabel}>No</Text>
                </View>
              </View>
              <View style={styles.radioGroup}>
                <Text>Parking Available?</Text>
                <View style={styles.radioButton}>
                  <RadioButton.Android
                    value={true}
                    status={formData.parking ? 'checked' : 'unchecked'}
                    onPress={() => setFormData({...formData, parking: true})}
                    color="#007BFF"
                  />
                  <Text style={styles.radioLabel}>Yes</Text>
                </View>
                <View style={styles.radioButton}>
                  <RadioButton.Android
                    value={false}
                    status={!formData.parking ? 'checked' : 'unchecked'}
                    onPress={() => setFormData({...formData, parking: false})}
                    color="#007BFF"
                  />
                  <Text style={styles.radioLabel}>No</Text>
                </View>
              </View>
              {/* Bedrooms */}
              <Input
                label="Bedrooms"
                keyboardType="numeric"
                value={formData.bedrooms}
                onChangeText={text =>
                  setFormData({...formData, bedrooms: text})
                }
              />
              <Input
                label="Living Rooms"
                keyboardType="numeric"
                value={formData.livingrooms}
                onChangeText={text =>
                  setFormData({...formData, livingrooms: text})
                }
              />
              <Input
                label="Amenities"
                value={formData.amenities}
                onChangeText={text =>
                  setFormData({...formData, amenities: text})
                }
              />
              <Input
                label="Baths (Toilets)"
                keyboardType="numeric"
                value={formData.toilet}
                onChangeText={text => setFormData({...formData, toilet: text})}
              />
              <Input
                label="Surface Area"
                keyboardType="numeric"
                value={formData.surface_area}
                onChangeText={text =>
                  setFormData({...formData, surface_area: text})
                }
              />
              <Text>sqft</Text>
            </>
          )}
          {step === 4 && (
            <>
              <Text h4>Description</Text>
              <Input
                label="Property Brief"
                placeholder="Enter property brief"
                multiline={true}
                value={formData.property_details}
                onChangeText={text =>
                  setFormData({...formData, property_details: text})
                }
                containerStyle={styles.inputContainer}
              />
              <Input
                label="Additional Info"
                placeholder="Enter additional info"
                multiline={true}
                value={formData.additional_info}
                onChangeText={text =>
                  setFormData({...formData, additional_info: text})
                }
                containerStyle={styles.inputContainer}
              />
            </>
          )}
          {step === 5 && (
            <>
              <Text h4>Add pictures</Text>
              <View style={styles.imageContainer}>
                {[...Array(8)].map((_, index) => (
                  <View key={index}>
                    {formData.images.find(image => image.id === index + 1) ? (
                      <View>
                        <Image
                          source={
                            formData.images.find(
                              image => image.id === index + 1,
                            ).file
                          }
                          style={styles.image}
                        />
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleImageRemoval(index + 1)}>
                          <Icon style={{color: 'red'}} type="fa" name="trash" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => handleImageUpload(index + 1)}>
                        <Icon type="fa" name="plus" />
                        <Text style={styles.addButtonText}>
                          Image {index + 1}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            </>
          )}
          {step === 6 && (
            <>
              <Text h4>Summary</Text>
              <Text>Title: {formData.titles}</Text>
              <Text>Currency: {formData.currency}</Text>
              <Text>Price: {formData.price}</Text>
              <Text>
                First payment required: {formData.nmonths}{' '}
                {formData.frequency === 'ANNUALLY'
                  ? 'YEARS'
                  : formData.frequency.replace(/LY$/, 'S')}
              </Text>
              <Text>Rules for tenants: {formData.conditions}</Text>
              <Text>Utilities to pay by tenant: {formData.utilities}</Text>
              <Text>Address: {formData.address}</Text>
              <Text>District:{formData.province}</Text>
              <Text>Host/Nearest Village: {nearVillage}</Text>
              <Text>
                Is it self-contained:{' '}
                {formData.is_self_contained ? 'Yes' : 'No'}
              </Text>
              <Text>
                Does it have kitchen inside:{' '}
                {formData.kitchen_inside ? 'Yes' : 'No'}
              </Text>
              <Text>
                Does it have parking: {formData.parking ? 'Yes' : 'No'}
              </Text>
              <Text>Bed rooms: {formData.bedrooms}</Text>
              <Text>Living rooms: {formData.livingrooms}</Text>
              <Text>Amenities: {formData.amenities}</Text>
              <Text>Number of Pictures Added: {formData.images.length}</Text>
              <View style={styles.imageContainer}>
                {formData.images.map((image, index) => (
                  <View key={index}>
                    <Image source={image.file} style={styles.summaryImages} />
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
      <View
        style={{
          flexDirection: step < 2 ? 'column' : 'row',
          justifyContent: step < 2 ? 'flex-end' : 'space-between',
          marginTop: 15,
          alignItems: 'center',
          alignContent: 'center',
          paddingHorizontal: 20,
          marginBottom: 15,
        }}>
        {step > 1 && <Button title="Previous" onPress={handlePreviousStep} />}
        <Button
          title={step === 6 ? 'Submit' : 'Next'}
          onPress={step === 6 ? handleSubmitForm : handleNextStep}
          buttonStyle={
            step === 6
              ? styles.submitButton
              : step < 2
              ? styles.largeButton
              : styles.defaultButton
          }
          titleStyle={step < 2 ? styles.buttonTitle : null}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    paddingHorizontal: 5,
  },
  freqlabel: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.gray,
  },
  dropdownText: {
    borderBottomWidth: 1,
    borderColor: 'gray',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },

  formContainer: {
    // width: '100%',
    // justifyContent: 'center',
    // alignItems: 'center',
    // padding: 20,

    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 120,
    height: 120,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  addButtonText: {
    fontSize: 16,
  },
  image: {
    width: 120,
    height: 120,
    margin: 10,
  },
  summaryImages: {width: 60, height: 60, margin: 5},
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    borderRadius: 20,
    padding: 5,
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 8,
    borderRadius: 8,
    padding: 16,
    width: '100%',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: 'green',
  },
  largeButton: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.purple,
  },
  buttonTitle: {
    textAlign: 'center',
    width: '100%',
  },
  defaultButton: {
    width: 'auto',
    backgroundColor: COLORS.purple,
  },
  dropdownButtonStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownButtonArrowStyle: {
    fontSize: 15,
  },
  dropdownButtonIconStyle: {
    fontSize: 20,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    maxWidth: '100%',

    backgroundColor: '#E9ECEF',
    borderRadius: 8,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#151E26',
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});
