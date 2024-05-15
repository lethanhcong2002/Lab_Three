import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';
import { useMyContextController } from '../store';
import CustomerHomeScreen from './CustomerHomeScreen';

const Stack = createStackNavigator();
export default function RouteHomeCustomer() {
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;
    const navigation = useNavigation();
    return (
        <Stack.Navigator initialRouteName='HomeCustomer' screenOptions={{
            headerStyle: {
                backgroundColor: '#e63268',
            },
            headerTintColor: 'white',
        }}>
            <Stack.Screen name="HomeCustomer" component={CustomerHomeScreen} options={{
                headerTitle: userLogin && userLogin != null ? userLogin.fullName : 'Service',
                headerRight: () => (
                    <IconButton icon={'account-circle'} iconColor="white" onPress={() => navigation.navigate("SettingCustomer")} />
                ),
            }} navigation={navigation} />
            {/* <Stack.Screen name="DetailService" component={DetailService} />
            <Stack.Screen name="UpdateService" component={UpdateService} /> */}
        </Stack.Navigator>
    );
}