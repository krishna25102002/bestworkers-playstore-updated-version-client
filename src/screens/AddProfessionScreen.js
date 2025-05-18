// c:\Users\kd1812\Desktop\BW NEW\BestWorkers_Client\src\screens\AddProfessionScreen.js
import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  Alert, // Make sure Alert is imported if you use it
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';
import styles from '../styles/AddProfessionStyles';
import {
  states,
  districts,
  cities,
  serviceCategories,
  serviceNames,
  experienceLevels,
  priceUnits,
} from '../data/staticData'; // Assuming your staticData.js has all these
import {addProfession, getUserProfile, updateProfessionalProfile} from '../services/api'; // Added updateProfessionalProfile
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native'; // To get route params


const AddProfessionScreen = ({navigation}) => {
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [secondaryMobileNo, setSecondaryMobileNo] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [designation, setDesignation] = useState(''); // New state for designation
  const [experience, setExperience] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [priceUnit, setPriceUnit] = useState('per hour');
  const [needSupport, setNeedSupport] = useState(false);
  const [professionDescription, setProfessionDescription] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // Added isLoading state

  const route = useRoute();
  const { editMode, existingData } = route.params || {};

  const screenTitle = editMode ? "Edit Professional Profile" : "Add Your Profession";
  const submitButtonText = editMode ? "Update Profile" : "Submit";

  // Populate form if in edit mode or fetch user profile for add mode
  useEffect(() => {
    if (editMode && existingData) {
      console.log("Edit Mode: Populating form with existing data", existingData);
      // Set basic fields
      setName(existingData.name || '');
      setEmail(existingData.email || '');
      setMobileNo(existingData.mobileNo || existingData.mobile || ''); // Check for both mobileNo and mobile
      setSecondaryMobileNo(existingData.secondaryMobileNo || '');
      setDesignation(existingData.designation || '');
      setExperience(existingData.experience || '');
      setServicePrice(existingData.servicePrice ? String(existingData.servicePrice) : '');
      setPriceUnit(existingData.priceUnit || 'per hour');
      setNeedSupport(existingData.needSupport || false);
      setProfessionDescription(existingData.professionDescription || '');

      // Set dropdown values - this will trigger re-filtering of dependent dropdowns
      // Ensure these are set *after* the basic fields if there are any dependencies
      // that might clear them.
      if (existingData.state) {
        setState(existingData.state);
        if (existingData.district) {
          setDistrict(existingData.district);
          if (existingData.city) setCity(existingData.city);
        }
      }
      if (existingData.serviceCategory) {
        setServiceCategory(existingData.serviceCategory);
        if (existingData.serviceName) setServiceName(existingData.serviceName);
      }
      // isAgreed is usually not part of existingData for editing, but you can set it if needed
    } else if (!editMode) {
      const fetchUserProfileForAdd = async () => {
        try {
          const response = await getUserProfile();
          if (response.success && response.data) {
            const userData = response.data;
            setName(userData.name || '');
            setEmail(userData.email || '');
            setMobileNo(userData.mobile || '');
          } else {
            console.error('Failed to fetch user profile data or data is not in expected format:', response);
            Alert.alert("Error", "Could not load your basic profile information.");
          }
        } catch (error) {
          console.error('Error fetching user profile in AddProfessionScreen (add mode):', error);
          if (error.response && error.response.status === 401) {
            Alert.alert("Session Expired", "Please log in again.");
            navigation.replace('Login');
          } else {
            Alert.alert("Error", "An error occurred while fetching your profile.");
          }
        }
      };
      fetchUserProfileForAdd();
    }
  }, [editMode, existingData, navigation]);

  // Memoize filtered data to prevent unnecessary re-renders
  const filteredDistricts = React.useMemo(() => {
    console.log("Filtering districts for state:", state);
    return state ? districts.filter(item => item.state === state) : [];
  }, [state]);

  const filteredCities = React.useMemo(() => {
    console.log("Filtering cities for district:", district);
    return district && state ? cities[district] || [] : []; // Ensure state is also present for context
  }, [district, state]);

  const filteredServiceNames = React.useMemo(() => {
    console.log("Filtering service names for category:", serviceCategory);
    return serviceCategory ? serviceNames[serviceCategory] || [] : [];
  }, [serviceCategory]);


  // Form validation
  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    if (!name.trim()) (newErrors.name = 'Name is required'), (valid = false);
    if (!email.trim()) (newErrors.email = 'Email is required'), (valid = false);
    else if (!/\S+@\S+\.\S+/.test(email))
      (newErrors.email = 'Email is invalid'), (valid = false);
    if (!mobileNo.trim())
      (newErrors.mobileNo = 'Mobile number is required'), (valid = false);
    else if (!/^\d{10}$/.test(mobileNo))
      (newErrors.mobileNo = 'Mobile number must be 10 digits'), (valid = false);
    if (secondaryMobileNo.trim() && !/^\d{10}$/.test(secondaryMobileNo))
      (newErrors.secondaryMobileNo = 'Secondary mobile must be 10 digits'),
        (valid = false);
    if (!state) (newErrors.state = 'State is required'), (valid = false);
    if (!district)
      (newErrors.district = 'District is required'), (valid = false);
    if (!city) (newErrors.city = 'City is required'), (valid = false);
    if (!serviceCategory)
      (newErrors.serviceCategory = 'Service category is required'),
        (valid = false);
    if (!serviceName)
      (newErrors.serviceName = 'Service name is required'), (valid = false);
    if (serviceName === 'Explore others' && !designation.trim()) // Validate designation if 'Explore others'
      (newErrors.designation = 'Designation is required for "Others" service'), (valid = false);
    if (!experience)
      (newErrors.experience = 'Experience is required'), (valid = false);
    if (!servicePrice.trim())
      (newErrors.servicePrice = 'Service price is required'), (valid = false);
    else if (isNaN(parseFloat(servicePrice))) // Check if it's a valid number
      (newErrors.servicePrice = 'Service price must be a number'),
        (valid = false);
    if (!isAgreed && !editMode) // Agreement only required for new additions
      (newErrors.isAgreed = 'You must agree to the terms'), (valid = false);

    setErrors(newErrors);
    return valid;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (validateForm()) {
      setIsLoading(true); // Start loading
      try {
        const formData = {
          name,
          email,
          mobileNo,
          secondaryMobileNo,
          state,
          district,
          city,
          serviceCategory,
          serviceName,
          designation: serviceName === 'Explore others' ? designation : '', // Only send designation if serviceName is 'Explore others'
          experience,
          servicePrice: parseFloat(servicePrice), // Ensure servicePrice is a number
          priceUnit,
          needSupport,
          professionDescription,
          // isAgreed is for client-side validation, not usually sent to backend
        };

        if (editMode) {
          await updateProfessionalProfile(formData); // Assuming your API takes all fields
          Alert.alert("Success", "Profile updated successfully!");
          navigation.goBack(); // Or navigate to ProfileScreen and refresh
        } else {
          await addProfession(formData);
          await AsyncStorage.setItem('isProfession', 'true');
          setShowSuccessModal(true); // Show success modal only for new additions
        }

      } catch (error) {
        const action = editMode ? "updating" : "submitting";
        console.error(`Error ${action} profession:`, error.response ? error.response.data : error.message);
        Alert.alert(
          `${editMode ? 'Update' : 'Submission'} Error`,
          error.response?.data?.error || error.message || `Failed to ${action} profession details. Please try again.`
        );
      } finally {
        setIsLoading(false); // Stop loading
      }
    } else {
      Alert.alert("Validation Error", "Please check the form for errors.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <AntDesign name="arrowleft" size={24} color="#1E40AF" />
          </TouchableOpacity>
          <Text style={styles.header}>{screenTitle}</Text>
        </View>

        {/* Personal Information */}
        <Text style={styles.sectionHeader}>Personal Information</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name*</Text>
          <TextInput
            style={[styles.input, {backgroundColor: '#F1F5F9'}]}
            placeholder="Enter your full name"
            value={name}
            editable={false} // Typically name is not editable here, fetched from user profile
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email*</Text>
          <TextInput
            style={[styles.input, {backgroundColor: '#F1F5F9'}]}
            placeholder="Enter your email"
            keyboardType="email-address"
            value={email}
            editable={false} // Email is often not editable here
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mobile No*</Text>
          <TextInput
            style={[styles.input, {backgroundColor: '#F1F5F9'}]}
            placeholder="Enter 10 digit mobile number"
            keyboardType="phone-pad"
            maxLength={10}
            value={mobileNo}
            editable={false} // Mobile is generally not editable here, fetched from user profile
          />
          {errors.mobileNo && (
            <Text style={styles.errorText}>{errors.mobileNo}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Secondary Mobile No</Text>
          <TextInput // Secondary mobile is usually editable
            style={styles.input}
            placeholder="Enter secondary mobile number"
            keyboardType="phone-pad"
            maxLength={10}
            value={secondaryMobileNo}
            onChangeText={setSecondaryMobileNo}
          />
          {errors.secondaryMobileNo && (
            <Text style={styles.errorText}>{errors.secondaryMobileNo}</Text>
          )}
        </View>

        {/* Location Information */}
        <Text style={styles.sectionHeader}>Location Information</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>State*</Text>
          <Dropdown
            style={[styles.dropdown, isFocus && styles.dropdownFocus]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={states}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'Select state' : '...'}
            searchPlaceholder="Search..."
            value={state}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setState(item.value);
              setDistrict(''); // Reset district when state changes
              setCity('');     // Reset city when state changes
              setIsFocus(false);
            }}
            renderLeftIcon={() => (
              <AntDesign
                style={styles.icon}
                color={isFocus ? '#1E40AF' : '#1E40AF'}
                name="enviromento"
                size={20}
              />
            )}
          />
          {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>District*</Text>
          <Dropdown
            style={[styles.dropdown, isFocus && styles.dropdownFocus]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={filteredDistricts}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'Select district' : '...'}
            searchPlaceholder="Search..."
            value={district}
            disable={!state && !editMode} // Only disable if not in edit mode and state is not selected
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setDistrict(item.value);
              setCity(''); // Reset city when district changes
              setIsFocus(false);
            }}
            renderLeftIcon={() => (
              <AntDesign
                style={styles.icon}
                color={isFocus ? '#1E40AF' : '#1E40AF'}
                name="enviromento"
                size={20}
              />
            )}
          />
          {errors.district && (
            <Text style={styles.errorText}>{errors.district}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>City*</Text>
          <Dropdown
            style={[styles.dropdown, isFocus && styles.dropdownFocus]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={filteredCities}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'Select city' : '...'}
            searchPlaceholder="Search..."
            value={city}
            disable={!district && !editMode} // Only disable if not in edit mode and district is not selected
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setCity(item.value);
              setIsFocus(false);
            }}
            renderLeftIcon={() => (
              <AntDesign
                style={styles.icon}
                color={isFocus ? '#1E40AF' : '#1E40AF'}
                name="enviromento"
                size={20}
              />
            )}
          />
          {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
        </View>

        {/* Professional Information */}
        <Text style={styles.sectionHeader}>Professional Information</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Service Category*</Text>
          <Dropdown
            style={[styles.dropdown, isFocus && styles.dropdownFocus]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={serviceCategories}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'Select service category' : '...'}
            searchPlaceholder="Search..."
            value={serviceCategory}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setServiceCategory(item.value);
              setServiceName(''); // Reset service name
              setDesignation(''); // Reset designation
              setIsFocus(false);
            }}
            renderLeftIcon={() => (
              <AntDesign
                style={styles.icon}
                color={isFocus ? '#1E40AF' : '#1E40AF'}
                name="profile"
                size={20}
              />
            )}
          />
          {errors.serviceCategory && (
            <Text style={styles.errorText}>{errors.serviceCategory}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Service Name*</Text>
          <Dropdown
            style={[styles.dropdown, isFocus && styles.dropdownFocus]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={filteredServiceNames}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'Select service name' : '...'}
            searchPlaceholder="Search..."
            value={serviceName}
            disable={!serviceCategory && !editMode} // Only disable if not in edit mode and category not selected
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setServiceName(item.value);
              if (item.value !== 'Explore others') {
                setDesignation(''); // Clear designation if not 'Explore others'
              }
              setIsFocus(false);
            }}
            renderLeftIcon={() => (
              <AntDesign
                style={styles.icon}
                color={isFocus ? '#1E40AF' : '#1E40AF'}
                name="profile"
                size={20}
              />
            )}
          />
          {errors.serviceName && (
            <Text style={styles.errorText}>{errors.serviceName}</Text>
          )}
        </View>
        
        {serviceName === 'Explore others' && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Designation*</Text>
              <View style={styles.inputWithIconContainer}>
                <AntDesign
                  name="idcard"
                  size={20}
                  color="#1E40AF"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.inputWithIcon}
                  placeholder="Enter your specific designation"
                  placeholderTextColor="#94A3B8"
                  value={designation}
                  onChangeText={setDesignation}
                />
              </View>
              {errors.designation && <Text style={styles.errorText}>{errors.designation}</Text>}
            </View>
        )}
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Experience*</Text>
          <Dropdown
            style={[styles.dropdown, isFocus && styles.dropdownFocus]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={experienceLevels}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'Select experience level' : '...'}
            value={experience}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setExperience(item.value);
              setIsFocus(false);
            }}
            renderLeftIcon={() => (
              <AntDesign
                style={styles.icon}
                color={isFocus ? '#1E40AF' : '#1E40AF'}
                name="clockcircleo"
                size={20}
              />
            )}
          />
          {errors.experience && (
            <Text style={styles.errorText}>{errors.experience}</Text>
          )}
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Service Price*</Text>
          <View style={styles.priceContainer}>
            <TextInput
              style={[styles.input, styles.priceInput, errors.servicePrice && styles.inputError]} // Assuming inputError style exists
              placeholder="Enter price"
              keyboardType="numeric"
              value={servicePrice}
              onChangeText={setServicePrice}
            />
            <Dropdown
              style={[
                styles.dropdown,
                styles.priceDropdown,
                isFocus && styles.dropdownFocus,
              ]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={priceUnits}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? 'Unit' : '...'}
              value={priceUnit}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setPriceUnit(item.value);
                setIsFocus(false);
              }}
            />
          </View>
          {errors.servicePrice && (
            <Text style={styles.errorText}>{errors.servicePrice}</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Need BW Team Support</Text>
          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setNeedSupport(true)}>
              <View
                style={[
                  styles.radioOuter,
                  needSupport && styles.radioSelected,
                ]}>
                {needSupport && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.radioLabel}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setNeedSupport(false)}>
              <View
                style={[
                  styles.radioOuter,
                  !needSupport && styles.radioSelected,
                ]}>
                {!needSupport && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.radioLabel}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Profession Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Describe your profession, skills, and expertise"
            multiline
            numberOfLines={4}
            value={professionDescription}
            onChangeText={setProfessionDescription}
          />
        </View>
        
        {!editMode && ( // Only show agreement checkbox if not in edit mode
            <View style={styles.checkboxContainer}>
            <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setIsAgreed(!isAgreed)}>
                {isAgreed ? (
                <AntDesign name="checkcircle" size={24} color="#1E40AF" />
                ) : (
                <AntDesign name="checkcircleo" size={24} color="#94A3B8" />
                )}
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>
                I acknowledge every detail given here is true
            </Text>
            </View>
        )}
        {errors.isAgreed && !editMode && ( // Only show error if not in edit mode
          <Text style={styles.errorText}>{errors.isAgreed}</Text>
        )}

        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmit}
          disabled={isLoading} // Disable button when loading
        >
          <LinearGradient
            colors={['#1E40AF', '#3B82F6']}
            style={styles.submitButtonGradient}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>{submitButtonText}</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={showSuccessModal}
          onRequestClose={() => {
            setShowSuccessModal(false);
            navigation.goBack(); // Navigate back on modal close
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <AntDesign
                name="checkcircle"
                size={60}
                color="#1E40AF"
                style={styles.modalIcon}
              />
              <Text style={styles.modalTitle}>Registration Successful!</Text>
              <Text style={styles.modalText}>Your professional profile has been submitted.</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setShowSuccessModal(false);
                  navigation.goBack();
                }}>
                <LinearGradient
                  colors={['#1E40AF', '#3B82F6']}
                  style={styles.modalButtonGradient}>
                  <Text style={styles.modalButtonText}>Continue</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddProfessionScreen;



