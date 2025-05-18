import {StyleSheet} from 'react-native';

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
    flex: 1,
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
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.white,
    marginLeft: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    margin: 16,
    paddingHorizontal: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchIcon: {
    marginRight: 10,
    color: COLORS.darkGray,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: COLORS.text,
    fontFamily: 'Roboto-Regular',
  },
  categoriesList: {
    flex: 1,
  },
  categoriesContainer: {
    paddingBottom: 20,
  },
  categorySection: {
    marginHorizontal: 16,
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
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    fontFamily: 'Roboto-Medium',
  },
  servicesList: {
    borderTopWidth: 1,
    borderTopColor: COLORS.gray,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray,
    backgroundColor: COLORS.lightGray,
  },
  serviceText: {
    fontSize: 16,
    color: COLORS.lightText,
    fontFamily: 'Roboto-Regular',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  noResultsText: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 20,
    fontFamily: 'Roboto-Medium',
  },
  noResultsSubtext: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginTop: 10,
    fontFamily: 'Roboto-Regular',
  },
  clearIcon: {
    padding: 5,
  },
  // In your HomeStyles.js
// ... other styles
serviceItem: {
  flexDirection: 'row',
  justifyContent: 'space-between', // This will push text to left and (count + icon) to right
  alignItems: 'center',
  paddingVertical: 15,
  paddingHorizontal: 20,
  borderBottomWidth: 1,
  borderBottomColor: '#eee', // Or your theme's separator color
},
serviceText: {
  fontSize: 16,
  color: '#333', // Or your theme's text color
},
serviceRightContainer: { // Optional: if you want to group count and icon
  flexDirection: 'row',
  alignItems: 'center',
},
serviceCount: {
  fontSize: 14,
  color: '#777', // Or your theme's secondary text color
  marginRight: 8, // Space between count and arrow icon
},
// ... other styles
});

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
  'others': 'home',
};

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