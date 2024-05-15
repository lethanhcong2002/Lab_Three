import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { IconButton } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const SERVICES = firestore().collection('Services');

export default function ServiceScreen({ navigation }) {

  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchServiceList = async () => {
      try {
        await SERVICES.orderBy('finalUpdate', 'desc').onSnapshot(
          (querySnapshot) => {
            const servicesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setList(servicesData);
          },
          (error) => {
            console.error('Error getting services: ', error);
          })
      } catch (error) {
        console.error('Error getting services: ', error);
      }
    };

    fetchServiceList();
  }, []);

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

  function handleDetailScreen(data) {
    navigation.navigate("DetailService", { serviceData: data })
  }

  return (
    <View
      style={{
        justifyContent: 'center',
        flex: 1,
        padding: 10,
      }}>
      <Image
        source={require('../asset/logo.png')}
        style={{ alignSelf: 'center', resizeMode: 'contain' }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold' }}>Danh sách dịch vụ</Text>
        <IconButton icon="plus-circle" size={40} iconColor="#e63268" onPress={() => navigation.navigate("NewService")} />
      </View>
      <FlatList
        style={{ marginTop: 10 }}
        data={list}
        numColumns={1}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
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
              onPress={() => handleDetailScreen(item)}>
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
          );
        }}
      />
    </View>
  );
}