// import React, { useState, useEffect } from 'react';
// import {
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Modal,
//   SafeAreaView,
//   Alert, // Added Alert import
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import { Dropdown } from 'react-native-element-dropdown';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import styles from '../styles/AddProfessionStyles';
// import {
//   states,
//   districts,
//   cities,
//   serviceCategories,
//   serviceNames,
//   experienceLevels,
//   priceUnits,
// } from '../data/staticData';
// import { addProfession, getUserProfile } from '../services/api';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const AddProfessionScreen = ({ navigation }) => {
//   // Form state
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [mobileNo, setMobileNo] = useState('');
//   const [secondaryMobileNo, setSecondaryMobileNo] = useState('');
//   const [state, setState] = useState('');
//   const [district, setDistrict] = useState('');
//   const [city, setCity] = useState('');
//   const [serviceCategory, setServiceCategory] = useState('');
//   const [serviceName, setServiceName] = useState('');
//   const [customServiceName, setCustomServiceName] = useState(''); // New state for custom service name
//   const [experience, setExperience] = useState('');
//   const [servicePrice, setServicePrice] = useState('');
//   const [priceUnit, setPriceUnit] = useState('per hour');
//   const [needSupport, setNeedSupport] = useState(false);
//   const [professionDescription, setProfessionDescription] = useState('');
//   const [isAgreed, setIsAgreed] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [isFocus, setIsFocus] = useState(false);
//   const [errors, setErrors] = useState({});

