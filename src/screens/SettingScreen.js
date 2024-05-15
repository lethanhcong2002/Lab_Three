import { View } from 'react-native'
import React, { useEffect } from 'react'
import { logout, useMyContextController } from '../store';
import { Button } from 'react-native-paper';

export default function SettingScreen({ navigation }) {
  const [controller, dispatch] = useMyContextController();
  const { userLogin } = controller;
  useEffect(() => {
    if (userLogin === null)
      navigation.replace("Login");
  }, [userLogin]);
  const onSubmit = () => {
    logout(dispatch);
  }
  return (
    <View style={{flex: 1, justifyContent: "center"}}>
      <Button mode='contained' onPress={onSubmit}>Đăng Xuất</Button>
    </View>
  )
}