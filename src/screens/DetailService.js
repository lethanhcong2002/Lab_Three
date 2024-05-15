import { Image, View } from 'react-native'
import React, { useState } from 'react'
import { PaperProvider, Text } from 'react-native-paper'
import firestore from '@react-native-firebase/firestore';
import DotMenu from '../component/dotMenu';

const USERS = firestore().collection('Users');

export default function DetailService({ navigation, route }) {
  const [creator, setCreator] = useState('');
  const { serviceData } = route.params;

  function formatCurrency(number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
  }

  console.log(serviceData);

  function getUserData() {
    USERS.doc(serviceData.userId).get()
      .then((userDoc) => {
        if (!userDoc.exists) {
          throw new Error('User not found');
        }
        setCreator(userDoc.data().fullName);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  getUserData();
  return (
    <View style={{ padding: 10 }}>
      <View style={{ marginBottom: 10, }}>
        {serviceData ? <Image source={{ uri: serviceData.image }} resizeMode='contain' width={'100%'} height={
          300
        } /> : ''}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', flex: 1 }}>
          Service name: <Text style={{ fontWeight: 'normal' }}>{serviceData ? serviceData.serviceName : ''}</Text>
        </Text>
        <DotMenu navigation={navigation} serviceData={serviceData} />
      </View>
      <View style={{ flexDirection: 'row', }}>
        <Text style={{ fontWeight: 'bold' }}>Trạng thái: </Text>
        <Text>{serviceData && serviceData.status === 'active' ? 'Dịch vụ còn hoạt đông' : 'Dịch vụ hết hoạt động'}</Text>
      </View>
      <View style={{ flexDirection: 'row', }}>
        <Text style={{ fontWeight: 'bold' }}>Price: </Text>
        <Text>{serviceData ? formatCurrency(serviceData.price) : ''}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontWeight: 'bold' }}>Creator: </Text>
        <Text>{creator}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontWeight: 'bold' }}>Time: </Text>
        <Text>{serviceData ? new Date(serviceData.time.toMillis()).toLocaleString() : ''}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={{ fontWeight: 'bold' }}>Final update: </Text>
        <Text>{serviceData ? new Date(serviceData.finalUpdate.toMillis()).toLocaleString() : ''}</Text>
      </View>
    </View>
  )
}