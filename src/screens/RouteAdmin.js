import { View, Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TransactionScreen from './TransactionScreen';
import ListCustomerScreen from './ListCustomerScreen';
import SettingScreen from './SettingScreen';
import RouteService from './RouteService';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-paper';

const Tab = createBottomTabNavigator();

export default function RouteAdmin() {

  const navigation = useNavigation();

  return (
    <Tab.Navigator
      initialRouteName="Admin"
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}>
      <Tab.Screen name="Admin" component={RouteService} options={{
        tabBarIcon: ({ color, size }) => (
          <Icon source="home" size={size} color={color} />
        ),
      }} />
      <Tab.Screen name="Transaction" component={TransactionScreen} options={{
        tabBarIcon: ({ color, size }) => (
          <Icon source="cash-multiple" size={size} color={color} />
        ),
      }} />
      <Tab.Screen name="ListCustomer" component={ListCustomerScreen} options={{
        title: 'Customer', tabBarIcon: ({ color, size }) => (
          <Icon source="account-supervisor-outline" size={size} color={color} />
        ),
      }} />
      <Tab.Screen name="Setting" component={SettingScreen} navigation={navigation} options={{
        tabBarIcon: ({ color, size }) => (
          <Icon source="cog" size={size} color={color} />
        ),
      }} />
    </Tab.Navigator>
  );
}
