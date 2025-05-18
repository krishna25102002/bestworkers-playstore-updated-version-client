import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProfessionalCard = ({ professional, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.avatar, { backgroundColor: professional.bgColor || '#2E5BFF' }]}>
        <Text style={styles.avatarText}>{professional.initial || 'P'}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{professional.name || 'Unknown'}</Text>
        <View style={styles.detailRow}>
          <Icon name="work" size={16} color="#8C95A6" />
          <Text style={styles.detailText}>
            {professional.service === 'Explore others' && professional.designation
              ? professional.designation
              : professional.service || 'N/A'}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="access-time" size={16} color="#8C95A6" />
          <Text style={styles.detailText}>{professional.experience || 'N/A'} years exp</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="currency-rupee" size={16} color="#8C95A6" />
          <Text style={styles.detailText}>
            ₹{professional.price || 'N/A'}{' '}
            <Text style={styles.priceUnit}>{professional.priceUnit || ''}</Text>
          </Text>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F5F5F7',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#505F79',
    marginLeft: 8,
  },
  priceUnit: {
    fontSize: 12,
    color: '#8C95A6',
  },
  arrowContainer: {
    padding: 8,
    justifyContent: 'center',
  },
});

export default ProfessionalCard;

// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const ProfessionalCard = ({ professional, onPress }) => {
//   return (
//     <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
//       <View style={[styles.avatar, { backgroundColor: professional.bgColor }]}>
//         <Text style={styles.avatarText}>{professional.initial}</Text>
//       </View>
//       <View style={styles.info}>
//         <Text style={styles.name}>{professional.name}</Text>
//         <View style={styles.locationContainer}>
//           <Icon name="location-on" size={14} color="#8C95A6" />
//           <Text style={styles.city}>{professional.city}</Text>
//         </View>
//         <View style={styles.experienceContainer}>
//           <Icon name="work" size={14} color="#8C95A6" />
//           <Text style={styles.service}>{professional.experience} years experience</Text>
//         </View>
//         <View style={styles.priceContainer}>
//           <Text style={styles.price}>₹{professional.price}</Text>
//           <Text style={styles.priceUnit}>{professional.priceUnit}</Text>
//         </View>
//       </View>
//       <View style={styles.arrowContainer}>
//         <Icon name="arrow-forward-ios" size={16} color="#2E5BFF" />
//       </View>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.06,
//     shadowRadius: 4,
//     elevation: 2,
//     borderWidth: 1,
//     borderColor: '#F0F0F5',
//   },
//   avatar: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   avatarText: {
//     color: 'white',
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   info: {
//     flex: 1,
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 4,
//   },
//   locationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 2,
//   },
//   city: {
//     fontSize: 14,
//     color: '#505F79',
//     marginLeft: 4,
//   },
//   experienceContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 2,
//   },
//   service: {
//     fontSize: 14,
//     color: '#505F79',
//     marginLeft: 4,
//   },
//   priceContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 4,
//   },
//   price: {
//     fontSize: 15,
//     color: '#2E5BFF',
//     fontWeight: 'bold',
//   },
//   priceUnit: {
//     fontSize: 13,
//     color: '#8C95A6',
//     marginLeft: 4,
//   },
//   arrowContainer: {
//     padding: 8,
//   },
// });

// export default ProfessionalCard;