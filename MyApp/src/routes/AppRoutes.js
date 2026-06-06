import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importando as telas que você criou
import FeedScreen from '../screens/FeedScreen';
import CheckInScreen from '../screens/CheckInScreen';

const Tab = createBottomTabNavigator();

export default function Routes() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Esconde a barra superior padrão
        tabBarStyle: {
          backgroundColor: '#202024', // Fundo dark combinando com as telas
          borderTopColor: '#29292E',
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
        },
        tabBarActiveTintColor: '#00B37E', // Cor do texto/ícone ativo (Verde FocusRats)
        tabBarInactiveTintColor: '#7C7C8A', // Cor do texto/ícone inativo
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen 
        name="Feed" 
        component={FeedScreen} 
        options={{
          tabBarLabel: 'Feed',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.iconStyle, focused && styles.iconActive]}>
              {focused ? '🔥' : '💬'}
            </Text>
          ),
        }}
      />
      
      <Tab.Screen 
        name="CheckIn" 
        component={CheckInScreen} 
        options={{
          tabBarLabel: 'Check-in',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.iconStyle, focused && styles.iconActive]}>
              {focused ? '💪' : '➕'}
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconStyle: {
    fontSize: 20,
    opacity: 0.5, // Deixa o emoji inativo mais discreto
  },
  iconActive: {
    opacity: 1, // Destaca o emoji da aba ativa
  },
});