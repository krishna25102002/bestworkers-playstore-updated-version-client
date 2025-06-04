import {StyleSheet, Platform} from 'react-native';

// Color palette
const COLORS = {
  primary: '#1a4b8c',
  primaryLight: '#2980b9',
  primaryLighter: '#5dade2',
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  gray: '#E0E0E0',
  darkGray: '#777',
  text: '#333',
  lightText: '#444',
};

export const styles = StyleSheet.create({
  safeArea: {
    flex: 2,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    // fontWeight: '700', // Poppins-Bold will be applied by AppText
    color: COLORS.white,
    marginLeft: 20,
    // fontFamily: 'Poppins-Bold', // No longer needed if using <AppText bold>
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12, // Match ProfessionalCard borderRadius
    paddingHorizontal: 12, // Adjusted padding
    paddingVertical: Platform.OS === 'ios' ? 10 : 6, // Adjusted padding
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 15,
    // Shadow properties similar to ProfessionalCard
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1, // Add border
    borderColor: '#E0E0E0', // Border color similar to ProfessionalCard
  },
  searchIcon: {
    color: '#666666', // Slightly darker icon
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    fontFamily: 'Poppins-Regular', // Explicitly set Poppins for TextInput
    paddingVertical: Platform.OS === 'ios' ? 4 : 2, // Fine-tune for vertical centering
  },
  categoriesList: {
    flex: 1,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  professionalsContainer: { // New style for the list of professionals
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  categorySection: {
    marginHorizontal: 0, // Removed horizontal margin here, added to categoriesContainer
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
  },
  categoryIconContainer: {
    backgroundColor: COLORS.primary,
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  categoryTitle: {
    fontSize: 15,
    // fontWeight: '600', // Poppins-SemiBold will be applied by AppText
    color: COLORS.text,
    flexShrink: 1, // Allow title to shrink if categoryTextAndCountContainer is constrained
  },
  categoryTextAndCountContainer: { // New style for title and category count
    flex: 1, // This container will now only hold the title and take available space
    marginRight: 8, // Space between the title container and the count/chevron group
    justifyContent: 'center', // Center title vertically if it's shorter than container
  },
  categoryCountText: { // New style for the category count
    fontSize: 15,
    // fontWeight: '500', // AppText will handle this via <AppText medium> or similar
    color: COLORS.darkGray,
    // No marginRight here, chevronIconStyle will handle spacing
  },
  countAndChevronContainer: { // New container for count and chevron
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevronIconStyle: { // Style for the chevron icon
    marginLeft: 5, // Space between count text and chevron icon
  },
  servicesList: {
    borderTopWidth: 1,
    borderTopColor: COLORS.gray,
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between', // This will push text to left and (count + icon) to right
    alignItems: 'center',
    paddingVertical: 15, // Adjusted from 16
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee', // Or your theme's separator color // Adjusted from COLORS.gray
    backgroundColor: COLORS.lightGray, // Added for consistency if needed
  },
  serviceText: {
    fontSize: 15,
    //fontWeight: '500', // Poppins-Medium will be applied by AppText,
    color: '#333', // Or your theme's text color // Adjusted from COLORS.lightText
    // fontFamily: 'Poppins-Regular', // No longer needed if using <AppText>
  },
  serviceRightContainer: { // Optional: if you want to group count and icon
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceCount: {
    fontSize: 14,
    color: '#777', // Or your theme's secondary text color
    marginRight: 8, // Space between count and arrow icon
    // fontFamily: 'Poppins-Regular', // Apply if AppText is not used directly for this count
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  noResultsText: {
    fontSize: 22,
    // fontWeight: '600', // Poppins-SemiBold will be applied by AppText
    color: COLORS.text,
    marginTop: 20,
    // fontFamily: 'Poppins-SemiBold', // No longer needed if using <AppText semiBold>
  },
  noResultsSubtext: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginTop: 10,
    textAlign: 'center', // Center the subtext
    paddingHorizontal: 20, // Add some padding
    // fontFamily: 'Poppins-Regular', // No longer needed if using <AppText>
  },
  clearIcon: {
    padding: 5,
  },
  fullPageLoaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white, // Or your app's background color
  },
  fullPageLoaderText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.primary,
    // fontFamily: 'Poppins-Medium', // Or your desired Poppins weight
  },
});

// Note: The categoryIcons and serviceData objects are also part of this file,
// but they are not part of the StyleSheet.create object itself.
// They are separate exports.


export const categoryIcons = {
  'Household Services': 'home',
  'Mechanics & Vehicle Services': 'directions-car',
  'Construction & Skilled Labor': 'construction',
  'Textile & Weaving Industry': 'content-cut',
  'Hotel & Catering Services': 'restaurant',
  'Sales & Retail': 'shopping-cart',
  'Medical & Hospital Services': 'local-hospital',
  'Security & Maintenance': 'security',
  'Logistics & Delivery': 'local-shipping',
  'Beauty & Grooming': 'spa',
  'Teaching & Education': 'school',
  'Banking & Office Jobs': 'business-center',
  'North Indian Workers': 'group-work',
  'Village & Agricultural Workers': 'eco',
  'others': 'home', // Default icon for 'others' if it were a category
};

// This serviceData object seems to be a duplicate or outdated version of what's in staticData.js.
// It's generally better to keep such data in one place (like staticData.js) to avoid inconsistencies.
// I'm keeping it here as it was in the provided file, but you might want to remove it if it's redundant.
export const serviceData = {
  'Household Services': [
    'Plumber',
    'Electrician',
    'Carpenter',
    'AC Service',
    'Washing Machine Service',
    'TV Service',
    'Painters',
    'Garden Maintainer',
    'others',
  ],
  'Mechanics & Vehicle Services': [
    'Auto Mechanic',
    'Two-Wheeler Mechanic',
    'Car Mechanic',
    'Lorry/Bus Mechanic',
    'others',
  ],
  'Construction & Skilled Labor': [
    'Masons',
    'Mason Helpers',
    'Welders',
    'Tiles Workers',
    'Lathe Turners',
    'CNC/VMC Operators',
    'others',
  ],
  'Textile & Weaving Industry': [
    'Power Loom Weavers',
    'Auto Loom Weavers',
    'Spinning OE Workers',
    'Garment Workers',
    'Tailors',
    'others',

  ],
  'Hotel & Catering Services': [
    'Tea Master Suppliers',
    'Hotel Master Suppliers',
    'others',

  ],
  'Sales & Retail': ['Sales Girls/Women', 'Sales Men/Boys'],
  'Medical & Hospital Services': ['Lab Technicians', 'Hospital Cleaners'],
  'Security & Maintenance': ['Security Guards', 'Load Men'],
  'Logistics & Delivery': ['Drivers', 'Delivery Boys (for all categories)'],
  'Beauty & Grooming': ["Men's Beauticians", "Women's Beauticians", 'Barbers'],
  'Teaching & Education': [
    'Teachers (All subjects & levels)',
    'Sports Instructors',
    'others',

  ],
  'Banking & Office Jobs': ['Bank Staff'],
  'North Indian Workers': [
    'Masons',
    'Mason Helpers',
    'Welders',
    'Painters',
    'Load Men',
    'Garment Workers',
    'Tailors',
    'Hotel Workers',
    'Security Guards',
    'Delivery Workers',
    'Construction Workers',
    'others',

  ],
  'Village & Agricultural Workers': ['Village Field Workers', 'Farm Laborers','others'],

};




// import {StyleSheet} from 'react-native';

// // Color palette
// const COLORS = {
//   primary: '#1a4b8c',
//   primaryLight: '#2980b9',
//   primaryLighter: '#5dade2',
//   white: '#FFFFFF',
//   lightGray: '#F5F5F5',
//   gray: '#E0E0E0', 
//   darkGray: '#777',
//   text: '#333',
//   lightText: '#444',
// };

// export const styles = StyleSheet.create({
//   safeArea: {
//     flex: 2,
//     backgroundColor: COLORS.white,
//   },
//   header: {
//     backgroundColor: COLORS.primary,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 15,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//   },
//   headerTitle: {
//     fontSize: 22,
//     // fontWeight: '700',
//     color: COLORS.white,
//     marginLeft: 20,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.white,
//     borderRadius: 10,
//     margin: 16,
//     paddingHorizontal: 15,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 1},
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//   },
//   searchIcon: {
//     marginRight: 10,
//     color: COLORS.darkGray,
//   },
//   searchInput: {
//     flex: 1,
//     height: 50,
//     fontSize: 16,
//     color: COLORS.text,
//     fontFamily: 'Roboto-Regular',
//   },
//   categoriesList: {
//     flex: 1,
//   },
//   categoriesContainer: {
//     paddingBottom: 20,
//   },
//   categorySection: {
//     marginHorizontal: 16,
//     marginBottom: 15,
//     borderRadius: 10,
//     overflow: 'hidden',
//     backgroundColor: COLORS.white,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 1},
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//   },
//   categoryHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: COLORS.white,
//   },
//   categoryIconContainer: {
//     backgroundColor: COLORS.primary,
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   categoryTitle: {
//     // flex: 1,
//     fontSize: 18,
//     fontWeight: '600',
//     color: COLORS.text,
//     fontFamily: 'poppins',
//     flexShrink: 1, // Allow title to shrink if categoryTextAndCountContainer is constrained
//     marginRight: 5, // Add a small margin between title and count
//     // Add these to ensure single line and ellipsis for very long titles
//     numberOfLines: 1,
//     ellipsizeMode: 'tail',
//   },

//   servicesList: {
//     borderTopWidth: 1,
//     borderTopColor: COLORS.gray,
//   },
//   serviceItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 16,
//     paddingHorizontal: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.gray,
//     backgroundColor: COLORS.lightGray,
//   },
//   serviceText: {
//     fontSize: 16,
//     color: COLORS.lightText,
//     fontFamily: 'Roboto-Regular',
//   },
//   noResultsContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingBottom: 50,
//   },
//   noResultsText: {
//     fontSize: 22,
//     fontWeight: '600',
//     color: COLORS.text,
//     marginTop: 20,
//     fontFamily: 'Roboto-Medium',
//   },
//   noResultsSubtext: {
//     fontSize: 16,
//     color: COLORS.darkGray,
//     marginTop: 10,
//     fontFamily: 'Roboto-Regular',
//   },
//   clearIcon: {
//     padding: 5,
//   },
//   // In your HomeStyles.js
// // ... other styles
// serviceItem: {
//   flexDirection: 'row',
//   justifyContent: 'space-between', // This will push text to left and (count + icon) to right
//   alignItems: 'center',
//   paddingVertical: 15,
//   paddingHorizontal: 20,
//   borderBottomWidth: 1,
//   borderBottomColor: '#eee', // Or your theme's separator color
// },
// serviceText: {
//   fontSize: 16,
//   color: '#333', // Or your theme's text color
// },
// serviceRightContainer: { // Optional: if you want to group count and icon
//   flexDirection: 'row',
//   alignItems: 'center',
// },
// serviceCount: {
//   fontSize: 14,
//   color: '#777', // Or your theme's secondary text color
//   marginRight: 8, // Space between count and arrow icon
// },
// // ... other styles
// categoryTextAndCountContainer: { // New style for title and category count
//   flex: 1, // Allows this container to take available space
//   flexDirection: 'row',
//   alignItems: 'center', // Vertically align title and count
//   marginRight: 8, // Add some margin to prevent overlap with the arrow icon
//   overflow: 'hidden',
// },
// categoryCountText: { // New style for the category count
//   // marginLeft: 8,
//   fontSize: 15,
//   fontWeight: '500',
//   color: COLORS.darkGray, 
// },
// });

// export const categoryIcons = {
//   'Household Services': 'home',
//   'Mechanics & Vehicle Services': 'directions-car',
//   'Construction & Skilled Labor': 'construction',
//   'Textile & Weaving Industry': 'content-cut',
//   'Hotel & Catering Services': 'restaurant',
//   'Sales & Retail': 'shopping-cart',
//   'Medical & Hospital Services': 'local-hospital',
//   'Security & Maintenance': 'security',
//   'Logistics & Delivery': 'local-shipping',
//   'Beauty & Grooming': 'spa',
//   'Teaching & Education': 'school',
//   'Banking & Office Jobs': 'business-center',
//   'North Indian Workers': 'group-work',
//   'Village & Agricultural Workers': 'eco',
//   'others': 'home',
// };

// export const serviceData = {
//   'Household Services': [
//     'Plumber',
//     'Electrician',
//     'Carpenter',
//     'AC Service',
//     'Washing Machine Service',
//     'TV Service',
//     'Painters',
//     'Garden Maintainer',
//     'others',
//   ],
//   'Mechanics & Vehicle Services': [
//     'Auto Mechanic',
//     'Two-Wheeler Mechanic',
//     'Car Mechanic',
//     'Lorry/Bus Mechanic',
//     'others',
//   ],
//   'Construction & Skilled Labor': [
//     'Masons',
//     'Mason Helpers',
//     'Welders',
//     'Tiles Workers',
//     'Lathe Turners',
//     'CNC/VMC Operators',
//     'others',
//   ],
//   'Textile & Weaving Industry': [
//     'Power Loom Weavers',
//     'Auto Loom Weavers',
//     'Spinning OE Workers',
//     'Garment Workers',
//     'Tailors',
//     'others',

//   ],
//   'Hotel & Catering Services': [
//     'Tea Master Suppliers',
//     'Hotel Master Suppliers',
//     'others',

//   ],
//   'Sales & Retail': ['Sales Girls/Women', 'Sales Men/Boys'],
//   'Medical & Hospital Services': ['Lab Technicians', 'Hospital Cleaners'],
//   'Security & Maintenance': ['Security Guards', 'Load Men'],
//   'Logistics & Delivery': ['Drivers', 'Delivery Boys (for all categories)'],
//   'Beauty & Grooming': ["Men's Beauticians", "Women's Beauticians", 'Barbers'],
//   'Teaching & Education': [
//     'Teachers (All subjects & levels)',
//     'Sports Instructors',
//     'others',

//   ],
//   'Banking & Office Jobs': ['Bank Staff'],
//   'North Indian Workers': [
//     'Masons',
//     'Mason Helpers',
//     'Welders',
//     'Painters',
//     'Load Men',
//     'Garment Workers',
//     'Tailors',
//     'Hotel Workers',
//     'Security Guards',
//     'Delivery Workers',
//     'Construction Workers',
//     'others',

//   ],
//   'Village & Agricultural Workers': ['Village Field Workers', 'Farm Laborers','others'],

// };