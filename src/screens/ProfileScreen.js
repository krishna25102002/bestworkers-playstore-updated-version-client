// ProfileScreen.js
import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  StatusBar,
  RefreshControl,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUserProfile} from '../services/api';
import SideMenu from '../components/SideMenu';
import LinearGradient from 'react-native-linear-gradient';
import AppText from '../components/AppText'; // Import AppText
import {styles} from '../styles/ProfileStyles';

const PRIMARY_COLOR = '#1a4b8c'; // Royal blue from HomeStyles

const ProfileScreen = ({navigation}) => {
  const [userId, setUserId] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [scrollY] = useState(new Animated.Value(0));
  const [isProfession, setIsProfession] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Flag to prevent re-fetch during logout

  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return; // Prevent multiple logout calls if already in progress
    setIsLoggingOut(true); // Set flag immediately
    try {
      console.log('ProfileScreen: Attempting to logout user (handleLogout).');
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userID');
      await AsyncStorage.removeItem('isProfession');
      await AsyncStorage.removeItem('lastActiveTime');
      navigation.replace('Login');
    } catch (e) {
      console.error('Error logging out from ProfileScreen:', e);
      // If logout fails, we might be stuck. For now, keep isLoggingOut true
      // as we expect navigation.replace to unmount this screen.
      // If it doesn't unmount, this could be an issue.
    }
  }, [navigation, isLoggingOut]); // isLoggingOut is a dependency

  const fetchUserData = useCallback(async () => {
    if (isLoggingOut) {
      console.log('ProfileScreen: fetchUserData - Logout in progress, skipping.');
      return;
    }
    console.log('ProfileScreen: fetchUserData - Attempting to fetch, setting loading true.');
    setLoading(true); // Ensure loading is true at the start of an attempt
    setError(null); // Clear previous errors
    try {
      const storedUserId = await AsyncStorage.getItem('userID');
      if (storedUserId && !isLoggingOut) { // Check isLoggingOut before setting state
        setUserId(storedUserId);
      }
      const response = await getUserProfile();
      if (response.success) {
        console.log('ProfileScreen: fetchUserData - API call successful.');
        if (!isLoggingOut) setUserData(response.data); // Check flag before setting data
      } else {
        // This handles cases where api.js might return { success: false, error: '...', status: ... }
        const errorMessage = response.error || 'Failed to fetch user data';
        console.log('ProfileScreen: fetchUserData - API call not successful:', errorMessage, 'Status:', response.status);
        if (!isLoggingOut) setError(errorMessage);
        if (response.status === 401) {
          console.error('ProfileScreen: Unauthorized (API response indicated 401). Triggering logout.');
          handleLogout();
        }
      }
    } catch (err) {
      if (isLoggingOut) return; // Don't process error if already logging out
      console.error('ProfileScreen: fetchUserData - Error caught:', err.message, 'Response status:', err.response?.status);
      if (err.response && err.response.status === 401) {
        if (!isLoggingOut) setError('Your session has expired. Please log in again.');
        console.error('ProfileScreen: Unauthorized (HTTP 401 caught). Triggering logout.');
        handleLogout();
      } else {
        const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'An error occurred while fetching profile';
        if (!isLoggingOut) setError(`Failed to load profile: ${errorMessage}`);
      }
    } finally {
      if (!isLoggingOut) { // Only update loading state if not in the process of logging out
        console.log('ProfileScreen: fetchUserData - Finally block, setting loading false.');
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, [handleLogout, isLoggingOut]); // isLoggingOut is a dependency

  const checkProfessionStatus = useCallback(async () => {
    if (isLoggingOut) return;
    try {
      console.log('ProfileScreen: checkProfessionStatus - Checking.');
      const professionStatus = await AsyncStorage.getItem('isProfession');
      if (!isLoggingOut) setIsProfession(professionStatus === 'true');
    } catch (err) {
      console.error('ProfileScreen: checkProfessionStatus - Error:', err);
    }
  }, [isLoggingOut]);

  const initializeData = useCallback(async () => {
    if (isLoggingOut) {
      console.log('ProfileScreen: initializeData - Logout in progress, skipping.');
      return;
    }
    console.log('ProfileScreen: initializeData - Starting...');
    await checkProfessionStatus(); // This might set isProfession
    await fetchUserData();
  }, [checkProfessionStatus, fetchUserData, isLoggingOut]);

  useEffect(() => {
    // Initial data load
    if (!isLoggingOut) { // Prevent initial load if a logout was somehow triggered before mount
        initializeData();
    }
  }, [initializeData]); // isLoggingOut added

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('ProfileScreen focused. Current isLoggingOut:', isLoggingOut);
       // If not currently in a logout process initiated by this screen,
      // then it's okay to re-initialize data.
      if (!isLoggingOut) {
        initializeData();
      }
    });
    return unsubscribe;
  }, [navigation, initializeData, isLoggingOut]); // Corrected dependency array


  const onRefresh = useCallback(() => {
    if (isLoggingOut) return;
    console.log('ProfileScreen: Refreshing data...');
    setRefreshing(true);
    initializeData();
  }, [initializeData, isLoggingOut]);


  // Animated header effect
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [120, 80],
    extrapolate: 'clamp',
  });

  // If logging out, show a specific message
  if (isLoggingOut) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={[PRIMARY_COLOR, PRIMARY_COLOR]} // Updated
          style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <AppText style={styles.loadingText}>Logging out...</AppText>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // Render loading state (only if no user data yet and not refreshing)
  if (loading && !refreshing && !userData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={[PRIMARY_COLOR, PRIMARY_COLOR]} // Updated
          style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <AppText style={styles.loadingText}>Loading profile...</AppText>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // Render error state (only if no user data yet)
  if (error && !userData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.errorContainer}>
           <Icon name="alert-circle-outline" size={80} color="#FF3B30" />
          <AppText style={styles.errorTitle} bold>Oops!</AppText>
          <AppText style={styles.errorText}>{error}</AppText>
          <TouchableOpacity style={styles.retryButton} onPress={initializeData}>
            <AppText style={styles.retryButtonText} semiBold>Try Again</AppText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Render profile content
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <SideMenu
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        navigation={navigation}
        setIsLoggedIn={() => {}} // Might not be needed if navigation.replace handles state
        userData={userData}
      />

      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerOpacity,
            height: headerHeight,
          },
        ]}>
        <LinearGradient
          colors={[PRIMARY_COLOR, PRIMARY_COLOR]} // Updated
          style={styles.gradientHeader}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setIsMenuVisible(true)}>
            <Icon name="menu" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <AppText style={styles.headerTitle} bold>My Profile</AppText>
          <View style={styles.menuButton} /> 
        </LinearGradient>
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[PRIMARY_COLOR]} // Updated
            tintColor={PRIMARY_COLOR} // Updated
          />
        }
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}>
        
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {userData?.avatar ? (
              <Image
                source={{uri: userData.avatar}}
                style={styles.avatarImage}
              />
            ) : (
              <LinearGradient
                colors={[PRIMARY_COLOR, '#2980b9']} // Updated, using a slightly lighter shade for gradient if desired
                style={styles.avatarPlaceholder}>
                <AppText style={styles.avatarInitial} bold>
                  {userData?.name ? userData.name.charAt(0).toUpperCase() : '?'}
                </AppText>
              </LinearGradient>
            )}
          </View>

          <AppText style={styles.userName} bold>{userData?.name || 'Your Name'}</AppText>

          <View style={styles.userInfoContainer}>
            <View style={styles.infoItem}>
              <Icon name="mail-outline" size={18} color={PRIMARY_COLOR} /> 
              <AppText style={styles.infoText}>
                {userData?.email || 'your.email@example.com'}
              </AppText>
            </View>

            <View style={styles.infoItem}>
              <Icon name="call-outline" size={18} color={PRIMARY_COLOR} />
              <AppText style={styles.infoText}>
                {userData?.mobile || '+1 234 567 890'}
              </AppText>
            </View>

            {userData?.location && (
              <View style={styles.infoItem}>
                <Icon name="location-outline" size={18} color={PRIMARY_COLOR} />
                <AppText style={styles.infoText}>{userData.location}</AppText>
              </View>
            )}
          </View>
        </View>

        {!isProfession ? (
          <LinearGradient
            colors={['#F5F7FA', '#E4E7EB']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.professionBanner}>
            <View style={styles.professionIconContainer}>
              <MaterialIcons name="work-outline" size={28} color={PRIMARY_COLOR} />
            </View>
            <AppText style={styles.professionTitle} bold>
              Add Your Professional Profile
            </AppText>
            <AppText style={styles.professionText}>
              Showcase your skills and services to connect with potential clients.
              Create a professional profile to get discovered.
            </AppText>
            <TouchableOpacity
              style={styles.addProfessionButton}
              onPress={() => navigation.navigate('AddProfession')}>
              <LinearGradient
                colors={[PRIMARY_COLOR, '#2980b9']} // Updated
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.gradientButton}>
                <AppText style={styles.addButtonText} semiBold>
                  Create Professional Profile
                </AppText>
                <Icon name="arrow-forward" size={18} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        ) : (
          <LinearGradient
            colors={['#E3F2FD', '#BBDEFB']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.professionBanner}>
            <View style={styles.professionIconContainer}>
              <MaterialIcons name="verified" size={28} color="#4CAF50" />
            </View>
            <AppText style={styles.professionTitle} bold>
              Professional Profile Active
            </AppText>
            <AppText style={styles.professionText}>
              You're now visible to potential clients! Enjoy your free trial of
              BestWorkers and start getting job offers.
            </AppText>
          </LinearGradient>
        )}

        <View style={styles.actionsContainer}>
      {isProfession && (
          <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('AddProfession', { editMode: true, existingData: userData })}>
              <View
                style={[
                  styles.actionIconContainer,
                  {backgroundColor: '#E0F2F7'}, // A light blue/teal for edit
                ]}>
                <Icon name="create-outline" size={24} color="#00796B" />
              </View>
              <View style={styles.actionTextContainer}>
                <AppText style={[styles.actionTitle, {color: '#00796B'}]} semiBold>
                  Edit Profile
                </AppText>
                <AppText style={styles.actionSubtitle}>Update your professional details</AppText>
              </View>
              <Icon name="chevron-forward" size={22} color="#A0A0A0" />
            </TouchableOpacity>
        )}
          <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
            <View
              style={[
                styles.actionIconContainer,
                {backgroundColor: '#FFEBEE'},
              ]}>
              <Icon name="log-out-outline" size={24} color="#F44336" />
            </View>
            <View style={styles.actionTextContainer}>
              <AppText style={[styles.actionTitle, {color: '#F44336'}]} semiBold>
                Logout
              </AppText>
              <AppText style={styles.actionSubtitle}>
                Sign out from your account
              </AppText>
            </View>
            <Icon name="chevron-forward" size={22} color="#A0A0A0" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;