//   // Fetch user profile on component mount
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const response = await getUserProfile();
//         const userData = response.data;
//         setName(userData.name);
//         setEmail(userData.email);
//         setMobileNo(userData.mobile);
//       } catch (error) {
//         console.error('Error fetching user profile:', error);
//       }
//     };

//     fetchUserProfile();
//   }, []);

//   // Filter districts and cities
//   const filteredDistricts = districts.filter(item => item.state === state);
//   const filteredCities = district ? cities[district] || [] : [];
//   const filteredServiceNames = serviceCategory
//     ? serviceNames[serviceCategory] || []
//     : [];

//   // Form validation
//   const validateForm = () => {
//     let valid = true;
//     let newErrors = {};

//     if (!name) (newErrors.name = 'Name is required'), (valid = false);
//     if (!email) (newErrors.email = 'Email is required'), (valid = false);
//     else if (!/\S+@\S+\.\S+/.test(email))
//       (newErrors.email = 'Email is invalid'), (valid = false);
//     if (!mobileNo)
//       (newErrors.mobileNo = 'Mobile number is required'), (valid = false);
//     else if (!/^\d{10}$/.test(mobileNo))
//       (newErrors.mobileNo = 'Mobile number must be 10 digits'), (valid = false);
//     if (secondaryMobileNo && !/^\d{10}$/.test(secondaryMobileNo))
//       (newErrors.secondaryMobileNo = 'Secondary mobile must be 10 digits'),
//         (valid = false);
//     if (!state) (newErrors.state = 'State is required'), (valid = false);
//     if (!district)
//       (newErrors.district = 'District is required'), (valid = false);
//     if (!city) (newErrors.city = 'City is required'), (valid = false);
//     if (!serviceCategory)
//       (newErrors.serviceCategory = 'Service category is required'),
//         (valid = false);
//     if (!serviceName)
//       (newErrors.serviceName = 'Service name is required'), (valid = false);
//     // Validate custom service name if "Others" is selected
//     if (serviceName === 'others' && !customServiceName)
//       (newErrors.customServiceName = 'Custom service name is required'),
//         (valid = false);
//     if (!experience)
//       (newErrors.experience = 'Experience is required'), (valid = false);
//     if (!servicePrice)
//       (newErrors.servicePrice = 'Service price is required'), (valid = false);
//     else if (isNaN(servicePrice))
//       (newErrors.servicePrice = 'Service price must be a number'),
//         (valid = false);
//     if (!isAgreed)
//       (newErrors.isAgreed = 'You must agree to the terms'), (valid = false);

