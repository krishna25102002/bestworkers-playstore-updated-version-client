import { BaseToast, ErrorToast } from 'react-native-toast-message';
import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  toastContainer: {
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    minHeight: 80, // Ensure enough space for text
  },
  successToast: {
    backgroundColor: '#2980b9', // Matches login gradient
    borderLeftColor: '#1a4b8c',
    borderLeftWidth: 5,
  },
  errorToast: {
    backgroundColor: '#e74c3c', // Standard red for errors
    borderLeftColor: '#c0392b',
    borderLeftWidth: 5,
  },
  infoToast: {
    backgroundColor: '#3498db', // Matches forgotPinText
    borderLeftColor: '#2980b9',
    borderLeftWidth: 5,
  },
  text1: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  text2: {
    fontSize: 14,
    color: '#f0f0f0',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
});

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={[styles.toastContainer, styles.successToast]}
      text1Style={styles.text1}
      text2Style={styles.text2}
      contentContainerStyle={{ paddingHorizontal: 15 }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={[styles.toastContainer, styles.errorToast]}
      text1Style={styles.text1}
      text2Style={styles.text2}
      contentContainerStyle={{ paddingHorizontal: 15 }}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={[styles.toastContainer, styles.infoToast]}
      text1Style={styles.text1}
      text2Style={styles.text2}
      contentContainerStyle={{ paddingHorizontal: 15 }}
    />
  ),
};

export default toastConfig;