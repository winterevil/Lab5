import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getServices } from '../api/api';

export default function HomeScreen({ navigation }) {
    const [services, setServices] = useState([]);
    const [username, setUsername] = useState('');

    const loadServices = async () => {
        try {
            const data = await getServices();
            setServices(data);
        } catch (error) {
            console.error("Failed to load services:", error);
        }
    };

    const loadUser = async () => {
        try {
            const user = await AsyncStorage.getItem('userName');
            setUsername(user || 'User');
        } catch (error) {
            console.error("Failed to load user:", error);
        }
    };

    useEffect(() => {
        const focusHandler = navigation.addListener('focus', () => {
            loadUser();
            loadServices();
        });
        return focusHandler;
    }, [navigation]);

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.headerText}>{username.toUpperCase()}</Text>
                <TouchableOpacity>
                    <Icon name="account-circle-outline" size={28} color="#fff" marginTop="40"/>
                </TouchableOpacity>
            </View>

            <View style={styles.logoContainer}>
                <Image
                    source={require("../../assets/logo.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.titleRow}>
                <Text style={styles.sectionTitle}>Danh sách dịch vụ</Text>
                <TouchableOpacity
                    style={styles.addIconWrapper}
                    onPress={() => navigation.navigate('AddService')}
                >
                    <Icon name="plus" size={18} color="#fff" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={services}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('ServiceDetail', { id: item._id })}
                    >
                        <Text style={styles.serviceName} numberOfLines={1}>
                            {item.name}
                        </Text>
                        <Text style={styles.price}>
                            {item.price.toLocaleString('vi-VN')} đ
                        </Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingBottom: 90 }}
            />

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

    logoContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 15,
    },
    logo: {
        width: 200,
        height: 75,
    },

    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16.5,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    addIconWrapper: {
        backgroundColor: '#f04c4c',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },

    card: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginBottom: 12,
        paddingVertical: 14,
        paddingHorizontal: 15,
        borderRadius: 14,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 3,
    },

    serviceName: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
        marginRight: 10,
    },

    price: {
        fontSize: 14,
        fontWeight: "600",
        color: '#444',
    },
});