//     setErrors(newErrors);
//     return valid;
//   };

//   // Handle form submission
//   const handleSubmit = async () => {
//     if (validateForm()) {
//       try {
//         const formData = {
//           name,
//           email,
//           mobileNo,
//           secondaryMobileNo,
//           state,
//           district,
//           city,
//           serviceCategory,
//           // Use customServiceName if serviceName is 'others', otherwise use serviceName
//           serviceName: serviceName === 'others' ? customServiceName : serviceName,
//           experience,
//           servicePrice,
//           priceUnit,
//           needSupport,
//           professionDescription,
//           isAgreed,
//         };

//         await addProfession(formData);
//         await AsyncStorage.setItem('isProfession', 'true');
//         setShowSuccessModal(true);
//       } catch (error) {
//         console.error('Error submitting profession:', error);
//         Alert.alert(
//           'Error',
//           error.message || 'Failed to submit profession details',
//         );
//       }
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.contentContainer}>
//         <View style={styles.headerContainer}>
//           <TouchableOpacity
//             onPress={() => navigation.goBack()}
//             style={styles.backButton}>
//             <AntDesign name="arrowleft" size={24} color="#1E40AF" />
//           </TouchableOpacity>
//           <Text style={styles.header}>Registration</Text>
//         </View>

//         {/* Personal Information */}
//         <Text style={styles.sectionHeader}>Personal Information</Text>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Name*</Text>
//           <TextInput
//             style={[styles.input, { backgroundColor: '#F1F5F9' }]}
//             placeholder="Enter your full name"
//             value={name}
//             onChangeText={setName}
//             editable={false}
//           />
//           {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
//         </View>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Email*</Text>
//           <TextInput
//             style={[styles.input, { backgroundColor: '#F1F5F9' }]}
//             placeholder="Enter your email"
//             keyboardType="email-address"
//             value={email}
//             onChangeText={setEmail}
//             editable={false}
//           />
//           {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
//         </View>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Mobile No*</Text>
//           <TextInput
//             style={[styles.input, { backgroundColor: '#F1F5F9' }]}
//             placeholder="Enter 10 digit mobile number"
//             keyboardType="phone-pad"
//             maxLength={10}
//             value={mobileNo}
//             onChangeText={setMobileNo}
//             editable={false}
//           />
//           {errors.mobileNo && (
//             <Text style={styles.errorText}>{errors.mobileNo}</Text>
//           )}
//         </View>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Secondary Mobile No</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter secondary mobile number"
//             keyboardType="phone-pad"
//             maxLength={10}
//             value={secondaryMobileNo}
//             onChangeText={setSecondaryMobileNo}
//           />
//           {errors.secondaryMobileNo && (
//             <Text style={styles.errorText}>{errors.secondaryMobileNo}</Text>
//           )}
//         </View>

//         {/* Location Information */}
//         <Text style={styles.sectionHeader}>Location Information</Text>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>State*</Text>
//           <Dropdown
//             style={[styles.dropdown, isFocus && styles.dropdownFocus]}
//             placeholderStyle={styles.placeholderStyle}
//             selectedTextStyle={styles.selectedTextStyle}
//             inputSearchStyle={styles.inputSearchStyle}
//             iconStyle={styles.iconStyle}
//             data={states}
//             search
//             maxHeight={300}
//             labelField="label"
//             valueField="value"
//             placeholder="Select state"
//             searchPlaceholder="Search..."
//             value={state}
//             onFocus={() => setIsFocus(true)}
//             onBlur={() => setIsFocus(false)}
//             onChange={item => {
//               setState(item.value);
//               setDistrict('');
//               setCity('');
//               setIsFocus(false);
//             }}
//             renderLeftIcon={() => (
//               <AntDesign
//                 style={styles.icon}
//                 color={isFocus ? '#1E40AF' : '#1E40AF'}
//                 name="enviromento"
//                 size={20}
//               />
//             )}
//           />
//           {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
//         </View>

//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>District*</Text>
//           <Dropdown
//             style={[styles.dropdown, isFocus && styles.dropdownFocus]}
//             placeholderStyle={styles.placeholderStyle}
//             selectedTextStyle={styles.selectedTextStyle}
//             inputSearchStyle={styles.inputSearchStyle}
//             iconStyle={styles.iconStyle}
//             data={filteredDistricts}
//             search
//             maxHeight={300}
//             labelField="label"
//             valueField="value"
//             placeholder="Select district"
//             searchPlaceholder="Search..."
//             value={district}
//             onFocus={() => setIsFocus(true)}
//             onBlur={() => setIsFocus(false)}
//             onChange={item => {
//               setDistrict(item.value);
//               setCity('');
//               setIsFocus(false);
//             }}
//             renderLeftIcon={() => (
//               <AntDesign
//                 style={styles.icon}
//                 color={isFocus ? '#1E40AF' : '#1E40AF'}
//                 name="enviromento"
//                 size={20}
//               />
//             )}
//           />
//           {errors.district && (
//             <Text style={styles.errorText}>{errors.district}</Text>
//           )}
//         </View>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>City*</Text>
//           <Dropdown
//             style={[styles.dropdown, isFocus && styles.dropdownFocus]}
//             placeholderStyle={styles.placeholderStyle}
//             selectedTextStyle={styles.selectedTextStyle}
//             inputSearchStyle={styles.inputSearchStyle}
//             iconStyle={styles.iconStyle}
//             data={filteredCities}
//             search
//             maxHeight={300}
//             labelField="label"
//             valueField="value"
//             placeholder="Select city"
//             searchPlaceholder="Search..."
//             value={city}
//             onFocus={() => setIsFocus(true)}
//             onBlur={() => setIsFocus(false)}
//             onChange={item => {
//               setCity(item.value);
//               setIsFocus(false);
//             }}
//             renderLeftIcon={() => (
//               <AntDesign
//                 style={styles.icon}
//                 color={isFocus ? '#1E40AF' : '#1E40AF'}
//                 name="enviromento"
//                 size={20}
//               />
//             )}
//           />
//           {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
//         </View>

