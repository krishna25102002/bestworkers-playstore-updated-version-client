import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet, 
  Image, 
  ScrollView, 
  SafeAreaView 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import AppText from './AppText'; // Import AppText
import { getUserProfile } from '../services/api'; // Import the getUserProfile function

const ROYAL_BLUE = '#1a4b8c';
const LIGHT_BLUE = '#2980b9';
const LIGHTER_BLUE = '#5dade2';
const WHITE = '#FFFFFF';

const SideMenu = ({ isVisible, onClose, navigation, setIsLoggedIn }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data when the component mounts or when isVisible changes
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await getUserProfile();
        if (response.success) {
          setUserData(response.data);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isVisible) {
      fetchUserData();
    }
  }, [isVisible]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setIsLoggedIn(false);
      onClose();
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const menuItems = [
    { icon: 'home', label: 'Home', onPress: () => navigation.navigate('HomeTab') },
    { icon: 'person', label: 'Profile', onPress: () => navigation.navigate('ProfileTab') },
    { icon: 'policy', label: 'Privacy Policy', onPress: () => navigation.navigate('PrivacyPolicy') },
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.menu}>
          <ScrollView>
            <LinearGradient
              colors={['#1a4b8c', '#2980b9', '#5dade2']}
              style={styles.profileSection}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.profileImageContainer}>
                <Image
                  source={{ uri: userData?.avatar || 'https://via.placeholder.com/100' }}
                  style={styles.profileImage}
                />
              </View>
              {loading ? (
                <AppText style={styles.profileName} bold>Loading...</AppText>
              ) : (
                <>
                  <AppText style={styles.profileName} bold>{userData?.name || 'Your Name'}</AppText>
                  <AppText style={styles.profileEmail}>{userData?.email || 'your.email@example.com'}</AppText>
                </>
              )}
            </LinearGradient>

            <View style={styles.divider} />

            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  onClose();
                  item.onPress();
                }}
              >
                <Icon name={item.icon} size={24} color={WHITE} />
                <AppText style={styles.menuItemText}>{item.label}</AppText>
              </TouchableOpacity>
            ))}

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Icon name="logout" size={24} color={WHITE} />
              <AppText style={styles.menuItemText}>Logout</AppText>
            </TouchableOpacity>

            <AppText style={styles.versionText}>Version 2.0</AppText>
          </ScrollView>
        </View>

        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menu: {
    width: '75%',
    backgroundColor: ROYAL_BLUE,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  profileSection: {
    padding: 20,
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: WHITE,
    marginBottom: 10,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileName: {
     textAlign: 'center',
    fontSize: 15,
    // fontWeight: 'bold', // Handled by AppText bold prop
    color: WHITE,
   
    marginBottom: 5,
  },
  profileEmail: {
     textAlign: 'center',
    fontSize: 14,
     marginleft: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    // fontFamily: 'Poppins-Regular', // Handled by AppText
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  menuItemText: {
    fontSize: 14,
    color: WHITE,
    // fontFamily: 'Poppins-Regular', // Handled by AppText
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  versionText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    // fontFamily: 'Poppins-Regular', // Handled by AppText
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
});

export default SideMenu;