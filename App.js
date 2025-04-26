import React from 'react';
import { StatusBar } from 'react-native';
import Toast from 'react-native-toast-message'; // Import Toast
import AppNavigator from './src/navigation/AppNavigator';
import toastConfig from './src/utils/toastConfig'; // Import custom toast config (created later)

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#2E5BFF" />
      <AppNavigator />
      <Toast config={toastConfig} /> {/* Add Toast with custom config */}
    </>
  );
};

export default App;