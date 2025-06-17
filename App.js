// Gunakan polyfill URL & URLSearchParams yang aman untuk React Native (Hermes compatible)
import 'react-native-url-polyfill/auto';

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { registerRootComponent } from 'expo';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};
registerRootComponent(App); // ✅ Ini saja cukup di proyek Expo
export default App;