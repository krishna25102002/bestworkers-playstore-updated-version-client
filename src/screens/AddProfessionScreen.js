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
  Image, // Import Image
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
} from '../data/staticData';
import {addProfession, getUserProfile, updateProfessionalProfile, uploadProfileAvatar, getAvatarUrl} from '../services/api'; // Added uploadProfileAvatar, getAvatarUrl
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native'; // To get route params
import * as ImagePicker from 'react-native-image-picker'; // Import ImagePicker
import AppText from '../components/AppText'; // Import AppText


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
  // const [customCategoryName, setCustomCategoryName] = useState(''); // Removed: No custom category input
  const [designation, setDesignation] = useState(''); // New state for designation
  const [experience, setExperience] = useState('');
  // const [servicePrice, setServicePrice] = useState(''); // Commented out
  // const [priceUnit, setPriceUnit] = useState('per hour'); // Commented out
  const [needSupport, setNeedSupport] = useState(false);
  const [professionDescription, setProfessionDescription] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // Added isLoading state
  const [showUpdateSuccessModal, setShowUpdateSuccessModal] = useState(false); // New state for update success
  const [avatarSource, setAvatarSource] = useState(null); // For image preview
  const [selectedPhotoAsset, setSelectedPhotoAsset] = useState(null); // To store selected photo asset for upload
  const [avatarTimestamp, setAvatarTimestamp] = useState(Date.now()); // For cache busting existing avatar
  
  const route = useRoute();
  const { editMode, existingData } = route.params || {};

  const screenTitle = editMode ? "Edit Professional Profile" : "Add Your Profession";
  const submitButtonText = editMode ? "Update Profile" : "Submit";

  // Populate form if in edit mode or fetch user profile for add mode
  useEffect(() => {
    if (editMode && existingData) {
      if (existingData.hasAvatar && existingData._id) {
        const newTimestamp = Date.now();
        setAvatarTimestamp(newTimestamp);
        setAvatarSource({ uri: getAvatarUrl(existingData._id, newTimestamp) });
      }
      console.log("Edit Mode: Populating form with existing data", existingData);
      // Set basic fields
      setName(existingData.name || '');
      setEmail(existingData.email || '');
      setMobileNo(existingData.mobileNo || existingData.mobile || ''); // Check for both mobileNo and mobile
      setSecondaryMobileNo(existingData.secondaryMobileNo || '');
      // setDesignation(existingData.designation || ''); // Designation will be set based on category/service logic below
      setExperience(existingData.experience || '');
      // setServicePrice(existingData.servicePrice ? String(existingData.servicePrice) : ''); // Commented out
      // setPriceUnit(existingData.priceUnit || 'per hour'); // Commented out
      setNeedSupport(existingData.needSupport || false);
      setProfessionDescription(existingData.professionDescription || '');

      // Populate State/District/City
      if (existingData.state) {
        setState(existingData.state);
        if (existingData.district) {
          setDistrict(existingData.district);
          if (existingData.city) setCity(existingData.city);
        }
      }

      // Populate Service Category, Custom Category Name, Service Name, and Designation
      const preloadedServiceCategory = existingData.serviceCategory || '';
      const preloadedServiceName = existingData.serviceName || '';
      const preloadedDesignation = existingData.designation || ''; // This is the most specific role/service

      setServiceCategory(preloadedServiceCategory);

      // Determine if the preloadedServiceName was a standard one or a custom one (entered via designation)
      const servicesForCategory = serviceNames[preloadedServiceCategory] || [];
      const isPreloadedServiceStandard = servicesForCategory.some(s => s.value === preloadedServiceName);

      if (isPreloadedServiceStandard && preloadedServiceName !== 'Explore others') {
        setServiceName(preloadedServiceName);
        setDesignation(preloadedDesignation); // This would be a more specific role under the standard service
      } else {
        // If serviceName was 'Explore others' OR if it was a custom string not in the standard list
        setServiceName('Explore others'); // Set dropdown to 'Explore others' value
        setDesignation(preloadedDesignation || preloadedServiceName); // The actual custom service name is in designation (or serviceName if designation was empty)
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
  }, [editMode, existingData, navigation]); // Removed serviceCategories, serviceNames from deps as they are static

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
    const services = serviceCategory ? serviceNames[serviceCategory] : [];
    // Ensure services is an array and add 'Explore others' if not already present
    let serviceOptions = Array.isArray(services) ? [...services] : [];
    if (!serviceOptions.some(s => s.value === 'Explore others')) { // Internal value is still 'Explore others'
        serviceOptions.push({ label: 'Others', value: 'Explore others' }); // Display label is 'Others'
    }
    return serviceOptions;
  }, [serviceCategory]); // serviceNames removed from deps as it's static


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
      (newErrors.designation = 'Designation is required when "Others" is selected'), (valid = false); // Adjusted error message
    if (!experience)
      (newErrors.experience = 'Experience is required'), (valid = false);
    // if (!servicePrice.trim()) // Commented out
    //   (newErrors.servicePrice = 'Service price is required'), (valid = false);
    // else if (isNaN(parseFloat(servicePrice))) // Check if it's a valid number // Commented out
    //   (newErrors.servicePrice = 'Service price must be a number'), // Commented out
    //     (valid = false); // Commented out
    if (!isAgreed && !editMode) // Agreement only required for new additions
      (newErrors.isAgreed = 'You must agree to the terms'), (valid = false);

    setErrors(newErrors);
    return valid;
  };

  const handleChoosePhoto = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: false,
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.7,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
          Alert.alert('Error', 'Could not select image: ' + response.errorMessage);
        } else if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          setAvatarSource({ uri: asset.uri }); // Preview selected image
          setSelectedPhotoAsset(asset); // Store asset for upload
        }
      },
    );
  };

  const uploadAvatarAfterSubmit = async () => {
    if (!selectedPhotoAsset) return; // No new photo selected

    const formData = new FormData();
    formData.append('avatar', {
      uri: selectedPhotoAsset.uri,
      type: selectedPhotoAsset.type || 'image/jpeg',
      name: selectedPhotoAsset.fileName || `avatar_${Date.now()}.${(selectedPhotoAsset.type || 'image/jpeg').split('/')[1]}`,
    });

    try {
      // setIsLoading(true); // Optionally show loading for avatar upload specifically
      const result = await uploadProfileAvatar(formData);
      if (result.success) {
        console.log('Avatar uploaded successfully after profile save/update.');
        // Optionally show another success message or just let the main success modal handle it
      } else {
        Alert.alert('Avatar Upload Failed', result.error || 'Could not upload profile picture separately.');
      }
    } catch (error) {
      Alert.alert('Avatar Upload Error', error.error || 'An unexpected error occurred during avatar upload.');
    } finally {
      // setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (validateForm()) {
      setIsLoading(true); // Start loading
      try {
        // Determine the final values to send to the backend
        const finalServiceCategory = serviceCategory; // serviceCategory is always a standard one now
        let finalServiceName;
        let finalDesignation;

        if (serviceName === 'Explore others') {
           // If 'Explore others' is selected (value from dropdown), save the literal string in serviceName
           finalServiceName = 'Explore others';
           // Save the user-entered custom name in designation
           finalDesignation = designation;
       } else {
            // If a standard service is selected, serviceName is the selected value
            finalServiceName = serviceName;
            // If a specific designation IS entered, use that. Otherwise, use the standard service name.
            finalDesignation = designation.trim() ? designation : finalServiceName;
        }


        const formData = {
          name,
          email,
          mobileNo,
          secondaryMobileNo,
          state,
          district,
          city,
          serviceCategory: finalServiceCategory,
          serviceName: finalServiceName, // This will now be 'Explore others' or the standard service name
          designation: finalDesignation,
          experience,
          // servicePrice: servicePrice ? parseFloat(servicePrice) : undefined, // Commented out, send undefined if empty
          // priceUnit: priceUnit || 'per hour', // Commented out, ensure a default or handle if empty
          needSupport,
          professionDescription,
          // isAgreed is for client-side validation, not usually sent to backend
        };

        console.log("Form Data to be submitted:", formData);


        if (editMode) {
          await updateProfessionalProfile(formData); // Assuming your API takes all fields
          // Alert.alert("Success", "Profile updated successfully!");
          // navigation.goBack(); // Or navigate to ProfileScreen and refresh
          if (selectedPhotoAsset) await uploadAvatarAfterSubmit(); // Upload avatar if selected
          setShowUpdateSuccessModal(true); // Show custom modal for update success
          
        } else {
          await addProfession(formData);
          await AsyncStorage.setItem('isProfession', 'true');
          if (selectedPhotoAsset) await uploadAvatarAfterSubmit(); // Upload avatar if selected
          setShowSuccessModal(true); 
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
          <AppText style={styles.header} bold>{screenTitle}</AppText>
        </View>

        {/* Avatar Upload Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handleChoosePhoto} style={styles.avatarContainer}>
            {avatarSource ? (
              <Image source={avatarSource} style={styles.avatarImage} key={avatarTimestamp} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <AntDesign name="camerao" size={40} color="#94A3B8" />
              </View>
            )}
            <View style={styles.cameraIconOverlay}>
                <AntDesign name="camera" size={18} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleChoosePhoto}>
            <AppText style={styles.changeAvatarText} medium>
              {avatarSource ? 'Change Profile Photo' : 'Add Profile Photo'}
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Personal Information */} 
        <AppText style={styles.sectionHeader} semiBold>Personal Information</AppText>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name*</Text>
          <TextInput
            style={[styles.input, {backgroundColor: '#F1F5F9'}]}
            placeholder="Enter your full name"
            value={name}
            editable={false} // Typically name is not editable here, fetched from user profile
          />
          {errors.name && <AppText style={styles.errorText}>{errors.name}</AppText>}
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
          {errors.email && <AppText style={styles.errorText}>{errors.email}</AppText>}
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
            <AppText style={styles.errorText}>{errors.mobileNo}</AppText>
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
            <AppText style={styles.errorText}>{errors.secondaryMobileNo}</AppText>
          )}
        </View>

        {/* Location Information */} 
        <AppText style={styles.sectionHeader} semiBold>Location Information</AppText>
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
          {errors.state && <AppText style={styles.errorText}>{errors.state}</AppText>}
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
            <AppText style={styles.errorText}>{errors.district}</AppText>
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
          {errors.city && <AppText style={styles.errorText}>{errors.city}</AppText>}
        </View>

        {/* Professional Information */} 
        <AppText style={styles.sectionHeader} semiBold>Professional Information</AppText>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Service Category*</Text>
          <Dropdown
            style={[styles.dropdown, isFocus && styles.dropdownFocus]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={serviceCategories} // This should include your 'Other' option
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
              // When category changes, reset service name and designation
              setServiceName('');
              setDesignation('');
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
            <AppText style={styles.errorText}>{errors.serviceCategory}</AppText>
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
            disable={!serviceCategory && !editMode}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setServiceName(item.value);
              if (item.value !== 'Explore others') {
                setDesignation(''); // Clear designation if a specific service is chosen
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
            <AppText style={styles.errorText}>{errors.serviceName}</AppText>
          )}
        </View>

        {/* Show Designation input if 'Explore others' is selected for ServiceName */}
        {serviceName === 'Explore others' && (
            <View style={styles.inputContainer}>
              <AppText style={styles.label}>
                Specify Service Name* {/* Adjusted label for clarity when "Others" is selected */}
              </AppText>
              <View style={styles.inputWithIconContainer}>
                <AntDesign
                  name="idcard"
                  size={20}
                  color="#1E40AF"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.inputWithIcon}
                  placeholder="Enter the specific service name" // Adjusted placeholder
                  placeholderTextColor="#94A3B8"
                  value={designation}
                  onChangeText={setDesignation}
                />
              </View>
              {errors.designation && <AppText style={styles.errorText}>{errors.designation}</AppText>}
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
            <AppText style={styles.errorText}>{errors.experience}</AppText>
          )}
        </View>

        {/* <View style={styles.inputContainer}>
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
            <AppText style={styles.errorText}>{errors.servicePrice}</AppText>
          )}
        </View> */}
        <View style={styles.inputContainer}>
          <AppText style={styles.label}>Need BW Team Support</AppText>
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
              <AppText style={styles.radioLabel}>Yes</AppText>
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
              <AppText style={styles.radioLabel}>No</AppText>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <AppText style={styles.label}>Profession Description (Optional)</AppText>
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
            <AppText style={styles.checkboxLabel}>
                I acknowledge every detail given here is true
            </AppText>
            </View>
        )}
        {errors.isAgreed && !editMode && ( // Only show error if not in edit mode
          <AppText style={styles.errorText}>{errors.isAgreed}</AppText>
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
              <AppText style={styles.submitButtonText} semiBold>{submitButtonText}</AppText>
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
              <AppText style={styles.modalTitle} bold>Registration Successful!</AppText>
              <AppText style={styles.modalText}>Your professional profile has been submitted.</AppText>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setShowSuccessModal(false);
                  navigation.goBack();
                }}>
                <LinearGradient
                  colors={['#1E40AF', '#3B82F6']}
                  style={styles.modalButtonGradient}>
                  <AppText style={styles.modalButtonText} semiBold>Continue</AppText>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

         {/* Modal for Update Success */}
         <Modal
          animationType="slide"
          transparent={true}
          visible={showUpdateSuccessModal}
          onRequestClose={() => {
            setShowUpdateSuccessModal(false);
            navigation.goBack(); // Navigate back on modal close
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <AntDesign
                name="checkcircle"
                size={60}
                color="#1E40AF" // Or your success color
                style={styles.modalIcon}
              />
              <AppText style={styles.modalTitle} bold>Update Successful!</AppText>
              <AppText style={styles.modalText}>Your professional profile has been updated.</AppText>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setShowUpdateSuccessModal(false);
                  navigation.goBack();
                }}>
                <LinearGradient
                  colors={['#1E40AF', '#3B82F6']} // Or your success button colors
                  style={styles.modalButtonGradient}>
                  <AppText style={styles.modalButtonText} semiBold>Continue</AppText>
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



