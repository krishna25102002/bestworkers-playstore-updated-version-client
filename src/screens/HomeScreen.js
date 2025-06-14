// HomeScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform, // Import Platform
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  FlatList,
  UIManager, // Import UIManager
  LayoutAnimation, // Import LayoutAnimation
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import SideMenu from '../components/SideMenu';
import { styles, categoryIcons } from '../styles/HomeStyles';
import { serviceNames } from '../data/staticData';
import { getProfessionalsByService } from '../services/api';
import ProfessionalCard from '../components/ProfessionalCard'; // Import ProfessionalCard
import AppText from '../components/AppText'; // Import your custom AppText

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HomeScreen = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [professionalCounts, setProfessionalCounts] = useState({});
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const [suggestionsList, setSuggestionsList] = useState([]);
  // New state variables for enhanced search
  const [searchMode, setSearchMode] = useState('categories'); // 'categories' or 'professionals'
  const [searchResults, setSearchResults] = useState(Object.keys(serviceNames)); // Holds category keys or professional objects
  const [isSearchingProfessionals, setIsSearchingProfessionals] = useState(false);

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
            visibilityTime: 1500,
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

  // Helper function for random colors (can be moved to a utils file)
  const getRandomColor = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    const lowercasedSearch = searchText.toLowerCase();

    // Phase 1: Quick suggestions from static data (runs synchronously on searchText change)
    if (searchText) {
      const staticSuggestions = new Set();
      Object.keys(serviceNames).forEach(catKey => {
        if (catKey.toLowerCase().includes(lowercasedSearch)) {
          staticSuggestions.add(catKey);
        }
        if (Array.isArray(serviceNames[catKey])) {
          serviceNames[catKey].forEach(service => {
            if (service.label.toLowerCase().includes(lowercasedSearch)) {
              staticSuggestions.add(service.label);
            }
          });
        }
      });
      setSuggestionsList(Array.from(staticSuggestions).slice(0, 7));
    } else {
      setSuggestionsList([]);
    }

    // Phase 2: Debounced full search for main results and augmented suggestions
    const performFullSearchAndAugmentSuggestions = async () => {
      if (!searchText) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Animate clearing search
        setSearchMode('categories');
        setSearchResults(Object.keys(serviceNames));
        // Suggestions already cleared by synchronous part
        setIsSearchingProfessionals(false);
        if (expandedCategory) setExpandedCategory(null); // Collapse category on clearing search
        return;
      }

      setIsSearchingProfessionals(true);
      let professionalsFoundFromServiceMatch = [];
      let categoriesFound = [];
      let professionalsFoundViaDesignationMatch = []; // To store professionals matched by designation

      // Phase 1: Try to find professionals if search term matches a service type
      const serviceSearchPromises = [];
      for (const categoryKey in serviceNames) {
        if (Array.isArray(serviceNames[categoryKey])) {
          for (const service of serviceNames[categoryKey]) {
            if (service.label.toLowerCase().includes(lowercasedSearch) || service.value.toLowerCase().includes(lowercasedSearch)) {
              serviceSearchPromises.push(
                getProfessionalsByService(service.value, service.value === 'Explore others' ? categoryKey : null)
                  .then(response => response.data) // Get raw data
                  .catch(err => { console.error(`Error fetching for ${service.label}:`, err); return []; })
              );
            }
          }
        }
      }

      if (serviceSearchPromises.length > 0) {
        const resultsArray = await Promise.all(serviceSearchPromises);
        const rawProfessionals = resultsArray.flat();
        const uniqueRawProfessionals = Array.from(new Map(rawProfessionals.map(p => [p._id, p])).values());

        professionalsFoundFromServiceMatch = uniqueRawProfessionals.filter(prof =>
          prof.name.toLowerCase().includes(lowercasedSearch) ||
          prof.city.toLowerCase().includes(lowercasedSearch) ||
          prof.serviceName.toLowerCase().includes(lowercasedSearch) ||
          (prof.designation && prof.designation.toLowerCase().includes(lowercasedSearch))
        ).map(prof => ({ // Format for ProfessionalCard & ProfessionalDetailScreen
          id: prof._id,
          name: prof.name,
          initial: prof.name.charAt(0).toUpperCase(),
          bgColor: getRandomColor(),
          experience: prof.experience, // e.g., "0-2"
          service: prof.serviceName,
          city: prof.city,
          userIdForAvatar: prof.userIdForAvatar,
          hasAvatar: prof.hasAvatar,
          designation: prof.designation,
          serviceCategory: prof.serviceCategory,
          mobileNo: prof.mobileNo,
          secondaryMobileNo: prof.secondaryMobileNo,
          email: prof.email,
          professionDescription: prof.professionDescription,
          district: prof.district, // Added district
          state: prof.state,       // Added state
          needSupport: prof.needSupport, // Added needSupport
          createdAt: prof.createdAt,
          status: prof.status,
          // price: prof.servicePrice, // If needed
          // priceUnit: prof.priceUnit, // If needed
        }));
      }

      // Phase 2: If no professionals found via service type match, or to show categories as fallback
      // This part helps find categories if the search term directly matches a category name or a service name within a category,
      // even if no professionals are immediately filtered by the search term from those services.
      if (professionalsFoundFromServiceMatch.length === 0) { // Check if we need to find categories as primary result
        const categoryNameMatches = Object.keys(serviceNames).filter(cat =>
          cat.toLowerCase().includes(lowercasedSearch)
        );
        const serviceInCatMatches = Object.keys(serviceNames).filter(cat =>
          Array.isArray(serviceNames[cat]) &&
          serviceNames[cat].some(service =>
            service.label.toLowerCase().includes(lowercasedSearch) ||
            service.value.toLowerCase().includes(lowercasedSearch)
          )
        );
        categoriesFound = [...new Set([...categoryNameMatches, ...serviceInCatMatches])];
      }


      // Phase 3: Try to find categories based on designations within "Explore others" services.
      // This runs regardless of previous professional finds to ensure designations are always checked for suggestion augmentation
      // and potentially for direct display if it's the most relevant match.
      const designationMatchPromises = [];
      for (const categoryKey_1 in serviceNames) {
        if (Array.isArray(serviceNames[categoryKey_1])) {
          const othersService = serviceNames[categoryKey_1].find(s => s.value === 'Explore others');
          if (othersService) {
            designationMatchPromises.push(
              getProfessionalsByService(othersService.value, categoryKey_1)
                .then(response_1 => {
                  const matchingProfsInThisCategory = response_1.data.filter(prof_1 =>
                    prof_1.designation && prof_1.designation.toLowerCase().includes(lowercasedSearch)
                  );
                  if (matchingProfsInThisCategory.length > 0) {
                    professionalsFoundViaDesignationMatch.push(...matchingProfsInThisCategory.map(p => ({
                      id: p._id, name: p.name, initial: p.name.charAt(0).toUpperCase(), bgColor: getRandomColor(),
                      experience: p.experience, service: p.serviceName, 
                      city: p.city, userIdForAvatar: p.userIdForAvatar, hasAvatar: p.hasAvatar,
                      designation: p.designation, 
                      serviceCategory: p.serviceCategory, mobileNo: p.mobileNo,
                      secondaryMobileNo: p.secondaryMobileNo, email: p.email,
                      professionDescription: p.professionDescription, createdAt: p.createdAt, status: p.status,
                      district: p.district, state: p.state, needSupport: p.needSupport,
                    })));
                    return categoryKey_1; 
                  }
                  return null;
                })
                .catch(err_1 => { console.error(`Error fetching for "Others" in ${categoryKey_1} for designation check:`, err_1); return null; })
            );
          }
        }
      }
      const matchedCategoriesFromDesignations = (await Promise.all(designationMatchPromises)).filter(Boolean);
      // Combine all found categories for suggestion purposes and potential display
      const allPotentialMatchingCategories = [...new Set([...categoriesFound, ...matchedCategoriesFromDesignations])];


      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      // --- Suggestion Augmentation Logic (after API calls) ---
      const augmentedSuggestions = new Set(); 

      if (professionalsFoundFromServiceMatch.length > 0) {
        professionalsFoundFromServiceMatch.forEach(prof => {
          // if (prof.name.toLowerCase().includes(lowercasedSearch)) augmentedSuggestions.add(prof.name);
          if (prof.service.toLowerCase().includes(lowercasedSearch)) augmentedSuggestions.add(prof.service);
          if (prof.designation && prof.designation.toLowerCase().includes(lowercasedSearch)) augmentedSuggestions.add(prof.designation);
          if (prof.city.toLowerCase().includes(lowercasedSearch)) augmentedSuggestions.add(prof.city);
          if (prof.serviceCategory && prof.serviceCategory.toLowerCase().includes(lowercasedSearch)) augmentedSuggestions.add(prof.serviceCategory);
        });
      }
      
      if (professionalsFoundViaDesignationMatch.length > 0) {
        professionalsFoundViaDesignationMatch.forEach(prof => {
          if (prof.designation) augmentedSuggestions.add(prof.designation);
          if (prof.name.toLowerCase().includes(lowercasedSearch)) augmentedSuggestions.add(prof.name);
          if (prof.city.toLowerCase().includes(lowercasedSearch)) augmentedSuggestions.add(prof.city);
        });
      }

      allPotentialMatchingCategories.forEach(catKey => {
        if (catKey.toLowerCase().includes(lowercasedSearch)) {
          augmentedSuggestions.add(catKey);
        }
        if (serviceNames[catKey] && Array.isArray(serviceNames[catKey])) {
          serviceNames[catKey].forEach(service => {
            if (service.label.toLowerCase().includes(lowercasedSearch)) {
              augmentedSuggestions.add(service.label);
            }
          });
        }
      });

      if (augmentedSuggestions.size < 7) {
        Object.keys(serviceNames).forEach(catKey => {
            if (catKey.toLowerCase().includes(lowercasedSearch)) augmentedSuggestions.add(catKey);
            if (serviceNames[catKey] && Array.isArray(serviceNames[catKey])) {
                serviceNames[catKey].forEach(service => {
                    if (service.label.toLowerCase().includes(lowercasedSearch)) augmentedSuggestions.add(service.label);
                });
            }
        });
      }
      setSuggestionsList(Array.from(augmentedSuggestions).slice(0, 7));
      // --- End Suggestion Augmentation ---

      // Determine what to display based on search results priority
      if (professionalsFoundViaDesignationMatch.length > 0) {
        setSearchMode('professionals');
        setSearchResults(professionalsFoundViaDesignationMatch);
        if (expandedCategory) setExpandedCategory(null);
      } else if (professionalsFoundFromServiceMatch.length > 0) {
        setSearchMode('professionals');
        setSearchResults(professionalsFoundFromServiceMatch);
        if (expandedCategory) setExpandedCategory(null); 
      } else {
        // If no professionals found by designation or standard service match,
        // do not fall back to showing categories as the main result.
        // Instead, indicate that no professionals were found for the search term.
        setSearchMode('professionals'); 
        setSearchResults([]);
      }
      setIsSearchingProfessionals(false);
    };

    const debounceTimeout = setTimeout(() => {
      performFullSearchAndAugmentSuggestions();
    }, 500); 
    return () => clearTimeout(debounceTimeout);
  }, [searchText, serviceNames]); // expandedCategory is needed for reset logic

  const toggleCategory = (category) => {
    const newExpanded = expandedCategory === category ? null : category;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Animate expand/collapse
    setExpandedCategory(newExpanded);
  };

  const handleServicePress = (service, parentCategory) => {
    navigation.navigate('ServiceDetail', {
      service: service.value,
      category: parentCategory,
    });
  };

  const handleProfessionalPress = (professional) => {
    navigation.navigate('ProfessionalDetail', { professional });
  };

  const handleClearSearch = () => {
    setSearchText('');
    setSuggestionsList([]); 
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
    let isMounted = true; 

    const fetchAllData = async () => {
      if (!isMounted) return;
      setLoadingCounts(true); 
      if (isMounted) { 
        setProfessionalCounts({});
        setCategoryCounts({});
      }
      const serviceLvlCounts = {};
      const categoryLvlCounts = {};
      console.log("HomeScreen: Fetching all counts...");

      for (const categoryKey in serviceNames) {
        if (!isMounted) break; 
        let currentCategoryTotal = 0;

        if (categoryKey.toLowerCase() === 'explore others') continue;
        if (Array.isArray(serviceNames[categoryKey])) {
            for (const service of serviceNames[categoryKey]) {
                if (service.value) {
                    let count;
                    if (service.value === 'Explore others') {
                       console.log(`Fetching count for 'Explore others' under category: ${categoryKey}`);
                        count = await fetchProfessionalCount(service.value, categoryKey);
                        console.log(`Fetched count: ${count} for key: ${service.value}_${categoryKey}`);
                    } else {
                        count = await fetchProfessionalCount(service.value);
                    }
                    serviceLvlCounts[`${service.value}_${categoryKey}`] = count;
                    currentCategoryTotal += count;
                }
            }
        }
        categoryLvlCounts[categoryKey] = currentCategoryTotal;
      }
      if (isMounted) { 
        setProfessionalCounts(serviceLvlCounts);
        setCategoryCounts(categoryLvlCounts);
        setLoadingCounts(false);
        console.log("HomeScreen: Counts fetched:", { serviceLvlCounts, categoryLvlCounts });
      }
    };

    fetchAllData(); 

    return () => {
      isMounted = false;
    };
  }, [navigation, fetchProfessionalCount]); 

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
            <View style={styles.countAndChevronContainer}>
              <AppText style={styles.categoryCountText}>
                {/* ({loadingCounts ? '...' : categoryTotal}) */}
              </AppText>
              <Icon
                name={
                  isExpanded
                    ? 'keyboard-arrow-up'
                    : 'keyboard-arrow-down'
                }
                size={24}
                color={styles.categoryIconContainer.backgroundColor} 
                style={styles.chevronIconStyle} 
              />
            </View>
          </TouchableOpacity>

          {isExpanded && Array.isArray(categoryServices) && (
            <FlatList
              data={categoryServices}
              renderItem={({ item: serviceItem }) => {
                const countKey = `${serviceItem.value}_${category}`;
                const count = professionalCounts[countKey] !== undefined ? professionalCounts[countKey] : 0;
                return (
                  <TouchableOpacity
                    style={styles.serviceItem}
                    onPress={() => handleServicePress(serviceItem, category)}
                  >
                    <AppText style={styles.serviceText}>{serviceItem.label}</AppText>
                    <View style={styles.serviceRightContainer}>
                      <AppText style={styles.serviceCount}>({loadingCounts ? '...' : count})</AppText>
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
              scrollEnabled={false} // Important if this FlatList is inside the main ScrollView/FlatList
              nestedScrollEnabled={true} // For Android
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

      {/* Suggestions List */}
      {searchText && suggestionsList.length > 0 && (
        <View style={localStyles.suggestionsContainer}>
          <FlatList
            data={suggestionsList}
            keyExtractor={(item, index) => `${item}_${index}`}
            renderItem={({ item: suggestion }) => (
              <TouchableOpacity
                style={localStyles.suggestionItem}
                onPress={() => {
                  setSearchText(suggestion);
                  setSuggestionsList([]); 
                }}
              >
                <AppText style={localStyles.suggestionText}>{suggestion}</AppText>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true} 
          />
        </View>
      )}
        
      {isSearchingProfessionals ? (
        <View style={styles.fullPageLoaderContainer}>
          <ActivityIndicator size="large" color={styles.categoryIconContainer.backgroundColor || '#2E5BFF'} />
          <AppText style={styles.fullPageLoaderText}>Searching...</AppText>
        </View>
      ) : searchMode === 'professionals' && searchResults.length > 0 ? (
        <FlatList
          data={searchResults} 
          renderItem={({ item }) => (
            <ProfessionalCard
              professional={item}
              onPress={() => handleProfessionalPress(item)}
            />
          )}
          keyExtractor={item => item.id}
          style={styles.categoriesList} 
          contentContainerStyle={styles.professionalsContainer} 
          showsVerticalScrollIndicator={false}
        />
      ) : searchMode === 'professionals' && searchResults.length === 0 && searchText ? (
         <View style={styles.noResultsContainer}>
          <Icon name="search-off" size={64} color={styles.categoryIconContainer.backgroundColor || '#2E5BFF'} />
          <AppText style={styles.noResultsText} semiBold>No professionals found</AppText>
          <AppText style={styles.noResultsSubtext}>Try a different search term or browse categories.</AppText>
        </View>
      ) : searchMode === 'categories' && searchResults.length > 0 ? ( 
        <FlatList
          data={searchResults.filter(cat => cat.toLowerCase() !== 'explore others')} 
          renderItem={renderCategoryItem}
          keyExtractor={item => item}
          style={styles.categoriesList}
          contentContainerStyle={styles.categoriesContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : searchMode === 'categories' && searchResults.length === 0 && searchText ? ( 
        <View style={styles.noResultsContainer}>
          <Icon
            name="search-off"
            size={64}
            color={styles.categoryIconContainer.backgroundColor || '#2E5BFF'}
          />
          <AppText style={styles.noResultsText} semiBold>No categories or services found</AppText>
          <AppText style={styles.noResultsSubtext}>
            Try a different search term
          </AppText>
        </View>
      ) : loadingCounts && Object.keys(professionalCounts).length === 0 && Object.keys(categoryCounts).length === 0 ? ( 
        <View style={styles.fullPageLoaderContainer}>
            <ActivityIndicator size="large" color={styles.categoryIconContainer.backgroundColor || '#2E5BFF'} />
        </View>
      ) : ( 
        <FlatList
          data={Object.keys(serviceNames).filter(cat => cat.toLowerCase() !== 'explore others')}
          renderItem={renderCategoryItem}
          keyExtractor={item => item}
          style={styles.categoriesList}
          contentContainerStyle={styles.categoriesContainer}
          showsVerticalScrollIndicator={false}
        />
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

const localStyles = StyleSheet.create({
  suggestionsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 15, 
    marginTop: Platform.OS === 'ios' ? -5 : 5, 
    marginBottom: 10,
    maxHeight: 220, 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    zIndex: 1000, 
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    fontSize: 15,
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
});

export default HomeScreen;



// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   Platform, // Import Platform
//   TouchableOpacity,
//   TextInput,
//   SafeAreaView,
//   ActivityIndicator,
//   StatusBar,
//   FlatList,
//   UIManager, // Import UIManager
//   LayoutAnimation, // Import LayoutAnimation
// } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Toast from 'react-native-toast-message';
// import SideMenu from '../components/SideMenu';
// import { styles, categoryIcons } from '../styles/HomeStyles';
// import { serviceNames } from '../data/staticData';
// import { getProfessionalsByService } from '../services/api';
// import ProfessionalCard from '../components/ProfessionalCard'; // Import ProfessionalCard
// import AppText from '../components/AppText'; // Import your custom AppText

// // Enable LayoutAnimation for Android
// if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

// const HomeScreen = ({ navigation }) => {
//   const [menuVisible, setMenuVisible] = useState(false);
//   const [professionalCounts, setProfessionalCounts] = useState({});
//   const [categoryCounts, setCategoryCounts] = useState({});
//   const [loadingCounts, setLoadingCounts] = useState(true);
//   const [searchText, setSearchText] = useState('');
//   const [expandedCategory, setExpandedCategory] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(true);

//   const [suggestionsList, setSuggestionsList] = useState([]);
//   // New state variables for enhanced search
//   const [searchMode, setSearchMode] = useState('categories'); // 'categories' or 'professionals'
//   const [searchResults, setSearchResults] = useState(Object.keys(serviceNames)); // Holds category keys or professional objects
//   const [isSearchingProfessionals, setIsSearchingProfessionals] = useState(false);

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
//             visibilityTime: 1500,
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

//   // Helper function for random colors (can be moved to a utils file)
//   const getRandomColor = () => {
//     const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6'];
//     return colors[Math.floor(Math.random() * colors.length)];
//   };

//   useEffect(() => {
//     const lowercasedSearch = searchText.toLowerCase();

//     // Phase 1: Quick suggestions from static data (runs synchronously on searchText change)
//     if (searchText) {
//       const staticSuggestions = new Set();
//       Object.keys(serviceNames).forEach(catKey => {
//         if (catKey.toLowerCase().includes(lowercasedSearch)) {
//           staticSuggestions.add(catKey);
//         }
//         if (Array.isArray(serviceNames[catKey])) {
//           serviceNames[catKey].forEach(service => {
//             if (service.label.toLowerCase().includes(lowercasedSearch)) {
//               staticSuggestions.add(service.label);
//             }
//           });
//         }
//       });
//       setSuggestionsList(Array.from(staticSuggestions).slice(0, 7));
//     } else {
//       setSuggestionsList([]);
//     }

//     // Phase 2: Debounced full search for main results and augmented suggestions
//     const performFullSearchAndAugmentSuggestions = async () => {
//       if (!searchText) {
//         LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Animate clearing search
//         setSearchMode('categories');
//         setSearchResults(Object.keys(serviceNames));
//         // Suggestions already cleared by synchronous part
//         setIsSearchingProfessionals(false);
//         if (expandedCategory) setExpandedCategory(null); // Collapse category on clearing search
//         return;
//       }

//       setIsSearchingProfessionals(true);
//       let professionalsFoundFromServiceMatch = [];
//       let categoriesFound = [];
//       let professionalsFoundViaDesignationMatch = []; // To store professionals matched by designation

//       // Phase 1: Try to find professionals if search term matches a service type
//       const serviceSearchPromises = [];
//       for (const categoryKey in serviceNames) {
//         if (Array.isArray(serviceNames[categoryKey])) {
//           for (const service of serviceNames[categoryKey]) {
//             if (service.label.toLowerCase().includes(lowercasedSearch) || service.value.toLowerCase().includes(lowercasedSearch)) {
//               serviceSearchPromises.push(
//                 getProfessionalsByService(service.value, service.value === 'Explore others' ? categoryKey : null)
//                   .then(response => response.data) // Get raw data
//                   .catch(err => { console.error(`Error fetching for ${service.label}:`, err); return []; })
//               );
//             }
//           }
//         }
//       }

//       if (serviceSearchPromises.length > 0) {
//         const resultsArray = await Promise.all(serviceSearchPromises);
//         const rawProfessionals = resultsArray.flat();
//         const uniqueRawProfessionals = Array.from(new Map(rawProfessionals.map(p => [p._id, p])).values());

//         professionalsFoundFromServiceMatch = uniqueRawProfessionals.filter(prof =>
//           prof.name.toLowerCase().includes(lowercasedSearch) ||
//           prof.city.toLowerCase().includes(lowercasedSearch) ||
//           prof.serviceName.toLowerCase().includes(lowercasedSearch) ||
//           (prof.designation && prof.designation.toLowerCase().includes(lowercasedSearch))
//         ).map(prof => ({ // Format for ProfessionalCard & ProfessionalDetailScreen
//           id: prof._id,
//           name: prof.name,
//           initial: prof.name.charAt(0).toUpperCase(),
//           bgColor: getRandomColor(),
//           experience: prof.experience, // e.g., "0-2"
//           service: prof.serviceName,
//           city: prof.city,
//           userIdForAvatar: prof.userIdForAvatar,
//           hasAvatar: prof.hasAvatar,
//           designation: prof.designation,
//           serviceCategory: prof.serviceCategory,
//           mobileNo: prof.mobileNo,
//           secondaryMobileNo: prof.secondaryMobileNo,
//           email: prof.email,
//           professionDescription: prof.professionDescription,
//           district: prof.district, // Added district
//           state: prof.state,       // Added state
//           needSupport: prof.needSupport, // Added needSupport
//           createdAt: prof.createdAt,
//           status: prof.status,
//           // price: prof.servicePrice, // If needed
//           // priceUnit: prof.priceUnit, // If needed
//         }));
//       }

//       // Phase 2: If no professionals found via service type match, or to show categories as fallback
//       if (professionalsFoundFromServiceMatch.length === 0) {
//         const categoryNameMatches = Object.keys(serviceNames).filter(cat =>
//           cat.toLowerCase().includes(lowercasedSearch)
//         );
//         const serviceInCatMatches = Object.keys(serviceNames).filter(cat =>
//           Array.isArray(serviceNames[cat]) &&
//           serviceNames[cat].some(service =>
//             service.label.toLowerCase().includes(lowercasedSearch) ||
//             service.value.toLowerCase().includes(lowercasedSearch)
//           )
//         );
//         categoriesFound = [...new Set([...categoryNameMatches, ...serviceInCatMatches])];
//       }

//       // If Phase 1 (direct professional match via service type) didn't yield results to display,
//       // let's try to find categories based on designations within "Others" services.
//       if (professionalsFoundFromServiceMatch.length === 0) {
//         const designationMatchPromises = [];
//         for (const categoryKey_1 in serviceNames) {
//           if (Array.isArray(serviceNames[categoryKey_1])) {
//             // Find if this category has an "Others" type service
//             const othersService = serviceNames[categoryKey_1].find(s => s.value === 'Explore others');
//             if (othersService) {
//               // Fetch professionals for this "Others" service within this category
//               designationMatchPromises.push(
//                 getProfessionalsByService(othersService.value, categoryKey_1) // Pass categoryKey for "Explore others"
//                   .then(response_1 => {
//                     // Check if any professional in this "Others" group has a matching designation
//                     const matchingProfsInThisCategory = response_1.data.filter(prof_1 =>
//                       prof_1.designation && prof_1.designation.toLowerCase().includes(lowercasedSearch)
//                     );
//                     if (matchingProfsInThisCategory.length > 0) {
//                       // Add these professionals to our new list, mapping them to the standard format
//                       professionalsFoundViaDesignationMatch.push(...matchingProfsInThisCategory.map(p => ({
//                         id: p._id, name: p.name, initial: p.name.charAt(0).toUpperCase(), bgColor: getRandomColor(),
//                         experience: p.experience, service: p.serviceName, // serviceName will be 'Explore others'
//                         city: p.city, userIdForAvatar: p.userIdForAvatar, hasAvatar: p.hasAvatar,
//                         designation: p.designation, // This is the custom service name
//                         serviceCategory: p.serviceCategory, mobileNo: p.mobileNo,
//                         secondaryMobileNo: p.secondaryMobileNo, email: p.email,
//                         professionDescription: p.professionDescription, createdAt: p.createdAt, status: p.status,
//                         district: p.district, // Added district
//                         state: p.state,       // Added state
//                         needSupport: p.needSupport, // Added needSupport
//                       })));
//                       return categoryKey_1; // Return the category key if a match is found
//                     }
//                     return null;
//                   })
//                   .catch(err_1 => { console.error(`Error fetching for "Others" in ${categoryKey_1} for designation check:`, err_1); return null; })
//               );
//             }
//           }
//         }
//         const matchedCategoriesFromDesignations = (await Promise.all(designationMatchPromises)).filter(Boolean);
//         if (matchedCategoriesFromDesignations.length > 0) {
//           categoriesFound = [...new Set([...categoriesFound, ...matchedCategoriesFromDesignations])];
//         }
//       }

//       LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

//       // --- Suggestion Augmentation Logic (after API calls) ---
//       const augmentedSuggestions = new Set(); // Start fresh for augmentation

//       if (professionalsFoundFromServiceMatch.length > 0) {
//         professionalsFoundFromServiceMatch.forEach(prof => {
//           if (prof.name.toLowerCase().includes(lowercasedSearch)) augmentedSuggestions.add(prof.name);
//           if (prof.service.toLowerCase().includes(lowercasedSearch)) augmentedSuggestions.add(prof.service);
//           if (prof.designation && prof.designation.toLowerCase().includes(lowercasedSearch)) augmentedSuggestions.add(prof.designation);
//           if (prof.city.toLowerCase().includes(lowercasedSearch)) augmentedSuggestions.add(prof.city);
//           if (prof.serviceCategory && prof.serviceCategory.toLowerCase().includes(lowercasedSearch)) augmentedSuggestions.add(prof.serviceCategory);
//         });
//       }
      
//       // Add suggestions from professionals found specifically by designation match
//       if (professionalsFoundViaDesignationMatch.length > 0) {
//         professionalsFoundViaDesignationMatch.forEach(prof => {
//           // The designation matched, so it's a primary suggestion candidate
//           if (prof.designation) augmentedSuggestions.add(prof.designation);
          
//           // Optionally add name/city if they also contain the search term for more context
//           if (prof.name.toLowerCase().includes(lowercasedSearch)) augmentedSuggestions.add(prof.name);
//           if (prof.city.toLowerCase().includes(lowercasedSearch)) augmentedSuggestions.add(prof.city);
//           // Suggesting the category (prof.serviceCategory) is handled by the allMatchingCategoriesFromAPI loop
//         });
//       }

//       // Add categories and their services if they match
//       const allMatchingCategoriesFromAPI = [...new Set([...categoriesFound, ...matchedCategoriesFromDesignations])];
//       allMatchingCategoriesFromAPI.forEach(catKey => {
//         if (catKey.toLowerCase().includes(lowercasedSearch)) {
//           augmentedSuggestions.add(catKey);
//         }
//         if (serviceNames[catKey] && Array.isArray(serviceNames[catKey])) {
//           serviceNames[catKey].forEach(service => {
//             if (service.label.toLowerCase().includes(lowercasedSearch)) {
//               augmentedSuggestions.add(service.label);
//             }
//           });
//         }
//       });

//       // Fallback: if API-driven suggestions are sparse, ensure static ones are included
//       if (augmentedSuggestions.size < 7) {
//         Object.keys(serviceNames).forEach(catKey => {
//             if (catKey.toLowerCase().includes(lowercasedSearch)) augmentedSuggestions.add(catKey);
//             if (serviceNames[catKey] && Array.isArray(serviceNames[catKey])) {
//                 serviceNames[catKey].forEach(service => {
//                     if (service.label.toLowerCase().includes(lowercasedSearch)) augmentedSuggestions.add(service.label);
//                 });
//             }
//         });
//       }
//       setSuggestionsList(Array.from(augmentedSuggestions).slice(0, 7));
//       // --- End Suggestion Augmentation ---

//       // Determine what to display based on search results priority
//       if (professionalsFoundViaDesignationMatch.length > 0) {
//         // Priority 1: Professionals found by specific designation match
//         setSearchMode('professionals');
//         setSearchResults(professionalsFoundViaDesignationMatch);
//         if (expandedCategory) setExpandedCategory(null);
//       } else if (professionalsFoundFromServiceMatch.length > 0) {
//         // Priority 2: Professionals found by standard service name match
//         setSearchMode('professionals');
//         setSearchResults(professionalsFoundFromServiceMatch);
//         if (expandedCategory) setExpandedCategory(null); // Collapse category if showing professionals
//       } else if (allMatchingCategoriesFromAPI.length > 0) {
//         // Priority 3: Categories found
//         setSearchMode('categories');
//         setSearchResults(allMatchingCategoriesFromAPI); // Use API derived categories
//       } else {
//         // Fallback: No results found
//         setSearchMode('professionals'); // Default to "no professionals found" if nothing matches
//         setSearchResults([]);
//       }
//       setIsSearchingProfessionals(false);
//     };

//     const debounceTimeout = setTimeout(() => {
//       performFullSearchAndAugmentSuggestions();
//     }, 500); // Corrected debounce for search (e.g., 500ms)
//     return () => clearTimeout(debounceTimeout);
//   }, [searchText, serviceNames]); // expandedCategory for reset logic

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

//   const handleProfessionalPress = (professional) => {
//     // Navigate to ProfessionalDetailScreen, ensuring `professional` object has all necessary fields
//     navigation.navigate('ProfessionalDetail', { professional });
//   };

//   const handleClearSearch = () => {
//     setSearchText('');
//     setSuggestionsList([]); // Clear suggestions when search is cleared
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
//     let isMounted = true; // Flag to prevent state updates if component is unmounted

//     const fetchAllData = async () => {
//       if (!isMounted) return;
//       setLoadingCounts(true); // Set loading true at the start of fetching
//       // Reset counts to ensure fresh data if called again (e.g., on manual refresh)
//       if (isMounted) { // Check isMounted before setting state
//         setProfessionalCounts({});
//         setCategoryCounts({});
//       }
//       const serviceLvlCounts = {};
//       const categoryLvlCounts = {};
//       console.log("HomeScreen: Fetching all counts...");

//       for (const categoryKey in serviceNames) {
//         if (!isMounted) break; // Stop if component unmounted during loop
//         let currentCategoryTotal = 0;

//         if (categoryKey.toLowerCase() === 'explore others') continue;
//         if (Array.isArray(serviceNames[categoryKey])) {
//             for (const service of serviceNames[categoryKey]) {
//                 if (service.value) {
//                     let count;
//                     // *** CRUCIAL LOGIC FOR "OTHERS" COUNT ***
//                     if (service.value === 'Explore others') {
//                        console.log(`Fetching count for 'Explore others' under category: ${categoryKey}`);
//                         count = await fetchProfessionalCount(service.value, categoryKey);
//                         console.log(`Fetched count: ${count} for key: ${service.value}_${categoryKey}`);
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
//       if (isMounted) { // Check isMounted before setting state
//         setProfessionalCounts(serviceLvlCounts);
//         setCategoryCounts(categoryLvlCounts);
//         setLoadingCounts(false);
//         console.log("HomeScreen: Counts fetched:", { serviceLvlCounts, categoryLvlCounts });
//       }
//     };

//     fetchAllData(); // Fetch on initial mount

//     // To re-fetch data when the screen comes into focus (e.g., after navigating back):
//     // This was causing performance issues by running on *every* focus.
//     // If you need to refresh data on focus, consider a more controlled approach,
//     // perhaps with a shorter list of critical data or a manual refresh option.
//     // For now, this is disabled to improve performance.
//     // const unsubscribeFocus = navigation.addListener('focus', () => {
//     //   if (isMounted) {
//     //     console.log('HomeScreen focused, considering re-fetching counts...');
//     //     // fetchAllData(); // Re-enable if truly necessary and optimized
//     //   }
//     // });

//     return () => {
//       isMounted = false;
//       // if (unsubscribeFocus) unsubscribeFocus(); // Unsubscribe if the listener was active
//     };
//   }, [navigation, fetchProfessionalCount]); // serviceNames removed as it's static

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
//               <AppText style={styles.categoryTitle} semiBold>{category}</AppText>
//             </View>
//             {/* New container for count and chevron icon */}
//             <View style={styles.countAndChevronContainer}>
//               <AppText style={styles.categoryCountText}>
//                 {/* ({loadingCounts ? '...' : categoryTotal}) */}
//               </AppText>
//               <Icon
//                 name={
//                   isExpanded
//                     ? 'keyboard-arrow-up'
//                     : 'keyboard-arrow-down'
//                 }
//                 size={24}
//                 color={styles.categoryIconContainer.backgroundColor} // Use primary color
//                 style={styles.chevronIconStyle} // Added style for potential margin
//               />
//             </View>
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
//                     <AppText style={styles.serviceText}>{serviceItem.label}</AppText>
//                     <View style={styles.serviceRightContainer}>
//                       <AppText style={styles.serviceCount}>({loadingCounts ? '...' : count})</AppText>
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
//         <AppText style={styles.headerTitle} bold>Job Services</AppText>
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

//       {/* Suggestions List */}
//       {searchText && suggestionsList.length > 0 && (
//         <View style={localStyles.suggestionsContainer}>
//           <FlatList
//             data={suggestionsList}
//             keyExtractor={(item, index) => `${item}_${index}`}
//             renderItem={({ item: suggestion }) => (
//               <TouchableOpacity
//                 style={localStyles.suggestionItem}
//                 onPress={() => {
//                   setSearchText(suggestion);
//                   setSuggestionsList([]); // Hide suggestions after selection
//                 }}
//               >
//                 <AppText style={localStyles.suggestionText}>{suggestion}</AppText>
//               </TouchableOpacity>
//             )}
//             showsVerticalScrollIndicator={false}
//             nestedScrollEnabled={true} // Important for Android if inside another scroll view, though here it's conditionally rendered
//           />
//         </View>
//       )}
//             {/* Show full page loader only if professionalCounts is empty, indicating very first load phase */}
//       {/* {loadingCounts && Object.keys(professionalCounts).length === 0 && Object.keys(categoryCounts).length === 0 ? (
//         <View style={styles.fullPageLoaderContainer}>
//             <ActivityIndicator size="large" color={styles.categoryIconContainer.backgroundColor || '#2E5BFF'} />
//             {/* <AppText style={styles.fullPageLoaderText}>Loading Categories...</AppText> */}
//             {/* <AppText style={styles.fullPageLoaderText}>Loading Categories...</AppText> */}
//         {/* </View>  */}
        
//       {/* /* {loadingCounts && Object.keys(professionalCounts).length === 0 && Object.keys(categoryCounts).length === 0 ? ( */}

//        {/* {loadingCounts && filteredCategories.length === Object.keys(serviceNames).length ? ( */}

//       {/* Show FlatList if categories are available, otherwise show loader or no results */}
//       {isSearchingProfessionals ? (
//         <View style={styles.fullPageLoaderContainer}>
//           <ActivityIndicator size="large" color={styles.categoryIconContainer.backgroundColor || '#2E5BFF'} />
//           <AppText style={styles.fullPageLoaderText}>Searching...</AppText>
//         </View>
//       ) : searchMode === 'professionals' && searchResults.length > 0 ? (
//         <FlatList
//           data={searchResults} // These are professional objects
//           renderItem={({ item }) => (
//             <ProfessionalCard
//               professional={item}
//               onPress={() => handleProfessionalPress(item)}
//             />
//           )}
//           keyExtractor={item => item.id}
//           style={styles.categoriesList} // Can reuse or create new style e.g., styles.professionalsList
//           contentContainerStyle={styles.professionalsContainer} // Create this style
//           showsVerticalScrollIndicator={false}
//         />
//       ) : searchMode === 'professionals' && searchResults.length === 0 && searchText ? (
//          <View style={styles.noResultsContainer}>
//           <Icon name="search-off" size={64} color={styles.categoryIconContainer.backgroundColor || '#2E5BFF'} />
//           <AppText style={styles.noResultsText} semiBold>No professionals found</AppText>
//           <AppText style={styles.noResultsSubtext}>Try a different search term or browse categories.</AppText>
//         </View>
//       ) : searchMode === 'categories' && searchResults.length > 0 ? ( // Original category display
//         <FlatList
//           data={searchResults.filter(cat => cat.toLowerCase() !== 'explore others')} // searchResults are category keys
//           renderItem={renderCategoryItem}
//           keyExtractor={item => item}
//           style={styles.categoriesList}
//           contentContainerStyle={styles.categoriesContainer}
//           showsVerticalScrollIndicator={false}
//         />
//       ) : searchMode === 'categories' && searchResults.length === 0 && searchText ? ( // No categories found by search
//         <View style={styles.noResultsContainer}>
//           <Icon
//             name="search-off"
//             size={64}
//             color={styles.categoryIconContainer.backgroundColor || '#2E5BFF'}
//           />
//           <AppText style={styles.noResultsText} semiBold>No categories or services found</AppText>
//           <AppText style={styles.noResultsSubtext}>
//             Try a different search term
//           </AppText>
//         </View>
//       ) : loadingCounts && Object.keys(professionalCounts).length === 0 && Object.keys(categoryCounts).length === 0 ? ( // Initial loading state before any search
//         <View style={styles.fullPageLoaderContainer}>
//             <ActivityIndicator size="large" color={styles.categoryIconContainer.backgroundColor || '#2E5BFF'} />
//         </View>
//       ) : ( // Default to category list if no search text and not initial loading
//         <FlatList
//           data={Object.keys(serviceNames).filter(cat => cat.toLowerCase() !== 'explore others')}
//           renderItem={renderCategoryItem}
//           keyExtractor={item => item}
//           style={styles.categoriesList}
//           contentContainerStyle={styles.categoriesContainer}
//           showsVerticalScrollIndicator={false}
//         />
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

// // Add these styles to your styles/HomeStyles.js or define them locally like this for now.
// // For better organization, moving them to HomeStyles.js is recommended.
// const localStyles = StyleSheet.create({
//   suggestionsContainer: {
//     backgroundColor: 'white',
//     borderRadius: 8,
//     marginHorizontal: 15, // Match searchContainer horizontal margin
//     marginTop: Platform.OS === 'ios' ? -5 : 5, // Adjust to sit nicely below search bar
//     marginBottom: 10,
//     maxHeight: 220, // Limit height
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     zIndex: 1000, // Ensure it's on top
//     borderColor: '#e0e0e0',
//     borderWidth: 1,
//   },
//   suggestionItem: {
//     paddingVertical: 12,
//     paddingHorizontal: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   suggestionText: {
//     fontSize: 15,
//     color: '#333',
//     fontFamily: 'Poppins-Regular',
//   },
// });

// export default HomeScreen;

// // import React, { useState, useEffect, useCallback } from 'react';
// // import {
// //   StyleSheet,
// //   Text,
// //   View,
// //   TouchableOpacity,
// //   TextInput,
// //   SafeAreaView,
// //   ActivityIndicator,
// //   StatusBar,
// //   FlatList,
// // } from 'react-native';
// // import Icon from 'react-native-vector-icons/MaterialIcons';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import Toast from 'react-native-toast-message';
// // import SideMenu from '../components/SideMenu';
// // import { styles, categoryIcons } from '../styles/HomeStyles';
// // import { serviceNames } from '../data/staticData';
// // import { getProfessionalsByService } from '../services/api';
// // import ProfessionalCard from '../components/ProfessionalCard'; // Import ProfessionalCard
// // import AppText from '../components/AppText'; // Import your custom AppText

// // const HomeScreen = ({ navigation }) => {
// //   const [menuVisible, setMenuVisible] = useState(false);
// //   const [professionalCounts, setProfessionalCounts] = useState({});
// //   const [categoryCounts, setCategoryCounts] = useState({});
// //   const [loadingCounts, setLoadingCounts] = useState(true);
// //   const [searchText, setSearchText] = useState('');
// //   const [expandedCategory, setExpandedCategory] = useState(null);
// //   const [isLoggedIn, setIsLoggedIn] = useState(true);

// //   // New state variables for enhanced search
// //   const [searchMode, setSearchMode] = useState('categories'); // 'categories' or 'professionals'
// //   const [searchResults, setSearchResults] = useState(Object.keys(serviceNames)); // Holds category keys or professional objects
// //   const [isSearchingProfessionals, setIsSearchingProfessionals] = useState(false);

// //   useEffect(() => {
// //     const checkToken = async () => {
// //       try {
// //         const token = await AsyncStorage.getItem('userToken');
// //         if (!token) {
// //           navigation.navigate('Login');
// //         } else {
// //           Toast.show({
// //             type: 'success',
// //             text1: 'Welcome to Job Services',
// //             text2: 'Explore our categories!',
// //             visibilityTime: 1500,
// //             position: 'top',
// //             topOffset: 70,
// //           });
// //         }
// //       } catch (error) {
// //         console.error('Failed to get token', error);
// //       }
// //     };

// //     checkToken();
// //   }, [navigation]);

// //   // Helper function for random colors (can be moved to a utils file)
// //   const getRandomColor = () => {
// //     const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6'];
// //     return colors[Math.floor(Math.random() * colors.length)];
// //   };

// //   useEffect(() => {
// //     const performSearch = async () => {
// //       if (!searchText) {
// //         setSearchMode('categories');
// //         setSearchResults(Object.keys(serviceNames));
// //         setIsSearchingProfessionals(false);
// //         if (expandedCategory) setExpandedCategory(null); // Collapse category on clearing search
// //         return;
// //       }

// //       setIsSearchingProfessionals(true);
// //       const lowercasedSearch = searchText.toLowerCase();
// //       let professionalsFoundFromServiceMatch = [];
// //       let categoriesFound = [];

// //       // Phase 1: Try to find professionals if search term matches a service type
// //       const serviceSearchPromises = [];
// //       for (const categoryKey in serviceNames) {
// //         if (Array.isArray(serviceNames[categoryKey])) {
// //           for (const service of serviceNames[categoryKey]) {
// //             if (service.label.toLowerCase().includes(lowercasedSearch) || service.value.toLowerCase().includes(lowercasedSearch)) {
// //               serviceSearchPromises.push(
// //                 getProfessionalsByService(service.value, service.value === 'Explore others' ? categoryKey : null)
// //                   .then(response => response.data) // Get raw data
// //                   .catch(err => { console.error(`Error fetching for ${service.label}:`, err); return []; })
// //               );
// //             }
// //           }
// //         }
// //       }

// //       if (serviceSearchPromises.length > 0) {
// //         const resultsArray = await Promise.all(serviceSearchPromises);
// //         const rawProfessionals = resultsArray.flat();
// //         const uniqueRawProfessionals = Array.from(new Map(rawProfessionals.map(p => [p._id, p])).values());

// //         professionalsFoundFromServiceMatch = uniqueRawProfessionals.filter(prof =>
// //           prof.name.toLowerCase().includes(lowercasedSearch) ||
// //           prof.city.toLowerCase().includes(lowercasedSearch) ||
// //           prof.serviceName.toLowerCase().includes(lowercasedSearch) ||
// //           (prof.designation && prof.designation.toLowerCase().includes(lowercasedSearch))
// //         ).map(prof => ({ // Format for ProfessionalCard & ProfessionalDetailScreen
// //           id: prof._id,
// //           name: prof.name,
// //           initial: prof.name.charAt(0).toUpperCase(),
// //           bgColor: getRandomColor(),
// //           experience: prof.experience, // e.g., "0-2"
// //           service: prof.serviceName,
// //           city: prof.city,
// //           userIdForAvatar: prof.userIdForAvatar,
// //           hasAvatar: prof.hasAvatar,
// //           designation: prof.designation,
// //           serviceCategory: prof.serviceCategory,
// //           mobileNo: prof.mobileNo,
// //           secondaryMobileNo: prof.secondaryMobileNo,
// //           email: prof.email,
// //           professionDescription: prof.professionDescription,
// //           createdAt: prof.createdAt,
// //           status: prof.status,
// //           // price: prof.servicePrice, // If needed
// //           // priceUnit: prof.priceUnit, // If needed
// //         }));
// //       }

// //       // Phase 2: If no professionals found via service type match, or to show categories as fallback
// //       if (professionalsFoundFromServiceMatch.length === 0) {
// //         const categoryNameMatches = Object.keys(serviceNames).filter(cat =>
// //           cat.toLowerCase().includes(lowercasedSearch)
// //         );
// //         const serviceInCatMatches = Object.keys(serviceNames).filter(cat =>
// //           Array.isArray(serviceNames[cat]) &&
// //           serviceNames[cat].some(service =>
// //             service.label.toLowerCase().includes(lowercasedSearch) ||
// //             service.value.toLowerCase().includes(lowercasedSearch)
// //           )
// //         );
// //         categoriesFound = [...new Set([...categoryNameMatches, ...serviceInCatMatches])];
// //       }

// //       if (professionalsFoundFromServiceMatch.length > 0) {
// //         setSearchMode('professionals');
// //         setSearchResults(professionalsFoundFromServiceMatch);
// //         if (expandedCategory) setExpandedCategory(null); // Collapse category if showing professionals
// //       } else if (categoriesFound.length > 0) {
// //         setSearchMode('categories');
// //         setSearchResults(categoriesFound);
// //       } else {
// //         setSearchMode('professionals'); // Default to "no professionals found" if nothing matches
// //         setSearchResults([]);
// //       }
// //       setIsSearchingProfessionals(false);
// //     };

// //     const debounceTimeout = setTimeout(() => {
// //       performSearch();
// //     }, 300); // 300ms debounce for search

// //     return () => clearTimeout(debounceTimeout);
// //   }, [searchText, serviceNames]);

// //   const toggleCategory = (category) => {
// //     const newExpanded = expandedCategory === category ? null : category;
// //     setExpandedCategory(newExpanded);
// //   };

// //   const handleServicePress = (service, parentCategory) => {
// //     navigation.navigate('ServiceDetail', {
// //       service: service.value,
// //       category: parentCategory,
// //     });
// //   };

// //   const handleProfessionalPress = (professional) => {
// //     // Navigate to ProfessionalDetailScreen, ensuring `professional` object has all necessary fields
// //     navigation.navigate('ProfessionalDetail', { professional });
// //   };

// //   const handleClearSearch = () => {
// //     setSearchText('');
// //   };

// //   const fetchProfessionalCount = useCallback(async (serviceValue, categoryValue = null) => {
// //     if (!serviceValue) return 0;
// //     try {
// //       const response = await getProfessionalsByService(serviceValue, categoryValue);
// //       return response.data.length;
// //     } catch (error) {
// //       console.error(`Error fetching count for ${serviceValue} (Category: ${categoryValue}):`, error.message);
// //       return 0;
// //     }
// //   }, []);

// //   useEffect(() => {
// //     const fetchAllData = async () => {
// //       setLoadingCounts(true);
// //       const serviceLvlCounts = {};
// //       const categoryLvlCounts = {};

// //       console.log("HomeScreen: Fetching all counts...");

// //       for (const categoryKey in serviceNames) {
// //         let currentCategoryTotal = 0;

// //         if (categoryKey.toLowerCase() === 'explore others') continue;

// //         if (Array.isArray(serviceNames[categoryKey])) {
// //             for (const service of serviceNames[categoryKey]) {
// //                 if (service.value) {
// //                     let count;
// //                     // *** CRUCIAL LOGIC FOR "OTHERS" COUNT ***
// //                     if (service.value === 'Explore others') {
// //                        console.log(`Fetching count for 'Explore others' under category: ${categoryKey}`);
// //     count = await fetchProfessionalCount(service.value, categoryKey);
// //     console.log(`Fetched count: ${count} for key: ${service.value}_${categoryKey}`);
// //                     } else {
// //                         count = await fetchProfessionalCount(service.value);
// //                     }
// //                     // *** CRUCIAL LOGIC FOR STORING COUNT WITH UNIQUE KEY ***
// //                     serviceLvlCounts[`${service.value}_${categoryKey}`] = count;
// //                     currentCategoryTotal += count;
// //                 }
// //             }
// //         }
// //         categoryLvlCounts[categoryKey] = currentCategoryTotal;
// //       }
// //       setProfessionalCounts(serviceLvlCounts);
// //       setCategoryCounts(categoryLvlCounts);
// //       setLoadingCounts(false);
// //       console.log("HomeScreen: Counts fetched:", { serviceLvlCounts, categoryLvlCounts });
// //     };

// //     fetchAllData();

// //     const unsubscribe = navigation.addListener('focus', () => {
// //       console.log('HomeScreen focused, re-fetching counts...');
// //       fetchAllData();
// //     });

// //     return unsubscribe;
// //   }, [navigation, fetchProfessionalCount, serviceNames]);

// //   const renderCategoryItem = ({ item: category }) => {
// //     if (category.toLowerCase() === 'explore others') {
// //         return null;
// //     }

// //     const categoryTotal = categoryCounts[category] !== undefined ? categoryCounts[category] : 0;
// //     const categoryServices = serviceNames[category] || [];
// //     const isExpanded = expandedCategory === category;
// //     const categoryIconName = categoryIcons[category] || 'category';

// //       return (
// //         <View style={styles.categorySection}>
// //           <TouchableOpacity
// //             style={styles.categoryHeader}
// //             onPress={() => toggleCategory(category)}
// //             activeOpacity={0.7}>
// //             <View style={styles.categoryIconContainer}>
// //               <Icon
// //                 name={categoryIconName}
// //                 size={24}
// //                 color="white"
// //               />
// //             </View>
// //             <View style={styles.categoryTextAndCountContainer}>
// //               <AppText style={styles.categoryTitle} semiBold>{category}</AppText>
// //             </View>
// //             {/* New container for count and chevron icon */}
// //             <View style={styles.countAndChevronContainer}>
// //               <AppText style={styles.categoryCountText}>
// //                 {/* ({loadingCounts ? '...' : categoryTotal}) */}
// //               </AppText>
// //               <Icon
// //                 name={
// //                   isExpanded
// //                     ? 'keyboard-arrow-up'
// //                     : 'keyboard-arrow-down'
// //                 }
// //                 size={24}
// //                 color={styles.categoryIconContainer.backgroundColor} // Use primary color
// //                 style={styles.chevronIconStyle} // Added style for potential margin
// //               />
// //             </View>
// //           </TouchableOpacity>

// //           {isExpanded && Array.isArray(categoryServices) && (
// //             <FlatList
// //               data={categoryServices}
// //               renderItem={({ item: serviceItem }) => {
// //                 // *** CRUCIAL LOGIC FOR DISPLAYING "OTHERS" COUNT ***
// //                 const countKey = `${serviceItem.value}_${category}`;
// //                 const count = professionalCounts[countKey] !== undefined ? professionalCounts[countKey] : 0;
// //                 return (
// //                   <TouchableOpacity
// //                     style={styles.serviceItem}
// //                     // *** CRUCIAL LOGIC FOR NAVIGATING "OTHERS" ***
// //                     onPress={() => handleServicePress(serviceItem, category)}
// //                   >
// //                     <AppText style={styles.serviceText}>{serviceItem.label}</AppText>
// //                     <View style={styles.serviceRightContainer}>
// //                       <AppText style={styles.serviceCount}>({loadingCounts ? '...' : count})</AppText>
// //                       <Icon
// //                           name="arrow-forward-ios"
// //                           size={16}
// //                           color={styles.categoryIconContainer.backgroundColor}
// //                       />
// //                     </View>
// //                   </TouchableOpacity>
// //                 );
// //               }}
// //               keyExtractor={serviceItem => `${serviceItem.value}_${category}`}
// //               style={styles.servicesList}
// //               scrollEnabled={false}
// //             />
// //           )}
// //         </View>
// //       );
// //   };

// //   return (
// //     <SafeAreaView style={styles.safeArea}>
// //       <StatusBar
// //         backgroundColor={styles.header.backgroundColor}
// //         barStyle="light-content"
// //       />

// //       <View style={styles.header}>
// //         <TouchableOpacity onPress={() => setMenuVisible(true)}>
// //           <Icon name="menu" size={28} color="white" />
// //         </TouchableOpacity>
// //         <AppText style={styles.headerTitle} bold>Job Services</AppText>
// //         <View style={{ width: 28 }} />
// //       </View>

// //       <View style={styles.searchContainer}>
// //         <Icon name="search" size={24} style={styles.searchIcon} />
// //         <TextInput
// //           style={styles.searchInput}
// //           placeholder="Search for services..."
// //           value={searchText}
// //           onChangeText={setSearchText}
// //           placeholderTextColor={styles.searchIcon.color}
// //           clearButtonMode="while-editing"
// //         />
// //         {searchText ? (
// //           <TouchableOpacity
// //             onPress={handleClearSearch}
// //             style={styles.clearIcon}>
// //             <Icon name="clear" size={24} style={styles.searchIcon} />
// //           </TouchableOpacity>
// //         ) : null}
// //       </View>
// //             {/* Show full page loader only if professionalCounts is empty, indicating very first load phase */}
// //       {/* {loadingCounts && Object.keys(professionalCounts).length === 0 && Object.keys(categoryCounts).length === 0 ? (
// //         <View style={styles.fullPageLoaderContainer}>
// //             <ActivityIndicator size="large" color={styles.categoryIconContainer.backgroundColor || '#2E5BFF'} />
// //             {/* <AppText style={styles.fullPageLoaderText}>Loading Categories...</AppText> */}
// //             {/* <AppText style={styles.fullPageLoaderText}>Loading Categories...</AppText> */}
// //         {/* </View>  */}
        
// //       {/* /* {loadingCounts && Object.keys(professionalCounts).length === 0 && Object.keys(categoryCounts).length === 0 ? ( */}

// //        {/* {loadingCounts && filteredCategories.length === Object.keys(serviceNames).length ? ( */}

// //       {/* Show FlatList if categories are available, otherwise show loader or no results */}
// //       {isSearchingProfessionals ? (
// //         <View style={styles.fullPageLoaderContainer}>
// //           <ActivityIndicator size="large" color={styles.categoryIconContainer.backgroundColor || '#2E5BFF'} />
// //           <AppText style={styles.fullPageLoaderText}>Searching...</AppText>
// //         </View>
// //       ) : searchMode === 'professionals' && searchResults.length > 0 ? (
// //         <FlatList
// //           data={searchResults} // These are professional objects
// //           renderItem={({ item }) => (
// //             <ProfessionalCard
// //               professional={item}
// //               onPress={() => handleProfessionalPress(item)}
// //             />
// //           )}
// //           keyExtractor={item => item.id}
// //           style={styles.categoriesList} // Can reuse or create new style e.g., styles.professionalsList
// //           contentContainerStyle={styles.professionalsContainer} // Create this style
// //           showsVerticalScrollIndicator={false}
// //         />
// //       ) : searchMode === 'professionals' && searchResults.length === 0 && searchText ? (
// //          <View style={styles.noResultsContainer}>
// //           <Icon name="search-off" size={64} color={styles.categoryIconContainer.backgroundColor || '#2E5BFF'} />
// //           <AppText style={styles.noResultsText} semiBold>No professionals found</AppText>
// //           <AppText style={styles.noResultsSubtext}>Try a different search term or browse categories.</AppText>
// //         </View>
// //       ) : searchMode === 'categories' && searchResults.length > 0 ? ( // Original category display
// //         <FlatList
// //           data={searchResults.filter(cat => cat.toLowerCase() !== 'explore others')} // searchResults are category keys
// //           renderItem={renderCategoryItem}
// //           keyExtractor={item => item}
// //           style={styles.categoriesList}
// //           contentContainerStyle={styles.categoriesContainer}
// //           showsVerticalScrollIndicator={false}
// //         />
// //       ) : searchMode === 'categories' && searchResults.length === 0 && searchText ? ( // No categories found by search
// //         <View style={styles.noResultsContainer}>
// //           <Icon
// //             name="search-off"
// //             size={64}
// //             color={styles.categoryIconContainer.backgroundColor || '#2E5BFF'}
// //           />
// //           <AppText style={styles.noResultsText} semiBold>No categories or services found</AppText>
// //           <AppText style={styles.noResultsSubtext}>
// //             Try a different search term
// //           </AppText>
// //         </View>
// //       )};

// //       <SideMenu
// //         isVisible={menuVisible}
// //         onClose={() => setMenuVisible(false)}
// //         navigation={navigation}
// //         setIsLoggedIn={setIsLoggedIn}
// //       />
// //     </SafeAreaView>
// //   );
// // };
// // export default HomeScreen;

// // import React, { useState, useEffect, useCallback } from 'react';
// // import {
// //   StyleSheet,
// //   Text,
// //   View,
// //   TouchableOpacity,
// //   TextInput,
// //   SafeAreaView,
// //   ActivityIndicator,
// //   StatusBar,
// //   FlatList,
// // } from 'react-native';
// // import Icon from 'react-native-vector-icons/MaterialIcons';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import Toast from 'react-native-toast-message';
// // import SideMenu from '../components/SideMenu';
// // import { styles, categoryIcons } from '../styles/HomeStyles';
// // import { serviceNames } from '../data/staticData';
// // import { getProfessionalsByService } from '../services/api';
// // import AppText from '../components/AppText'; // Import your custom AppText

// // const HomeScreen = ({ navigation }) => {
// //   const [menuVisible, setMenuVisible] = useState(false);
// //   const [professionalCounts, setProfessionalCounts] = useState({});
// //   const [categoryCounts, setCategoryCounts] = useState({});
// //   const [loadingCounts, setLoadingCounts] = useState(true);
// //   const [searchText, setSearchText] = useState('');
// //   const [expandedCategory, setExpandedCategory] = useState(null);
// //   const [isLoggedIn, setIsLoggedIn] = useState(true);
// //   const [filteredCategories, setFilteredCategories] = useState(
// //     Object.keys(serviceNames),
// //   );

// //   useEffect(() => {
// //     const checkToken = async () => {
// //       try {
// //         const token = await AsyncStorage.getItem('userToken');
// //         if (!token) {
// //           navigation.navigate('Login');
// //         } else {
// //           Toast.show({
// //             type: 'success',
// //             text1: 'Welcome to Job Services',
// //             text2: 'Explore our categories!',
// //             visibilityTime: 2500,
// //             position: 'top',
// //             topOffset: 70,
// //           });
// //         }
// //       } catch (error) {
// //         console.error('Failed to get token', error);
// //       }
// //     };

// //     checkToken();
// //   }, [navigation]);

// //   useEffect(() => {
// //     if (searchText) {
// //       const lowercasedSearch = searchText.toLowerCase();
// //       const categoryMatches = Object.keys(serviceNames).filter(category =>
// //         category.toLowerCase().includes(lowercasedSearch),
// //       );
// //       const serviceMatches = Object.keys(serviceNames).filter(category => {
// //         return Array.isArray(serviceNames[category]) && serviceNames[category].some(service =>
// //           service.label.toLowerCase().includes(lowercasedSearch),
// //         );
// //       });
// //       const combinedMatches = [
// //         ...new Set([...categoryMatches, ...serviceMatches]),
// //       ];
// //       setFilteredCategories(combinedMatches);
// //     } else {
// //       setFilteredCategories(Object.keys(serviceNames));
// //     }
// //   }, [searchText, serviceNames]);

// //   const toggleCategory = (category) => {
// //     const newExpanded = expandedCategory === category ? null : category;
// //     setExpandedCategory(newExpanded);
// //   };

// //   const handleServicePress = (service, parentCategory) => {
// //     navigation.navigate('ServiceDetail', {
// //       service: service.value,
// //       category: parentCategory,
// //     });
// //   };

// //   const handleClearSearch = () => {
// //     setSearchText('');
// //   };

// //   const fetchProfessionalCount = useCallback(async (serviceValue, categoryValue = null) => {
// //     if (!serviceValue) return 0;
// //     try {
// //       const response = await getProfessionalsByService(serviceValue, categoryValue);
// //       return response.data.length;
// //     } catch (error) {
// //       console.error(`Error fetching count for ${serviceValue} (Category: ${categoryValue}):`, error.message);
// //       return 0;
// //     }
// //   }, []);

// //   useEffect(() => {
// //     const fetchAllData = async () => {
// //       setLoadingCounts(true);
// //       const serviceLvlCounts = {};
// //       const categoryLvlCounts = {};

// //       console.log("HomeScreen: Fetching all counts...");

// //       for (const categoryKey in serviceNames) {
// //         let currentCategoryTotal = 0;

// //         if (categoryKey.toLowerCase() === 'explore others') continue;

// //         if (Array.isArray(serviceNames[categoryKey])) {
// //             for (const service of serviceNames[categoryKey]) {
// //                 if (service.value) {
// //                     let count;
// //                     // *** CRUCIAL LOGIC FOR "OTHERS" COUNT ***
// //                     if (service.value === 'Explore others') {
// //                        console.log(`Fetching count for 'Explore others' under category: ${categoryKey}`);
// //     count = await fetchProfessionalCount(service.value, categoryKey);
// //     console.log(`Fetched count: ${count} for key: ${service.value}_${categoryKey}`);
// //                     } else {
// //                         count = await fetchProfessionalCount(service.value);
// //                     }
// //                     // *** CRUCIAL LOGIC FOR STORING COUNT WITH UNIQUE KEY ***
// //                     serviceLvlCounts[`${service.value}_${categoryKey}`] = count;
// //                     currentCategoryTotal += count;
// //                 }
// //             }
// //         }
// //         categoryLvlCounts[categoryKey] = currentCategoryTotal;
// //       }
// //       setProfessionalCounts(serviceLvlCounts);
// //       setCategoryCounts(categoryLvlCounts);
// //       setLoadingCounts(false);
// //       console.log("HomeScreen: Counts fetched:", { serviceLvlCounts, categoryLvlCounts });
// //     };

// //     fetchAllData();

// //     const unsubscribe = navigation.addListener('focus', () => {
// //       console.log('HomeScreen focused, re-fetching counts...');
// //       fetchAllData();
// //     });

// //     return unsubscribe;
// //   }, [navigation, fetchProfessionalCount, serviceNames]);

// //   const renderCategoryItem = ({ item: category }) => {
// //     if (category.toLowerCase() === 'explore others') {
// //         return null;
// //     }

// //     const categoryTotal = categoryCounts[category] !== undefined ? categoryCounts[category] : 0;
// //     const categoryServices = serviceNames[category] || [];
// //     const isExpanded = expandedCategory === category;
// //     const categoryIconName = categoryIcons[category] || 'category';

// //       return (
// //         <View style={styles.categorySection}>
// //           <TouchableOpacity
// //             style={styles.categoryHeader}
// //             onPress={() => toggleCategory(category)}
// //             activeOpacity={0.7}>
// //             <View style={styles.categoryIconContainer}>
// //               <Icon
// //                 name={categoryIconName}
// //                 size={24}
// //                 color="white"
// //               />
// //             </View>
// //             <View style={styles.categoryTextAndCountContainer}>
// //               <AppText style={styles.categoryTitle} semiBold>{category}</AppText>
// //             </View>
// //             {/* New container for count and chevron icon */}
// //             <View style={styles.countAndChevronContainer}>
// //               <AppText style={styles.categoryCountText}>
// //                 ({loadingCounts ? '...' : categoryTotal})
// //               </AppText>
// //               <Icon
// //                 name={
// //                   isExpanded
// //                     ? 'keyboard-arrow-up'
// //                     : 'keyboard-arrow-down'
// //                 }
// //                 size={24}
// //                 color={styles.categoryIconContainer.backgroundColor} // Use primary color
// //                 style={styles.chevronIconStyle} // Added style for potential margin
// //               />
// //             </View>
// //           </TouchableOpacity>

// //           {isExpanded && Array.isArray(categoryServices) && (
// //             <FlatList
// //               data={categoryServices}
// //               renderItem={({ item: serviceItem }) => {
// //                 // *** CRUCIAL LOGIC FOR DISPLAYING "OTHERS" COUNT ***
// //                 const countKey = `${serviceItem.value}_${category}`;
// //                 const count = professionalCounts[countKey] !== undefined ? professionalCounts[countKey] : 0;
// //                 return (
// //                   <TouchableOpacity
// //                     style={styles.serviceItem}
// //                     // *** CRUCIAL LOGIC FOR NAVIGATING "OTHERS" ***
// //                     onPress={() => handleServicePress(serviceItem, category)}
// //                   >
// //                     <AppText style={styles.serviceText}>{serviceItem.label}</AppText>
// //                     <View style={styles.serviceRightContainer}>
// //                       <AppText style={styles.serviceCount}>({loadingCounts ? '...' : count})</AppText>
// //                       <Icon
// //                           name="arrow-forward-ios"
// //                           size={16}
// //                           color={styles.categoryIconContainer.backgroundColor}
// //                       />
// //                     </View>
// //                   </TouchableOpacity>
// //                 );
// //               }}
// //               keyExtractor={serviceItem => `${serviceItem.value}_${category}`}
// //               style={styles.servicesList}
// //               scrollEnabled={false}
// //             />
// //           )}
// //         </View>
// //       );
// //   };

// //   return (
// //     <SafeAreaView style={styles.safeArea}>
// //       <StatusBar
// //         backgroundColor={styles.header.backgroundColor}
// //         barStyle="light-content"
// //       />

// //       <View style={styles.header}>
// //         <TouchableOpacity onPress={() => setMenuVisible(true)}>
// //           <Icon name="menu" size={28} color="white" />
// //         </TouchableOpacity>
// //         <AppText style={styles.headerTitle} bold>Job Services</AppText>
// //         <View style={{ width: 28 }} />
// //       </View>

// //       <View style={styles.searchContainer}>
// //         <Icon name="search" size={24} style={styles.searchIcon} />
// //         <TextInput
// //           style={styles.searchInput}
// //           placeholder="Search for services..."
// //           value={searchText}
// //           onChangeText={setSearchText}
// //           placeholderTextColor={styles.searchIcon.color}
// //           clearButtonMode="while-editing"
// //         />
// //         {searchText ? (
// //           <TouchableOpacity
// //             onPress={handleClearSearch}
// //             style={styles.clearIcon}>
// //             <Icon name="clear" size={24} style={styles.searchIcon} />
// //           </TouchableOpacity>
// //         ) : null}
// //       </View>
// //             {/* Show full page loader only if professionalCounts is empty, indicating very first load phase */}
// //       {/* {loadingCounts && Object.keys(professionalCounts).length === 0 && Object.keys(categoryCounts).length === 0 ? (
// //         <View style={styles.fullPageLoaderContainer}>
// //             <ActivityIndicator size="large" color={styles.categoryIconContainer.backgroundColor || '#2E5BFF'} />
// //             {/* <AppText style={styles.fullPageLoaderText}>Loading Categories...</AppText> */}
// //             {/* <AppText style={styles.fullPageLoaderText}>Loading Categories...</AppText> */}
// //         {/* </View>  */}
// //         //first the list and then load below line
// //       {/* /* {loadingCounts && Object.keys(professionalCounts).length === 0 && Object.keys(categoryCounts).length === 0 ? ( */}
// // //first load and the list line
// //        {/* {loadingCounts && filteredCategories.length === Object.keys(serviceNames).length ? ( */}

// //          {loadingCounts && Object.keys(professionalCounts).length === 0 && Object.keys(categoryCounts).length === 0 ? (
// //         <View style={styles.fullPageLoaderContainer}>
// //             <ActivityIndicator size="large" color={styles.categoryIconContainer.backgroundColor || '#2E5BFF'} />
// //             {/* <AppText style={styles.fullPageLoaderText}>Loading Categories...</AppText> */}
// //         </View> ) : filteredCategories.length > 0 ? (
// //         <FlatList
// //           data={filteredCategories.filter(cat => cat.toLowerCase() !== 'explore others')}
// //           renderItem={renderCategoryItem}
// //           keyExtractor={item => item}
// //           style={styles.categoriesList}
// //           contentContainerStyle={styles.categoriesContainer}
// //           showsVerticalScrollIndicator={false}
// //         />
// //       ) : (
// //         <View style={styles.noResultsContainer}>
// //           <Icon
// //             name="search-off"
// //             size={64}
// //             color={styles.categoryIconContainer.backgroundColor || '#2E5BFF'}
// //           />
// //           <AppText style={styles.noResultsText} semiBold>No services found</AppText>
// //           <AppText style={styles.noResultsSubtext}>
// //             Try a different search term
// //           </AppText>
// //         </View>
// //       )}

// //       <SideMenu
// //         isVisible={menuVisible}
// //         onClose={() => setMenuVisible(false)}
// //         navigation={navigation}
// //         setIsLoggedIn={setIsLoggedIn}
// //       />
// //     </SafeAreaView>
// //   );
// // };

// // export default HomeScreen;



// // import React, { useState, useEffect, useCallback } from 'react';
// // import {
// //   StyleSheet,
// //   Text,
// //   View,
// //   TouchableOpacity,
// //   TextInput,
// //   SafeAreaView,
// //   ActivityIndicator,
// //   StatusBar,
// //   FlatList,
// // } from 'react-native';
// // import Icon from 'react-native-vector-icons/MaterialIcons';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import Toast from 'react-native-toast-message';
// // import SideMenu from '../components/SideMenu';
// // import { styles, categoryIcons } from '../styles/HomeStyles';
// // import { serviceNames } from '../data/staticData';
// // import { getProfessionalsByService } from '../services/api';
// // import AppText from '../components/AppText'; // Import your custom AppText

// // const HomeScreen = ({ navigation }) => {
// //   const [menuVisible, setMenuVisible] = useState(false);
// //   const [professionalCounts, setProfessionalCounts] = useState({});
// //   const [categoryCounts, setCategoryCounts] = useState({});
// //   const [loadingCounts, setLoadingCounts] = useState(true);
// //   const [searchText, setSearchText] = useState('');
// //   const [expandedCategory, setExpandedCategory] = useState(null);
// //   const [isLoggedIn, setIsLoggedIn] = useState(true);
// //   const [filteredCategories, setFilteredCategories] = useState(
// //     Object.keys(serviceNames),
// //   );

// //   useEffect(() => {
// //     const checkToken = async () => {
// //       try {
// //         const token = await AsyncStorage.getItem('userToken');
// //         if (!token) {
// //           navigation.navigate('Login');
// //         } else {
// //           Toast.show({
// //             type: 'success',
// //             text1: 'Welcome to Job Services',
// //             text2: 'Explore our categories!',
// //             visibilityTime: 2500,
// //             position: 'top',
// //             topOffset: 70,
// //           });
// //         }
// //       } catch (error) {
// //         console.error('Failed to get token', error);
// //       }
// //     };

// //     checkToken();
// //   }, [navigation]);

// //   useEffect(() => {
// //     if (searchText) {
// //       const lowercasedSearch = searchText.toLowerCase();
// //       const categoryMatches = Object.keys(serviceNames).filter(category =>
// //         category.toLowerCase().includes(lowercasedSearch),
// //       );
// //       const serviceMatches = Object.keys(serviceNames).filter(category => {
// //         return Array.isArray(serviceNames[category]) && serviceNames[category].some(service =>
// //           service.label.toLowerCase().includes(lowercasedSearch),
// //         );
// //       });
// //       const combinedMatches = [
// //         ...new Set([...categoryMatches, ...serviceMatches]),
// //       ];
// //       setFilteredCategories(combinedMatches);
// //     } else {
// //       setFilteredCategories(Object.keys(serviceNames));
// //     }
// //   }, [searchText, serviceNames]);

// //   const toggleCategory = (category) => {
// //     const newExpanded = expandedCategory === category ? null : category;
// //     setExpandedCategory(newExpanded);
// //   };

// //   const handleServicePress = (service, parentCategory) => {
// //     navigation.navigate('ServiceDetail', {
// //       service: service.value,
// //       category: parentCategory,
// //     });
// //   };

// //   const handleClearSearch = () => {
// //     setSearchText('');
// //   };

// //   const fetchProfessionalCount = useCallback(async (serviceValue, categoryValue = null) => {
// //     if (!serviceValue) return 0;
// //     try {
// //       const response = await getProfessionalsByService(serviceValue, categoryValue);
// //       return response.data.length;
// //     } catch (error) {
// //       console.error(`Error fetching count for ${serviceValue} (Category: ${categoryValue}):`, error.message);
// //       return 0;
// //     }
// //   }, []);

// //   useEffect(() => {
// //     const fetchAllData = async () => {
// //       setLoadingCounts(true);
// //       const serviceLvlCounts = {};
// //       const categoryLvlCounts = {};

// //       console.log("HomeScreen: Fetching all counts...");

// //       for (const categoryKey in serviceNames) {
// //         let currentCategoryTotal = 0;

// //         if (categoryKey.toLowerCase() === 'explore others') continue;

// //         if (Array.isArray(serviceNames[categoryKey])) {
// //             for (const service of serviceNames[categoryKey]) {
// //                 if (service.value) {
// //                     let count;
// //                     // *** CRUCIAL LOGIC FOR "OTHERS" COUNT ***
// //                     if (service.value === 'Explore others') {
// //                        console.log(`Fetching count for 'Explore others' under category: ${categoryKey}`);
// //     count = await fetchProfessionalCount(service.value, categoryKey);
// //     console.log(`Fetched count: ${count} for key: ${service.value}_${categoryKey}`);
// //                     } else {
// //                         count = await fetchProfessionalCount(service.value);
// //                     }
// //                     // *** CRUCIAL LOGIC FOR STORING COUNT WITH UNIQUE KEY ***
// //                     serviceLvlCounts[`${service.value}_${categoryKey}`] = count;
// //                     currentCategoryTotal += count;
// //                 }
// //             }
// //         }
// //         categoryLvlCounts[categoryKey] = currentCategoryTotal;
// //       }
// //       setProfessionalCounts(serviceLvlCounts);
// //       setCategoryCounts(categoryLvlCounts);
// //       setLoadingCounts(false);
// //       console.log("HomeScreen: Counts fetched:", { serviceLvlCounts, categoryLvlCounts });
// //     };

// //     fetchAllData();

// //     const unsubscribe = navigation.addListener('focus', () => {
// //       console.log('HomeScreen focused, re-fetching counts...');
// //       fetchAllData();
// //     });

// //     return unsubscribe;
// //   }, [navigation, fetchProfessionalCount, serviceNames]);

// //   const renderCategoryItem = ({ item: category }) => {
// //     if (category.toLowerCase() === 'explore others') {
// //         return null;
// //     }

// //     const categoryTotal = categoryCounts[category] !== undefined ? categoryCounts[category] : 0;
// //     const categoryServices = serviceNames[category] || [];
// //     const isExpanded = expandedCategory === category;
// //     const categoryIconName = categoryIcons[category] || 'category';

// //       return (
// //         <View style={styles.categorySection}>
// //           <TouchableOpacity
// //             style={styles.categoryHeader}
// //             onPress={() => toggleCategory(category)}
// //             activeOpacity={0.7}>
// //             <View style={styles.categoryIconContainer}>
// //               <Icon
// //                 name={categoryIconName}
// //                 size={24}
// //                 color="white"
// //               />
// //             </View>
// //             <View style={styles.categoryTextAndCountContainer}>
// //               <Text style={styles.categoryTitle}>{category}</Text>
// //               <Text style={styles.categoryCountText}>
// //                 ({loadingCounts ? '...' : categoryTotal})
// //               </Text>
// //             </View>
// //             <Icon
// //               name={
// //                 isExpanded
// //                   ? 'keyboard-arrow-up'
// //                   : 'keyboard-arrow-down'
// //               }
// //               size={24}
// //               color={styles.categoryIconContainer.backgroundColor}
// //             />
// //           </TouchableOpacity>

// //           {isExpanded && Array.isArray(categoryServices) && (
// //             <FlatList
// //               data={categoryServices}
// //               renderItem={({ item: serviceItem }) => {
// //                 // *** CRUCIAL LOGIC FOR DISPLAYING "OTHERS" COUNT ***
// //                 const countKey = `${serviceItem.value}_${category}`;
// //                 const count = professionalCounts[countKey] !== undefined ? professionalCounts[countKey] : 0;
// //                 return (
// //                   <TouchableOpacity
// //                     style={styles.serviceItem}
// //                     // *** CRUCIAL LOGIC FOR NAVIGATING "OTHERS" ***
// //                     onPress={() => handleServicePress(serviceItem, category)}
// //                   >
// //                     <Text style={styles.serviceText}>{serviceItem.label}</Text>
// //                     <View style={styles.serviceRightContainer}>
// //                       <Text style={styles.serviceCount}>({loadingCounts && count === 0 ? '...' : count})</Text>
// //                       <Icon
// //                           name="arrow-forward-ios"
// //                           size={16}
// //                           color={styles.categoryIconContainer.backgroundColor}
// //                       />
// //                     </View>
// //                   </TouchableOpacity>
// //                 );
// //               }}
// //               keyExtractor={serviceItem => `${serviceItem.value}_${category}`}
// //               style={styles.servicesList}
// //               scrollEnabled={false}
// //             />
// //           )}
// //         </View>
// //       );
// //   };

// //   return (
// //     <SafeAreaView style={styles.safeArea}>
// //       <StatusBar
// //         backgroundColor={styles.header.backgroundColor}
// //         barStyle="light-content"
// //       />

// //       <View style={styles.header}>
// //         <TouchableOpacity onPress={() => setMenuVisible(true)}>
// //           <Icon name="menu" size={28} color="white" />
// //         </TouchableOpacity>
// //         <AppText style={styles.headerTitle}>Job Services</AppText>
// //         <View style={{ width: 28 }} />
// //       </View>

// //       <View style={styles.searchContainer}>
// //         <Icon name="search" size={24} style={styles.searchIcon} />
// //         <TextInput
// //           style={styles.searchInput}
// //           placeholder="Search for services..."
// //           value={searchText}
// //           onChangeText={setSearchText}
// //           placeholderTextColor={styles.searchIcon.color}
// //           clearButtonMode="while-editing"
// //         />
// //         {searchText ? (
// //           <TouchableOpacity
// //             onPress={handleClearSearch}
// //             style={styles.clearIcon}>
// //             <Icon name="clear" size={24} style={styles.searchIcon} />
// //           </TouchableOpacity>
// //         ) : null}
// //       </View>
// //             {/* Show full page loader only if professionalCounts is empty, indicating very first load phase */}
// //       {/* {loadingCounts && Object.keys(professionalCounts).length === 0 && Object.keys(categoryCounts).length === 0 ? (
// //         <View style={styles.fullPageLoaderContainer}>
// //             <ActivityIndicator size="large" color={styles.categoryIconContainer.backgroundColor || '#2E5BFF'} />
// //             {/* <Text style={styles.fullPageLoaderText}>Loading Categories...</Text> */}
// //             {/* <Text style={styles.fullPageLoaderText}>Loading Categories...</Text> */}
// //         {/* </View>  */}
// //         //first the list and then load below line
// //       {/* /* {loadingCounts && Object.keys(professionalCounts).length === 0 && Object.keys(categoryCounts).length === 0 ? ( */}
// // //first load and the list line
// //        {/* {loadingCounts && filteredCategories.length === Object.keys(serviceNames).length ? ( */}

// //          {loadingCounts && Object.keys(professionalCounts).length === 0 && Object.keys(categoryCounts).length === 0 ? (
// //         <View style={styles.fullPageLoaderContainer}>
// //             <ActivityIndicator size="large" color={styles.categoryIconContainer.backgroundColor || '#2E5BFF'} />
// //             {/* <Text style={styles.fullPageLoaderText}>Loading Categories...</Text> */}
// //         </View> ) : filteredCategories.length > 0 ? (
// //         <FlatList
// //           data={filteredCategories.filter(cat => cat.toLowerCase() !== 'explore others')}
// //           renderItem={renderCategoryItem}
// //           keyExtractor={item => item}
// //           style={styles.categoriesList}
// //           contentContainerStyle={styles.categoriesContainer}
// //           showsVerticalScrollIndicator={false}
// //         />
// //       ) : (
// //         <View style={styles.noResultsContainer}>
// //           <Icon
// //             name="search-off"
// //             size={64}
// //             color={styles.categoryIconContainer.backgroundColor || '#2E5BFF'}
// //           />
// //           <Text style={styles.noResultsText}>No services found</Text>
// //           <Text style={styles.noResultsSubtext}>
// //             Try a different search term
// //           </Text>
// //         </View>
// //       )}

// //       <SideMenu
// //         isVisible={menuVisible}
// //         onClose={() => setMenuVisible(false)}
// //         navigation={navigation}
// //         setIsLoggedIn={setIsLoggedIn}
// //       />
// //     </SafeAreaView>
// //   );
// // };

// // export default HomeScreen;




// // import React, { useState, useEffect, useCallback } from 'react';
// // import {
// //   StyleSheet,
// //   Text,
// //   View,
// //   TouchableOpacity,
// //   TextInput,
// //   SafeAreaView,
// //   StatusBar,
// //   FlatList,
// // } from 'react-native';
// // import Icon from 'react-native-vector-icons/MaterialIcons';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import Toast from 'react-native-toast-message'; // Keep import for welcome toast
// // import SideMenu from '../components/SideMenu';
// // import { styles, categoryIcons } from '../styles/HomeStyles';
// // import { serviceNames } from '../data/staticData'; // Import serviceNames
// // import { getProfessionalsByService } from '../services/api';


// // const HomeScreen = ({ navigation }) => {
// //   const [menuVisible, setMenuVisible] = useState(false);
// //   const [professionalCounts, setProfessionalCounts] = useState({}); // Counts for individual services
// //   const [categoryCounts, setCategoryCounts] = useState({});     // Counts for total in each category
// //   const [loadingCounts, setLoadingCounts] = useState(true);     // Loading state for counts
// //   const [searchText, setSearchText] = useState('');
// //   const [expandedCategory, setExpandedCategory] = useState(null);
// //   const [isLoggedIn, setIsLoggedIn] = useState(true); // Assuming default to true, adjust as needed
// //   const [filteredCategories, setFilteredCategories] = useState(
// //     Object.keys(serviceNames),
// //   );

// //   useEffect(() => {
// //     const checkToken = async () => {
// //       try {
// //         const token = await AsyncStorage.getItem('userToken');
// //         if (!token) {
// //           navigation.navigate('Login');
// //         } else {
// //           Toast.show({
// //             type: 'success',
// //             text1: 'Welcome to Job Services',
// //             text2: 'Explore our categories!',
// //             visibilityTime: 2500,
// //             position: 'top',
// //             topOffset: 70,
// //           });
// //         }
// //       } catch (error) {
// //         console.error('Failed to get token', error);
// //       }
// //     };

// //     checkToken();
// //   }, [navigation]);

// //   useEffect(() => {
// //     if (searchText) {
// //       const lowercasedSearch = searchText.toLowerCase();
// //       const categoryMatches = Object.keys(serviceNames).filter(category =>
// //         category.toLowerCase().includes(lowercasedSearch),
// //       );
// //       const serviceMatches = Object.keys(serviceNames).filter(category => {
// //         // Ensure serviceNames[category] is an array before calling .some()
// //         return Array.isArray(serviceNames[category]) && serviceNames[category].some(service =>
// //           service.label.toLowerCase().includes(lowercasedSearch),
// //         );
// //       });
// //       const combinedMatches = [
// //         ...new Set([...categoryMatches, ...serviceMatches]),
// //       ];
// //       setFilteredCategories(combinedMatches);
// //     } else {
// //       setFilteredCategories(Object.keys(serviceNames));
// //     }
// //   }, [searchText]);

// //   const toggleCategory = (category) => {
// //     const newExpanded = expandedCategory === category ? null : category;
// //     setExpandedCategory(newExpanded);
// //   };

// //   const handleServicePress = (service) => {
// //     const categoryForService = Object.keys(serviceNames).find(category => // This will find the 'Others' key if service.value is 'Others'
// //       Array.isArray(serviceNames[category]) && serviceNames[category].some(s => s.value === service.value),
// //     );
// //     navigation.navigate('ServiceDetail', {
// //       service: service.value,
// //       category: categoryForService,
// //     }); // service.value will be 'Others' if that category/service is pressed
// //   };

// //   const handleClearSearch = () => {
// //     setSearchText('');
// //   };

// //   const fetchProfessionalCount = useCallback(async (serviceValue) => {
// //     if (!serviceValue || serviceValue === 'Others') return 0; // Don't fetch for the 'Others' placeholder/category value itself
// //     try {
// //       const response = await getProfessionalsByService(serviceValue);
// //       return response.data.length; 
// //     } catch (error) {
// //       console.error(`Error fetching count for ${serviceValue}:`, error.message);
// //       return 0; 
// //     }
// //   }, []);

// //   useEffect(() => {
// //     const fetchAllData = async () => {
// //       setLoadingCounts(true);
// //       const serviceLvlCounts = {};
// //       const categoryLvlCounts = {};

// //       console.log("HomeScreen: Fetching all counts...");

// //       for (const categoryKey in serviceNames) {
// //         let currentCategoryTotal = 0;

// //         if (categoryKey.toLowerCase() === 'others') { // Check for 'others' key
// //           categoryLvlCounts[categoryKey] = 0; 
// //           continue;
// //         }

// //         if (Array.isArray(serviceNames[categoryKey])) {
// //             for (const service of serviceNames[categoryKey]) {
// //                 if (service.value) { // Ensure service.value exists
// //                     const count = await fetchProfessionalCount(service.value);
// //                     serviceLvlCounts[service.value] = count;
// //                     currentCategoryTotal += count;
// //                 }
// //             }
// //         }
// //         categoryLvlCounts[categoryKey] = currentCategoryTotal;
// //       }
// //       setProfessionalCounts(serviceLvlCounts);
// //       setCategoryCounts(categoryLvlCounts);
// //       setLoadingCounts(false);
// //       console.log("HomeScreen: Counts fetched:", { serviceLvlCounts, categoryLvlCounts });
// //     };

// //     fetchAllData(); // Initial fetch

// //     const unsubscribe = navigation.addListener('focus', () => {
// //       console.log('HomeScreen focused, re-fetching counts...');
// //       fetchAllData(); // Re-fetch on focus
// //     });

// //     return unsubscribe; // Cleanup listener on unmount
// //   }, [navigation, fetchProfessionalCount]); // serviceNames is static, so removed from deps


// //   const renderServiceItem = ({ item }) => {
// //     const count = professionalCounts[item.value] !== undefined ? professionalCounts[item.value] : 0;
  
// //     return (
// //       <TouchableOpacity
// //         style={styles.serviceItem}
// //         onPress={() => handleServicePress(item)}>
// //         <Text style={styles.serviceText}>{item.label}</Text>
// //         <View style={styles.serviceRightContainer}>
// //             <Text style={styles.serviceCount}>({loadingCounts && count === 0 ? '...' : count})</Text>
// //             <Icon
// //                 name="arrow-forward-ios"
// //                 size={16}
// //                 color={styles.categoryIconContainer.backgroundColor} 
// //             />
// //         </View>
// //       </TouchableOpacity>
// //     );
// //   };

// //   const renderCategoryItem = ({ item: category }) => {
// //     const isOthersCategory = category.toLowerCase() === 'explore others';
// //     const categoryTotal = categoryCounts[category] !== undefined ? categoryCounts[category] : 0;

// //     if (isOthersCategory) {
// //       return (
// //         <View style={styles.categorySection}>
// //           <TouchableOpacity
// //             style={styles.categoryHeader}
// //             onPress={() => handleServicePress({ label: 'Explore others', value: 'Explore others' })} // Ensure value is 'Explore others'
// //             activeOpacity={0.7}>
// //             <View style={styles.categoryIconContainer}>
// //               <Icon
// //                 name={categoryIcons[category] || 'explore'}
// //                 size={24}
// //                 color="white"
// //               />
// //             </View>
// //             <Text style={styles.categoryTitle}>{category}</Text>
// //             {/* <Icon
// //               name="arrow-forward-ios"
// //               size={20}
// //               color={styles.categoryIconContainer.backgroundColor}
// //             /> */}
// //           </TouchableOpacity>
// //         </View>
// //       );
// //     } else {
// //       return (
// //         <View style={styles.categorySection}>
// //           <TouchableOpacity
// //             style={styles.categoryHeader}
// //             onPress={() => toggleCategory(category)}
// //             activeOpacity={0.7}>
// //             <View style={styles.categoryIconContainer}>
// //               <Icon
// //                 name={categoryIcons[category] || 'category'}
// //                 size={24}
// //                 color="white"
// //               />
// //             </View>
// //             <View style={styles.categoryTextAndCountContainer}>
// //               <Text style={styles.categoryTitle}>{category}</Text>
// //               <Text style={styles.categoryCountText}>
// //                 ({loadingCounts ? '...' : categoryTotal})
// //               </Text>
// //             </View>
// //             <Icon
// //               name={
// //                 expandedCategory === category
// //                   ? 'keyboard-arrow-up'
// //                   : 'keyboard-arrow-down'
// //               }
// //               size={24}
// //               color={styles.categoryIconContainer.backgroundColor}
// //             />
// //           </TouchableOpacity>

// //           {expandedCategory === category && Array.isArray(serviceNames[category]) && (
// //             <FlatList
// //               data={serviceNames[category]}
// //               renderItem={renderServiceItem}
// //               keyExtractor={item => item.value}
// //               style={styles.servicesList}
// //               scrollEnabled={false}
// //             />
// //           )}
// //         </View>
// //       );
// //     }
// //   };

// //   return (
// //     <SafeAreaView style={styles.safeArea}>
// //       <StatusBar
// //         backgroundColor={styles.header.backgroundColor}
// //         barStyle="light-content"
// //       />

// //       <View style={styles.header}>
// //         <TouchableOpacity onPress={() => setMenuVisible(true)}>
// //           <Icon name="menu" size={28} color="white" />
// //         </TouchableOpacity>
// //         <Text style={styles.headerTitle}>Job Services</Text>
// //       </View>

// //       <View style={styles.searchContainer}>
// //         <Icon name="search" size={24} style={styles.searchIcon} />
// //         <TextInput
// //           style={styles.searchInput}
// //           placeholder="Search for services..."
// //           value={searchText}
// //           onChangeText={setSearchText}
// //           placeholderTextColor={styles.searchIcon.color}
// //           clearButtonMode="while-editing"
// //         />
// //         {searchText ? (
// //           <TouchableOpacity
// //             onPress={handleClearSearch}
// //             style={styles.clearIcon}>
// //             <Icon name="clear" size={24} style={styles.searchIcon} />
// //           </TouchableOpacity>
// //         ) : null}
// //       </View>

// //       {filteredCategories.length > 0 ? (
// //         <FlatList
// //           data={filteredCategories}
// //           renderItem={renderCategoryItem}
// //           keyExtractor={item => item}
// //           style={styles.categoriesList}
// //           contentContainerStyle={styles.categoriesContainer}
// //           showsVerticalScrollIndicator={false}
// //         />
// //       ) : (
// //         <View style={styles.noResultsContainer}>
// //           <Icon
// //             name="search-off"
// //             size={64}
// //             color={styles.categoryIconContainer.backgroundColor}
// //           />
// //           <Text style={styles.noResultsText}>No services found</Text>
// //           <Text style={styles.noResultsSubtext}>
// //             Try a different search term
// //           </Text>
// //         </View>
// //       )}

// //       <SideMenu
// //         isVisible={menuVisible}
// //         onClose={() => setMenuVisible(false)}
// //         navigation={navigation}
// //         setIsLoggedIn={setIsLoggedIn} // You might need to pass the actual setIsLoggedIn function if used in SideMenu
// //       />
// //     </SafeAreaView>
// //   );
// // };

// // export default HomeScreen;



// // import React, { useState, useEffect } from 'react';
// // import {
// //   StyleSheet,
// //   Text,
// //   View,
// //   TouchableOpacity,
// //   TextInput,
// //   SafeAreaView, 
// //   StatusBar,
// //   FlatList,
// // } from 'react-native';
// // import Icon from 'react-native-vector-icons/MaterialIcons';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import Toast from 'react-native-toast-message'; // Keep import for welcome toast
// // import SideMenu from '../components/SideMenu';
// // import { styles, categoryIcons } from '../styles/HomeStyles';
// // import { serviceNames } from '../data/staticData'; // Import serviceNames

// // const HomeScreen = ({ navigation }) => {
// //   const [menuVisible, setMenuVisible] = useState(false);
// //   const [searchText, setSearchText] = useState('');
// //   const [expandedCategory, setExpandedCategory] = useState(null);
// //   const [isLoggedIn, setIsLoggedIn] = useState(true);
// //   const [filteredCategories, setFilteredCategories] = useState(
// //     Object.keys(serviceNames), // Include "others"
// //   );

// //   useEffect(() => {
// //     const checkToken = async () => {
// //       try {
// //         const token = await AsyncStorage.getItem('userToken');
// //         if (!token) {
// //           navigation.navigate('Login');
// //         } else {
// //           Toast.show({
// //             type: 'success',
// //             text1: 'Welcome to Job Services',
// //             text2: 'Explore our categories!',
// //             visibilityTime: 2500,
// //             position: 'top',
// //             topOffset: 70,
// //           });
// //         }
// //       } catch (error) {
// //         console.error('Failed to get token', error);
// //       }
// //     };

// //     checkToken();
// //   }, [navigation]);

// //   useEffect(() => {
// //     if (searchText) {
// //       const lowercasedSearch = searchText.toLowerCase();
// //       const categoryMatches = Object.keys(serviceNames).filter(category =>
// //         category.toLowerCase().includes(lowercasedSearch),
// //       );
// //       const serviceMatches = Object.keys(serviceNames).filter(category =>
// //         serviceNames[category].some(service =>
// //           service.label.toLowerCase().includes(lowercasedSearch),
// //         ),
// //       );
// //       const combinedMatches = [
// //         ...new Set([...categoryMatches, ...serviceMatches]),
// //       ];
// //       setFilteredCategories(combinedMatches);
// //     } else {
// //       setFilteredCategories(Object.keys(serviceNames));
// //     }
// //   }, [searchText]);

// //   const toggleCategory = (category) => {
// //     const newExpanded = expandedCategory === category ? null : category;
// //     setExpandedCategory(newExpanded);
// //   };

// //   const handleServicePress = (service) => {
// //     const categoryForService = Object.keys(serviceNames).find(category =>
// //       serviceNames[category].some(s => s.value === service.value),
// //     );
// //     navigation.navigate('ServiceDetail', {
// //       service: service.value,
// //       category: categoryForService,
// //     });
// //   };

// //   const handleClearSearch = () => {
// //     setSearchText('');
// //   };

// //   const renderServiceItem = ({ item }) => (
// //     <TouchableOpacity
// //       style={styles.serviceItem}
// //       onPress={() => handleServicePress(item)}>
// //       <Text style={styles.serviceText}>{item.label}</Text>
// //       <Icon
// //         name="arrow-forward-ios"
// //         size={16}
// //         color={styles.categoryIconContainer.backgroundColor}
// //       />
// //     </TouchableOpacity>
// //   );

// //   const renderCategoryItem = ({ item: category }) => (
// //     <View style={styles.categorySection}>
// //       <TouchableOpacity
// //         style={styles.categoryHeader}
// //         onPress={() => toggleCategory(category)}
// //         activeOpacity={0.7}>
// //         <View style={styles.categoryIconContainer}>
// //           <Icon
// //             name={categoryIcons[category] || 'category'} // Default for "others"
// //             size={24}
// //             color="white"
// //           />
// //         </View>
// //         <Text style={styles.categoryTitle}>{category}</Text>
// //         <Icon
// //           name={
// //             expandedCategory === category
// //               ? 'keyboard-arrow-up'
// //               : 'keyboard-arrow-down'
// //           }
// //           size={24}
// //           color={styles.categoryIconContainer.backgroundColor}
// //         />
// //       </TouchableOpacity>

// //       {expandedCategory === category && (
// //         <FlatList
// //           data={serviceNames[category]}
// //           renderItem={renderServiceItem}
// //           keyExtractor={item => item.value}
// //           style={styles.servicesList}
// //           scrollEnabled={false}
// //         />
// //       )}
// //     </View>
// //   );

// //   return (
// //     <SafeAreaView style={styles.safeArea}>
// //       <StatusBar
// //         backgroundColor={styles.header.backgroundColor}
// //         barStyle="light-content"
// //       />

// //       {/* Header */}
// //       <View style={styles.header}>
// //         <TouchableOpacity onPress={() => setMenuVisible(true)}>
// //           <Icon name="menu" size={28} color="white" />
// //         </TouchableOpacity>
// //         <Text style={styles.headerTitle}>Job Services</Text>
// //       </View>

// //       {/* Search Bar */}
// //       <View style={styles.searchContainer}>
// //         <Icon name="search" size={24} style={styles.searchIcon} />
// //         <TextInput
// //           style={styles.searchInput}
// //           placeholder="Search for services..."
// //           value={searchText}
// //           onChangeText={setSearchText}
// //           placeholderTextColor={styles.searchIcon.color}
// //           clearButtonMode="while-editing"
// //         />
// //         {searchText ? (
// //           <TouchableOpacity
// //             onPress={handleClearSearch}
// //             style={styles.clearIcon}>
// //             <Icon name="clear" size={24} style={styles.searchIcon} />
// //           </TouchableOpacity>
// //         ) : null}
// //       </View>

// //       {/* Main Content */}
// //       {filteredCategories.length > 0 ? (
// //         <FlatList
// //           data={filteredCategories}
// //           renderItem={renderCategoryItem}
// //           keyExtractor={item => item}
// //           style={styles.categoriesList}
// //           contentContainerStyle={styles.categoriesContainer}
// //           showsVerticalScrollIndicator={false}
// //         />
// //       ) : (
// //         <View style={styles.noResultsContainer}>
// //           <Icon
// //             name="search-off"
// //             size={64}
// //             color={styles.categoryIconContainer.backgroundColor}
// //           />
// //           <Text style={styles.noResultsText}>No services found</Text>
// //           <Text style={styles.noResultsSubtext}>
// //             Try a different search term
// //           </Text>
// //         </View>
// //       )}

// //       {/* Side Menu */}
// //       <SideMenu
// //         isVisible={menuVisible}
// //         onClose={() => setMenuVisible(false)}
// //         navigation={navigation}
// //         setIsLoggedIn={setIsLoggedIn}
// //       />
// //     </SafeAreaView>
// //   );
// // };
