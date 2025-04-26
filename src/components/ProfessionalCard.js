import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProfessionalCard = ({ professional, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.avatar, { backgroundColor: professional.bgColor }]}>
        <Text style={styles.avatarText}>{professional.initial}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{professional.name}</Text>
        <View style={styles.locationContainer}>
          <Icon name="location-on" size={14} color="#8C95A6" />
          <Text style={styles.city}>{professional.city}</Text>
        </View>
        <View style={styles.experienceContainer}>
          <Icon name="work" size={14} color="#8C95A6" />
          <Text style={styles.service}>{professional.experience} years experience</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹{professional.price}</Text>
          <Text style={styles.priceUnit}>{professional.priceUnit}</Text>
        </View>
      </View>
      <View style={styles.arrowContainer}>
        <Icon name="arrow-forward-ios" size={16} color="#2E5BFF" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F5',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  city: {
    fontSize: 14,
    color: '#505F79',
    marginLeft: 4,
  },
  experienceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  service: {
    fontSize: 14,
    color: '#505F79',
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  price: {
    fontSize: 15,
    color: '#2E5BFF',
    fontWeight: 'bold',
  },
  priceUnit: {
    fontSize: 13,
    color: '#8C95A6',
    marginLeft: 4,
  },
  arrowContainer: {
    padding: 8,
  },
});

export default ProfessionalCard;