// // c:\Users\kd1812\Desktop\BW NEW\BestWorkers_Client\src\screens\AddProfessionScreen.js
// import React, {useState, useEffect} from 'react';
// import {
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Modal,
//   SafeAreaView,
//   ActivityIndicator,
//   Alert, // Make sure Alert is imported if you use it
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
// } from '../data/staticData'; // Assuming your staticData.js has all these
// import {addProfession, getUserProfile, updateProfessionalProfile} from '../services/api'; // Added updateProfessionalProfile
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useRoute } from '@react-navigation/native'; // To get route params


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
//   const [designation, setDesignation] = useState(''); // New state for designation
//   const [experience, setExperience] = useState('');
//   const [servicePrice, setServicePrice] = useState('');
//   const [priceUnit, setPriceUnit] = useState('per hour');
//   const [needSupport, setNeedSupport] = useState(false);
//   const [professionDescription, setProfessionDescription] = useState('');
//   const [isAgreed, setIsAgreed] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [isFocus, setIsFocus] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false); // Added isLoading state

//   const route = useRoute();
//   const { editMode, existingData } = route.params || {};

//   const screenTitle = editMode ? "Edit Professional Profile" : "Add Your Profession";
//   const submitButtonText = editMode ? "Update Profile" : "Submit";

//   // Populate form if in edit mode or fetch user profile for add mode
//   useEffect(() => {
//     if (editMode && existingData) {
//       console.log("Edit Mode: Populating form with existing data", existingData);
//       // Set basic fields
//       setName(existingData.name || '');
//       setEmail(existingData.email || '');
//       setMobileNo(existingData.mobileNo || existingData.mobile || ''); // Check for both mobileNo and mobile
//       setSecondaryMobileNo(existingData.secondaryMobileNo || '');
//       setDesignation(existingData.designation || '');
//       setExperience(existingData.experience || '');
//       setServicePrice(existingData.servicePrice ? String(existingData.servicePrice) : '');
//       setPriceUnit(existingData.priceUnit || 'per hour');
//       setNeedSupport(existingData.needSupport || false);
//       setProfessionDescription(existingData.professionDescription || '');

