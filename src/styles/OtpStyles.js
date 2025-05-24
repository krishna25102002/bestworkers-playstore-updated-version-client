import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  gradient: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 36,
    // fontWeight: '700', // Handled by AppText bold prop
    color: 'white',
    // fontFamily: 'Poppins-Bold', // Handled by AppText bold prop
    letterSpacing: 1.2,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 30,
    paddingHorizontal: 30,
    paddingVertical: 40,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 26,
    // fontWeight: '700', // Handled by AppText bold prop
    color: '#2c3e50',
    marginBottom: 5,
    // fontFamily: 'Poppins-Bold', // Handled by AppText bold prop
  },
  subtitleText: {
    fontSize: 15,
    color: '#7f8c8d',
    textAlign: 'center',
    // fontFamily: 'Poppins-Regular', // Handled by AppText
    // fontWeight: '400', // Handled by AppText
  },
  inputContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 12,
    // fontWeight: '600', // Handled by AppText semiBold prop
    color: '#7f8c8d',
    marginBottom: 8,
    letterSpacing: 0.5,
    // fontFamily: 'Poppins-SemiBold', // Handled by AppText semiBold prop
  },
  otpInput: {
    height: 60,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 24,
    color: '#2c3e50',
    borderWidth: 1,
    borderColor: '#ecf0f1',
    textAlign: 'center',
    letterSpacing: 10,
    fontFamily: 'Poppins-Medium', // Explicitly for TextInput (OTP input)
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
    // fontFamily: 'Poppins-Regular', // Handled by AppText
  },
  verifyButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2E5BFF',
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    // fontWeight: '600', // Handled by AppText semiBold prop
    letterSpacing: 0.5,
    // fontFamily: 'Poppins-SemiBold', // Handled by AppText semiBold prop
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  resendText: {
    color: '#7f8c8d',
    fontSize: 14,
    // fontFamily: 'Poppins-Regular', // Handled by AppText
  },
  resendLink: {
    color: '#2E5BFF',
    // fontWeight: '600', // Handled by AppText semiBold prop
    marginLeft: 5,
    // fontFamily: 'Poppins-SemiBold', // Handled by AppText semiBold prop
  },
  spamNoteText: {
  fontSize: 14, // Smaller font size for a note
  color: 'black', // A gold/yellowish color for a gentle warning/info
  // Or use a more muted color like: color: '#A0A0A0', 
  marginTop: 8,     // Space above the note
  textAlign: 'center', // Center the text
  paddingHorizontal: 10, // Add some horizontal padding if needed
  // fontFamily: 'Poppins-Regular', // Handled by AppText
},
});