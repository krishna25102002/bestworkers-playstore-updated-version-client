import React, { useState, useEffect } from 'react';
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

const HomeScreen = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [filteredCategories, setFilteredCategories] = useState(
    Object.keys(serviceNames), // Include "others"
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
      const serviceMatches = Object.keys(serviceNames).filter(category =>
        serviceNames[category].some(service =>
          service.label.toLowerCase().includes(lowercasedSearch),
        ),
      );
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
      serviceNames[category].some(s => s.value === service.value),
    );
    navigation.navigate('ServiceDetail', {
      service: service.value,
      category: categoryForService,
    });
  };

  const handleClearSearch = () => {
    setSearchText('');
  };

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() => handleServicePress(item)}>
      <Text style={styles.serviceText}>{item.label}</Text>
      <Icon
        name="arrow-forward-ios"
        size={16}
        color={styles.categoryIconContainer.backgroundColor}
      />
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item: category }) => (
    <View style={styles.categorySection}>
      <TouchableOpacity
        style={styles.categoryHeader}
        onPress={() => toggleCategory(category)}
        activeOpacity={0.7}>
        <View style={styles.categoryIconContainer}>
          <Icon
            name={categoryIcons[category] || 'category'} // Default for "others"
            size={24}
            color="white"
          />
        </View>
        <Text style={styles.categoryTitle}>{category}</Text>
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

      {expandedCategory === category && (
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor={styles.header.backgroundColor}
        barStyle="light-content"
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Icon name="menu" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Services</Text>
      </View>

      {/* Search Bar */}
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

      {/* Main Content */}
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

      {/* Side Menu */}
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