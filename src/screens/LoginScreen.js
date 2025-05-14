import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message'; // Import Toast
import { loginUser } from '../services/api';
import styles from '../styles/LoginStyles';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }], // Or 'Home' if 'Main' is your root stack for logged-in users
          });
        } else {
          // Optional welcome toast on screen load, no navigation on hide
          Toast.show({
            type: 'info',
            text1: 'Welcome to BestWorkers',
            text2: 'Sign in to find top talent!',
            visibilityTime: 2500,
            position: 'top',
            topOffset: 70,
          });
        }
      } catch (error) {
        console.error('Error checking token:', error);
      }
    };

    checkToken();
  }, [navigation]);

  const handleLogin = async () => {
    if (!email || !pin) {
      Toast.show({
        type: 'error',
        text1: 'Missing Details',
        text2: 'Please enter both email and PIN',
        visibilityTime: 2500,
        position: 'top',
        topOffset: 70,
      });
      return;
    }

    if (pin.length !== 4) {
      Toast.show({
        type: 'error',
        text1: 'Invalid PIN',
        text2: 'PIN must be 4 digits',
        visibilityTime: 2500,
        position: 'top',
        topOffset: 70,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser({ email, pin });

      // Store all user data in AsyncStorage
      await AsyncStorage.multiSet([
        ['userToken', response.token],
        ['userID', response.data.id],
        ['isProfession', String(response.data.isProfession)],
        ['lastActiveTime', new Date().getTime().toString()], // Store last active time
      ]);

      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: 'Welcome to BestWorkers!',
        visibilityTime: 2500,
        position: 'top',
        topOffset: 70,
        onHide: () => navigation.reset({ // Reset stack after successful login
          index: 0,
          routes: [{ name: 'Main' }],
        }),
      });
    } catch (error) {
      console.error('Login error:', error);
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.error || 'Invalid credentials',
        visibilityTime: 2500,
        position: 'top',
        topOffset: 70,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    Toast.show({
      type: 'info',
      text1: 'Create Account',
      text2: 'Redirecting to registration...',
      visibilityTime: 2500,
      position: 'top',
      topOffset: 70,
      onHide: () => navigation.navigate('Register'), // Navigate after toast
    });
  };

  const handleForgotPin = () => {
    Toast.show({
      type: 'info',
      text1: 'Forgot PIN',
      text2: 'Please contact support to reset your PIN',
      visibilityTime: 2500,
      position: 'top',
      topOffset: 70,
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
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>BestWorkers</Text>
              <Text style={styles.logoSubtext}>Excellence in Every Task</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.headerContainer}>
                <Text style={styles.welcomeText}>Welcome Back</Text>
                <Text style={styles.subtitleText}>
                  Sign in to access your account
                </Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>EMAIL ADDRESS</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#bdc3c7"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>PIN</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your 4-digit PIN"
                  placeholderTextColor="#bdc3c7"
                  keyboardType="number-pad"
                  secureTextEntry
                  maxLength={4}
                  value={pin}
                  onChangeText={setPin}
                />
              </View>

              <TouchableOpacity
                style={styles.forgotPin}
                onPress={handleForgotPin}>
                <Text style={styles.forgotPinText}>Forgot your PIN?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                activeOpacity={0.8}
                disabled={loading}>
                <LinearGradient
                  colors={['#1a4b8c', '#2980b9']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}>
                  <Text style={styles.loginButtonText}>
                    {loading ? 'LOGGING IN...' : 'LOG IN'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={styles.createAccountButton}
                onPress={handleCreateAccount}
                activeOpacity={0.8}>
                <Text style={styles.createAccountButtonText}>
                  CREATE NEW ACCOUNT
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default LoginScreen;