//       // Set dropdown values - this will trigger re-filtering of dependent dropdowns
//       // Ensure these are set *after* the basic fields if there are any dependencies
//       // that might clear them.
//       if (existingData.state) {
//         setState(existingData.state);
//         if (existingData.district) {
//           setDistrict(existingData.district);
//           if (existingData.city) setCity(existingData.city);
//         }
//       }
//       if (existingData.serviceCategory) {
//         setServiceCategory(existingData.serviceCategory);
//         if (existingData.serviceName) setServiceName(existingData.serviceName);
//       }
//       // isAgreed is usually not part of existingData for editing, but you can set it if needed
//     } else if (!editMode) {
//       const fetchUserProfileForAdd = async () => {
//         try {
//           const response = await getUserProfile();
//           if (response.success && response.data) {
//             const userData = response.data;
//             setName(userData.name || '');
//             setEmail(userData.email || '');
//             setMobileNo(userData.mobile || '');
//           } else {
//             console.error('Failed to fetch user profile data or data is not in expected format:', response);
//             Alert.alert("Error", "Could not load your basic profile information.");
//           }
//         } catch (error) {
//           console.error('Error fetching user profile in AddProfessionScreen (add mode):', error);
//           if (error.response && error.response.status === 401) {
//             Alert.alert("Session Expired", "Please log in again.");
//             navigation.replace('Login');
//           } else {
//             Alert.alert("Error", "An error occurred while fetching your profile.");
//           }
//         }
//       };
//       fetchUserProfileForAdd();
//     }
//   }, [editMode, existingData, navigation]);