// // ProfileScreen.js
// import React, {useEffect, useState, useCallback} from 'react';
// import {
//   View,
//   Text,
//   SafeAreaView,
//   TouchableOpacity,
//   ActivityIndicator,
//   ScrollView,
//   Image,
//   StatusBar,
//   RefreshControl,
//   Animated,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {getUserProfile} from '../services/api';
// import SideMenu from '../components/SideMenu';
// import LinearGradient from 'react-native-linear-gradient';
// import {styles} from '../styles/ProfileStyles';

// const ProfileScreen = ({navigation}) => {
//   const [userId, setUserId] = useState('');
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isMenuVisible, setIsMenuVisible] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [scrollY] = useState(new Animated.Value(0));
//   const [isProfession, setIsProfession] = useState(false);

//   const fetchUserData = async () => {
//     try {
//       setLoading(true);
//       const storedUserId = await AsyncStorage.getItem('userID');
//       if (storedUserId) setUserId(storedUserId);

//       const response = await getUserProfile();

//       if (response.success) {
//         setUserData(response.data);
//       } else {
//         // This block might be hit if the API returns success: false but not a 401 error specifically
//         setError('Failed to fetch user data');
//       }
//     } catch (err) {
//       console.error('Error fetching user data:', err);
//       // This catch block is where network errors or non-success responses land
//       if (err.response && err.response.status === 401) {
//           // Handle 401 specifically - token is missing or invalid
//           setError('Unauthorized. Please log in again.');
//           // You might want to clear storage and navigate to login here
//           // AsyncStorage.clear();
//           // navigation.replace('Login');
//       } else {
//           // Handle other errors (network issues, 500 errors, etc.)
//           setError(err.message || 'An error occurred while fetching user data');
//       }
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const checkProfessionStatus = async () => {
//     try {
//       const professionStatus = await AsyncStorage.getItem('isProfession');
//       setIsProfession(professionStatus === 'true');
//     } catch (err) {
//       console.error('Error checking profession status:', err);
//     }
//   };

//   useEffect(() => {
//     const initializeData = async () => {
//       await checkProfessionStatus();
//       await fetchUserData();
//     };
    
//     initializeData();
//   }, []); // Empty dependency array means this runs once on mount

//   useEffect(() => {
//     // This effect runs when the screen comes into focus
//     const unsubscribe = navigation.addListener('focus', async () => {
//       // Re-check profession status and potentially refresh data
//       await checkProfessionStatus();
//       // You might want to call fetchUserData() here as well if data can change while screen is unfocused
//       // fetchUserData();
//     });

//     return unsubscribe; // Clean up the listener when the component unmounts
//   }, [navigation]); // Re-run if navigation object changes (unlikely)

//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     // Fetch data and check status again on pull-to-refresh
//     fetchUserData();
//     checkProfessionStatus();
//   }, []); // Dependencies are stable functions/states

//   const handleLogout = async () => {
//     try {
//       // Clear all relevant items from AsyncStorage
//       await AsyncStorage.removeItem('userToken');
//       await AsyncStorage.removeItem('userID');
//       await AsyncStorage.removeItem('isProfession');
//       await AsyncStorage.removeItem('lastActiveTime'); // Also clear last active time
//       // Replace the current screen with the Login screen
//       navigation.replace('Login');
//     } catch (error) {
//       console.error('Error logging out:', error);
//       // Optionally show a toast or alert if logout fails
//     }
//   };

//   // Animated header effect
//   const headerOpacity = scrollY.interpolate({
//     inputRange: [0, 100], // Scroll range over which animation happens
//     outputRange: [1, 0.9], // Corresponding opacity range
//     extrapolate: 'clamp', // Don't go outside the output range
//   });

//   const headerHeight = scrollY.interpolate({
//     inputRange: [0, 100], // Scroll range
//     outputRange: [120, 80], // Corresponding height range
//     extrapolate: 'clamp', // Don't go outside the output range
//   });

//   // Render loading state
//   if (loading && !refreshing) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <StatusBar barStyle="light-content" />
//         <LinearGradient
//           colors={['#4A90E2', '#5A6BFF']}
//           style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#FFFFFF" />
//           <Text style={styles.loadingText}>Loading profile...</Text>
//         </LinearGradient>
//       </SafeAreaView>
//     );
//   }

//   // Render error state
//   if (error) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <StatusBar barStyle="light-content" />
//         <View style={styles.errorContainer}>
//           {/* Assuming you have a local image or using an icon */}
//           {/* <Image
//             source={require('../assets/kk.png')} // Replace with your actual error image path
//             style={styles.errorImage}
//           /> */}
//            <Icon name="alert-circle-outline" size={80} color="#FF3B30" /> {/* Using an icon as a fallback/alternative */}
//           <Text style={styles.errorTitle}>Oops!</Text>
//           <Text style={styles.errorText}>{error}</Text>
//           <TouchableOpacity style={styles.retryButton} onPress={fetchUserData}>
//             <Text style={styles.retryButtonText}>Try Again</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // Render profile content
//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" />

//       {/* Side Menu Modal */}
//       <SideMenu
//         isVisible={isMenuVisible}
//         onClose={() => setIsMenuVisible(false)}
//         navigation={navigation}
//         setIsLoggedIn={() => {}} // This prop might not be needed if navigation.replace handles auth state
//         userData={userData} // Pass user data to SideMenu
//       />

//       {/* Animated Header */}
//       <Animated.View
//         style={[
//           styles.header,
//           {
//             opacity: headerOpacity,
//             height: headerHeight,
//           },
//         ]}>
//         <LinearGradient
//           colors={['#4A90E2', '#5A6BFF']}
//           style={styles.gradientHeader}>
//           <TouchableOpacity
//             style={styles.menuButton}
//             onPress={() => setIsMenuVisible(true)}>
//             <Icon name="menu" size={28} color="#FFFFFF" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>My Profile</Text>
//           {/* Placeholder to balance the menu button */}
//           <View style={styles.menuButton} /> 
//         </LinearGradient>
//       </Animated.View>

//       {/* Scrollable Content */}
//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={['#4A90E2']} // Android refresh indicator color
//             tintColor="#4A90E2" // iOS refresh indicator color
//           />
//         }
//         // Event listener for scroll position
//         scrollEventThrottle={16} // How often to fire scroll events (lower is more frequent)
//         onScroll={Animated.event(
//           [{nativeEvent: {contentOffset: {y: scrollY}}}],
//           {useNativeDriver: false}, // Set to true if possible for performance
//         )}>
        
//         {/* Profile Details Section */}
//         <View style={styles.profileSection}>
//           <View style={styles.avatarContainer}>
//             {userData?.avatar ? (
//               <Image
//                 source={{uri: userData.avatar}}
//                 style={styles.avatarImage}
//               />
//             ) : (
//               <LinearGradient
//                 colors={['#5A6BFF', '#4A90E2']}
//                 style={styles.avatarPlaceholder}>
//                 <Text style={styles.avatarInitial}>
//                   {userData?.name ? userData.name.charAt(0).toUpperCase() : '?'}
//                 </Text>
//               </LinearGradient>
//             )}
//           </View>

//           <Text style={styles.userName}>{userData?.name || 'Your Name'}</Text>

//           <View style={styles.userInfoContainer}>
//             <View style={styles.infoItem}>
//               <Icon name="mail-outline" size={18} color="#4A90E2" />
//               <Text style={styles.infoText}>
//                 {userData?.email || 'your.email@example.com'}
//               </Text>
//             </View>

//             <View style={styles.infoItem}>
//               <Icon name="call-outline" size={18} color="#4A90E2" />
//               <Text style={styles.infoText}>
//                 {userData?.mobile || '+1 234 567 890'}
//               </Text>
//             </View>

//             {/* Conditionally render location if available */}
//             {userData?.location && (
//               <View style={styles.infoItem}>
//                 <Icon name="location-outline" size={18} color="#4A90E2" />
//                 <Text style={styles.infoText}>{userData.location}</Text>
//               </View>
//             )}
//           </View>

//           {/* Edit Profile Button (commented out) */}
//           {/* <TouchableOpacity
//             style={styles.editProfileButton}
//             onPress={() => navigation.navigate('EditProfile')}>
//             <Text style={styles.editProfileText}>Edit Profile</Text>
//           </TouchableOpacity> */}
//         </View>

//         {/* Stats Container (commented out) */}
// {/* 
//         <View style={styles.statsContainer}>
//           <View style={styles.statDivider} />

//           <View style={styles.statItem}>
//             <Text style={styles.statNumber}>{userData?.reviews || 0}</Text>
//             <Text style={styles.statLabel}>Reviews</Text>
//           </View>

//           <View style={styles.statDivider} />

//           <View style={styles.statItem}>
//             <Text style={styles.statNumber}>{userData?.rating || '0.0'}</Text>
//             <Text style={styles.statLabel}>Rating</Text>
//           </View>
//         </View> */}

//         {/* Professional Profile Banner */}
//         {!isProfession ? ( // If user is NOT a professional
//           <LinearGradient
//             colors={['#F5F7FA', '#E4E7EB']}
//             start={{x: 0, y: 0}}
//             end={{x: 1, y: 1}}
//             style={styles.professionBanner}>
//             <View style={styles.professionIconContainer}>
//               <MaterialIcons name="work-outline" size={28} color="#4A90E2" />
//             </View>

//             <Text style={styles.professionTitle}>
//               Add Your Professional Profile
//             </Text>

//             <Text style={styles.professionText}>
//               Showcase your skills and services to connect with potential clients.
//               Create a professional profile to get discovered.
//             </Text>

//             <TouchableOpacity
//               style={styles.addProfessionButton}
//               onPress={() => navigation.navigate('AddProfession')}>
//               <LinearGradient
//                 colors={['#4A90E2', '#5A6BFF']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.gradientButton}>
//                 <Text style={styles.addButtonText}>
//                   Create Professional Profile
//                 </Text>
//                 <Icon name="arrow-forward" size={18} color="#FFFFFF" />
//               </LinearGradient>
//             </TouchableOpacity>
//           </LinearGradient>
//         ) : ( // If user IS a professional
//           <LinearGradient
//             colors={['#E3F2FD', '#BBDEFB']}
//             start={{x: 0, y: 0}}
//             end={{x: 1, y: 1}}
//             style={styles.professionBanner}>
//             <View style={styles.professionIconContainer}>
//               <MaterialIcons name="verified" size={28} color="#4CAF50" />
//             </View>

//             <Text style={styles.professionTitle}>
//               Professional Profile Active
//             </Text>

//             <Text style={styles.professionText}>
//               You're now visible to potential clients! Enjoy your free trial of
//               BestWorkers and start getting job offers.
//             </Text>

//             {/* View Professional Profile Button (commented out) */}
//             {/* <TouchableOpacity
//               style={styles.addProfessionButton}
//               onPress={() => navigation.navigate('ProfessionalProfile')}>
//               <LinearGradient
//                 colors={['#4CAF50', '#2E7D32']}
//                 start={{x: 0, y: 0}}
//                 end={{x: 1, y: 0}}
//                 style={styles.gradientButton}>
//                 <Text style={styles.addButtonText}>
//                   View Professional Profile
//                 </Text>
//                 <Icon name="arrow-forward" size={18} color="#FFFFFF" />
//               </LinearGradient>
//             </TouchableOpacity> */}
//           </LinearGradient>
//         )}

//         {/* Actions Container */}
//         <View style={styles.actionsContainer}>
//           {/* Notifications Button (commented out) */}
//           {/* <TouchableOpacity
//             style={styles.actionButton}
//             onPress={() => navigation.navigate('Notifications')}>
//             <View style={styles.actionIconContainer}>
//               <Icon name="notifications-outline" size={24} color="#4A90E2" />
//             </View>
//             <View style={styles.actionTextContainer}>
//               <Text style={styles.actionTitle}>Notifications</Text>
//               <Text style={styles.actionSubtitle}>
//                 Check your latest updates
//               </Text>
//             </View>
//             <Icon name="chevron-forward" size={22} color="#A0A0A0" />
//           </TouchableOpacity> */}

//           {/* Logout Button */}
//           <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
//             <View
//               style={[
//                 styles.actionIconContainer,
//                 {backgroundColor: '#FFEBEE'}, // Light red background
//               ]}>
//               <Icon name="log-out-outline" size={24} color="#F44336" /> {/* Red icon */}
//             </View>
//             <View style={styles.actionTextContainer}>
//               <Text style={[styles.actionTitle, {color: '#F44336'}]}> {/* Red text */}
//                 Logout
//               </Text>
//               <Text style={styles.actionSubtitle}>
//                 Sign out from your account
//               </Text>
//             </View>
//             <Icon name="chevron-forward" size={22} color="#A0A0A0" /> {/* Gray arrow */}
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default ProfileScreen;


// // // ProfileScreen.js
// // import React, {useEffect, useState, useCallback} from 'react';
// // import {
// //   View,
// //   Text,
// //   SafeAreaView,
// //   TouchableOpacity,
// //   ActivityIndicator,
// //   ScrollView,
// //   Image,
// //   StatusBar,
// //   RefreshControl,
// //   Animated,
// // } from 'react-native';
// // import Icon from 'react-native-vector-icons/Ionicons';
// // import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import {getUserProfile} from '../services/api';
// // import SideMenu from '../components/SideMenu';
// // import LinearGradient from 'react-native-linear-gradient';
// // import {styles} from '../styles/ProfileStyles';

// // const ProfileScreen = ({navigation}) => {
// //   const [userId, setUserId] = useState('');
// //   const [userData, setUserData] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [isMenuVisible, setIsMenuVisible] = useState(false);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [scrollY] = useState(new Animated.Value(0));
// //   const [isProfession, setIsProfession] = useState(false);

// //   const fetchUserData = async () => {
// //     try {
// //       setLoading(true);
// //       const storedUserId = await AsyncStorage.getItem('userID');
// //       if (storedUserId) setUserId(storedUserId);

// //       const response = await getUserProfile();

// //       if (response.success) {
// //         setUserData(response.data);
// //       } else {
// //         setError('Failed to fetch user data');
// //       }
// //     } catch (err) {
// //       console.error('Error fetching user data:', err);
// //       setError(err.message || 'An error occurred while fetching user data');
// //     } finally {
// //       setLoading(false);
// //       setRefreshing(false);
// //     }
// //   };

// //   const checkProfessionStatus = async () => {
// //     try {
// //       const professionStatus = await AsyncStorage.getItem('isProfession');
// //       setIsProfession(professionStatus === 'true');
// //     } catch (err) {
// //       console.error('Error checking profession status:', err);
// //     }
// //   };

// //   useEffect(() => {
// //     const initializeData = async () => {
// //       await checkProfessionStatus();
// //       await fetchUserData();
// //     };
    
// //     initializeData();
// //   }, []);

// //   useEffect(() => {
// //     const unsubscribe = navigation.addListener('focus', async () => {
// //       await checkProfessionStatus();
// //     });

// //     return unsubscribe;
// //   }, [navigation]);

// //   const onRefresh = useCallback(() => {
// //     setRefreshing(true);
// //     fetchUserData();
// //     checkProfessionStatus();
// //   }, []);

// //   const handleLogout = async () => {
// //     try {
// //       await AsyncStorage.removeItem('userToken');
// //       await AsyncStorage.removeItem('userID');
// //       await AsyncStorage.removeItem('isProfession');
// //       navigation.replace('Login');
// //     } catch (error) {
// //       console.error('Error logging out:', error);
// //     }
// //   };

// //   // Animated header effect
// //   const headerOpacity = scrollY.interpolate({
// //     inputRange: [0, 100],
// //     outputRange: [1, 0.9],
// //     extrapolate: 'clamp',
// //   });

// //   const headerHeight = scrollY.interpolate({
// //     inputRange: [0, 100],
// //     outputRange: [120, 80],
// //     extrapolate: 'clamp',
// //   });

// //   if (loading && !refreshing) {
// //     return (
// //       <SafeAreaView style={styles.container}>
// //         <StatusBar barStyle="light-content" />
// //         <LinearGradient
// //           colors={['#4A90E2', '#5A6BFF']}
// //           style={styles.loadingContainer}>
// //           <ActivityIndicator size="large" color="#FFFFFF" />
// //           <Text style={styles.loadingText}>Loading profile...</Text>
// //         </LinearGradient>
// //       </SafeAreaView>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <SafeAreaView style={styles.container}>
// //         <StatusBar barStyle="light-content" />
// //         <View style={styles.errorContainer}>
// //           <Image
// //             source={require('../assets/kk.png')}
// //             style={styles.errorImage}
// //             defaultSource={
// //               <Icon name="alert-circle" size={80} color="#FF3B30" />
// //             }
// //           />
// //           <Text style={styles.errorTitle}>Oops!</Text>
// //           <Text style={styles.errorText}>{error}</Text>
// //           <TouchableOpacity style={styles.retryButton} onPress={fetchUserData}>
// //             <Text style={styles.retryButtonText}>Try Again</Text>
// //           </TouchableOpacity>
// //         </View>
// //       </SafeAreaView>
// //     );
// //   }

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <StatusBar barStyle="light-content" />

// //       <SideMenu
// //         isVisible={isMenuVisible}
// //         onClose={() => setIsMenuVisible(false)}
// //         navigation={navigation}
// //         setIsLoggedIn={() => {}}
// //         userData={userData}
// //       />

// //       <Animated.View
// //         style={[
// //           styles.header,
// //           {
// //             opacity: headerOpacity,
// //             height: headerHeight,
// //           },
// //         ]}>
// //         <LinearGradient
// //           colors={['#4A90E2', '#5A6BFF']}
// //           style={styles.gradientHeader}>
// //           <TouchableOpacity
// //             style={styles.menuButton}
// //             onPress={() => setIsMenuVisible(true)}>
// //             <Icon name="menu" size={28} color="#FFFFFF" />
// //           </TouchableOpacity>
// //           <Text style={styles.headerTitle}>My Profile</Text>
// //           <View style={styles.menuButton} />
// //         </LinearGradient>
// //       </Animated.View>

// //       <ScrollView
// //         contentContainerStyle={styles.scrollContent}
// //         showsVerticalScrollIndicator={false}
// //         refreshControl={
// //           <RefreshControl
// //             refreshing={refreshing}
// //             onRefresh={onRefresh}
// //             colors={['#4A90E2']}
// //             tintColor="#4A90E2"
// //           />
// //         }
// //         scrollEventThrottle={16}
// //         onScroll={Animated.event(
// //           [{nativeEvent: {contentOffset: {y: scrollY}}}],
// //           {useNativeDriver: false},
// //         )}>
// //         <View style={styles.profileSection}>
// //           <View style={styles.avatarContainer}>
// //             {userData?.avatar ? (
// //               <Image
// //                 source={{uri: userData.avatar}}
// //                 style={styles.avatarImage}
// //               />
// //             ) : (
// //               <LinearGradient
// //                 colors={['#5A6BFF', '#4A90E2']}
// //                 style={styles.avatarPlaceholder}>
// //                 <Text style={styles.avatarInitial}>
// //                   {userData?.name ? userData.name.charAt(0).toUpperCase() : '?'}
// //                 </Text>
// //               </LinearGradient>
// //             )}
// //           </View>

// //           <Text style={styles.userName}>{userData?.name || 'Your Name'}</Text>

// //           <View style={styles.userInfoContainer}>
// //             <View style={styles.infoItem}>
// //               <Icon name="mail-outline" size={18} color="#4A90E2" />
// //               <Text style={styles.infoText}>
// //                 {userData?.email || 'your.email@example.com'}
// //               </Text>
// //             </View>

// //             <View style={styles.infoItem}>
// //               <Icon name="call-outline" size={18} color="#4A90E2" />
// //               <Text style={styles.infoText}>
// //                 {userData?.mobile || '+1 234 567 890'}
// //               </Text>
// //             </View>

// //             {userData?.location && (
// //               <View style={styles.infoItem}>
// //                 <Icon name="location-outline" size={18} color="#4A90E2" />
// //                 <Text style={styles.infoText}>{userData.location}</Text>
// //               </View>
// //             )}
// //           </View>

// //           {/* <TouchableOpacity
// //             style={styles.editProfileButton}
// //             onPress={() => navigation.navigate('EditProfile')}>
// //             <Text style={styles.editProfileText}>Edit Profile</Text>
// //           </TouchableOpacity> */}
// //         </View>
// // {/* 
// //         <View style={styles.statsContainer}>
// //           <View style={styles.statDivider} />

// //           <View style={styles.statItem}>
// //             <Text style={styles.statNumber}>{userData?.reviews || 0}</Text>
// //             <Text style={styles.statLabel}>Reviews</Text>
// //           </View>

// //           <View style={styles.statDivider} />

// //           <View style={styles.statItem}>
// //             <Text style={styles.statNumber}>{userData?.rating || '0.0'}</Text>
// //             <Text style={styles.statLabel}>Rating</Text>
// //           </View>
// //         </View> */}

// //         {!isProfession ? (
// //           <LinearGradient
// //             colors={['#F5F7FA', '#E4E7EB']}
// //             start={{x: 0, y: 0}}
// //             end={{x: 1, y: 1}}
// //             style={styles.professionBanner}>
// //             <View style={styles.professionIconContainer}>
// //               <MaterialIcons name="work-outline" size={28} color="#4A90E2" />
// //             </View>

// //             <Text style={styles.professionTitle}>
// //               Add Your Professional Profile
// //             </Text>

// //             <Text style={styles.professionText}>
// //               Showcase your skills and services to connect with potential clients.
// //               Create a professional profile to get discovered.
// //             </Text>

// //             <TouchableOpacity
// //               style={styles.addProfessionButton}
// //               onPress={() => navigation.navigate('AddProfession')}>
// //               <LinearGradient
// //                 colors={['#4A90E2', '#5A6BFF']}
// //                 start={{x: 0, y: 0}}
// //                 end={{x: 1, y: 0}}
// //                 style={styles.gradientButton}>
// //                 <Text style={styles.addButtonText}>
// //                   Create Professional Profile
// //                 </Text>
// //                 <Icon name="arrow-forward" size={18} color="#FFFFFF" />
// //               </LinearGradient>
// //             </TouchableOpacity>
// //           </LinearGradient>
// //         ) : (
// //           <LinearGradient
// //             colors={['#E3F2FD', '#BBDEFB']}
// //             start={{x: 0, y: 0}}
// //             end={{x: 1, y: 1}}
// //             style={styles.professionBanner}>
// //             <View style={styles.professionIconContainer}>
// //               <MaterialIcons name="verified" size={28} color="#4CAF50" />
// //             </View>

// //             <Text style={styles.professionTitle}>
// //               Professional Profile Active
// //             </Text>

// //             <Text style={styles.professionText}>
// //               You're now visible to potential clients! Enjoy your free trial of
// //               BestWorkers and start getting job offers.
// //             </Text>

// //             {/* <TouchableOpacity
// //               style={styles.addProfessionButton}
// //               onPress={() => navigation.navigate('ProfessionalProfile')}>
// //               <LinearGradient
// //                 colors={['#4CAF50', '#2E7D32']}
// //                 start={{x: 0, y: 0}}
// //                 end={{x: 1, y: 0}}
// //                 style={styles.gradientButton}>
// //                 <Text style={styles.addButtonText}>
// //                   View Professional Profile
// //                 </Text>
// //                 <Icon name="arrow-forward" size={18} color="#FFFFFF" />
// //               </LinearGradient>
// //             </TouchableOpacity> */}
// //           </LinearGradient>
// //         )}

// //         <View style={styles.actionsContainer}>
// //           {/* <TouchableOpacity
// //             style={styles.actionButton}
// //             onPress={() => navigation.navigate('Notifications')}>
// //             <View style={styles.actionIconContainer}>
// //               <Icon name="notifications-outline" size={24} color="#4A90E2" />
// //             </View>
// //             <View style={styles.actionTextContainer}>
// //               <Text style={styles.actionTitle}>Notifications</Text>
// //               <Text style={styles.actionSubtitle}>
// //                 Check your latest updates
// //               </Text>
// //             </View>
// //             <Icon name="chevron-forward" size={22} color="#A0A0A0" />
// //           </TouchableOpacity> */}

// //           <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
// //             <View
// //               style={[
// //                 styles.actionIconContainer,
// //                 {backgroundColor: '#FFEBEE'},
// //               ]}>
// //               <Icon name="log-out-outline" size={24} color="#F44336" />
// //             </View>
// //             <View style={styles.actionTextContainer}>
// //               <Text style={[styles.actionTitle, {color: '#F44336'}]}>
// //                 Logout
// //               </Text>
// //               <Text style={styles.actionSubtitle}>
// //                 Sign out from your account
// //               </Text>
// //             </View>
// //             <Icon name="chevron-forward" size={22} color="#A0A0A0" />
// //           </TouchableOpacity>
// //         </View>
// //       </ScrollView>
// //     </SafeAreaView>
// //   );
// // };

// // export default ProfileScreen;