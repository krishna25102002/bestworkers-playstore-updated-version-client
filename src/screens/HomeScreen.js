import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import SideMenu from '../components/SideMenu';
import { styles, categoryIcons } from '../styles/HomeStyles';
import { serviceNames } from '../data/staticData';
import { getProfessionalsByService } from '../services/api';
import AppText from '../components/AppText'; // Import your custom AppText

const HomeScreen = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [professionalCounts, setProfessionalCounts] = useState({});
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [filteredCategories, setFilteredCategories] = useState(
    Object.keys(serviceNames),
  );

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          navigation.navigate('Login');
        } else {
          Toast.show({
            type: 'success',
            text1: 'Welcome to Job Services',
            text2: 'Explore our categories!',
            visibilityTime: 2500,
            position: 'top',
            topOffset: 70,
          });
        }
      } catch (error) {
        console.error('Failed to get token', error);
      }
    };

    checkToken();
  }, [navigation]);

  useEffect(() => {
    if (searchText) {
      const lowercasedSearch = searchText.toLowerCase();
      const categoryMatches = Object.keys(serviceNames).filter(category =>
        category.toLowerCase().includes(lowercasedSearch),
      );
      const serviceMatches = Object.keys(serviceNames).filter(category => {
        return Array.isArray(serviceNames[category]) && serviceNames[category].some(service =>
          service.label.toLowerCase().includes(lowercasedSearch),
        );
      });
      const combinedMatches = [
        ...new Set([...categoryMatches, ...serviceMatches]),
      ];
      setFilteredCategories(combinedMatches);
    } else {
      setFilteredCategories(Object.keys(serviceNames));
    }
  }, [searchText, serviceNames]);

  const toggleCategory = (category) => {
    const newExpanded = expandedCategory === category ? null : category;
    setExpandedCategory(newExpanded);
  };

  const handleServicePress = (service, parentCategory) => {
    navigation.navigate('ServiceDetail', {
      service: service.value,
      category: parentCategory,
    });
  };

  const handleClearSearch = () => {
    setSearchText('');
  };

  const fetchProfessionalCount = useCallback(async (serviceValue, categoryValue = null) => {
    if (!serviceValue) return 0;
    try {
      const response = await getProfessionalsByService(serviceValue, categoryValue);
      return response.data.length;
    } catch (error) {
      console.error(`Error fetching count for ${serviceValue} (Category: ${categoryValue}):`, error.message);
      return 0;
    }
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoadingCounts(true);
      const serviceLvlCounts = {};
      const categoryLvlCounts = {};

      console.log("HomeScreen: Fetching all counts...");

      for (const categoryKey in serviceNames) {
        let currentCategoryTotal = 0;

        if (categoryKey.toLowerCase() === 'explore others') continue;

        if (Array.isArray(serviceNames[categoryKey])) {
            for (const service of serviceNames[categoryKey]) {
                if (service.value) {
                    let count;
                    // *** CRUCIAL LOGIC FOR "OTHERS" COUNT ***
                    if (service.value === 'Explore others') {
                       console.log(`Fetching count for 'Explore others' under category: ${categoryKey}`);
    count = await fetchProfessionalCount(service.value, categoryKey);
    console.log(`Fetched count: ${count} for key: ${service.value}_${categoryKey}`);
                    } else {
                        count = await fetchProfessionalCount(service.value);
                    }
                    // *** CRUCIAL LOGIC FOR STORING COUNT WITH UNIQUE KEY ***
                    serviceLvlCounts[`${service.value}_${categoryKey}`] = count;
                    currentCategoryTotal += count;
                }
            }
        }
        categoryLvlCounts[categoryKey] = currentCategoryTotal;
      }
      setProfessionalCounts(serviceLvlCounts);
      setCategoryCounts(categoryLvlCounts);
      setLoadingCounts(false);
      console.log("HomeScreen: Counts fetched:", { serviceLvlCounts, categoryLvlCounts });
    };

    fetchAllData();

    const unsubscribe = navigation.addListener('focus', () => {
      console.log('HomeScreen focused, re-fetching counts...');
      fetchAllData();
    });

    return unsubscribe;
  }, [navigation, fetchProfessionalCount, serviceNames]);

  const renderCategoryItem = ({ item: category }) => {
    if (category.toLowerCase() === 'explore others') {
        return null;
    }

    const categoryTotal = categoryCounts[category] !== undefined ? categoryCounts[category] : 0;
    const categoryServices = serviceNames[category] || [];
    const isExpanded = expandedCategory === category;
    const categoryIconName = categoryIcons[category] || 'category';

      return (
        <View style={styles.categorySection}>
          <TouchableOpacity
            style={styles.categoryHeader}
            onPress={() => toggleCategory(category)}
            activeOpacity={0.7}>
            <View style={styles.categoryIconContainer}>
              <Icon
                name={categoryIconName}
                size={24}
                color="white"
              />
            </View>
            <View style={styles.categoryTextAndCountContainer}>
              <AppText style={styles.categoryTitle} semiBold>{category}</AppText>
            </View>
            {/* New container for count and chevron icon */}
            <View style={styles.countAndChevronContainer}>
              <AppText style={styles.categoryCountText}>
                ({loadingCounts ? '...' : categoryTotal})
              </AppText>
              <Icon
                name={
                  isExpanded
                    ? 'keyboard-arrow-up'
                    : 'keyboard-arrow-down'
                }
                size={24}
                color={styles.categoryIconContainer.backgroundColor} // Use primary color
                style={styles.chevronIconStyle} // Added style for potential margin
              />
            </View>
          </TouchableOpacity>

          {isExpanded && Array.isArray(categoryServices) && (
            <FlatList
              data={categoryServices}
              renderItem={({ item: serviceItem }) => {
                // *** CRUCIAL LOGIC FOR DISPLAYING "OTHERS" COUNT ***
                const countKey = `${serviceItem.value}_${category}`;
                const count = professionalCounts[countKey] !== undefined ? professionalCounts[countKey] : 0;
                return (
                  <TouchableOpacity
                    style={styles.serviceItem}
                    // *** CRUCIAL LOGIC FOR NAVIGATING "OTHERS" ***
                    onPress={() => handleServicePress(serviceItem, category)}
                  >
                    <AppText style={styles.serviceText}>{serviceItem.label}</AppText>
                    <View style={styles.serviceRightContainer}>
                      <AppText style={styles.serviceCount}>({loadingCounts && count === 0 ? '...' : count})</AppText>
                      <Icon
                          name="arrow-forward-ios"
                          size={16}
                          color={styles.categoryIconContainer.backgroundColor}
                      />
                    </View>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={serviceItem => `${serviceItem.value}_${category}`}
              style={styles.servicesList}
              scrollEnabled={false}
            />
          )}
        </View>
      );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor={styles.header.backgroundColor}
        barStyle="light-content"
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Icon name="menu" size={28} color="white" />
        </TouchableOpacity>
        <AppText style={styles.headerTitle} bold>Job Services</AppText>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={24} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for services..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor={styles.searchIcon.color}
          clearButtonMode="while-editing"
        />
        {searchText ? (
          <TouchableOpacity
            onPress={handleClearSearch}
            style={styles.clearIcon}>
            <Icon name="clear" size={24} style={styles.searchIcon} />
          </TouchableOpacity>
        ) : null}
      </View>
            {/* Show full page loader only if professionalCounts is empty, indicating very first load phase */}
      {/* {loadingCounts && Object.keys(professionalCounts).length === 0 && Object.keys(categoryCounts).length === 0 ? (
        <View style={styles.fullPageLoaderContainer}>
            <ActivityIndicator size="large" color={styles.categoryIconContainer.backgroundColor || '#2E5BFF'} />
            {/* <AppText style={styles.fullPageLoaderText}>Loading Categories...</AppText> */}
            {/* <AppText style={styles.fullPageLoaderText}>Loading Categories...</AppText> */}
        {/* </View>  */}
        //first the list and then load below line
      {/* /* {loadingCounts && Object.keys(professionalCounts).length === 0 && Object.keys(categoryCounts).length === 0 ? ( */}
//first load and the list line
       {/* {loadingCounts && filteredCategories.length === Object.keys(serviceNames).length ? ( */}

         {loadingCounts && Object.keys(professionalCounts).length === 0 && Object.keys(categoryCounts).length === 0 ? (
        <View style={styles.fullPageLoaderContainer}>
            <ActivityIndicator size="large" color={styles.categoryIconContainer.backgroundColor || '#2E5BFF'} />
            {/* <AppText style={styles.fullPageLoaderText}>Loading Categories...</AppText> */}
        </View> ) : filteredCategories.length > 0 ? (
        <FlatList
          data={filteredCategories.filter(cat => cat.toLowerCase() !== 'explore others')}
          renderItem={renderCategoryItem}
          keyExtractor={item => item}
          style={styles.categoriesList}
          contentContainerStyle={styles.categoriesContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.noResultsContainer}>
          <Icon
            name="search-off"
            size={64}
            color={styles.categoryIconContainer.backgroundColor || '#2E5BFF'}
          />
          <AppText style={styles.noResultsText} semiBold>No services found</AppText>
          <AppText style={styles.noResultsSubtext}>
            Try a different search term
          </AppText>
        </View>
      )}

      <SideMenu
        isVisible={menuVisible}
        onClose={() => setMenuVisible(false)}
        navigation={navigation}
        setIsLoggedIn={setIsLoggedIn}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;



// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   TextInput,
//   SafeAreaView,
//   ActivityIndicator,
//   StatusBar,
//   FlatList,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Toast from 'react-native-toast-message';
// import SideMenu from '../components/SideMenu';
// import { styles, categoryIcons } from '../styles/HomeStyles';
// import { serviceNames } from '../data/staticData';
// import { getProfessionalsByService } from '../services/api';
// import AppText from '../components/AppText'; // Import your custom AppText

// const HomeScreen = ({ navigation }) => {
//   const [menuVisible, setMenuVisible] = useState(false);
//   const [professionalCounts, setProfessionalCounts] = useState({});
//   const [categoryCounts, setCategoryCounts] = useState({});
//   const [loadingCounts, setLoadingCounts] = useState(true);
//   const [searchText, setSearchText] = useState('');
//   const [expandedCategory, setExpandedCategory] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(true);
//   const [filteredCategories, setFilteredCategories] = useState(
//     Object.keys(serviceNames),
//   );

//   useEffect(() => {
//     const checkToken = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         if (!token) {
//           navigation.navigate('Login');
//         } else {
//           Toast.show({
//             type: 'success',
//             text1: 'Welcome to Job Services',
//             text2: 'Explore our categories!',
//             visibilityTime: 2500,
//             position: 'top',
//             topOffset: 70,
//           });
//         }
//       } catch (error) {
//         console.error('Failed to get token', error);
//       }
//     };

//     checkToken();
//   }, [navigation]);

//   useEffect(() => {
//     if (searchText) {
//       const lowercasedSearch = searchText.toLowerCase();
//       const categoryMatches = Object.keys(serviceNames).filter(category =>
//         category.toLowerCase().includes(lowercasedSearch),
//       );
//       const serviceMatches = Object.keys(serviceNames).filter(category => {
//         return Array.isArray(serviceNames[category]) && serviceNames[category].some(service =>
//           service.label.toLowerCase().includes(lowercasedSearch),
//         );
//       });
//       const combinedMatches = [
//         ...new Set([...categoryMatches, ...serviceMatches]),
//       ];
//       setFilteredCategories(combinedMatches);
//     } else {
//       setFilteredCategories(Object.keys(serviceNames));
//     }
//   }, [searchText, serviceNames]);

//   const toggleCategory = (category) => {
//     const newExpanded = expandedCategory === category ? null : category;
//     setExpandedCategory(newExpanded);
//   };

//   const handleServicePress = (service, parentCategory) => {
//     navigation.navigate('ServiceDetail', {
//       service: service.value,
//       category: parentCategory,
//     });
//   };

//   const handleClearSearch = () => {
//     setSearchText('');
//   };

//   const fetchProfessionalCount = useCallback(async (serviceValue, categoryValue = null) => {
//     if (!serviceValue) return 0;
//     try {
//       const response = await getProfessionalsByService(serviceValue, categoryValue);
//       return response.data.length;
//     } catch (error) {
//       console.error(`Error fetching count for ${serviceValue} (Category: ${categoryValue}):`, error.message);
//       return 0;
//     }
//   }, []);

//   useEffect(() => {
//     const fetchAllData = async () => {
//       setLoadingCounts(true);
//       const serviceLvlCounts = {};
//       const categoryLvlCounts = {};

//       console.log("HomeScreen: Fetching all counts...");

//       for (const categoryKey in serviceNames) {
//         let currentCategoryTotal = 0;

//         if (categoryKey.toLowerCase() === 'explore others') continue;

//         if (Array.isArray(serviceNames[categoryKey])) {
//             for (const service of serviceNames[categoryKey]) {
//                 if (service.value) {
//                     let count;
//                     // *** CRUCIAL LOGIC FOR "OTHERS" COUNT ***
//                     if (service.value === 'Explore others') {
//                        console.log(`Fetching count for 'Explore others' under category: ${categoryKey}`);
//     count = await fetchProfessionalCount(service.value, categoryKey);
//     console.log(`Fetched count: ${count} for key: ${service.value}_${categoryKey}`);
//                     } else {
//                         count = await fetchProfessionalCount(service.value);
//                     }
//                     // *** CRUCIAL LOGIC FOR STORING COUNT WITH UNIQUE KEY ***
//                     serviceLvlCounts[`${service.value}_${categoryKey}`] = count;
//                     currentCategoryTotal += count;
//                 }
//             }
//         }
//         categoryLvlCounts[categoryKey] = currentCategoryTotal;
//       }
//       setProfessionalCounts(serviceLvlCounts);
//       setCategoryCounts(categoryLvlCounts);
//       setLoadingCounts(false);
//       console.log("HomeScreen: Counts fetched:", { serviceLvlCounts, categoryLvlCounts });
//     };

//     fetchAllData();

//     const unsubscribe = navigation.addListener('focus', () => {
//       console.log('HomeScreen focused, re-fetching counts...');
//       fetchAllData();
//     });

//     return unsubscribe;
//   }, [navigation, fetchProfessionalCount, serviceNames]);

//   const renderCategoryItem = ({ item: category }) => {
//     if (category.toLowerCase() === 'explore others') {
//         return null;
//     }

//     const categoryTotal = categoryCounts[category] !== undefined ? categoryCounts[category] : 0;
//     const categoryServices = serviceNames[category] || [];
//     const isExpanded = expandedCategory === category;
//     const categoryIconName = categoryIcons[category] || 'category';

//       return (
//         <View style={styles.categorySection}>
//           <TouchableOpacity
//             style={styles.categoryHeader}
//             onPress={() => toggleCategory(category)}
//             activeOpacity={0.7}>
//             <View style={styles.categoryIconContainer}>
//               <Icon
//                 name={categoryIconName}
//                 size={24}
//                 color="white"
//               />
//             </View>
//             <View style={styles.categoryTextAndCountContainer}>
//               <Text style={styles.categoryTitle}>{category}</Text>
//               <Text style={styles.categoryCountText}>
//                 ({loadingCounts ? '...' : categoryTotal})
//               </Text>
//             </View>
//             <Icon
//               name={
//                 isExpanded
//                   ? 'keyboard-arrow-up'
//                   : 'keyboard-arrow-down'
//               }
//               size={24}
//               color={styles.categoryIconContainer.backgroundColor}
//             />
//           </TouchableOpacity>

//           {isExpanded && Array.isArray(categoryServices) && (
//             <FlatList
//               data={categoryServices}
//               renderItem={({ item: serviceItem }) => {
//                 // *** CRUCIAL LOGIC FOR DISPLAYING "OTHERS" COUNT ***
//                 const countKey = `${serviceItem.value}_${category}`;
//                 const count = professionalCounts[countKey] !== undefined ? professionalCounts[countKey] : 0;
//                 return (
//                   <TouchableOpacity
//                     style={styles.serviceItem}
//                     // *** CRUCIAL LOGIC FOR NAVIGATING "OTHERS" ***
//                     onPress={() => handleServicePress(serviceItem, category)}
//                   >
//                     <Text style={styles.serviceText}>{serviceItem.label}</Text>
//                     <View style={styles.serviceRightContainer}>
//                       <Text style={styles.serviceCount}>({loadingCounts && count === 0 ? '...' : count})</Text>
//                       <Icon
//                           name="arrow-forward-ios"
//                           size={16}
//                           color={styles.categoryIconContainer.backgroundColor}
//                       />
//                     </View>
//                   </TouchableOpacity>
//                 );
//               }}
//               keyExtractor={serviceItem => `${serviceItem.value}_${category}`}
//               style={styles.servicesList}
//               scrollEnabled={false}
//             />
//           )}
//         </View>
//       );
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar
//         backgroundColor={styles.header.backgroundColor}
//         barStyle="light-content"
//       />

//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => setMenuVisible(true)}>
//           <Icon name="menu" size={28} color="white" />
//         </TouchableOpacity>
//         <AppText style={styles.headerTitle}>Job Services</AppText>
//         <View style={{ width: 28 }} />
//       </View>

//       <View style={styles.searchContainer}>
//         <Icon name="search" size={24} style={styles.searchIcon} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search for services..."
//           value={searchText}
//           onChangeText={setSearchText}
//           placeholderTextColor={styles.searchIcon.color}
//           clearButtonMode="while-editing"
//         />
//         {searchText ? (
//           <TouchableOpacity
//             onPress={handleClearSearch}
//             style={styles.clearIcon}>
//             <Icon name="clear" size={24} style={styles.searchIcon} />
//           </TouchableOpacity>
//         ) : null}
//       </View>
//             {/* Show full page loader only if professionalCounts is empty, indicating very first load phase */}
//       {/* {loadingCounts && Object.keys(professionalCounts).length === 0 && Object.keys(categoryCounts).length === 0 ? (
//         <View style={styles.fullPageLoaderContainer}>
//             <ActivityIndicator size="large" color={styles.categoryIconContainer.backgroundColor || '#2E5BFF'} />
//             {/* <Text style={styles.fullPageLoaderText}>Loading Categories...</Text> */}
//             {/* <Text style={styles.fullPageLoaderText}>Loading Categories...</Text> */}
//         {/* </View>  */}
//         //first the list and then load below line
//       {/* /* {loadingCounts && Object.keys(professionalCounts).length === 0 && Object.keys(categoryCounts).length === 0 ? ( */}
// //first load and the list line
//        {/* {loadingCounts && filteredCategories.length === Object.keys(serviceNames).length ? ( */}

//          {loadingCounts && Object.keys(professionalCounts).length === 0 && Object.keys(categoryCounts).length === 0 ? (
//         <View style={styles.fullPageLoaderContainer}>
//             <ActivityIndicator size="large" color={styles.categoryIconContainer.backgroundColor || '#2E5BFF'} />
//             {/* <Text style={styles.fullPageLoaderText}>Loading Categories...</Text> */}
//         </View> ) : filteredCategories.length > 0 ? (
//         <FlatList
//           data={filteredCategories.filter(cat => cat.toLowerCase() !== 'explore others')}
//           renderItem={renderCategoryItem}
//           keyExtractor={item => item}
//           style={styles.categoriesList}
//           contentContainerStyle={styles.categoriesContainer}
//           showsVerticalScrollIndicator={false}
//         />
//       ) : (
//         <View style={styles.noResultsContainer}>
//           <Icon
//             name="search-off"
//             size={64}
//             color={styles.categoryIconContainer.backgroundColor || '#2E5BFF'}
//           />
//           <Text style={styles.noResultsText}>No services found</Text>
//           <Text style={styles.noResultsSubtext}>
//             Try a different search term
//           </Text>
//         </View>
//       )}

//       <SideMenu
//         isVisible={menuVisible}
//         onClose={() => setMenuVisible(false)}
//         navigation={navigation}
//         setIsLoggedIn={setIsLoggedIn}
//       />
//     </SafeAreaView>
//   );
// };

// export default HomeScreen;




// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   TextInput,
//   SafeAreaView,
//   StatusBar,
//   FlatList,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Toast from 'react-native-toast-message'; // Keep import for welcome toast
// import SideMenu from '../components/SideMenu';
// import { styles, categoryIcons } from '../styles/HomeStyles';
// import { serviceNames } from '../data/staticData'; // Import serviceNames
// import { getProfessionalsByService } from '../services/api';


// const HomeScreen = ({ navigation }) => {
//   const [menuVisible, setMenuVisible] = useState(false);
//   const [professionalCounts, setProfessionalCounts] = useState({}); // Counts for individual services
//   const [categoryCounts, setCategoryCounts] = useState({});     // Counts for total in each category
//   const [loadingCounts, setLoadingCounts] = useState(true);     // Loading state for counts
//   const [searchText, setSearchText] = useState('');
//   const [expandedCategory, setExpandedCategory] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(true); // Assuming default to true, adjust as needed
//   const [filteredCategories, setFilteredCategories] = useState(
//     Object.keys(serviceNames),
//   );

//   useEffect(() => {
//     const checkToken = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         if (!token) {
//           navigation.navigate('Login');
//         } else {
//           Toast.show({
//             type: 'success',
//             text1: 'Welcome to Job Services',
//             text2: 'Explore our categories!',
//             visibilityTime: 2500,
//             position: 'top',
//             topOffset: 70,
//           });
//         }
//       } catch (error) {
//         console.error('Failed to get token', error);
//       }
//     };

//     checkToken();
//   }, [navigation]);

//   useEffect(() => {
//     if (searchText) {
//       const lowercasedSearch = searchText.toLowerCase();
//       const categoryMatches = Object.keys(serviceNames).filter(category =>
//         category.toLowerCase().includes(lowercasedSearch),
//       );
//       const serviceMatches = Object.keys(serviceNames).filter(category => {
//         // Ensure serviceNames[category] is an array before calling .some()
//         return Array.isArray(serviceNames[category]) && serviceNames[category].some(service =>
//           service.label.toLowerCase().includes(lowercasedSearch),
//         );
//       });
//       const combinedMatches = [
//         ...new Set([...categoryMatches, ...serviceMatches]),
//       ];
//       setFilteredCategories(combinedMatches);
//     } else {
//       setFilteredCategories(Object.keys(serviceNames));
//     }
//   }, [searchText]);

//   const toggleCategory = (category) => {
//     const newExpanded = expandedCategory === category ? null : category;
//     setExpandedCategory(newExpanded);
//   };

//   const handleServicePress = (service) => {
//     const categoryForService = Object.keys(serviceNames).find(category => // This will find the 'Others' key if service.value is 'Others'
//       Array.isArray(serviceNames[category]) && serviceNames[category].some(s => s.value === service.value),
//     );
//     navigation.navigate('ServiceDetail', {
//       service: service.value,
//       category: categoryForService,
//     }); // service.value will be 'Others' if that category/service is pressed
//   };

//   const handleClearSearch = () => {
//     setSearchText('');
//   };

//   const fetchProfessionalCount = useCallback(async (serviceValue) => {
//     if (!serviceValue || serviceValue === 'Others') return 0; // Don't fetch for the 'Others' placeholder/category value itself
//     try {
//       const response = await getProfessionalsByService(serviceValue);
//       return response.data.length; 
//     } catch (error) {
//       console.error(`Error fetching count for ${serviceValue}:`, error.message);
//       return 0; 
//     }
//   }, []);

//   useEffect(() => {
//     const fetchAllData = async () => {
//       setLoadingCounts(true);
//       const serviceLvlCounts = {};
//       const categoryLvlCounts = {};

//       console.log("HomeScreen: Fetching all counts...");

//       for (const categoryKey in serviceNames) {
//         let currentCategoryTotal = 0;

//         if (categoryKey.toLowerCase() === 'others') { // Check for 'others' key
//           categoryLvlCounts[categoryKey] = 0; 
//           continue;
//         }

//         if (Array.isArray(serviceNames[categoryKey])) {
//             for (const service of serviceNames[categoryKey]) {
//                 if (service.value) { // Ensure service.value exists
//                     const count = await fetchProfessionalCount(service.value);
//                     serviceLvlCounts[service.value] = count;
//                     currentCategoryTotal += count;
//                 }
//             }
//         }
//         categoryLvlCounts[categoryKey] = currentCategoryTotal;
//       }
//       setProfessionalCounts(serviceLvlCounts);
//       setCategoryCounts(categoryLvlCounts);
//       setLoadingCounts(false);
//       console.log("HomeScreen: Counts fetched:", { serviceLvlCounts, categoryLvlCounts });
//     };

//     fetchAllData(); // Initial fetch

//     const unsubscribe = navigation.addListener('focus', () => {
//       console.log('HomeScreen focused, re-fetching counts...');
//       fetchAllData(); // Re-fetch on focus
//     });

//     return unsubscribe; // Cleanup listener on unmount
//   }, [navigation, fetchProfessionalCount]); // serviceNames is static, so removed from deps


//   const renderServiceItem = ({ item }) => {
//     const count = professionalCounts[item.value] !== undefined ? professionalCounts[item.value] : 0;
  
//     return (
//       <TouchableOpacity
//         style={styles.serviceItem}
//         onPress={() => handleServicePress(item)}>
//         <Text style={styles.serviceText}>{item.label}</Text>
//         <View style={styles.serviceRightContainer}>
//             <Text style={styles.serviceCount}>({loadingCounts && count === 0 ? '...' : count})</Text>
//             <Icon
//                 name="arrow-forward-ios"
//                 size={16}
//                 color={styles.categoryIconContainer.backgroundColor} 
//             />
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const renderCategoryItem = ({ item: category }) => {
//     const isOthersCategory = category.toLowerCase() === 'explore others';
//     const categoryTotal = categoryCounts[category] !== undefined ? categoryCounts[category] : 0;

//     if (isOthersCategory) {
//       return (
//         <View style={styles.categorySection}>
//           <TouchableOpacity
//             style={styles.categoryHeader}
//             onPress={() => handleServicePress({ label: 'Explore others', value: 'Explore others' })} // Ensure value is 'Explore others'
//             activeOpacity={0.7}>
//             <View style={styles.categoryIconContainer}>
//               <Icon
//                 name={categoryIcons[category] || 'explore'}
//                 size={24}
//                 color="white"
//               />
//             </View>
//             <Text style={styles.categoryTitle}>{category}</Text>
//             {/* <Icon
//               name="arrow-forward-ios"
//               size={20}
//               color={styles.categoryIconContainer.backgroundColor}
//             /> */}
//           </TouchableOpacity>
//         </View>
//       );
//     } else {
//       return (
//         <View style={styles.categorySection}>
//           <TouchableOpacity
//             style={styles.categoryHeader}
//             onPress={() => toggleCategory(category)}
//             activeOpacity={0.7}>
//             <View style={styles.categoryIconContainer}>
//               <Icon
//                 name={categoryIcons[category] || 'category'}
//                 size={24}
//                 color="white"
//               />
//             </View>
//             <View style={styles.categoryTextAndCountContainer}>
//               <Text style={styles.categoryTitle}>{category}</Text>
//               <Text style={styles.categoryCountText}>
//                 ({loadingCounts ? '...' : categoryTotal})
//               </Text>
//             </View>
//             <Icon
//               name={
//                 expandedCategory === category
//                   ? 'keyboard-arrow-up'
//                   : 'keyboard-arrow-down'
//               }
//               size={24}
//               color={styles.categoryIconContainer.backgroundColor}
//             />
//           </TouchableOpacity>

//           {expandedCategory === category && Array.isArray(serviceNames[category]) && (
//             <FlatList
//               data={serviceNames[category]}
//               renderItem={renderServiceItem}
//               keyExtractor={item => item.value}
//               style={styles.servicesList}
//               scrollEnabled={false}
//             />
//           )}
//         </View>
//       );
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar
//         backgroundColor={styles.header.backgroundColor}
//         barStyle="light-content"
//       />

//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => setMenuVisible(true)}>
//           <Icon name="menu" size={28} color="white" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Job Services</Text>
//       </View>

//       <View style={styles.searchContainer}>
//         <Icon name="search" size={24} style={styles.searchIcon} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search for services..."
//           value={searchText}
//           onChangeText={setSearchText}
//           placeholderTextColor={styles.searchIcon.color}
//           clearButtonMode="while-editing"
//         />
//         {searchText ? (
//           <TouchableOpacity
//             onPress={handleClearSearch}
//             style={styles.clearIcon}>
//             <Icon name="clear" size={24} style={styles.searchIcon} />
//           </TouchableOpacity>
//         ) : null}
//       </View>

//       {filteredCategories.length > 0 ? (
//         <FlatList
//           data={filteredCategories}
//           renderItem={renderCategoryItem}
//           keyExtractor={item => item}
//           style={styles.categoriesList}
//           contentContainerStyle={styles.categoriesContainer}
//           showsVerticalScrollIndicator={false}
//         />
//       ) : (
//         <View style={styles.noResultsContainer}>
//           <Icon
//             name="search-off"
//             size={64}
//             color={styles.categoryIconContainer.backgroundColor}
//           />
//           <Text style={styles.noResultsText}>No services found</Text>
//           <Text style={styles.noResultsSubtext}>
//             Try a different search term
//           </Text>
//         </View>
//       )}

//       <SideMenu
//         isVisible={menuVisible}
//         onClose={() => setMenuVisible(false)}
//         navigation={navigation}
//         setIsLoggedIn={setIsLoggedIn} // You might need to pass the actual setIsLoggedIn function if used in SideMenu
//       />
//     </SafeAreaView>
//   );
// };

// export default HomeScreen;



// import React, { useState, useEffect } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   TextInput,
//   SafeAreaView, 
//   StatusBar,
//   FlatList,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Toast from 'react-native-toast-message'; // Keep import for welcome toast
// import SideMenu from '../components/SideMenu';
// import { styles, categoryIcons } from '../styles/HomeStyles';
// import { serviceNames } from '../data/staticData'; // Import serviceNames

// const HomeScreen = ({ navigation }) => {
//   const [menuVisible, setMenuVisible] = useState(false);
//   const [searchText, setSearchText] = useState('');
//   const [expandedCategory, setExpandedCategory] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(true);
//   const [filteredCategories, setFilteredCategories] = useState(
//     Object.keys(serviceNames), // Include "others"
//   );

//   useEffect(() => {
//     const checkToken = async () => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//         if (!token) {
//           navigation.navigate('Login');
//         } else {
//           Toast.show({
//             type: 'success',
//             text1: 'Welcome to Job Services',
//             text2: 'Explore our categories!',
//             visibilityTime: 2500,
//             position: 'top',
//             topOffset: 70,
//           });
//         }
//       } catch (error) {
//         console.error('Failed to get token', error);
//       }
//     };

//     checkToken();
//   }, [navigation]);

//   useEffect(() => {
//     if (searchText) {
//       const lowercasedSearch = searchText.toLowerCase();
//       const categoryMatches = Object.keys(serviceNames).filter(category =>
//         category.toLowerCase().includes(lowercasedSearch),
//       );
//       const serviceMatches = Object.keys(serviceNames).filter(category =>
//         serviceNames[category].some(service =>
//           service.label.toLowerCase().includes(lowercasedSearch),
//         ),
//       );
//       const combinedMatches = [
//         ...new Set([...categoryMatches, ...serviceMatches]),
//       ];
//       setFilteredCategories(combinedMatches);
//     } else {
//       setFilteredCategories(Object.keys(serviceNames));
//     }
//   }, [searchText]);

//   const toggleCategory = (category) => {
//     const newExpanded = expandedCategory === category ? null : category;
//     setExpandedCategory(newExpanded);
//   };

//   const handleServicePress = (service) => {
//     const categoryForService = Object.keys(serviceNames).find(category =>
//       serviceNames[category].some(s => s.value === service.value),
//     );
//     navigation.navigate('ServiceDetail', {
//       service: service.value,
//       category: categoryForService,
//     });
//   };

//   const handleClearSearch = () => {
//     setSearchText('');
//   };

//   const renderServiceItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.serviceItem}
//       onPress={() => handleServicePress(item)}>
//       <Text style={styles.serviceText}>{item.label}</Text>
//       <Icon
//         name="arrow-forward-ios"
//         size={16}
//         color={styles.categoryIconContainer.backgroundColor}
//       />
//     </TouchableOpacity>
//   );

//   const renderCategoryItem = ({ item: category }) => (
//     <View style={styles.categorySection}>
//       <TouchableOpacity
//         style={styles.categoryHeader}
//         onPress={() => toggleCategory(category)}
//         activeOpacity={0.7}>
//         <View style={styles.categoryIconContainer}>
//           <Icon
//             name={categoryIcons[category] || 'category'} // Default for "others"
//             size={24}
//             color="white"
//           />
//         </View>
//         <Text style={styles.categoryTitle}>{category}</Text>
//         <Icon
//           name={
//             expandedCategory === category
//               ? 'keyboard-arrow-up'
//               : 'keyboard-arrow-down'
//           }
//           size={24}
//           color={styles.categoryIconContainer.backgroundColor}
//         />
//       </TouchableOpacity>

//       {expandedCategory === category && (
//         <FlatList
//           data={serviceNames[category]}
//           renderItem={renderServiceItem}
//           keyExtractor={item => item.value}
//           style={styles.servicesList}
//           scrollEnabled={false}
//         />
//       )}
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar
//         backgroundColor={styles.header.backgroundColor}
//         barStyle="light-content"
//       />

//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => setMenuVisible(true)}>
//           <Icon name="menu" size={28} color="white" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Job Services</Text>
//       </View>

//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <Icon name="search" size={24} style={styles.searchIcon} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search for services..."
//           value={searchText}
//           onChangeText={setSearchText}
//           placeholderTextColor={styles.searchIcon.color}
//           clearButtonMode="while-editing"
//         />
//         {searchText ? (
//           <TouchableOpacity
//             onPress={handleClearSearch}
//             style={styles.clearIcon}>
//             <Icon name="clear" size={24} style={styles.searchIcon} />
//           </TouchableOpacity>
//         ) : null}
//       </View>

//       {/* Main Content */}
//       {filteredCategories.length > 0 ? (
//         <FlatList
//           data={filteredCategories}
//           renderItem={renderCategoryItem}
//           keyExtractor={item => item}
//           style={styles.categoriesList}
//           contentContainerStyle={styles.categoriesContainer}
//           showsVerticalScrollIndicator={false}
//         />
//       ) : (
//         <View style={styles.noResultsContainer}>
//           <Icon
//             name="search-off"
//             size={64}
//             color={styles.categoryIconContainer.backgroundColor}
//           />
//           <Text style={styles.noResultsText}>No services found</Text>
//           <Text style={styles.noResultsSubtext}>
//             Try a different search term
//           </Text>
//         </View>
//       )}

//       {/* Side Menu */}
//       <SideMenu
//         isVisible={menuVisible}
//         onClose={() => setMenuVisible(false)}
//         navigation={navigation}
//         setIsLoggedIn={setIsLoggedIn}
//       />
//     </SafeAreaView>
//   );
// };
