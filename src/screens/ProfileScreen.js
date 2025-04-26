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
import {styles} from '../styles/ProfileStyles';

const ProfileScreen = ({navigation}) => {
  const [userId, setUserId] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [scrollY] = useState(new Animated.Value(0));
  const [isProfession, setIsProfession] = useState(false);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const storedUserId = await AsyncStorage.getItem('userID');
      if (storedUserId) setUserId(storedUserId);

      const response = await getUserProfile();

      if (response.success) {
        setUserData(response.data);
      } else {
        setError('Failed to fetch user data');
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.message || 'An error occurred while fetching user data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const checkProfessionStatus = async () => {
    try {
      const professionStatus = await AsyncStorage.getItem('isProfession');
      setIsProfession(professionStatus === 'true');
    } catch (err) {
      console.error('Error checking profession status:', err);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await checkProfessionStatus();
      await fetchUserData();
    };
    
    initializeData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await checkProfessionStatus();
    });

    return unsubscribe;
  }, [navigation]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUserData();
    checkProfessionStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userID');
      await AsyncStorage.removeItem('isProfession');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

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

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={['#4A90E2', '#5A6BFF']}
          style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.errorContainer}>
          <Image
            source={require('../assets/kk.png')}
            style={styles.errorImage}
            defaultSource={
              <Icon name="alert-circle" size={80} color="#FF3B30" />
            }
          />
          <Text style={styles.errorTitle}>Oops!</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchUserData}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <SideMenu
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        navigation={navigation}
        setIsLoggedIn={() => {}}
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
          colors={['#4A90E2', '#5A6BFF']}
          style={styles.gradientHeader}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setIsMenuVisible(true)}>
            <Icon name="menu" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
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
            colors={['#4A90E2']}
            tintColor="#4A90E2"
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
                colors={['#5A6BFF', '#4A90E2']}
                style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>
                  {userData?.name ? userData.name.charAt(0).toUpperCase() : '?'}
                </Text>
              </LinearGradient>
            )}
          </View>

          <Text style={styles.userName}>{userData?.name || 'Your Name'}</Text>

          <View style={styles.userInfoContainer}>
            <View style={styles.infoItem}>
              <Icon name="mail-outline" size={18} color="#4A90E2" />
              <Text style={styles.infoText}>
                {userData?.email || 'your.email@example.com'}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Icon name="call-outline" size={18} color="#4A90E2" />
              <Text style={styles.infoText}>
                {userData?.mobile || '+1 234 567 890'}
              </Text>
            </View>

            {userData?.location && (
              <View style={styles.infoItem}>
                <Icon name="location-outline" size={18} color="#4A90E2" />
                <Text style={styles.infoText}>{userData.location}</Text>
              </View>
            )}
          </View>

          {/* <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity> */}
        </View>
{/* 
        <View style={styles.statsContainer}>
          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userData?.reviews || 0}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userData?.rating || '0.0'}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View> */}

        {!isProfession ? (
          <LinearGradient
            colors={['#F5F7FA', '#E4E7EB']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.professionBanner}>
            <View style={styles.professionIconContainer}>
              <MaterialIcons name="work-outline" size={28} color="#4A90E2" />
            </View>

            <Text style={styles.professionTitle}>
              Add Your Professional Profile
            </Text>

            <Text style={styles.professionText}>
              Showcase your skills and services to connect with potential clients.
              Create a professional profile to get discovered.
            </Text>

            <TouchableOpacity
              style={styles.addProfessionButton}
              onPress={() => navigation.navigate('AddProfession')}>
              <LinearGradient
                colors={['#4A90E2', '#5A6BFF']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.gradientButton}>
                <Text style={styles.addButtonText}>
                  Create Professional Profile
                </Text>
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

            <Text style={styles.professionTitle}>
              Professional Profile Active
            </Text>

            <Text style={styles.professionText}>
              You're now visible to potential clients! Enjoy your free trial of
              BestWorkers and start getting job offers.
            </Text>

            {/* <TouchableOpacity
              style={styles.addProfessionButton}
              onPress={() => navigation.navigate('ProfessionalProfile')}>
              <LinearGradient
                colors={['#4CAF50', '#2E7D32']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.gradientButton}>
                <Text style={styles.addButtonText}>
                  View Professional Profile
                </Text>
                <Icon name="arrow-forward" size={18} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity> */}
          </LinearGradient>
        )}

        <View style={styles.actionsContainer}>
          {/* <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Notifications')}>
            <View style={styles.actionIconContainer}>
              <Icon name="notifications-outline" size={24} color="#4A90E2" />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Notifications</Text>
              <Text style={styles.actionSubtitle}>
                Check your latest updates
              </Text>
            </View>
            <Icon name="chevron-forward" size={22} color="#A0A0A0" />
          </TouchableOpacity> */}

          <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
            <View
              style={[
                styles.actionIconContainer,
                {backgroundColor: '#FFEBEE'},
              ]}>
              <Icon name="log-out-outline" size={24} color="#F44336" />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={[styles.actionTitle, {color: '#F44336'}]}>
                Logout
              </Text>
              <Text style={styles.actionSubtitle}>
                Sign out from your account
              </Text>
            </View>
            <Icon name="chevron-forward" size={22} color="#A0A0A0" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;