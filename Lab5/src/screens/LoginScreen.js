import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login } from '../api/api';

export default function LoginScreen({ navigation }) {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        console.log("Login button pressed");
        try {
            const res = await login(phone, password);
            console.log("Login API response:", res);
            await AsyncStorage.setItem('token', res.token);
            await AsyncStorage.setItem('userName', res.name);
            Alert.alert("Success", "Login successful");
            navigation.replace("MainTab");
        } catch (error) {
            console.log("Login error:", error);
            Alert.alert("Error", "Invalid credentials");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>LOGIN</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Phone"
                    value={phone}
                    keyboardType='number-pad'
                    onChangeText={setPhone}
                    placeholderTextColor="#999"
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor="#999"
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                    <Icon name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#999" />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#f04c4c',
        marginBottom: 40,
    },
    inputContainer: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    input: {
        height: 50,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#333',
    },
    button: {
        width: '100%',
        backgroundColor: '#f04c4c',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    eyeButton: {
        paddingHorizontal: 6,
    },
})