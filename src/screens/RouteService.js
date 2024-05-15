import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ServiceScreen from './ServiceScreen';
import AddService from './AddService';
import DetailService from './DetailService';
import { useNavigation } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';
import { useMyContextController } from '../store';
import UpdateService from './UpdateService';

const Stack = createStackNavigator();
export default function RouteService() {
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;
  const navigation = useNavigation();
  return (
    <Stack.Navigator initialRouteName='Service' screenOptions={{
      headerStyle: {
        backgroundColor: '#e63268',
      },
      headerTintColor: 'white',
    }}>
      <Stack.Screen name="Service" component={ServiceScreen} options={{
        headerTitle: userLogin && userLogin != null ? userLogin.fullName : 'Service',
        headerRight: () => (
          <IconButton icon={'account-circle'} iconColor="white" onPress={() => navigation.navigate("Setting")} />
        ),
      }} navigation={navigation} />
      <Stack.Screen name="NewService" component={AddService} options={{ title: 'Service' }} navigation={navigation} />
      <Stack.Screen name="DetailService" component={DetailService} />
      <Stack.Screen name="UpdateService" component={UpdateService} />
    </Stack.Navigator>
  );
}