//   // Memoize filtered data to prevent unnecessary re-renders
//   const filteredDistricts = React.useMemo(() => {
//     console.log("Filtering districts for state:", state);
//     return state ? districts.filter(item => item.state === state) : [];
//   }, [state]);

//   const filteredCities = React.useMemo(() => {
//     console.log("Filtering cities for district:", district);
//     return district && state ? cities[district] || [] : []; // Ensure state is also present for context
//   }, [district, state]);

//   const filteredServiceNames = React.useMemo(() => {
//     console.log("Filtering service names for category:", serviceCategory);
//     return serviceCategory ? serviceNames[serviceCategory] || [] : [];
//   }, [serviceCategory]);


//   // Form validation
//   const validateForm = () => {
//     let valid = true;
//     let newErrors = {};

//     if (!name.trim()) (newErrors.name = 'Name is required'), (valid = false);
//     if (!email.trim()) (newErrors.email = 'Email is required'), (valid = false);
//     else if (!/\S+@\S+\.\S+/.test(email))
//       (newErrors.email = 'Email is invalid'), (valid = false);
//     if (!mobileNo.trim())
//       (newErrors.mobileNo = 'Mobile number is required'), (valid = false);
//     else if (!/^\d{10}$/.test(mobileNo))
//       (newErrors.mobileNo = 'Mobile number must be 10 digits'), (valid = false);
//     if (secondaryMobileNo.trim() && !/^\d{10}$/.test(secondaryMobileNo))
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
//     if (serviceName === 'Explore others' && !designation.trim()) // Validate designation if 'Explore others'
//       (newErrors.designation = 'Designation is required for "Others" service'), (valid = false);
//     if (!experience)
//       (newErrors.experience = 'Experience is required'), (valid = false);
//     if (!servicePrice.trim())
//       (newErrors.servicePrice = 'Service price is required'), (valid = false);
//     else if (isNaN(parseFloat(servicePrice))) // Check if it's a valid number
//       (newErrors.servicePrice = 'Service price must be a number'),
//         (valid = false);
//     if (!isAgreed && !editMode) // Agreement only required for new additions
//       (newErrors.isAgreed = 'You must agree to the terms'), (valid = false);

