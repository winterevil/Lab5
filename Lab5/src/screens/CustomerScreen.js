import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getCustomers } from '../api/api';

export default function CustomerScreen({ navigation }) {
    const [customers, setCustomers] = useState([]);

    const loadCustomers = async () => {
        try {
            const data = await getCustomers();
            setCustomers(data);
        } catch (error) {
            console.error("Failed to load customers:", error);
        }
    };

    useEffect(() => {
        const focusHandler = navigation.addListener('focus', () => {
            loadCustomers();
        });
        return focusHandler;
    }, [navigation]);

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.headerText}>Customer</Text>
            </View>

            <FlatList
                data={customers}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                    >
                        <View style={styles.row}>
                            <Text style={styles.label}>Customer: </Text>
                            <Text style={styles.value}>{item.name}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Phone: </Text>
                            <Text style={styles.value}>{item.phone}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Total money: </Text>
                            <Text style={styles.loyaltyText}>{item.totalSpent} đ</Text>
                        </View>
                        <View style={styles.loyaltyBox}>
                            <Icon name="crown" size={26} color="#f04c4c" />
                            <Text style={styles.loyaltyText}>{item.loyalty.toUpperCase()}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingBottom: 90 }}
            />
            <TouchableOpacity
                style={styles.addIconWrapper}
                onPress={() => navigation.navigate('AddCustomer')}
            >
                <Icon name="plus" size={28} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    header: {
        backgroundColor: '#f04c4c',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 14,
        elevation: 5
    },
    headerText: {
        color: '#fff',
        fontSize: 20,
        marginTop: 40,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 16,
        color: '#333333',
    },
    value: {
        fontSize: 16,
        marginBottom: 15,
        fontWeight: '600',
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    addIconWrapper: {
        backgroundColor: '#f04c4c',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 25,
        right: 25,
        elevation: 6,
    },

    card: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginTop: 12,
        paddingVertical: 14,
        paddingHorizontal: 15,
        borderRadius: 14,

        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 3,
    },
    loyaltyBox: {
        position: 'absolute',
        top: 40,
        right: 20,
        alignItems: 'center',
    },
    loyaltyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#f04c4c',
    },
});
