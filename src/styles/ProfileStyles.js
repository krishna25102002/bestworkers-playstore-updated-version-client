// ProfileScreen.styles.js
import { StyleSheet } from 'react-native';

const PRIMARY_COLOR = '#1a4b8c'; // Define the royal blue color

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FFFFFF',
    // fontWeight: '500', // Handled by AppText
  },
  header: {
    width: '100%',
    overflow: 'hidden',
  },
  gradientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 15,
    width: '100%',
    height: '100%',
  },
  headerTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    // fontFamily: 'Poppins-Bold', // Handled by <AppText bold>
  },
  menuButton: {
    padding: 5,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  profileSection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 25,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarInitial: {
    fontSize: 40,
    color: '#FFFFFF',
    // fontFamily: 'Poppins-Bold', // Handled by <AppText bold>
  },
  userName: {
    fontSize: 24,
    color: '#333333',
    // fontFamily: 'Poppins-Bold', // Handled by <AppText bold>
    marginBottom: 10,
  },
  userInfoContainer: {
    width: '100%',
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#606060',
    marginLeft: 10,
    // fontFamily: 'Poppins-Regular', // Handled by AppText
  },
  editProfileButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: PRIMARY_COLOR,
  },
  editProfileText: {
    fontSize: 14,
    color: PRIMARY_COLOR,
    // fontWeight: '500', // Handled by <AppText medium> or <AppText semiBold>
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    color: '#333333',
    // fontFamily: 'Poppins-Bold', // Handled by <AppText bold>
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    // fontFamily: 'Poppins-Regular', // Handled by AppText
    color: '#606060',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  professionBanner: {
    margin: 16,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  professionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 15,
  },
  professionTitle: {
    fontSize: 18,
    color: '#333333',
    // fontFamily: 'Poppins-Bold', // Handled by <AppText bold>
    marginBottom: 10,
  },
  professionText: {
    fontSize: 14,
    color: '#606060',
    // fontFamily: 'Poppins-Regular', // Handled by AppText
    lineHeight: 20,
    marginBottom: 20,
  },
  addProfessionButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gradientButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    // fontWeight: '600', // Handled by <AppText semiBold>
    marginRight: 8,
  },
  actionsContainer: {
    padding: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    color: '#333333',
    // fontFamily: 'Poppins-SemiBold', // Handled by <AppText semiBold>
    marginBottom: 3,
  },
  actionSubtitle: {
    fontSize: 13,
    // fontFamily: 'Poppins-Regular', // Handled by AppText
    color: '#888888',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 22,
    color: '#333',
    // fontFamily: 'Poppins-Bold', // Handled by <AppText bold>
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    // fontFamily: 'Poppins-Regular', // Handled by AppText
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    // fontWeight: '600', // Handled by <AppText semiBold>
  },
  // Styles for Image Preview Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)', // Darker overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '90%',
    height: '80%',
    borderRadius: 10, // Optional: if you want rounded corners for the preview
  },
  closeButton: {
    position: 'absolute',
    top: 40, // Adjust as needed
    right: 20, // Adjust as needed
    padding: 10,
    zIndex: 1, // Ensure it's above the image
  },
});