//     setErrors(newErrors);
//     return valid;
//   };

//   // Handle form submission
//   const handleSubmit = async () => {
//     if (validateForm()) {
//       setIsLoading(true); // Start loading
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
//           designation: serviceName === 'Explore others' ? designation : '', // Only send designation if serviceName is 'Explore others'
//           experience,
//           servicePrice: parseFloat(servicePrice), // Ensure servicePrice is a number
//           priceUnit,
//           needSupport,
//           professionDescription,
//           // isAgreed is for client-side validation, not usually sent to backend
//         };

//         if (editMode) {
//           await updateProfessionalProfile(formData); // Assuming your API takes all fields
//           Alert.alert("Success", "Profile updated successfully!");
//           navigation.goBack(); // Or navigate to ProfileScreen and refresh
//         } else {
//           await addProfession(formData);
//           await AsyncStorage.setItem('isProfession', 'true');
//           setShowSuccessModal(true); // Show success modal only for new additions
//         }

//       } catch (error) {
//         const action = editMode ? "updating" : "submitting";
//         console.error(`Error ${action} profession:`, error.response ? error.response.data : error.message);
//         Alert.alert(
//           `${editMode ? 'Update' : 'Submission'} Error`,
//           error.response?.data?.error || error.message || `Failed to ${action} profession details. Please try again.`
//         );
//       } finally {
//         setIsLoading(false); // Stop loading
//       }
//     } else {
//       Alert.alert("Validation Error", "Please check the form for errors.");
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
//         <View style={styles.headerContainer}>
//           <TouchableOpacity
//             onPress={() => navigation.goBack()}
//             style={styles.backButton}>
//             <AntDesign name="arrowleft" size={24} color="#1E40AF" />
//           </TouchableOpacity>
//           <Text style={styles.header}>{screenTitle}</Text>
//         </View>

