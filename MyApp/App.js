// App.js
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native'; // 1. Importe o DarkTheme aqui
import { theme } from './src/styles/theme';
import Routes from './src/routes';

// 2. Atualize o AppTheme herdando o DarkTheme padrão
const AppTheme = {
  ...DarkTheme, // Isso traz as fontes ('regular', 'bold', etc.) e outras configs automáticas da v7
  colors: {
    ...DarkTheme.colors, // Mantém os fallbacks do tema dark
    primary: theme.colors.primary,
    background: theme.colors.background,
    card: theme.colors.surface,
    text: theme.colors.text,
    border: theme.colors.border,
    notification: theme.colors.primary,
  },
};

export default function App() {
  return (
    <NavigationContainer theme={AppTheme}>
      <StatusBar style="light" />
      <Routes />
    </NavigationContainer>
  );
}