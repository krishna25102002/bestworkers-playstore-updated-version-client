import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Linking,
  Modal, // Import Modal
  Image, // Import Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/ProfessionalDetailStyles';
import AppText from '../components/AppText'; // Import AppText
import { getAvatarUrl } from '../services/api'; // Import getAvatarUrl

const PRIMARY_COLOR = '#1a4b8c'; // Royal blue

const ProfessionalDetailScreen = ({ navigation, route }) => {
  const { professional } = route.params;
  // Use a timestamp for cache-busting the avatar
  const avatarTimestamp = React.useMemo(() => Date.now(), [professional.hasAvatar, professional.userIdForAvatar]);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [previewImageUri, setPreviewImageUri] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      title: professional.name,
      headerStyle: {
        backgroundColor: PRIMARY_COLOR,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontFamily: 'Poppins-Bold', // Explicitly set for header if not using AppText here
      },
    });
  }, [navigation, professional.name]);

  const renderDetailItem = (icon, title, value, isImportant = false) => (
    <View style={styles.detailItem}>
      <Icon name={icon} size={20} color={PRIMARY_COLOR} />
      <View style={styles.detailTextContainer}>
        <AppText style={styles.detailTitle}>{title}</AppText>
        <AppText style={[styles.detailValue, isImportant && styles.importantValue]}>
          {value || 'Not provided'}
        </AppText>
      </View>
    </View>
  );

  const handleCallPress = () => {
    const phoneNumbers = [professional.mobileNo];
    if (professional.secondaryMobileNo) {
      phoneNumbers.push(professional.secondaryMobileNo);
    }

    if (phoneNumbers.length === 1) {
      Linking.openURL(`tel:${phoneNumbers[0]}`);
    } else {
      Alert.alert(
        'Choose a number',
        '',
        phoneNumbers.map((number) => ({
          text: number,
          onPress: () => Linking.openURL(`tel:${number}`),
        })),
        { cancelable: true }
      );
    }
  };

  const handleImageTap = () => {
    if (professional.hasAvatar && professional.userIdForAvatar) {
      setPreviewImageUri(getAvatarUrl(professional.userIdForAvatar, avatarTimestamp));
      setIsPreviewModalVisible(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}> 
          <TouchableOpacity
            onPress={handleImageTap} // Changed to onPress
            disabled={!(professional.hasAvatar && professional.userIdForAvatar)} // Disable if no avatar
          >
            {professional.hasAvatar && professional.userIdForAvatar ? (
              <Image source={{ uri: getAvatarUrl(professional.userIdForAvatar, avatarTimestamp) }} style={styles.avatarImageLarge} />
            ) : (
              <View style={[styles.avatarCircle, { backgroundColor: professional.bgColor || PRIMARY_COLOR }]}>
                <AppText style={styles.avatarLetter} bold>
                  {professional.initial || professional.name?.charAt(0)?.toUpperCase() || 'P'}
                </AppText>
              </View>
            )}
          </TouchableOpacity>

          <AppText style={styles.profileName} bold>{professional.name}</AppText>
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <AppText style={styles.badgeText} medium>{professional.service}</AppText>
            </View>
            <View style={styles.badge}>
              <AppText style={styles.badgeText} medium>{professional.serviceCategory}</AppText>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Icon name="work" size={22} color={PRIMARY_COLOR} />
              <AppText style={styles.statText} medium>{professional.experience} years experience</AppText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Icon name="location-on" size={22} color={PRIMARY_COLOR} />
              <AppText style={styles.statText} medium>{professional.city}</AppText>
            </View>
          </View>
        </View>

        {/* Pricing Card */}
        {/* Pricing Card commented out
        <View style={styles.pricingCard}>
          <View style={styles.pricingHeader}>
            <AppText style={styles.pricingTitle} bold>Service Price</AppText>
            <View style={styles.priceBadge}>
              <AppText style={styles.priceBadgeText} bold>Best Value</AppText>
            </View>
          </View>
          <View style={styles.priceRow}>
            <AppText style={styles.priceValue} bold>₹{professional.price}</AppText>
            <AppText style={styles.priceUnit}>{professional.priceUnit}</AppText>
          </View>
        </View>
        */}

        {/* Location Section */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle} bold>Location</AppText>
          <View style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <Icon name="place" size={22} color={PRIMARY_COLOR} />
              <AppText style={styles.locationTitle} bold>Service Area</AppText>
            </View>
            <AppText style={styles.locationText}>
              {professional.city}, {professional.district}, {professional.state}
            </AppText>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle} bold>Contact Information</AppText>
          {renderDetailItem('email', 'Email', professional.email)}
          {renderDetailItem('phone', 'Phone', professional.mobileNo, true)}
          {professional.secondaryMobileNo && 
            renderDetailItem('phone-forwarded', 'Alternate Phone', professional.secondaryMobileNo)}
        </View>

        {/* Service Details */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle} bold>Service Details</AppText>
          {renderDetailItem('category', 'Category', professional.serviceCategory)}
          {/* Display the main service name */}
      {renderDetailItem('build', 'Service', professional.service)} 
      {/* Display designation if it's different from service or simply if it exists and is meaningful */}
      {professional.designation && professional.designation !== professional.service &&
        renderDetailItem('badge', 'Specific Role / Custom Service', professional.designation)}
          {renderDetailItem('description', 'Description', professional.professionDescription)}
          {/* {renderDetailItem('help-outline', 'BestWorkers Approved', professional.needSupport ? 'Yes' : 'No')} */}
        </View>

        {/* Additional Information */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle} bold>Additional Information</AppText>
          {renderDetailItem('event', 'Joined', new Date(professional.createdAt).toLocaleDateString())}
        </View>

        {/* Reviews Section */}
        <View style={styles.section}>
          <AppText style={styles.sectionTitle} bold>Reviews</AppText>
          <View style={styles.comingSoonContainer}>
            <Icon name="star" size={40} color="#F59E0B" />
            <AppText style={styles.comingSoonText} bold>Reviews Coming Soon!</AppText>
            <AppText style={styles.comingSoonSubtext}>
              We're working on adding reviews to help you make informed decisions.
            </AppText>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          
          <TouchableOpacity 
            style={[styles.contactButton, styles.callButton]}
            activeOpacity={0.8}
            onPress={handleCallPress}
          >
            <Icon name="call" size={20} color="#FFFFFF" />
            <AppText style={styles.buttonText} bold>Call Now</AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* Image Preview Modal */}
      <Modal
        transparent={true}
        visible={isPreviewModalVisible}
        onRequestClose={() => setIsPreviewModalVisible(false)} // For Android back button
        animationType="fade"
      >
        <TouchableOpacity
          style={styles.modalOverlay} // Re-use or create specific style
          activeOpacity={1}
          onPress={() => setIsPreviewModalVisible(false)} // Close on tap outside the image
        >
          {previewImageUri && (
            <Image
              source={{ uri: previewImageUri }}
              style={styles.previewImage} // Re-use or create specific style
              resizeMode="contain"
            />
          )}
          <TouchableOpacity style={styles.closeButton} onPress={() => setIsPreviewModalVisible(false)}>
            {/* <Icon name="close-circle" size={30} color="#FFFFFF" /> */}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfessionalDetailScreen;