//         {/* Personal Information */}
//         <Text style={styles.sectionHeader}>Personal Information</Text>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Name*</Text>
//           <TextInput
//             style={[styles.input, {backgroundColor: '#F1F5F9'}]}
//             placeholder="Enter your full name"
//             value={name}
//             editable={false} // Typically name is not editable here, fetched from user profile
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
//             editable={false} // Email is often not editable here
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
//             editable={false} // Mobile is generally not editable here, fetched from user profile
//           />
//           {errors.mobileNo && (
//             <Text style={styles.errorText}>{errors.mobileNo}</Text>
//           )}
//         </View>
//         <View style={styles.inputContainer}>
//           <Text style={styles.label}>Secondary Mobile No</Text>
//           <TextInput // Secondary mobile is usually editable
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
//             placeholder={!isFocus ? 'Select state' : '...'}
//             searchPlaceholder="Search..."
//             value={state}
//             onFocus={() => setIsFocus(true)}
//             onBlur={() => setIsFocus(false)}
//             onChange={item => {
//               setState(item.value);
//               setDistrict(''); // Reset district when state changes
//               setCity('');     // Reset city when state changes
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
//             placeholder={!isFocus ? 'Select district' : '...'}
//             searchPlaceholder="Search..."
//             value={district}
//             disable={!state && !editMode} // Only disable if not in edit mode and state is not selected
//             onFocus={() => setIsFocus(true)}
//             onBlur={() => setIsFocus(false)}
//             onChange={item => {
//               setDistrict(item.value);
//               setCity(''); // Reset city when district changes
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
//             placeholder={!isFocus ? 'Select city' : '...'}
//             searchPlaceholder="Search..."
//             value={city}
//             disable={!district && !editMode} // Only disable if not in edit mode and district is not selected
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
//             placeholder={!isFocus ? 'Select service category' : '...'}
//             searchPlaceholder="Search..."
//             value={serviceCategory}
//             onFocus={() => setIsFocus(true)}
//             onBlur={() => setIsFocus(false)}
//             onChange={item => {
//               setServiceCategory(item.value);
//               setServiceName(''); // Reset service name
//               setDesignation(''); // Reset designation
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
//             placeholder={!isFocus ? 'Select service name' : '...'}
//             searchPlaceholder="Search..."
//             value={serviceName}
//             disable={!serviceCategory && !editMode} // Only disable if not in edit mode and category not selected
//             onFocus={() => setIsFocus(true)}
//             onBlur={() => setIsFocus(false)}
//             onChange={item => {
//               setServiceName(item.value);
//               if (item.value !== 'Explore others') {
//                 setDesignation(''); // Clear designation if not 'Explore others'
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
        
