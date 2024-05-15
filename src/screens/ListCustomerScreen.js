import { View, FlatList, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Button, Modal, Portal, Text } from 'react-native-paper';

const USERS = firestore().collection('Users');

export default function ListCustomerScreen() {
  const [list, setList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: 'white', padding: 20, margin: 20 };

  useEffect(() => {
    const fetchServiceList = () => {
      try {
        USERS.orderBy('fullName', 'desc')
          .where('role', '==', 'customer')
          .onSnapshot(
            (querySnapshot) => {
              const userData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              setList(userData);
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

  const handlePress = (user) => {
    setSelectedUser(user);
    showModal();
  };

  const handleDelete = () => {
    USERS.doc(selectedUser.email)
      .update({ status: 'inactive' })
      .then(() => {
        Alert.alert("Xóa khách hàng thành công");
        hideModal();
      });
  }

  const handleRestore = () => {
    USERS.doc(selectedUser.email)
      .update({ status: 'active' })
      .then(() => {
        Alert.alert("Khôi phục khách hàng thành công");
        hideModal();
      });
  }

  return (
    <View style={{ padding: 10 }}>
      <Text style={{ alignSelf: 'center', fontSize: 18, fontWeight: 'bold' }}>Danh sách khách hàng</Text>
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
              }}
            >
              {item.fullName}
            </Text>
            <Text
              style={{
                color: 'black',
                fontSize: 16,
              }}
            >
              {item.status === 'active' ? 'Còn hoạt động' : 'Ngừng hoạt động'}
            </Text>
          </TouchableOpacity>
        )}
      />
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          {selectedUser ? (
            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{selectedUser.fullName}</Text>
              <Text>Số điện thoại: {selectedUser.phone}</Text>
              <Text>Email: {selectedUser.email}</Text>
              <Text>Địa chỉ: {selectedUser.address}</Text>
              <Text>Trạng thái: {selectedUser.status === 'active' ? 'Còn hoạt động' : 'Ngừng hoạt động'}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end',marginTop: 10 }}>
                {selectedUser.status === 'active' ? (
                  <Button mode='contained' style={{ marginRight: 10 }} onPress={handleDelete}>Ngưng hoạt động</Button>
                ) : (
                  <Button mode='outlined' onPress={handleRestore}>Khôi phục</Button>
                )}
              </View>
            </View>
          ) : (
            <Text>Loading...</Text>
          )}
        </Modal>
      </Portal>
    </View>
  );
}
