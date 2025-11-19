import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingScreen({ navigation }) {
    const logout = async () => {
        await AsyncStorage.removeItem('token');
        navigation.navigate('Login');
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Setting</Text>
            </View>

            <View style={styles.content}>
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    header: {
        backgroundColor: '#f04c4c',
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 16,
        paddingBottom: 14,
        elevation: 5,
    },
    headerText: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 40,
    },
    content: {
        padding: 20,
    },
    logoutButton: {
        backgroundColor: '#f04c4c',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    logoutText: {
        color: '#ffffff',
        fontSize: 17,
        fontWeight: '600',
    }
});