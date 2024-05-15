import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingScreen from './SettingScreen';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-paper';
import RouteHomeCustomer from './RouteHomeCustomer';
import RouteTransCustomer from './RouteTransCustomer';

const Tab = createBottomTabNavigator();

export default function RouteCustomer() {

    const navigation = useNavigation();

    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
                tabBarHideOnKeyboard: true,
            }}>
            <Tab.Screen name="Home" component={RouteHomeCustomer} options={{
                tabBarIcon: ({ color, size }) => (
                    <Icon source="home" size={size} color={color} />
                ),
            }} />
            <Tab.Screen name="Transaction" component={RouteTransCustomer} options={{
                tabBarIcon: ({ color, size }) => (
                    <Icon source="cash-multiple" size={size} color={color} />
                ),
            }} />
            <Tab.Screen name="SettingCustomer" component={SettingScreen} navigation={navigation} options={{
                title: 'Setting',
                tabBarIcon: ({ color, size }) => (
                    <Icon source="cog" size={size} color={color} />
                ),
            }} />
        </Tab.Navigator>
    );
}
