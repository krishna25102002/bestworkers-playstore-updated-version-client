import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 60,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  header: {
    fontSize: 20,
    // fontWeight: '700', // Handled by <AppText bold>
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 25,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0', // Placeholder background
    marginBottom: 10,
    position: 'relative', // For camera icon overlay
    borderWidth: 2,
    borderColor: '#1E40AF',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
  },
  cameraIconOverlay: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#1E40AF',
    padding: 8,
    borderRadius: 15,
  },
  changeAvatarText: {
    color: '#1E40AF',
    fontSize: 15,
    // fontWeight: '500', // Handled by AppText
    textDecorationLine: 'underline',
  },
  sectionHeader: {
    fontSize: 20,
    // fontWeight: '600', // Handled by <AppText semiBold>
    marginTop: 15,
    marginBottom: 10,
    color: '#1E40AF', // Royal blue color for section headers
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(30, 64, 175, 0.3)',
    paddingBottom: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    color: '#333',
    // fontWeight: '500', // Handled by <AppText medium>
  },
  input: {
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    fontFamily: 'Poppins-Regular', // For TextInput
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  dropdown: {
    height: 45,
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dropdownFocus: {
    borderColor: '#1E40AF',
    borderWidth: 2,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#94A3B8',
    fontFamily: 'Poppins-Regular',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
  },
  icon: {
    marginRight: 10,
    color: '#1E40AF',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 2,
    marginRight: 10,
  },
  priceDropdown: {
    flex: 1,
  },
  radioContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioOuter: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#1E40AF',
  },
  radioSelected: {
    borderColor: '#1E40AF',
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
    // fontFamily: 'Poppins-Regular', // Handled by AppText
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
    // fontFamily: 'Poppins-Regular', // Handled by AppText
    flex: 1,
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  submitButtonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    // fontWeight: '600', // Handled by <AppText semiBold>
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 14,
    // fontFamily: 'Poppins-Regular', // Handled by AppText
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    textAlign: 'center', 
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalIcon: {
    marginBottom: 20,
    color: '#1E40AF',
  },
  modalTitle: {
    fontSize: 22,
    // fontWeight: '700', // Handled by <AppText bold>
    marginBottom: 10,
    color: '#1E40AF',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    // fontFamily: 'Poppins-Regular', // Handled by AppText
    textAlign: 'center',
    color: '#666',
  },
  modalButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  modalButtonGradient: {
    padding: 14,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    // fontWeight: '600', // Handled by <AppText semiBold>
  },
  inputWithIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA', // Match your input background
    borderColor: '#E2E8F0',    // Match your input border color
    borderWidth: 1,
    borderRadius: 12,           // Match your input border radius
    paddingHorizontal: 10,     // Add some padding
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 10, // Space between icon and text input
    color: '#1E40AF', // Match icon color from dropdowns
  },
  inputWithIcon: { // Style for the TextInput itself when inside inputWithIconContainer
    flex: 1,
    paddingVertical: 14, // Match your input padding
    fontSize: 16,        // Match your input font size
    color: '#333',       // Match your input text color
    fontFamily: 'Poppins-Regular', // For TextInput
    borderWidth: 0,      // Remove individual border as container has it
    backgroundColor: 'transparent', // Ensure TextInput bg is transparent
    // height: '100%', // Ensure it takes full height of container if needed
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
});

export default styles;