import React, { useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/ProfessionalDetailStyles';

const ProfessionalDetailScreen = ({ navigation, route }) => {
  const { professional } = route.params;

  useEffect(() => {
    navigation.setOptions({
      title: professional.name,
      headerStyle: {
        backgroundColor: '#2E5BFF',
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, [navigation, professional.name]);

  const renderDetailItem = (icon, title, value, isImportant = false) => (
    <View style={styles.detailItem}>
      <Icon name={icon} size={20} color="#2E5BFF" />
      <View style={styles.detailTextContainer}>
        <Text style={styles.detailTitle}>{title}</Text>
        <Text style={[styles.detailValue, isImportant && styles.importantValue]}>
          {value || 'Not provided'}
        </Text>
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={[styles.avatarCircle, { backgroundColor: professional.bgColor }]}>
            <Text style={styles.avatarLetter}>
              {professional.initial}
            </Text>
          </View>

          <Text style={styles.profileName}>{professional.name}</Text>
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{professional.service}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{professional.serviceCategory}</Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Icon name="work" size={22} color="#2E5BFF" />
              <Text style={styles.statText}>{professional.experience} years experience</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Icon name="location-on" size={22} color="#2E5BFF" />
              <Text style={styles.statText}>{professional.city}</Text>
            </View>
          </View>
        </View>

        {/* Pricing Card */}
        <View style={styles.pricingCard}>
          <View style={styles.pricingHeader}>
            <Text style={styles.pricingTitle}>Service Price</Text>
            <View style={styles.priceBadge}>
              <Text style={styles.priceBadgeText}>Best Value</Text>
            </View>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceValue}>₹{professional.price}</Text>
            <Text style={styles.priceUnit}>{professional.priceUnit}</Text>
          </View>
        </View>

        {/* Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <Icon name="place" size={22} color="#2E5BFF" />
              <Text style={styles.locationTitle}>Service Area</Text>
            </View>
            <Text style={styles.locationText}>
              {professional.city}, {professional.district}, {professional.state}
            </Text>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          {renderDetailItem('email', 'Email', professional.email)}
          {renderDetailItem('phone', 'Phone', professional.mobileNo, true)}
          {professional.secondaryMobileNo && 
            renderDetailItem('phone-forwarded', 'Alternate Phone', professional.secondaryMobileNo)}
        </View>

        {/* Service Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          {renderDetailItem('category', 'Category', professional.serviceCategory)}
          {renderDetailItem('build', 'Service', professional.service)}        
          {professional.service === 'Explore others' &&
            renderDetailItem('badge', 'Designation', professional.designation)}
          {renderDetailItem('description', 'Description', professional.professionDescription)}
          {renderDetailItem('help-outline', 'BestWorkers Approved', professional.needSupport ? 'Yes' : 'No')}
        </View>

        {/* Additional Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          {renderDetailItem('event', 'Joined', new Date(professional.createdAt).toLocaleDateString())}
        </View>

        {/* Reviews Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          <View style={styles.comingSoonContainer}>
            <Icon name="star" size={40} color="#F59E0B" />
            <Text style={styles.comingSoonText}>Reviews Coming Soon!</Text>
            <Text style={styles.comingSoonSubtext}>
              We're working on adding reviews to help you make informed decisions.
            </Text>
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
            <Text style={styles.buttonText}>Call Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfessionalDetailScreen;
