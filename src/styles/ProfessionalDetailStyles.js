import { StyleSheet } from 'react-native';

const PRIMARY_COLOR = '#1a4b8c'; // Royal blue

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  avatarImageLarge: { // Style for the larger avatar image on this screen
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 16,
    backgroundColor: '#F0F0F0', // Placeholder while image loads
  },
  avatarLetter: {
    color: 'white',
    fontSize: 35,
    // fontWeight: 'bold', // Handled by AppText
  },
  profileName: {
    fontSize: 24,
    color: '#333',
    // fontFamily: 'Poppins-Bold', // Handled by AppText
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  badge: {
    backgroundColor: '#EBF0FF',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  badgeText: { // Consider if this should also be PRIMARY_COLOR or a contrasting color
    color: PRIMARY_COLOR, // Changed to primary, adjust if contrast is an issue
    fontSize: 14,
    // fontWeight: '500', // Handled by <AppText medium>
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  statText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#505F79', // Handled by <AppText medium>
    // fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#F0F0F0',
  },
  pricingCard: {
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  pricingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pricingTitle: {
    fontSize: 16,
    color: '#505F79',
    // fontFamily: 'Poppins-Bold', // Handled by AppText
  },
  priceBadge: {
    backgroundColor: '#EEFBF5',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  priceBadgeText: {
    color: '#36B37E',
    fontSize: 12,
    // fontWeight: 'bold', // Handled by AppText
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceValue: {
    fontSize: 26,
    color: PRIMARY_COLOR,
    // fontFamily: 'Poppins-Bold', // Handled by AppText
  },
  priceUnit: {
    fontSize: 16,
    color: '#8C95A6',
    marginLeft: 4,
  },
  section: {
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#333',
    // fontFamily: 'Poppins-Bold', // Handled by AppText
    marginBottom: 6,
    marginLeft: 4,
  },
  locationCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 13,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationTitle: {
    fontSize: 16,
    color: '#505F79',
    // fontFamily: 'Poppins-Bold', // Handled by AppText
    marginLeft: 8,
  },
  locationText: {
    fontSize: 15,
    color: '#505F79',
    // fontFamily: 'Poppins-Regular', // Handled by AppText
    lineHeight: 22,
  },
  detailItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  detailTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  detailTitle: {
    fontSize: 14,
    color: '#8C95A6',
    // fontFamily: 'Poppins-Regular', // Handled by AppText
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#505F79',
    // fontFamily: 'Poppins-Regular', // Handled by AppText
  },
  importantValue: {
    color: PRIMARY_COLOR,
    // fontWeight: 'bold', // Handled by AppText with bold prop
  },
  comingSoonContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  comingSoonText: {
    fontSize: 18,
    color: '#333',
    // fontFamily: 'Poppins-Bold', // Handled by AppText
    marginTop: 16,
  },
  comingSoonSubtext: {
    fontSize: 14,
    // fontFamily: 'Poppins-Regular', // Handled by AppText
    color: '#8C95A6',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    marginTop: 8,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY_COLOR, // Default contact button to primary
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 6,
    justifyContent: 'center',
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  callButton: {
    backgroundColor: '#36B37E',
    shadowColor: '#36B37E', // Kept green shadow for call button
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    // fontWeight: 'bold', // Handled by AppText
    marginLeft: 8,
  },
  // Styles for Image Preview Modal (can be similar to ProfileStyles)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '90%',
    height: '80%',
    borderRadius: 10,
  },
  closeButton: { // Can be the same as in ProfileStyles or customized
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
    zIndex: 1,
  },
});

export default styles;