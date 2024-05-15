import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {useMyContextController} from '../store';
import TransactionCustomer from './TransactionCustomer';
import NewTransCustomer from './NewTransCustomer';
import UpdateTransCustomer from './UpdateTransCustomer';

const Stack = createStackNavigator();
export default function RouteTransCustomer() {
  const [controller, dispatch] = useMyContextController();
  const {userLogin} = controller;
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      initialRouteName="TransactionFirst"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#e63268',
        },
        headerTintColor: 'white',
      }}>
      <Stack.Screen
        name="TransactionFirst"
        component={TransactionCustomer}
        options={{
          headerShown: false,
        }}
        navigation={navigation}
      />
      <Stack.Screen
        name="NewTrans"
        component={NewTransCustomer}
        navigation={navigation}
      />
      <Stack.Screen name="UpdateTrans" component={UpdateTransCustomer} />
    </Stack.Navigator>
  );
}
