import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AppText from '../components/AppText'; // Import your custom AppText
import { getAvatarUrl } from '../services/api'; // Import getAvatarUrl


const ProfessionalCard = ({ professional, onPress }) => {
  // Use a timestamp for cache-busting the avatar if it might change frequently
  // For a list, a static or less frequent timestamp might be okay unless avatars update often.
  const avatarTimestamp = React.useMemo(() => Date.now(), [professional.hasAvatar, professional.userIdForAvatar]);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {professional.hasAvatar && professional.userIdForAvatar ? (
        <Image source={{ uri: getAvatarUrl(professional.userIdForAvatar, avatarTimestamp) }} style={styles.avatarImage} />
      ) : (
        <View style={[styles.avatarPlaceholder, { backgroundColor: professional.bgColor || '#2E5BFF' }]}>
          <AppText style={styles.avatarText}>{professional.initial || 'P'}</AppText>
        </View>
      )}
      <View style={styles.info}>
        <AppText style={styles.name}>{professional.name || 'Unknown'}</AppText>
        <View style={styles.detailRow}>
          <Icon name="work" size={17} color="#8C95A6" />
          <AppText style={styles.designationText} bold>
            {professional.designation || professional.service || 'N/A'}
          </AppText>
        </View>
        <View style={styles.detailRow}>
          <Icon name="access-time" size={16} color="#8C95A6" />
          <AppText style={styles.experienceText}>{professional.experience || 'N/A'} years exp</AppText>
        </View>
        {/* Price information commented out
        <View style={styles.detailRow}>
          <Icon name="currency-rupee" size={16} color="#8C95A6" />
          <Text style={styles.detailText}>
            ₹{professional.price || 'N/A'}{' '}
            <Text style={styles.priceUnit}>{professional.priceUnit || ''}</Text>
          </Text>
        </View>
        */}
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
    borderColor: '#E0E0E0', // Slightly darker border
  },
  avatarPlaceholder: { // Renamed from avatar to avatarPlaceholder
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarImage: { // New style for actual image
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    backgroundColor: '#F0F0F0', // Background color while image loads
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    // fontWeight: '600', // Handled by AppText semiBold or bold prop
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    // fontWeight: '700', // Handled by AppText bold prop
    color: '#1A1A1A',
    marginBottom: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 18,
    color: '#505F79',
    // fontFamily: 'Poppins-Regular', // Handled by AppText
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
    designationText: { // New style for designation/service
    // fontWeight: 'bold', // Handled by AppText bold prop
    fontSize: 17,       // Slightly larger font size (adjust as needed)
    color: '#333333',   // Darker color for more prominence
    marginLeft: 8,
    flexShrink: 1, // Allow text to shrink if needed
  },
  experienceText: { // New style for experience
    // fontWeight: '400', // Handled by AppText
    fontSize: 14,
    color: '#505F79',
    marginLeft: 8,
    flexShrink: 1, // Allow text to shrink if needed
  },
  detailText: { // Kept for reference or if used elsewhere, but experienceText is more specific now
    fontSize: 18, // Original size
    color: '#505F79',
    // fontFamily: 'Poppins-Regular', // Handled by AppText
    marginLeft: 8,
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