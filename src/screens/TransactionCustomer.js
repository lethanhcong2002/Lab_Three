import { Alert, FlatList, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, Modal, Portal, Text, TextInput } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import DatePicker from 'react-native-date-picker';

const TRANS = firestore().collection('Transactions');
const SERVICES = firestore().collection('Services');

export default function TransactionCustomer({ navigation }) {
  const [list, setList] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchServiceList = async () => {
      try {
        await TRANS.orderBy('date', 'asc').onSnapshot(
          async querySnapshot => {
            const transData = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));

            // Fetch service names
            const services = await SERVICES.get();
            const serviceData = services.docs.reduce((acc, doc) => {
              acc[doc.id] = doc.data().serviceName;
              return acc;
            }, {});

            const updatedTransData = transData.map(transaction => ({
              ...transaction,
              serviceName: serviceData[transaction.serviceId] || 'Unknown Service',
            }));

            setList(updatedTransData);
          },
          error => {
            console.error('Error getting transactions: ', error);
          },
        );
      } catch (error) {
        console.error('Error getting transactions: ', error);
      }
    };

    fetchServiceList();
  }, []);

  const handleEdit = () => {
    setDetailModalVisible(false);
    setEditModalVisible(true);
  };

  const handleUpdate = async () => {
    if (selectedTransaction) {
      try {
        await TRANS.doc(selectedTransaction.id).update({ date: date.getTime() });
        setEditModalVisible(false);
        Alert.alert("Cập nhật thành công");
      } catch (error) {
        console.error('Error updating transaction date: ', error);
        Alert.alert("Có lỗi xảy ra khi cập nhật, vui lòng thử lại sau");
      }
    } else {
      Alert.alert("Vui lòng chọn một giao dịch để cập nhật");
    }
  }

  return (
    <View style={{ padding: 10 }}>
      <Text
        style={{
          alignSelf: 'center',
          marginVertical: 10,
          fontSize: 18,
          fontWeight: 'bold',
        }}>
        Lịch đã đặt
      </Text>
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
              padding: 15,
              borderColor: 'black',
              borderWidth: 1,
              marginBottom: 10,
            }}
            onPress={() => {
              setSelectedTransaction(item);
              setDetailModalVisible(true);
            }}
          >
            <View>
              <Text
                style={{
                  color: 'black',
                  fontWeight: 'bold',
                  fontSize: 16,
                }}>
                {item.serviceName}
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 16,
                  }}>
                  {new Date(item.date).toLocaleString()}
                </Text>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 16,
                  }}>
                  {item.status}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      <Portal>
        <Modal
          visible={detailModalVisible}
          onDismiss={() => setDetailModalVisible(false)}
        >
          <View style={{ backgroundColor: 'white', padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Chi tiết giao dịch</Text>
            <Text>Tên dịch vụ: {selectedTransaction?.serviceName}</Text>
            <Text>Ngày: {selectedTransaction ? new Date(selectedTransaction.date).toLocaleString() : ''}</Text>
            <Text>Trạng thái: {selectedTransaction?.status === 'unconfirmed' ? 'Chờ xác nhận' : 'Đã xác nhận'}</Text>
            <Button mode="contained" onPress={handleEdit} style={{ marginTop: 10 }}>Chỉnh sửa</Button>
          </View>
        </Modal>
      </Portal>
      <Portal>
        <Modal
          visible={editModalVisible}
          onDismiss={() => setEditModalVisible(false)}
        >
          <View style={{ backgroundColor: 'white', padding: 20 }}>
            <TextInput
              label="Hẹn ngày"
              mode="outlined"
              value={date.toLocaleString()}
              right={<TextInput.Icon icon="calendar" onPress={() => setOpen(true)} />}
              editable={false}
            />
            <Button onPress={handleUpdate}>Thay đổi</Button>
          </View>
        </Modal>
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
      </Portal>
    </View>
  );
}