//         {/* Professional Information */}
//         <Text style={styles.sectionHeader}>Professional Information</Text>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Service Category*</Text>
//           <Dropdown
//             style={[styles.dropdown, isFocus && styles.dropdownFocus]}
//             placeholderStyle={styles.placeholderStyle}
//             selectedTextStyle={styles.selectedTextStyle}
//             inputSearchStyle={styles.inputSearchStyle}
//             iconStyle={styles.iconStyle}
//             data={serviceCategories}
//             search
//             maxHeight={300}
//             labelField="label"
//             valueField="value"
//             placeholder="Select service category"
//             searchPlaceholder="Search..."
//             value={serviceCategory}
//             onFocus={() => setIsFocus(true)}
//             onBlur={() => setIsFocus(false)}
//             onChange={item => {
//               setServiceCategory(item.value);
//               setServiceName('');
//               setCustomServiceName(''); // Reset custom service name
//               setIsFocus(false);
//             }}
//             renderLeftIcon={() => (
//               <AntDesign
//                 style={styles.icon}
//                 color={isFocus ? '#1E40AF' : '#1E40AF'}
//                 name="profile"
//                 size={20}
//               />
//             )}
//           />
//           {errors.serviceCategory && (
//             <Text style={styles.errorText}>{errors.serviceCategory}</Text>
//           )}
//         </View>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Service Name*</Text>
//           <Dropdown
//             style={[styles.dropdown, isFocus && styles.dropdownFocus]}
//             placeholderStyle={styles.placeholderStyle}
//             selectedTextStyle={styles.selectedTextStyle}
//             inputSearchStyle={styles.inputSearchStyle}
//             iconStyle={styles.iconStyle}
//             data={filteredServiceNames}
//             search
//             maxHeight={300}
//             labelField="label"
//             valueField="value"
//             placeholder="Select service name"
//             searchPlaceholder="Search..."
//             value={serviceName}
//             onFocus={() => setIsFocus(true)}
//             onBlur={() => setIsFocus(false)}
//             onChange={item => {
//               setServiceName(item.value);
//               if (item.value !== 'others') {
//                 setCustomServiceName(''); // Clear custom service name if not "Others"
//               }
//               setIsFocus(false);
//             }}
//             renderLeftIcon={() => (
//               <AntDesign
//                 style={styles.icon}
//                 color={isFocus ? '#1E40AF' : '#1E40AF'}
//                 name="profile"
//                 size={20}
//               />
//             )}
//           />
//           {errors.serviceName && (
//             <Text style={styles.errorText}>{errors.serviceName}</Text>
//           )}
//         </View>
//         {/* Conditionally render custom service name input */}
//         {serviceName === 'others' && (
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Custom Service Name*</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Enter custom service name"
//               value={customServiceName}
//               onChangeText={setCustomServiceName}
//             />
//             {errors.customServiceName && (
//               <Text style={styles.errorText}>{errors.customServiceName}</Text>
//             )}
//           </View>
//         )}
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Experience*</Text>
//           <Dropdown
//             style={[styles.dropdown, isFocus && styles.dropdownFocus]}
//             placeholderStyle={styles.placeholderStyle}
//             selectedTextStyle={styles.selectedTextStyle}
//             inputSearchStyle={styles.inputSearchStyle}
//             iconStyle={styles.iconStyle}
//             data={experienceLevels}
//             maxHeight={300}
//             labelField="label"
//             valueField="value"
//             placeholder="Select experience level"
//             value={experience}
//             onFocus={() => setIsFocus(true)}
//             onBlur={() => setIsFocus(false)}
//             onChange={item => {
//               setExperience(item.value);
//               setIsFocus(false);
//             }}
//             renderLeftIcon={() => (
//               <AntDesign
//                 style={styles.icon}
//                 color={isFocus ? '#1E40AF' : '#1E40AF'}
//                 name="clockcircleo"
//                 size={20}
//               />
//             )}
//           />
//           {errors.experience && (
//             <Text style={styles.errorText}>{errors.experience}</Text>
//           )}
//         </View>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Service Price*</Text>
//           <View style={styles.priceContainer}>
//             <TextInput
//               style={[styles.input, styles.priceInput]}
//               placeholder="Enter price"
//               keyboardType="numeric"
//               value={servicePrice}
//               onChangeText={setServicePrice}
//             />
//             <Dropdown
//               style={[
//                 styles.dropdown,
//                 styles.priceDropdown,
//                 isFocus && styles.dropdownFocus,
//               ]}
//               placeholderStyle={styles.placeholderStyle}
//               selectedTextStyle={styles.selectedTextStyle}
//               inputSearchStyle={styles.inputSearchStyle}
//               iconStyle={styles.iconStyle}
//               data={priceUnits}
//               maxHeight={300}
//               labelField="label"
//               valueField="value"
//               placeholder="Unit"
//               value={priceUnit}
//               onFocus={() => setIsFocus(true)}
//               onBlur={() => setIsFocus(false)}
//               onChange={item => {
//                 setPriceUnit(item.value);
//                 setIsFocus(false);
//               }}
//             />
//           </View>
//           {errors.servicePrice && (
//             <Text style={styles.errorText}>{errors.servicePrice}</Text>
//           )}
//         </View>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Need BW Team Support</Text>
//           <View style={styles.radioContainer}>
//             <TouchableOpacity
//               style={styles.radioButton}
//               onPress={() => setNeedSupport(true)}>
//               <View
//                 style={[
//                   styles.radioOuter,
//                   needSupport && styles.radioSelected,
//                 ]}>
//                 {needSupport && <View style={styles.radioInner} />}
//               </View>
//               <Text style={styles.radioLabel}>Yes</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.radioButton}
//               onPress={() => setNeedSupport(false)}>
//               <View
//                 style={[
//                   styles.radioOuter,
//                   !needSupport && styles.radioSelected,
//                 ]}>
//                 {!needSupport && <View style={styles.radioInner} />}
//               </View>
//               <Text style={styles.radioLabel}>No</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Profession Description</Text>
//           <TextInput
//             style={[styles.input, styles.multilineInput]}
//             placeholder="Describe your profession, skills, and expertise"
//             multiline
//             numberOfLines={4}
//             value={professionDescription}
//             onChangeText={setProfessionDescription}
//           />
//         </View>
//         <View style={styles.checkboxContainer}>
//           <TouchableOpacity
//             style={styles.checkbox}
//             onPress={() => setIsAgreed(!isAgreed)}>
//             {isAgreed ? (
//               <AntDesign name="checkcircle" size={24} color="#1E40AF" />
//             ) : (
//               <AntDesign name="checkcircleo" size={24} color="#94A3B8" />
//             )}
//           </TouchableOpacity>
//           <Text style={styles.checkboxLabel}>
//             I acknowledge every detail given here is true
//           </Text>
//         </View>
//         {errors.isAgreed && (
//           <Text style={styles.errorText}>{errors.isAgreed}</Text>
//         )}

