import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useMyContextController } from '../store';
import CustomerScreen from './CustomerScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import { useNavigation } from '@react-navigation/native';
import RouteAdmin from './RouteAdmin';
import RouteCustomer from './BottomCustomer';

const Stack = createStackNavigator();

export default function Router() {
  const navigation = useNavigation();
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false,}}>
      <Stack.Screen name="AdminRoute" component={RouteAdmin} />
      <Stack.Screen name="CustomerRoute" component={RouteCustomer} />
      <Stack.Screen name="Customer" component={CustomerScreen} />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        navigation={navigation}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        navigation={navigation}
      />
    </Stack.Navigator>
  );
}
