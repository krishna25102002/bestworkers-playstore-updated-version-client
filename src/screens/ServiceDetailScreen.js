import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProfessionalCard from '../components/ProfessionalCard';
import { getProfessionalsByService } from '../services/api';
import styles from '../styles/ServiceDetailStyles';
import AppText from '../components/AppText'; // Import AppText

const PRIMARY_COLOR = '#1a4b8c'; // Royal blue from HomeStyles

// Function to generate random background color
const getRandomColor = () => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const ServiceDetailScreen = ({ navigation, route }) => {
  const { service, category } = route.params;
  const [professionals, setProfessionals] = useState([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('experience');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    navigation.setOptions({
      title: service === 'Explore others' ? `Other ${category}` : service, // More specific title
      headerStyle: {
        backgroundColor: PRIMARY_COLOR,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        // fontWeight: 'bold', // Will be handled by Poppins-Bold if AppText is used in header
        fontFamily: 'Poppins-Bold', // Explicitly set for header title
      },
    });

    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        // If service is 'Explore others', we also use the category for specific filtering
        let response;
        if (service === 'Explore others' && category) {
          response = await getProfessionalsByService(service, category);
        } else {
          response = await getProfessionalsByService(service); // Fallback for standard services
        }
        const formattedProfessionals = response.data.map(prof => ({
          id: prof._id,
          name: prof.name,
          avatar: prof.imageUrl || '',
          initial: prof.name.charAt(0).toUpperCase(),
          bgColor: getRandomColor(),
          experience: parseInt(prof.experience.split('-')[1]) || 2,
          service: prof.serviceName, // This will be 'Explore others' for custom services
          city: prof.city,
          // price: prof.servicePrice, // Commented out
          // priceUnit: prof.priceUnit, // Commented out
          email: prof.email,
          mobileNo: prof.mobileNo,
          secondaryMobileNo: prof.secondaryMobileNo,
          district: prof.district,
          state: prof.state,
          serviceCategory: prof.serviceCategory,
          professionDescription: prof.professionDescription,
          designation: prof.designation, // This will hold the custom name for 'Explore others' services
          needSupport: prof.needSupport,
          createdAt: prof.createdAt,
          status: prof.status,
        }));
        setProfessionals(formattedProfessionals);
        setFilteredProfessionals(formattedProfessionals);
      } catch (error) {
        console.error('Error fetching professionals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, [navigation, service, category]); // Add category to dependencies

  useEffect(() => {
    let filtered = [...professionals];

    if (searchText) {
      filtered = filtered.filter(prof =>
        // Search by name, city, serviceName, or designation
        prof.name.toLowerCase().includes(searchText.toLowerCase()) ||
        prof.city.toLowerCase().includes(searchText.toLowerCase()) ||
        prof.service.toLowerCase().includes(searchText.toLowerCase()) || // Search serviceName (might be 'Explore others' or standard)
        (prof.designation && prof.designation.toLowerCase().includes(searchText.toLowerCase())) // Search designation (custom name or specific role)
      );
    }

    if (sortBy === 'experience') {
      filtered.sort((a, b) => b.experience - a.experience);
    } // else if (sortBy === 'price') { // Commented out price sort
      // filtered.sort((a, b) => a.price - b.price);
    // }

    setFilteredProfessionals(filtered);
  }, [searchText, sortBy, professionals]);

  const handleProfessionalPress = (professional) => {
    navigation.navigate('ProfessionalDetail', { professional });
  };

  const renderSortButton = (option, label) => (
    <TouchableOpacity
      style={[styles.sortButton, sortBy === option && styles.activeSortButton]}
      onPress={() => setSortBy(option)}>
      <AppText style={[styles.sortButtonText, sortBy === option && styles.activeSortButtonText]}>
        {label}
      </AppText>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.noResultsContainer}>
      <Icon name="search-off" size={64} color={PRIMARY_COLOR} />
      <AppText style={styles.noResultsTitle} bold>No professionals found</AppText>
      <AppText style={styles.noResultsSubtext}>
        Try adjusting your search or check back later
      </AppText>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={PRIMARY_COLOR} barStyle="light-content" />

      <View style={styles.headerContainer}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={22} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or city..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#A0A0A0"
          />
          {searchText ? (
            <TouchableOpacity
              onPress={() => setSearchText('')}
              style={styles.clearIcon}>
              <Icon name="clear" size={22} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.serviceInfo}>
            <Icon name="info-outline" size={20} color={PRIMARY_COLOR} />
            <AppText style={styles.serviceInfoText} medium>
            Showing {filteredProfessionals.length} {service === 'Explore others' ? 'other' : service} professionals{category && service !== 'Explore others' ? ` in ${category}` : ''}
            </AppText>
          </View>
        </View>

        <View style={styles.sortContainer}>
          <AppText style={styles.sortTitle} bold>Sort by:</AppText>
          <View style={styles.sortOptions}>
            {renderSortButton('experience', 'Experience')}
            {/* {renderSortButton('price', 'Price')}  // Price sort button commented out */}
          </View>
        </View>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
          <AppText style={styles.loadingText} medium>Finding the best professionals...</AppText>
        </View>
      ) : (
        <FlatList
          data={filteredProfessionals}
          renderItem={({ item }) => (
            <ProfessionalCard
              professional={item}
              onPress={() => handleProfessionalPress(item)}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />
      )}
    </SafeAreaView>
  );
};

export default ServiceDetailScreen;
