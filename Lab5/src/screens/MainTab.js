import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import HomeScreen from './HomeScreen';
import SettingScreen from './SettingScreen';
import CustomerScreen from './CustomerScreen';

const EmptyScreen = () => null;

const Tab = createBottomTabNavigator();

export default function MainTab() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    height: 60,
                    paddingBottom: 6,
                    paddingTop: 6,
                    backgroundColor: '#fff',
                    elevation: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    marginTop: 2,
                },
                tabBarActiveTintColor: '#f04c4c',
                tabBarInactiveTintColor: '#999',

                tabBarIcon: ({ focused, color, size }) => {
                    let icon;

                    switch (route.name) {
                        case 'Home':
                            icon = focused ? 'home' : 'home-outline';
                            break;

                        case 'Transaction':
                            icon = focused ? 'swap-horizontal' : 'swap-horizontal-circle-outline';
                            break;

                        case 'Customer':
                            icon = focused ? 'account-group' : 'account-group-outline';
                            break;

                        case 'Setting':
                            icon = focused ? 'cog' : 'cog-outline';
                            break;

                        default:
                            icon = 'help-circle-outline';
                    }

                    return <Icon name={icon} size={24} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
            <Tab.Screen name="Transaction" component={EmptyScreen} options={{ tabBarLabel: 'Transaction' }} />
            <Tab.Screen name="Customer" component={CustomerScreen} options={{ tabBarLabel: 'Customer' }} />
            <Tab.Screen name="Setting" component={SettingScreen} options={{ tabBarLabel: 'Setting' }} />
        </Tab.Navigator>
    );
}