//         <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//           <LinearGradient
//             colors={['#1E40AF', '#3B82F6']}
//             style={styles.submitButtonGradient}>
//             <Text style={styles.submitButtonText}>Submit</Text>
//           </LinearGradient>
//         </TouchableOpacity>

//         {/* Success Modal */}
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={showSuccessModal}
//           onRequestClose={() => setShowSuccessModal(false)}>
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <AntDesign
//                 name="checkcircle"
//                 size={60}
//                 color="#1E40AF"
//                 style={styles.modalIcon}
//               />
//               <Text style={styles.modalTitle}>Registration Successful!</Text>
//               <Text style={styles.modalText}>Enjoy BW Free trial period</Text>
//               <TouchableOpacity
//                 style={styles.modalButton}
//                 onPress={() => {
//                   setShowSuccessModal(false);
//                   navigation.goBack();
//                 }}>
//                 <LinearGradient
//                   colors={['#1E40AF', '#3B82F6']}
//                   style={styles.modalButtonGradient}>
//                   <Text style={styles.modalButtonText}>Continue</Text>
//                 </LinearGradient>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default AddProfessionScreen;


// import React, {useState, useEffect} from 'react';
// import {
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Modal,
//   SafeAreaView,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import {Dropdown} from 'react-native-element-dropdown';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import styles from '../styles/AddProfessionStyles';
// import {
//   states,
//   districts,
//   cities,
//   serviceCategories,
//   serviceNames,
//   experienceLevels,
//   priceUnits,
// } from '../data/staticData';
// import {addProfession, getUserProfile} from '../services/api'; // Importing the API function
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const AddProfessionScreen = ({navigation}) => {
//   // Form state
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [mobileNo, setMobileNo] = useState('');
//   const [secondaryMobileNo, setSecondaryMobileNo] = useState('');
//   const [state, setState] = useState('');
//   const [district, setDistrict] = useState('');
//   const [city, setCity] = useState('');
//   const [serviceCategory, setServiceCategory] = useState('');
//   const [serviceName, setServiceName] = useState('');
//   const [experience, setExperience] = useState('');
//   const [servicePrice, setServicePrice] = useState('');
//   const [priceUnit, setPriceUnit] = useState('per hour');
//   const [needSupport, setNeedSupport] = useState(false);
//   const [professionDescription, setProfessionDescription] = useState('');
//   const [isAgreed, setIsAgreed] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [isFocus, setIsFocus] = useState(false);
//   const [errors, setErrors] = useState({});

//   // Fetch user profile on component mount
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const response = await getUserProfile();
//         const userData = response.data; // Assuming response contains user data
//         setName(userData.name);
//         setEmail(userData.email);
//         setMobileNo(userData.mobile);
//       } catch (error) {
//         console.error('Error fetching user profile:', error);
//       }
//     };

//     fetchUserProfile();
//   }, []);

//   // Filter districts and cities
//   const filteredDistricts = districts.filter(item => item.state === state);
//   const filteredCities = district ? cities[district] || [] : [];
//   const filteredServiceNames = serviceCategory
//     ? serviceNames[serviceCategory] || []
//     : [];

//   // Form validation
//   const validateForm = () => {
//     let valid = true;
//     let newErrors = {};

//     if (!name) (newErrors.name = 'Name is required'), (valid = false);
//     if (!email) (newErrors.email = 'Email is required'), (valid = false);
//     else if (!/\S+@\S+\.\S+/.test(email))
//       (newErrors.email = 'Email is invalid'), (valid = false);
//     if (!mobileNo)
//       (newErrors.mobileNo = 'Mobile number is required'), (valid = false);
//     else if (!/^\d{10}$/.test(mobileNo))
//       (newErrors.mobileNo = 'Mobile number must be 10 digits'), (valid = false);
//     if (secondaryMobileNo && !/^\d{10}$/.test(secondaryMobileNo))
//       (newErrors.secondaryMobileNo = 'Secondary mobile must be 10 digits'),
//         (valid = false);
//     if (!state) (newErrors.state = 'State is required'), (valid = false);
//     if (!district)
//       (newErrors.district = 'District is required'), (valid = false);
//     if (!city) (newErrors.city = 'City is required'), (valid = false);
//     if (!serviceCategory)
//       (newErrors.serviceCategory = 'Service category is required'),
//         (valid = false);
//     if (!serviceName)
//       (newErrors.serviceName = 'Service name is required'), (valid = false);
//     if (!experience)
//       (newErrors.experience = 'Experience is required'), (valid = false);
//     if (!servicePrice)
//       (newErrors.servicePrice = 'Service price is required'), (valid = false);
//     else if (isNaN(servicePrice))
//       (newErrors.servicePrice = 'Service price must be a number'),
//         (valid = false);
//     if (!isAgreed)
//       (newErrors.isAgreed = 'You must agree to the terms'), (valid = false);

//     setErrors(newErrors);
//     return valid;
//   };

//   // Handle form submission
//   // Replace the handleSubmit function in AddProfessionScreen.js
//   const handleSubmit = async () => {
//     if (validateForm()) {
//       try {
//         const formData = {
//           name,
//           email,
//           mobileNo,
//           secondaryMobileNo,
//           state,
//           district,
//           city,
//           serviceCategory,
//           serviceName,
//           experience,
//           servicePrice,
//           priceUnit,
//           needSupport,
//           professionDescription,
//           isAgreed,
//         };

//         await addProfession(formData);
//         await AsyncStorage.setItem('isProfession', 'true');
//         setShowSuccessModal(true);
//       } catch (error) {
//         console.error('Error submitting profession:', error);
//         Alert.alert(
//           'Error',
//           error.message || 'Failed to submit profession details',
//         );
//       }
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.contentContainer}>
//         <View style={styles.headerContainer}>
//           <TouchableOpacity
//             onPress={() => navigation.goBack()}
//             style={styles.backButton}>
//             <AntDesign name="arrowleft" size={24} color="#1E40AF" />
//           </TouchableOpacity>
//           <Text style={styles.header}>Registration</Text>
//         </View>

