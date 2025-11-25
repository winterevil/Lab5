import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getTransactions } from '../api/api';

export default function TransactionScreen({ navigation }) {
    const [transactions, setTransactions] = useState([]);

    const loadTransactions = async () => {
        try {
            const data = await getTransactions();
            setTransactions(data);
        } catch (error) {
            console.error("Failed to load transactions:", error);
        }
    };

    useEffect(() => {
        const focusHandler = navigation.addListener('focus', () => {
            loadTransactions();
        });
        return focusHandler;
    }, [navigation]);

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        const second = String(date.getSeconds()).padStart(2, '0');

        return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    };
    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.headerText}>Transaction</Text>
            </View>

            <FlatList
                data={transactions}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('TransactionDetail', { id: item._id })}
                    >
                        <View style={styles.row}>
                            <Text style={styles.value}>{item.id} - </Text>
                            <Text style={styles.value}>{formatDate(item.createdAt)}</Text>
                            <Text style={styles.statusText}> - {item.status}</Text>
                        </View>
                        {item.services.map((service, _id) => (
                            <View key={_id} style={styles.row}>
                                <Text style={styles.label}>- {service.name}</Text>
                            </View>
                        ))}
                        <View style={styles.row}>
                            <Text style={styles.customerText}>Customer: </Text>
                            <Text style={styles.customerText}>{item.customer?.name}</Text>
                        </View>
                        <View style={styles.loyaltyBox}>
                            <Text style={styles.loyaltyText}>{item.price} đ</Text>
                        </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingBottom: 90 }}
            />
            <TouchableOpacity
                style={styles.addIconWrapper}
                onPress={() => {}}
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
        fontSize: 14,
        color: '#333333',
    },
    value: {
        fontSize: 14,
        fontWeight: '600',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#f04c4c',
    },
    customerText: {
        fontSize: 14,
        color: '#999',
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
        marginBottom: 6,
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
        top: 50,
        right: 20,
        alignItems: 'center',
    },
    loyaltyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#f04c4c',
    },
});
