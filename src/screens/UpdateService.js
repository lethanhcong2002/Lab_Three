import { Alert, Image, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, Text, TextInput } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import imagePicker from 'react-native-image-crop-picker';
import { updateServiceData } from '../store';

export default function UpdateService({ navigation, route }) {
    const { serviceData } = route.params;
    console.log(serviceData);
    const [serviceName, setServiceName] = useState('');
    const [price, setPrice] = useState('0');
    const [imagePath, setImagePath] = useState('');

    useEffect(() => {
        setServiceName(serviceData.serviceName);
        setPrice(serviceData.price.toString());
        setImagePath(serviceData.image);
    }, [serviceData]);

    const handleChooseImage = () => {
        imagePicker.openPicker({
            cropping: true,
            width: 300,
            height: 400,
            mediaType: "photo",
        })
            .then(image => {
                setImagePath(image.path);
            })
            .catch(e => console.log(e))
    };

    const handleUpdateService = async () => {
        if (serviceName === '' || price === '' || price === '0') {
            Alert.alert("Vui lòng nhập đủ thông tin")
            return;
        }
        updateServiceData(serviceData.id, {
            serviceName: serviceName,
            price: Number(price),
        }, imagePath)
        navigation.goBack();
    };

    return (
        <View style={{ padding: 10 }}>
            <View style={{ marginBottom: 15 }}>
                <Text style={{ fontWeight: 'bold' }}>
                    Service Name <Text style={{ color: '#e63268' }}>*</Text>
                </Text>
                <TextInput
                    placeholder="Input a service name"
                    mode="contained"
                    value={serviceName}
                    onChangeText={setServiceName}
                />
            </View>
            <View style={{ marginBottom: 25 }}>
                <Text style={{ fontWeight: 'bold' }}>
                    Price <Text style={{ color: '#e63268' }}>*</Text>
                </Text>
                <TextInput mode="contained" keyboardType='decimal-pad' value={price} onChangeText={setPrice} />
            </View>
            <Button mode="contained" buttonColor="#e63268" onPress={handleChooseImage} style={{ marginBottom: 10 }}>
                Choose Image
            </Button>
            <View>
                {(imagePath != "") && <Image source={{ uri: imagePath }} resizeMode='contain' width={400} height={
                    300
                } />}
            </View>
            <Button mode="contained" buttonColor="#e63268" onPress={handleUpdateService} style={{ marginTop: 10 }}>
                Add
            </Button>
        </View>
    );
}