//         {/* Personal Information */}
//         <Text style={styles.sectionHeader}>Personal Information</Text>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Name*</Text>
//           <TextInput
//             style={[styles.input, {backgroundColor: '#F1F5F9'}]} // Light gray background for disabled fields
//             placeholder="Enter your full name"
//             value={name}
//             onChangeText={setName}
//             editable={false} // Disable input
//           />
//           {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
//         </View>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Email*</Text>
//           <TextInput
//             style={[styles.input, {backgroundColor: '#F1F5F9'}]}
//             placeholder="Enter your email"
//             keyboardType="email-address"
//             value={email}
//             onChangeText={setEmail}
//             editable={false} // Disable input
//           />
//           {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
//         </View>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Mobile No*</Text>
//           <TextInput
//             style={[styles.input, {backgroundColor: '#F1F5F9'}]}
//             placeholder="Enter 10 digit mobile number"
//             keyboardType="phone-pad"
//             maxLength={10}
//             value={mobileNo}
//             onChangeText={setMobileNo}
//             editable={false} // Disable input
//           />
//           {errors.mobileNo && (
//             <Text style={styles.errorText}>{errors.mobileNo}</Text>
//           )}
//         </View>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Secondary Mobile No</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter secondary mobile number"
//             keyboardType="phone-pad"
//             maxLength={10}
//             value={secondaryMobileNo}
//             onChangeText={setSecondaryMobileNo}
//           />
//           {errors.secondaryMobileNo && (
//             <Text style={styles.errorText}>{errors.secondaryMobileNo}</Text>
//           )}
//         </View>

//         {/* Location Information */}
//         <Text style={styles.sectionHeader}>Location Information</Text>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>State*</Text>
//           <Dropdown
//             style={[styles.dropdown, isFocus && styles.dropdownFocus]}
//             placeholderStyle={styles.placeholderStyle}
//             selectedTextStyle={styles.selectedTextStyle}
//             inputSearchStyle={styles.inputSearchStyle}
//             iconStyle={styles.iconStyle}
//             data={states}
//             search
//             maxHeight={300}
//             labelField="label"
//             valueField="value"
//             placeholder="Select state"
//             searchPlaceholder="Search..."
//             value={state}
//             onFocus={() => setIsFocus(true)}
//             onBlur={() => setIsFocus(false)}
//             onChange={item => {
//               setState(item.value);
//               setDistrict('');
//               setCity('');
//               setIsFocus(false);
//             }}
//             renderLeftIcon={() => (
//               <AntDesign
//                 style={styles.icon}
//                 color={isFocus ? '#1E40AF' : '#1E40AF'}
//                 name="enviromento"
//                 size={20}
//               />
//             )}
//           />
//           {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
//         </View>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>District*</Text>
//           <Dropdown
//             style={[styles.dropdown, isFocus && styles.dropdownFocus]}
//             placeholderStyle={styles.placeholderStyle}
//             selectedTextStyle={styles.selectedTextStyle}
//             inputSearchStyle={styles.inputSearchStyle}
//             iconStyle={styles.iconStyle}
//             data={filteredDistricts}
//             search
//             maxHeight={300}
//             labelField="label"
//             valueField="value"
//             placeholder="Select district"
//             searchPlaceholder="Search..."
//             value={district}
//             onFocus={() => setIsFocus(true)}
//             onBlur={() => setIsFocus(false)}
//             onChange={item => {
//               setDistrict(item.value);
//               setCity('');
//               setIsFocus(false);
//             }}
//             renderLeftIcon={() => (
//               <AntDesign
//                 style={styles.icon}
//                 color={isFocus ? '#1E40AF' : '#1E40AF'}
//                 name="enviromento"
//                 size={20}
//               />
//             )}
//           />
//           {errors.district && (
//             <Text style={styles.errorText}>{errors.district}</Text>
//           )}
//         </View>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>City*</Text>
//           <Dropdown
//             style={[styles.dropdown, isFocus && styles.dropdownFocus]}
//             placeholderStyle={styles.placeholderStyle}
//             selectedTextStyle={styles.selectedTextStyle}
//             inputSearchStyle={styles.inputSearchStyle}
//             iconStyle={styles.iconStyle}
//             data={filteredCities}
//             search
//             maxHeight={300}
//             labelField="label"
//             valueField="value"
//             placeholder="Select city"
//             searchPlaceholder="Search..."
//             value={city}
//             onFocus={() => setIsFocus(true)}
//             onBlur={() => setIsFocus(false)}
//             onChange={item => {
//               setCity(item.value);
//               setIsFocus(false);
//             }}
//             renderLeftIcon={() => (
//               <AntDesign
//                 style={styles.icon}
//                 color={isFocus ? '#1E40AF' : '#1E40AF'}
//                 name="enviromento"
//                 size={20}
//               />
//             )}
//           />
//           {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
//         </View>

