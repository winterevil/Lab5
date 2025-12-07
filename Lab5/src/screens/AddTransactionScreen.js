import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { addTransaction, getCustomers, getServices } from '../api/api';
import { Dropdown } from 'react-native-element-dropdown';
import BouncyCheckbox from "react-native-bouncy-checkbox";

export default function AddTransactionScreen({ navigation }) {
    const [customers, setCustomers] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedCustomers, setSelectedCustomers] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const c = await getCustomers();
        const s = await getServices();

        s.forEach(item => {
            item.quantity = 1;
            item.checked = false;
            item.userID = "";
        })

        setCustomers(c);
        setServices(s);
    }

    const toggleService = (id) => {
        setServices(prev =>
            prev.map(item =>
                item._id === id ? { ...item, checked: !item.checked } : item
            )
        );
    }

    const updateQuantity = (id, q) => {
        setServices(prev =>
            prev.map(item =>
                item._id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + q) }
                    : item
            )
        );

    }

    const totalPrice = () => {
        return services
            .filter(s => s.checked)
            .reduce((sum, s) => sum + s.price * s.quantity, 0)
    }

    const handleAdd = async () => {
        if (!selectedCustomers) {
            alert("Please select a customer");
            return;
        }
        const token = await AsyncStorage.getItem('token');

        const serviceList = services
            .filter(s => s.checked)
            .map(s => ({
                _id: s._id,
                quantity: s.quantity,
                userID: selectedCustomers.value
            }))

        try {
            await addTransaction(token, selectedCustomers.value, serviceList);
            
            Alert.alert('Success', 'Transaction added successfully');
            navigation.goBack();
        } catch (err) {
            const msg = err.response?.data?.errors?.[0]?.msg;
            Alert.alert("Error", msg || "Something went wrong");
        }
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name='arrow-left' size={26} color='#fff' marginTop={40} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Add Transaction</Text>
                <View style={{ width: 26 }} />
            </View>

            <Text style={styles.label}>Customer *</Text>
            <Dropdown
                style={styles.dropdown}
                data={customers.map(c => ({ label: c.name, value: c._id }))}
                labelField="label"
                valueField="value"
                placeholder='Select customer'
                value={selectedCustomers?.value}
                onChange={item => setSelectedCustomers(item)} />

            {services.map(service => (
                <View key={service._id} style={styles.serviceCard}>
                    <BouncyCheckbox
                        fillColor="#f04c4c"
                        isChecked={service.checked}
                        text={service.name}
                        onPress={() => toggleService(service._id)}
                        textStyle={{ fontSize: 16, fontWeight: "500", textDecorationLine: "none" }}
                        innerIconStyle={{ borderWidth: 2 }}
                    />
                    {service.checked && (
                        <View>
                            <View style={styles.quantityRow}>
                                <TouchableOpacity style={styles.qtyBtn}
                                    onPress={() => updateQuantity(service._id, -1)}>
                                    <Text style={styles.qtyText}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.qtyNumber}>{service.quantity}</Text>
                                <TouchableOpacity style={styles.qtyBtn}
                                    onPress={() => updateQuantity(service._id, +1)}>
                                    <Text style={styles.qtyText}>+</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.priceText}>Price: {service.price * service.quantity} đ</Text>
                        </View>
                    )}
                </View>
            ))}
            <TouchableOpacity style={styles.summaryBtn} onPress={handleAdd}>
                <Text style={styles.summaryText}>See summary: ({totalPrice()} đ)</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
        backgroundColor: "#f04c4c",
        paddingHorizontal: 18,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 16,
        paddingBottom: 14,
        elevation: 5,
    },
    headerText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 40,
    },
    label: {
        marginLeft: 20,
        marginTop: 20,
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
    },
    dropdown: {
        marginHorizontal: 20,
        backgroundColor: "#f4f5f9",
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
    },
    serviceCard: {
        marginHorizontal: 20,
        marginTop: 14,
        padding: 14,
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    serviceName: {
        flex: 1,
        fontSize: 16,
        fontWeight: "500",
        marginLeft: 5,
        color: "#000"
    },
    quantityRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
    qtyBtn: {
        width: 35,
        height: 35,
        backgroundColor: "#f04c4c",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    qtyText: { fontSize: 20, color: "#fff", fontWeight: "700" },
    qtyNumber: { fontSize: 18, marginHorizontal: 15, fontWeight: "600" },
    priceText: { marginTop: 8, color: "#f04c4c", fontWeight: "600" },
    summaryBtn: {
        margin: 20,
        backgroundColor: "#f04c4c",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 50,
    },
    summaryText: { color: "#fff", fontSize: 17, fontWeight: "700" }
});