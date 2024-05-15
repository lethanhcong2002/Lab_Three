import React, { useState } from 'react';
import { View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useMyContextController } from '../store';
import { Button, Text, TextInput } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { CommonActions } from '@react-navigation/native';

const TRANS = firestore().collection("Transactions");

export default function NewTransCustomer({ navigation, route }) {
    const [controller, dispatch] = useMyContextController();
    const { userLogin } = controller;
    const { serviceData } = route.params;
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [notes, setNotes] = useState('');

    function formatCurrency(number) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(number);
    }

    const handleConfirm = async () => {
        const transactionData = {
            serviceId: serviceData ? serviceData.id : '',
            customerId: userLogin ? userLogin.email : '',
            date: date.getTime(),
            notes: notes,
            createdAt: firestore.FieldValue.serverTimestamp(),
            status: 'Chưa xác nhận'
        };

        try {
            await TRANS.add(transactionData);
            alert('Đặt lịch thành công!');
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Home', params: { screen: 'HomeCustomer' } }],
                })
            );
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Có lỗi xảy ra, vui lòng thử lại sau.');
        }
    };

    return (
        <View style={{ padding: 10 }}>
            <Text style={{ alignSelf: 'center', fontSize: 28, marginBottom: 10, fontWeight: 'bold' }}>
                Đặt Lịch
            </Text>
            <View>
                <Text style={{ fontSize: 18, marginBottom: 10, fontWeight: 'bold' }}>Thông tin dịch vụ</Text>
                <Text>Tên dịch vụ: {serviceData ? serviceData.serviceName : ''}</Text>
                <Text>Giá: {serviceData ? formatCurrency(serviceData.price) : ''}</Text>
                <Text style={{ fontSize: 18, marginVertical: 10, fontWeight: 'bold' }}>Thông tin khách hàng</Text>
                <Text>Tên khách hàng: {userLogin ? userLogin.fullName : ''}</Text>
                <Text>Email: {userLogin ? userLogin.email : ''}</Text>
                <Text>Địa chỉ: {userLogin ? userLogin.address : ''}</Text>
                <Text>Số điện thoại: {userLogin ? userLogin.phone : ''}</Text>
                <Text style={{ fontSize: 18, marginVertical: 10, fontWeight: 'bold' }}>Thông tin cần thiết</Text>
                <TextInput
                    label="Hẹn ngày"
                    mode="outlined"
                    value={date.toLocaleString()}
                    right={<TextInput.Icon icon="calendar" onPress={() => setOpen(true)} />}
                    editable={false}
                />
                <TextInput
                    label="Ghi chú"
                    mode="outlined"
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    numberOfLines={4}
                />
                <Button mode='contained' style={{ marginVertical: 10 }} onPress={handleConfirm}>
                    Xác nhận
                </Button>
            </View>
            <DatePicker
                modal
                open={open}
                date={date}
                onConfirm={(date) => {
                    setOpen(false)
                    setDate(date)
                }}
                onCancel={() => {
                    setOpen(false)
                }}
            />
        </View>
    );
}
