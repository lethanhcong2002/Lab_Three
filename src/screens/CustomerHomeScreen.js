import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { Button, Modal, Portal, Text } from 'react-native-paper';

const SERVICES = firestore().collection('Services');

export default function CustomerHomeScreen({navigation}) {
    const [list, setList] = useState([]);
    const [visible, setVisible] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = { backgroundColor: 'white', padding: 20, margin: 20 };

    useEffect(() => {
        const fetchServiceList = async () => {
            try {
                await SERVICES.where('status', '==', 'active').orderBy('finalUpdate', 'desc').onSnapshot(
                    (querySnapshot) => {
                        const servicesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                        setList(servicesData);
                    },
                    (error) => {
                        console.error('Error getting services: ', error);
                    }
                );
            } catch (error) {
                console.error('Error getting services: ', error);
            }
        };

        fetchServiceList();
    }, []);

    const handlePress = (service) => {
        setSelectedService(service);
        showModal();
    };

    function formatCurrency(number) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    }

    function truncateString(str) {
        if (str.length > 30) {
            return str.substring(0, 25) + '...';
        } else {
            return str;
        }
    }

    const handleNewTrans = () => {
        navigation.navigate("Transaction", { screen: 'NewTrans', params: { serviceData: selectedService } });
        hideModal();
    }
    return (
        <View style={{ padding: 10 }}>
            <Text style={{ alignSelf: 'center', fontSize: 18, fontWeight: 'bold' }}>Danh sách dịch vụ</Text>
            <FlatList
                style={{ marginTop: 10 }}
                data={list}
                numColumns={1}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={{
                            borderRadius: 20,
                            overflow: 'hidden',
                            padding: 30,
                            borderColor: 'black',
                            borderWidth: 1,
                            marginBottom: 10,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                        onPress={() => handlePress(item)}
                    >
                        <Text
                            style={{
                                color: 'black',
                                fontWeight: 'bold',
                                fontSize: 16,
                            }}>
                            {truncateString(item.serviceName)}
                        </Text>
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 16,
                            }}>
                            {formatCurrency(item.price)}
                        </Text>
                    </TouchableOpacity>
                )}
            />
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                    {selectedService ? (
                        <View>
                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{selectedService.serviceName}</Text>
                            <Text>Giá: {formatCurrency(selectedService.price)}</Text>
                            <Button mode='contained' style={{ alignSelf: 'flex-end' }} onPress={handleNewTrans}>Đặt lịch</Button>
                        </View>
                    ) : (
                        <Text>Loading...</Text>
                    )}
                </Modal>
            </Portal>
        </View>
    );
}