//         {serviceName === 'Explore others' && (
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Designation*</Text>
//               <View style={styles.inputWithIconContainer}>
//                 <AntDesign
//                   name="idcard"
//                   size={20}
//                   color="#1E40AF"
//                   style={styles.inputIcon}
//                 />
//                 <TextInput
//                   style={styles.inputWithIcon}
//                   placeholder="Enter your specific designation"
//                   placeholderTextColor="#94A3B8"
//                   value={designation}
//                   onChangeText={setDesignation}
//                 />
//               </View>
//               {errors.designation && <Text style={styles.errorText}>{errors.designation}</Text>}
//             </View>
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
//             placeholder={!isFocus ? 'Select experience level' : '...'}
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
//               style={[styles.input, styles.priceInput, errors.servicePrice && styles.inputError]} // Assuming inputError style exists
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
//               placeholder={!isFocus ? 'Unit' : '...'}
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
//           <Text style={styles.label}>Profession Description (Optional)</Text>
//           <TextInput
//             style={[styles.input, styles.multilineInput]}
//             placeholder="Describe your profession, skills, and expertise"
//             multiline
//             numberOfLines={4}
//             value={professionDescription}
//             onChangeText={setProfessionDescription}
//           />
//         </View>
        
//         {!editMode && ( // Only show agreement checkbox if not in edit mode
//             <View style={styles.checkboxContainer}>
//             <TouchableOpacity
//                 style={styles.checkbox}
//                 onPress={() => setIsAgreed(!isAgreed)}>
//                 {isAgreed ? (
//                 <AntDesign name="checkcircle" size={24} color="#1E40AF" />
//                 ) : (
//                 <AntDesign name="checkcircleo" size={24} color="#94A3B8" />
//                 )}
//             </TouchableOpacity>
//             <Text style={styles.checkboxLabel}>
//                 I acknowledge every detail given here is true
//             </Text>
//             </View>
//         )}
//         {errors.isAgreed && !editMode && ( // Only show error if not in edit mode
//           <Text style={styles.errorText}>{errors.isAgreed}</Text>
//         )}

//         <TouchableOpacity 
//           style={styles.submitButton} 
//           onPress={handleSubmit}
//           disabled={isLoading} // Disable button when loading
//         >
//           <LinearGradient
//             colors={['#1E40AF', '#3B82F6']}
//             style={styles.submitButtonGradient}>
//             {isLoading ? (
//               <ActivityIndicator size="small" color="#FFFFFF" />
//             ) : (
//               <Text style={styles.submitButtonText}>{submitButtonText}</Text>
//             )}
//           </LinearGradient>
//         </TouchableOpacity>

//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={showSuccessModal}
//           onRequestClose={() => {
//             setShowSuccessModal(false);
//             navigation.goBack(); // Navigate back on modal close
//           }}>
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <AntDesign
//                 name="checkcircle"
//                 size={60}
//                 color="#1E40AF"
//                 style={styles.modalIcon}
//               />
//               <Text style={styles.modalTitle}>Registration Successful!</Text>
//               <Text style={styles.modalText}>Your professional profile has been submitted.</Text>
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