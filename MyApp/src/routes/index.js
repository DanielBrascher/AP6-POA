// src/routes/index.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Importando as Telas
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import GroupsScreen from '../screens/GroupsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CreateGroupScreen from '../screens/CreateGroupScreen';
import GroupDetailsScreen from '../screens/GroupDetailsScreen';
import ManageGoalsScreen from '../screens/ManageGoalsScreen'; // Crie um arquivo simples
import EditProfileScreen from '../screens/EditProfileScreen'; // Crie um arquivo simples
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// 1. Configuração do Menu de Abas Inferior (Tab)
function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Feed' }} />
      <Tab.Screen name="Grupos" component={GroupsScreen} options={{ title: 'Meus Grupos' }} />
      <Tab.Screen name="Perfil" component={ProfileScreen} options={{ title: 'Meu Perfil' }} />
    </Tab.Navigator>
  );
}

// 2. Fluxo Principal (Stack) que une a Autenticação e as telas internas
export default function Routes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="CreateGroup" component={CreateGroupScreen} options={{ title: 'Criar Novo Grupo' }} />
      <Stack.Screen name="GroupDetails" component={GroupDetailsScreen} options={{ title: 'Grupo' }} />
      <Stack.Screen name="ManageGoals" component={ManageGoalsScreen} options={{ title: 'Configurar Metas' }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Editar Perfil' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}