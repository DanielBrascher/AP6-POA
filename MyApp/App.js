import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes/AppRoutes.js';

export default function App() {
  return (
    <NavigationContainer>
      <Routes />
    </NavigationContainer>
  );
}