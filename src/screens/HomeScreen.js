import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message'; // Keep import for welcome toast
import SideMenu from '../components/SideMenu';
import { styles, categoryIcons } from '../styles/HomeStyles';
import { serviceNames } from '../data/staticData'; // Import serviceNames
import { getProfessionalsByService } from '../services/api';


const HomeScreen = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [professionalCounts, setProfessionalCounts] = useState({}); // Counts for individual services
  const [categoryCounts, setCategoryCounts] = useState({});     // Counts for total in each category
  const [loadingCounts, setLoadingCounts] = useState(true);     // Loading state for counts
  const [searchText, setSearchText] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Assuming default to true, adjust as needed
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
        // Ensure serviceNames[category] is an array before calling .some()
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
  }, [searchText]);

  const toggleCategory = (category) => {
    const newExpanded = expandedCategory === category ? null : category;
    setExpandedCategory(newExpanded);
  };

  const handleServicePress = (service) => {
    const categoryForService = Object.keys(serviceNames).find(category =>
      Array.isArray(serviceNames[category]) && serviceNames[category].some(s => s.value === service.value),
    );
    navigation.navigate('ServiceDetail', {
      service: service.value,
      category: categoryForService,
    });
  };

  const handleClearSearch = () => {
    setSearchText('');
  };

  const fetchProfessionalCount = useCallback(async (serviceValue) => {
    if (!serviceValue || serviceValue === 'Explore others') return 0; // Don't fetch for placeholder
    try {
      const response = await getProfessionalsByService(serviceValue);
      return response.data.length; 
    } catch (error) {
      console.error(`Error fetching count for ${serviceValue}:`, error.message);
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

        if (categoryKey.toLowerCase() === 'explore others') {
          categoryLvlCounts[categoryKey] = 0; 
          continue;
        }

        if (Array.isArray(serviceNames[categoryKey])) {
            for (const service of serviceNames[categoryKey]) {
                if (service.value) { // Ensure service.value exists
                    const count = await fetchProfessionalCount(service.value);
                    serviceLvlCounts[service.value] = count;
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

    fetchAllData(); // Initial fetch

    const unsubscribe = navigation.addListener('focus', () => {
      console.log('HomeScreen focused, re-fetching counts...');
      fetchAllData(); // Re-fetch on focus
    });

    return unsubscribe; // Cleanup listener on unmount
  }, [navigation, fetchProfessionalCount]); // serviceNames is static, so removed from deps


  const renderServiceItem = ({ item }) => {
    const count = professionalCounts[item.value] !== undefined ? professionalCounts[item.value] : 0;
  
    return (
      <TouchableOpacity
        style={styles.serviceItem}
        onPress={() => handleServicePress(item)}>
        <Text style={styles.serviceText}>{item.label}</Text>
        <View style={styles.serviceRightContainer}>
            <Text style={styles.serviceCount}>({loadingCounts && count === 0 ? '...' : count})</Text>
            <Icon
                name="arrow-forward-ios"
                size={16}
                color={styles.categoryIconContainer.backgroundColor} 
            />
        </View>
      </TouchableOpacity>
    );
  };

  const renderCategoryItem = ({ item: category }) => {
    const isOthersCategory = category.toLowerCase() === 'explore others';
    const categoryTotal = categoryCounts[category] !== undefined ? categoryCounts[category] : 0;

    if (isOthersCategory) {
      return (
        <View style={styles.categorySection}>
          <TouchableOpacity
            style={styles.categoryHeader}
            onPress={() => handleServicePress({ label: 'Explore others', value: 'Explore others' })}
            activeOpacity={0.7}>
            <View style={styles.categoryIconContainer}>
              <Icon
                name={categoryIcons[category] || 'explore'}
                size={24}
                color="white"
              />
            </View>
            <Text style={styles.categoryTitle}>{category}</Text>
            {/* <Icon
              name="arrow-forward-ios"
              size={20}
              color={styles.categoryIconContainer.backgroundColor}
            /> */}
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.categorySection}>
          <TouchableOpacity
            style={styles.categoryHeader}
            onPress={() => toggleCategory(category)}
            activeOpacity={0.7}>
            <View style={styles.categoryIconContainer}>
              <Icon
                name={categoryIcons[category] || 'category'}
                size={24}
                color="white"
              />
            </View>
            <View style={styles.categoryTextAndCountContainer}>
              <Text style={styles.categoryTitle}>{category}</Text>
              <Text style={styles.categoryCountText}>
                ({loadingCounts ? '...' : categoryTotal})
              </Text>
            </View>
            <Icon
              name={
                expandedCategory === category
                  ? 'keyboard-arrow-up'
                  : 'keyboard-arrow-down'
              }
              size={24}
              color={styles.categoryIconContainer.backgroundColor}
            />
          </TouchableOpacity>

          {expandedCategory === category && Array.isArray(serviceNames[category]) && (
            <FlatList
              data={serviceNames[category]}
              renderItem={renderServiceItem}
              keyExtractor={item => item.value}
              style={styles.servicesList}
              scrollEnabled={false}
            />
          )}
        </View>
      );
    }
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
        <Text style={styles.headerTitle}>Job Services</Text>
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

      {filteredCategories.length > 0 ? (
        <FlatList
          data={filteredCategories}
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
            color={styles.categoryIconContainer.backgroundColor}
          />
          <Text style={styles.noResultsText}>No services found</Text>
          <Text style={styles.noResultsSubtext}>
            Try a different search term
          </Text>
        </View>
      )}

      <SideMenu
        isVisible={menuVisible}
        onClose={() => setMenuVisible(false)}
        navigation={navigation}
        setIsLoggedIn={setIsLoggedIn} // You might need to pass the actual setIsLoggedIn function if used in SideMenu
      />
    </SafeAreaView>
  );
};

export default HomeScreen;



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

