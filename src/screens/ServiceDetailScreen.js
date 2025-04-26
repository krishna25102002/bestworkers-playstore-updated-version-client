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
      title: service,
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

    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        const response = await getProfessionalsByService(service);
        const formattedProfessionals = response.data.map(prof => ({
          id: prof._id,
          name: prof.name,
          avatar: prof.imageUrl || '',
          initial: prof.name.charAt(0).toUpperCase(),
          bgColor: getRandomColor(),
          experience: parseInt(prof.experience.split('-')[1]) || 2,
          service: prof.serviceName,
          city: prof.city,
          price: prof.servicePrice,
          priceUnit: prof.priceUnit,
          email: prof.email,
          mobileNo: prof.mobileNo,
          secondaryMobileNo: prof.secondaryMobileNo,
          district: prof.district,
          state: prof.state,
          serviceCategory: prof.serviceCategory,
          professionDescription: prof.professionDescription,
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
  }, [navigation, service]);

  useEffect(() => {
    let filtered = [...professionals];
    
    if (searchText) {
      filtered = filtered.filter(prof =>
        prof.name.toLowerCase().includes(searchText.toLowerCase()) ||
        prof.city.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (sortBy === 'experience') {
      filtered.sort((a, b) => b.experience - a.experience);
    } else if (sortBy === 'price') {
      filtered.sort((a, b) => a.price - b.price);
    }

    setFilteredProfessionals(filtered);
  }, [searchText, sortBy, professionals]);

  const handleProfessionalPress = (professional) => {
    navigation.navigate('ProfessionalDetail', { professional });
  };

  const renderSortButton = (option, label) => (
    <TouchableOpacity
      style={[styles.sortButton, sortBy === option && styles.activeSortButton]}
      onPress={() => setSortBy(option)}>
      <Text style={[styles.sortButtonText, sortBy === option && styles.activeSortButtonText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.noResultsContainer}>
      <Icon name="search-off" size={64} color="#2E5BFF" />
      <Text style={styles.noResultsTitle}>No professionals found</Text>
      <Text style={styles.noResultsSubtext}>
        Try adjusting your search or check back later
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#2E5BFF" barStyle="light-content" />
      
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
            <Icon name="info-outline" size={20} color="#2E5BFF" />
            <Text style={styles.serviceInfoText}>
              Showing {filteredProfessionals.length} {service} professionals in {category}
            </Text>
          </View>
        </View>

        <View style={styles.sortContainer}>
          <Text style={styles.sortTitle}>Sort by:</Text>
          <View style={styles.sortOptions}>
            {renderSortButton('experience', 'Experience')}
            {renderSortButton('price', 'Price')}
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2E5BFF" />
          <Text style={styles.loadingText}>Finding the best professionals...</Text>
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