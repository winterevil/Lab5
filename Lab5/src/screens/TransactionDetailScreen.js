import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getTransactionById } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function TransactionDetailScreen({ route, navigation }) {
    const { id } = route.params;
    const [transaction, setTransaction] = useState(null);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        const loadTransaction = async () => {
            const data = await getTransactionById(id);
            setTransaction(data);
        }

        loadTransaction();

        const unsubcribe = navigation.addListener('focus', () => {
            loadTransaction();
        });

        return unsubcribe;
    }, [navigation]);

    if (!transaction) return null;

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        const second = String(date.getSeconds()).padStart(2, '0');

        return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={26} color="#fff" marginTop={40} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Transaction detail</Text>
                <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
                    <Icon name="dots-vertical" size={26} color="#fff" marginTop={40} />
                </TouchableOpacity>
            </View>
            {showMenu && (
                <View style={styles.menuBox}>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                            setShowMenu(false);
                        }}>
                        <Text style={styles.menuText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                            setShowMenu(false);
                        }}>
                        <Text style={styles.menuText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.label}>General Infromation</Text>
                    <View style={styles.row}>
                        <Text style={styles.valueHeader}>Transaction code</Text>
                        <Text style={styles.value}>{transaction.id}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.valueHeader}>Customer</Text>
                        <Text style={styles.value}>{transaction.customer.name} - {transaction.customer.phone}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.valueHeader}>Creation time</Text>
                        <Text style={styles.value}>{formatDate(transaction.createdAt)}</Text>
                    </View>
                </View>
                <View style={styles.card}>
                    <Text style={styles.label}>Service list</Text>
                    {transaction.services.map((service) => (
                        <View key={service._id} style={styles.row}>
                            <Text style={styles.valueHeader}>{service.name}</Text>
                            <Text style={styles.valueHeader}>x{service.quantity}</Text>
                            <Text style={styles.value}>{service.price} đ</Text>
                        </View>
                    ))}
                </View>
                <View style={styles.card}>
                    <Text style={styles.label}>Cost</Text>
                    <View style={styles.row}>
                        <Text style={styles.valueHeader}>Amount of money</Text>
                        <Text style={styles.value}>{transaction.priceBeforePromotion} đ</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.valueHeader}>Discount</Text>
                        <Text style={styles.value}>-{transaction.priceBeforePromotion - transaction.price} đ</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.totalHeader}>Total payment</Text>
                        <Text style={styles.total}>{transaction.price} đ</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        position: 'relative',
        zIndex: 1,
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
    menuBox: {
        position: 'absolute',
        top: 70,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        width: 150,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 50,
        zIndex: 10,
        overflow: 'visible',
    },
    menuItem: {
        paddingVertical: 12,
        paddingHorizontal: 12,
    },
    menuText: {
        fontSize: 16,
    },
    content: {
        padding: 2,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#f04c4c',
        marginBottom: 6,
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
    },
    valueHeader: {
        fontSize: 16,
        color: "#999",
        fontWeight: '600',
    },
    totalHeader: {
        marginTop: 7,
        fontSize: 18,
        fontWeight: '600',
    },
    total: {
        marginTop: 7,
        fontSize: 18,
        fontWeight: '600',
        color: '#f04c4c',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    popupBox: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        paddingVertical: 25,
        paddingHorizontal: 20,
        elevation: 10,
    },
    popupTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    popupMessage: {
        fontSize: 16,
        marginBottom: 25,
        color: '#333333',
        lineHeight: 22,
    },
    popupButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    deleteText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2f9c93',
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
});