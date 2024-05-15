import React from 'react';
import { MyContextControllerProvider } from './src/store';
import { NavigationContainer } from '@react-navigation/native';
import Router from './src/screens/Router';
import { PaperProvider } from 'react-native-paper';

export default function App() {
  return (
    <MyContextControllerProvider>
      <PaperProvider>
        <NavigationContainer>
          <Router />
        </NavigationContainer>
      </PaperProvider>
    </MyContextControllerProvider>
  );
}