//         {/* Professional Information */}
//         <Text style={styles.sectionHeader}>Professional Information</Text>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Service Category*</Text>
//           <Dropdown
//             style={[styles.dropdown, isFocus && styles.dropdownFocus]}
//             placeholderStyle={styles.placeholderStyle}
//             selectedTextStyle={styles.selectedTextStyle}
//             inputSearchStyle={styles.inputSearchStyle}
//             iconStyle={styles.iconStyle}
//             data={serviceCategories}
//             search
//             maxHeight={300}
//             labelField="label"
//             valueField="value"
//             placeholder="Select service category"
//             searchPlaceholder="Search..."
//             value={serviceCategory}
//             onFocus={() => setIsFocus(true)}
//             onBlur={() => setIsFocus(false)}
//             onChange={item => {
//               setServiceCategory(item.value);
//               setServiceName('');
//               setIsFocus(false);
//             }}
//             renderLeftIcon={() => (
//               <AntDesign
//                 style={styles.icon}
//                 color={isFocus ? '#1E40AF' : '#1E40AF'}
//                 name="profile"
//                 size={20}
//               />
//             )}
//           />
//           {errors.serviceCategory && (
//             <Text style={styles.errorText}>{errors.serviceCategory}</Text>
//           )}
//         </View>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Service Name*</Text>
//           <Dropdown
//             style={[styles.dropdown, isFocus && styles.dropdownFocus]}
//             placeholderStyle={styles.placeholderStyle}
//             selectedTextStyle={styles.selectedTextStyle}
//             inputSearchStyle={styles.inputSearchStyle}
//             iconStyle={styles.iconStyle}
//             data={filteredServiceNames}
//             search
//             maxHeight={300}
//             labelField="label"
//             valueField="value"
//             placeholder="Select service name"
//             searchPlaceholder="Search..."
//             value={serviceName}
//             onFocus={() => setIsFocus(true)}
//             onBlur={() => setIsFocus(false)}
//             onChange={item => {
//               setServiceName(item.value);
//               setIsFocus(false);
//             }}
//             renderLeftIcon={() => (
//               <AntDesign
//                 style={styles.icon}
//                 color={isFocus ? '#1E40AF' : '#1E40AF'}
//                 name="profile"
//                 size={20}
//               />
//             )}
//           />
//           {errors.serviceName && (
//             <Text style={styles.errorText}>{errors.serviceName}</Text>
//           )}
//         </View>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Experience*</Text>
//           <Dropdown
//             style={[styles.dropdown, isFocus && styles.dropdownFocus]}
//             placeholderStyle={styles.placeholderStyle}
//             selectedTextStyle={styles.selectedTextStyle}
//             inputSearchStyle={styles.inputSearchStyle}
//             iconStyle={styles.iconStyle}
//             data={experienceLevels}
//             maxHeight={300}
//             labelField="label"
//             valueField="value"
//             placeholder="Select experience level"
//             value={experience}
//             onFocus={() => setIsFocus(true)}
//             onBlur={() => setIsFocus(false)}
//             onChange={item => {
//               setExperience(item.value);
//               setIsFocus(false);
//             }}
//             renderLeftIcon={() => (
//               <AntDesign
//                 style={styles.icon}
//                 color={isFocus ? '#1E40AF' : '#1E40AF'}
//                 name="clockcircleo"
//                 size={20}
//               />
//             )}
//           />
//           {errors.experience && (
//             <Text style={styles.errorText}>{errors.experience}</Text>
//           )}
//         </View>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Service Price*</Text>
//           <View style={styles.priceContainer}>
//             <TextInput
//               style={[styles.input, styles.priceInput]}
//               placeholder="Enter price"
//               keyboardType="numeric"
//               value={servicePrice}
//               onChangeText={setServicePrice}
//             />
//             <Dropdown
//               style={[
//                 styles.dropdown,
//                 styles.priceDropdown,
//                 isFocus && styles.dropdownFocus,
//               ]}
//               placeholderStyle={styles.placeholderStyle}
//               selectedTextStyle={styles.selectedTextStyle}
//               inputSearchStyle={styles.inputSearchStyle}
//               iconStyle={styles.iconStyle}
//               data={priceUnits}
//               maxHeight={300}
//               labelField="label"
//               valueField="value"
//               placeholder="Unit"
//               value={priceUnit}
//               onFocus={() => setIsFocus(true)}
//               onBlur={() => setIsFocus(false)}
//               onChange={item => {
//                 setPriceUnit(item.value);
//                 setIsFocus(false);
//               }}
//             />
//           </View>
//           {errors.servicePrice && (
//             <Text style={styles.errorText}>{errors.servicePrice}</Text>
//           )}
//         </View>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Need BW Team Support</Text>
//           <View style={styles.radioContainer}>
//             <TouchableOpacity
//               style={styles.radioButton}
//               onPress={() => setNeedSupport(true)}>
//               <View
//                 style={[
//                   styles.radioOuter,
//                   needSupport && styles.radioSelected,
//                 ]}>
//                 {needSupport && <View style={styles.radioInner} />}
//               </View>
//               <Text style={styles.radioLabel}>Yes</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.radioButton}
//               onPress={() => setNeedSupport(false)}>
//               <View
//                 style={[
//                   styles.radioOuter,
//                   !needSupport && styles.radioSelected,
//                 ]}>
//                 {!needSupport && <View style={styles.radioInner} />}
//               </View>
//               <Text style={styles.radioLabel}>No</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Profession Description</Text>
//           <TextInput
//             style={[styles.input, styles.multilineInput]}
//             placeholder="Describe your profession, skills, and expertise"
//             multiline
//             numberOfLines={4}
//             value={professionDescription}
//             onChangeText={setProfessionDescription}
//           />
//         </View>
//         <View style={styles.checkboxContainer}>
//           <TouchableOpacity
//             style={styles.checkbox}
//             onPress={() => setIsAgreed(!isAgreed)}>
//             {isAgreed ? (
//               <AntDesign name="checkcircle" size={24} color="#1E40AF" />
//             ) : (
//               <AntDesign name="checkcircleo" size={24} color="#94A3B8" />
//             )}
//           </TouchableOpacity>
//           <Text style={styles.checkboxLabel}>
//             I acknowledge every detail given here is true
//           </Text>
//         </View>
//         {errors.isAgreed && (
//           <Text style={styles.errorText}>{errors.isAgreed}</Text>
//         )}

//         <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
//           <LinearGradient
//             colors={['#1E40AF', '#3B82F6']}
//             style={styles.submitButtonGradient}>
//             <Text style={styles.submitButtonText}>Submit</Text>
//           </LinearGradient>
//         </TouchableOpacity>

//         {/* Success Modal */}
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={showSuccessModal}
//           onRequestClose={() => setShowSuccessModal(false)}>
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <AntDesign
//                 name="checkcircle"
//                 size={60}
//                 color="#1E40AF"
//                 style={styles.modalIcon}
//               />
//               <Text style={styles.modalTitle}>Registration Successful!</Text>
//               <Text style={styles.modalText}>Enjoy BW Free trial period</Text>
//               <TouchableOpacity
//                 style={styles.modalButton}
//                 onPress={() => {
//                   setShowSuccessModal(false);
//                   navigation.goBack();
//                 }}>
//                 <LinearGradient
//                   colors={['#1E40AF', '#3B82F6']}
//                   style={styles.modalButtonGradient}>
//                   <Text style={styles.modalButtonText}>Continue</Text>
//                 </LinearGradient>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default AddProfessionScreen;
