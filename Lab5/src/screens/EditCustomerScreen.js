import React, { useState, useEffect, use } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getCustomerById, updateCustomer } from '../api/api';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';

export default function EditCustomerScreen({ navigation, route }) {
    const { id } = route.params;
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        (async () => {
            const data = await getCustomerById(id);
            setName(data.name);
            setPhone(data.phone);
        })();
    }, []);

    const handleEdit = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            await updateCustomer(id, name, phone, token);
            Alert.alert('Success', 'Customer updated successfully');
            navigation.goBack();
        } catch (err) {
            const msg = err.response?.data?.errors?.[0]?.msg;
            Alert.alert("Error", msg || "Something went wrong");
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='arrow-left' size={26} color='#fff' marginTop={40} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Edit customer</Text>
                <View style={{ width: 26 }} />
            </View>
            <View style={styles.content}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Input a customer name'
                    placeholderTextColor='#999'
                    onChangeText={setName}>{name}</TextInput>

                <Text style={styles.label}>Phone</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Input a customer phone'
                    placeholderTextColor='#999'
                    onChangeText={setPhone}>{phone}</TextInput>

                <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                    <Text style={styles.editButtonText}>Update</Text>
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
    editButton: {
        backgroundColor: '#f04c4c',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    editButtonText: {
        color: '#ffffff',
        fontSize: 17,
        fontWeight: '600',
    }
});