// src/styles/LoginStyles.js
import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 60 : 40,
    marginBottom: 20,
  },
  logoText: {
    fontSize: 36,
    // fontWeight: '700', // Handled by AppText bold prop
    color: 'white',
    // fontFamily: 'Poppins-Bold', // Handled by AppText bold prop
    letterSpacing: 1.2,
  },
  logoSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
    // fontFamily: 'Poppins-Light', // Handled by AppText light prop
    // fontWeight: '300', // Handled by AppText light prop
    letterSpacing: 0.5,
  },
  formContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 50,
    flex: 1,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  headerContainer: {
    marginBottom: 30,
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
    // fontFamily: 'Poppins-Regular', // Handled by AppText
    // fontWeight: '400', // Handled by AppText
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 12,
    // fontWeight: '600', // Handled by AppText semiBold prop
    color: '#7f8c8d',
    marginBottom: 8,
    letterSpacing: 0.5,
    // fontFamily: 'Poppins-SemiBold', // Handled by AppText semiBold prop
  },
  input: {
    height: 56,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#2c3e50',
    borderWidth: 1,
    borderColor: '#ecf0f1',
    fontFamily: 'Poppins-Regular', // Explicitly for TextInput
  },
  forgotPin: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPinText: {
    color: '#3498db',
    fontSize: 14,
    // fontWeight: '600', // Handled by AppText semiBold prop
    // fontFamily: 'Poppins-SemiBold', // Handled by AppText semiBold prop
  },
  loginButton: {
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    // fontWeight: '600', // Handled by AppText semiBold prop
    letterSpacing: 0.5,
    // fontFamily: 'Poppins-SemiBold', // Handled by AppText semiBold prop
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ecf0f1',
  },
  dividerText: {
    paddingHorizontal: 10,
    color: '#bdc3c7',
    // fontWeight: '600', // Handled by AppText semiBold prop
    fontSize: 12,
    // fontFamily: 'Poppins-SemiBold', // Handled by AppText semiBold prop
  },
  createAccountButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#3498db',
  },
  createAccountButtonText: {
    color: '#3498db',
    fontSize: 15,
    // fontWeight: '600', // Handled by AppText semiBold prop
    letterSpacing: 0.5,
    // fontFamily: 'Poppins-SemiBold', // Handled by AppText semiBold prop
  },
});