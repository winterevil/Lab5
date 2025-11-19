import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getServiceById, deleteService } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function ServiceDetailScreen({ route, navigation }) {
    const { id } = route.params;
    const [service, setService] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    useEffect(() => {
        const loadService = async () => {
            const data = await getServiceById(id);
            setService(data);
        }

        loadService();

        const unsubcribe = navigation.addListener('focus', () => {
            loadService();
        });

        return unsubcribe;
    }, [navigation]);

    if (!service) return null;

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
        await deleteService(token, id);
        setShowDelete(false);
        Alert.alert('Success', 'Service deleted successfully');
        navigation.goBack();
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={26} color="#fff" marginTop={40} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Service detail</Text>
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
                            navigation.navigate("EditService", { id });
                        }}>
                        <Text style={styles.menuText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => {
                            setShowMenu(false);
                            setShowDelete(true);
                        }}>
                        <Text style={styles.menuText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            )}

            {showDelete && (
                <View style={styles.overlay}>
                    <View style={styles.popupBox}>
                        <Text style={styles.popupTitle}>Warning</Text>
                        <Text style={styles.popupMessage}>Are you sure you want to remove this service? This operation cannot be returned</Text>
                        <View style={styles.popupButtons}>
                            <TouchableOpacity onPress={handleDelete} style={{marginRight: 20}}>
                                <Text style={styles.deleteText}>DELETE</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowDelete(false)}>
                                <Text style={styles.deleteText}>CANCEL</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
            <View style={styles.content}>
                <View style={styles.row}>
                    <Text style={styles.label}>Service name: </Text>
                    <Text style={styles.value}>{service.name}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Price: </Text>
                    <Text style={styles.value}>{service.price} đ</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Creator: </Text>
                    <Text style={styles.value}>{service.user?.name || 'Unknown'}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Time: </Text>
                    <Text style={styles.value}>{formatDate(service.createdAt)}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Final update: </Text>
                    <Text style={styles.value}>{formatDate(service.updatedAt)}</Text>
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
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 6,
    },
    value: {
        fontSize: 16,
        marginBottom: 15,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
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
});