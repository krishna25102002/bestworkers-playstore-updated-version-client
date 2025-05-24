import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, KeyboardAvoidingView, SafeAreaView, Alert, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { verifyOtp, resendOtp } from '../services/api';
import AppText from '../components/AppText'; // Import AppText
import styles from '../styles/OtpStyles';

const OtpScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  // const { email } = route.params || {};
  const { name, email, mobile, pin: userPin } = route.params || {}; // Renamed pin to userPin for clarity

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setResendDisabled(false);
    }
  }, [timer]);

  const handleOtpChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    if (numericValue.length <= 4) {
      setOtp(numericValue);
      setError('');
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 4) {
      setError('Please enter a 4-digit OTP');
      return;
    }
  
    setLoading(true);
    try {
      console.log("Verifying OTP:", otp, "for email:", email); // Debug log
      // Send all required data to the backend
      const response = await verifyOtp({
        name,
        email,
        mobile,
        pin: userPin, // Send the pin received from route params
        otp,
      });
      if (response.success) {
        console.log("OTP verification successful:", response); // Debug log
        // Store token securely
        // await SecureStore.setItemAsync('userToken', response.token);
        
        // Navigate to Home screen
        navigation.navigate('Login');
      } else {
        setError(response.error || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.log("OTP verification error:", error); // Debug log
      setError(error.message || error.error || 'An error occurred during verification');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await resendOtp({email});
      setTimer(30);
      setResendDisabled(true);
      setOtp('');
      setError('');
      Alert.alert('Success', 'New OTP has been sent to your email');
    } catch (error) {
      Alert.alert('Error', error.error || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a4b8c', '#2980b9', '#5dade2']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoid}
        >
          <View style={styles.logoContainer}>
            <AppText style={styles.logoText} bold>BestWorkers</AppText>
          </View>
          
          <View style={styles.formContainer}>
            <View style={styles.headerContainer}>
              <AppText style={styles.welcomeText} bold>Verify OTP</AppText>
              <AppText style={styles.subtitleText}>
                We've sent a 4-digit OTP to {email || 'your email'}
              </AppText>
            </View>
            
            <View style={styles.inputContainer}>
              <AppText style={styles.label} semiBold>ENTER OTP</AppText>
              <TextInput
                style={styles.otpInput}
                placeholder="----"
                placeholderTextColor="#bdc3c7"
                keyboardType="number-pad"
                maxLength={4}
                value={otp}
                onChangeText={handleOtpChange}
              />
               <AppText style={styles.spamNoteText}>
                * If you don't see the OTP, please check your spam or junk folder.
              </AppText>
              {error ? <AppText style={styles.errorText}>{error}</AppText> : null}
            </View>
            
            <TouchableOpacity 
              style={styles.verifyButton}
              onPress={handleVerify}
              activeOpacity={0.8}
              disabled={loading}
            >
              <AppText style={styles.verifyButtonText} semiBold>
                {loading ? 'VERIFYING...' : 'VERIFY'}
              </AppText>
            </TouchableOpacity>
            
            <View style={styles.resendContainer}>
              <AppText style={styles.resendText}>Didn't receive OTP?</AppText>
              <TouchableOpacity 
                onPress={handleResend} 
                disabled={resendDisabled || resendLoading}
              >
                <AppText style={[
                  styles.resendLink,
                  (resendDisabled || resendLoading) && { color: '#bdc3c7' }
                ]} semiBold>
                  {resendLoading ? 'SENDING...' : 
                   resendDisabled ? `Resend (${timer}s)` : 'Resend'}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default OtpScreen;