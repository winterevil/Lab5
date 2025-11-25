import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addCustomer } from '../api/api';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function AddCustomerScreen({ navigation }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const handleAdd = async () => {
        const token = await AsyncStorage.getItem('token');
        console.log("TOKEN USED:", token);
        await addCustomer(token, name, phone);
        Alert.alert('Success', 'Customer added successfully');
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={26} color="#fff" marginTop={40} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Add Customer</Text>
                <View style={{ width: 26 }} />
            </View>

            <View style={styles.content}>
                <Text style={styles.label}>Customer Name *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Input your customer's name"
                    placeholderTextColor="#999"
                    onChangeText={setName}
                />

                <Text style={styles.label}>Phone *</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Input phone number'
                    placeholderTextColor="#999"
                    onChangeText={setPhone}
                    keyboardType='numeric'
                />

                <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                    <Text style={styles.addButtonText}>Add</Text>
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
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#f4f5f9',
        paddingVertical: 13,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginBottom: 20,
        fontSize: 15,
    },
    addButton: {
        backgroundColor: '#f04c4c',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    addButtonText: {
        color: '#ffffff',
        fontSize: 17,
        fontWeight: '600',
    }
});