import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCustomerById, deleteCustomer } from '../api/api';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';

export default function CustomerDetailScreen({ navigation, route }) {
    const { id } = route.params;
    const [customer, setCustomer] = useState(null);
    const [showMenu, setShowmenu] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    useEffect(() => {
        const loadCustomer = async () => {
            const data = await getCustomerById(id);
            setCustomer(data);
        }

        loadCustomer();
        const unsubcribe = navigation.addListener('focus', () => {
            loadCustomer();
        })
        return unsubcribe;
    }, [navigation]);

    if (!customer) return null;

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

    const handleDelete = async () => {
        const token = await AsyncStorage.getItem('token');
        await deleteCustomer(id, token);
        setShowDelete(false);
        Alert.alert("Success", "Customer deleted successfully");
        navigation.goBack();
    }
    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={26} color="#fff" marginTop={40} />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Customer detail</Text>
                    <TouchableOpacity onPress={() => setShowmenu(!showMenu)}>
                        <Icon name="dots-vertical" size={26} color="#fff" marginTop={40} />
                    </TouchableOpacity>
                </View>
                {showMenu && (
                    <View style={styles.menuBox}>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {
                                setShowmenu(false);
                                navigation.navigate('EditCustomer', { id });
                            }}>
                            <Text style={styles.menuText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {
                                setShowmenu(false);
                                setShowDelete(true);
                            }}>
                            <Text style={styles.menuText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.card}>
                    <Text style={styles.label}>General information</Text>
                    <View style={styles.row}>
                        <Text style={styles.valueHeader}>Name: </Text>
                        <Text style={styles.value}>{customer.name}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.valueHeader}>Phone: </Text>
                        <Text style={styles.value}>{customer.phone}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.valueHeader}>Total spent: </Text>
                        <Text style={styles.label}>{customer.totalSpent}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.valueHeader}>Time: </Text>
                        <Text style={styles.value}>{formatDate(customer.createdAt)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.valueHeader}>Last update: </Text>
                        <Text style={styles.value}>{formatDate(customer.updatedAt)}</Text>
                    </View>
                </View>
                <View style={styles.card}>
                    <Text style={styles.label}>Transaction history</Text>
                    {customer.transactions.map((transaction) => (
                        <View key={transaction._id} style={styles.transactionCard}>
                            <Text style={styles.valueHeader}>{transaction.id}</Text>
                            <View style={styles.transactionRow}>
                                <View>
                                    {transaction.services.map((service) => (
                                        <Text key={service._id} style={styles.value}>- {service.name}</Text>
                                    ))}
                                </View>
                                <Text style={styles.label}>{transaction.customer.totalSpent} đ</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
            {showDelete && (
                <View style={styles.overlay}>
                    <View style={styles.popupBox}>
                        <Text style={styles.popupTitle}>Alert</Text>
                        <Text style={styles.popupMessage}>Are you sure you want to remove this client?
                            This will not be possible to return
                        </Text>
                        <View style={styles.popupButtons}>
                            <TouchableOpacity onPress={handleDelete} style={{ marginRight: 20 }}>
                                <Text style={styles.deleteText}>DELETE</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowDelete(false)}>
                                <Text style={styles.deleteText}>CANCEL</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
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
        fontWeight: '400',
    },
    valueHeader: {
        fontSize: 16,
        color: "#000",
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
    transactionCard: {
        backgroundColor: '#fff',
        paddingVertical: 14,
        paddingHorizontal: 15,
        marginBottom: 10,
        borderRadius: 14,
        borderColor: '#999',
        borderWidth: 1,
    },
    transactionRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10
    }
})