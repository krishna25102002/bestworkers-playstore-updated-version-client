import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message'; // Import Toast
import { registerUser } from '../services/api';
import styles from '../styles/RegisterStyles';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    pin: '',
    confirmPin: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
      valid = false;
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits';
      valid = false;
    }

    if (!formData.pin.trim()) {
      newErrors.pin = 'PIN is required';
      valid = false;
    } else if (!/^\d{4}$/.test(formData.pin)) {
      newErrors.pin = 'PIN must be 4 digits';
      valid = false;
    }

    if (formData.pin !== formData.confirmPin) {
      newErrors.confirmPin = 'PINs do not match';
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      // Show toast for validation errors
      Toast.show({
        type: 'error',
        text1: 'Form Error',
        text2: 'Please fix the errors in the form',
        visibilityTime: 2500,
        position: 'top',
        topOffset: 70,
      });
    }

    return valid;
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await registerUser({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        pin: formData.pin,
        confirmPin: formData.confirmPin,
      });

      Toast.show({
        type: 'success',
        text1: 'Registration Successful',
        text2: response.message || 'Verify your email with OTP',
        visibilityTime: 2500,
        position: 'top',
        topOffset: 70,
        onHide: () => navigation.navigate('OTP', { email: formData.email }),
      });
    } catch (error) {
      console.log('Registration error details:', error);
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: error.message || error.error || 'Please try again',
        visibilityTime: 2500,
        position: 'top',
        topOffset: 70,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginNavigation = () => {
    Toast.show({
      type: 'info',
      text1: 'Go to Login',
      text2: 'Redirecting to login page...',
      visibilityTime: 2500,
      position: 'top',
      topOffset: 70,
      onHide: () => navigation.navigate('Login'),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a4b8c', '#2980b9', '#5dade2']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled">
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>BestWorkers</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.headerContainer}>
                <Text style={styles.welcomeText}>Create Account</Text>
                <Text style={styles.subtitleText}>
                  Fill in your details to get started
                </Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>FULL NAME</Text>
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  placeholder="Enter your full name"
                  placeholderTextColor="#bdc3c7"
                  value={formData.name}
                  onChangeText={(text) => handleChange('name', text)}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>EMAIL ADDRESS</Text>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="Enter your email"
                  placeholderTextColor="#bdc3c7"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => handleChange('email', text)}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>MOBILE NUMBER</Text>
                <TextInput
                  style={[styles.input, errors.mobile && styles.inputError]}
                  placeholder="Enter your 10-digit mobile number"
                  placeholderTextColor="#bdc3c7"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={formData.mobile}
                  onChangeText={(text) => handleChange('mobile', text)}
                />
                {errors.mobile && (
                  <Text style={styles.errorText}>{errors.mobile}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>CREATE 4-DIGIT PIN</Text>
                <TextInput
                  style={[styles.input, errors.pin && styles.inputError]}
                  placeholder="Enter 4-digit PIN"
                  placeholderTextColor="#bdc3c7"
                  keyboardType="number-pad"
                  secureTextEntry
                  maxLength={4}
                  value={formData.pin}
                  onChangeText={(text) => handleChange('pin', text)}
                />
                {errors.pin && <Text style={styles.errorText}>{errors.pin}</Text>}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>CONFIRM 4-DIGIT PIN</Text>
                <TextInput
                  style={[styles.input, errors.confirmPin && styles.inputError]}
                  placeholder="Confirm your 4-digit PIN"
                  placeholderTextColor="#bdc3c7"
                  keyboardType="number-pad"
                  secureTextEntry
                  maxLength={4}
                  value={formData.confirmPin}
                  onChangeText={(text) => handleChange('confirmPin', text)}
                />
                {errors.confirmPin && (
                  <Text style={styles.errorText}>{errors.confirmPin}</Text>
                )}
              </View>

              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleSubmit}
                activeOpacity={0.8}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.registerButtonText}>SIGN UP</Text>
                )}
              </TouchableOpacity>

              <View style={styles.loginTextContainer}>
                <Text style={styles.loginText}>Already have an account?</Text>
                <TouchableOpacity onPress={handleLoginNavigation}>
                  <Text style={styles.loginLink}>Log In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default RegisterScreen;