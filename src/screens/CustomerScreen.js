import { View, Text } from 'react-native'
import React from 'react'
import { useMyContextController } from '../store';

export default function CustomerScreen() {
  const [controller, dispatch] = useMyContextController();
  const {userLogin} = controller;
  return (
    <View>
      <Text style={{color: 'red'}}>{userLogin.fullName}</Text>
    </View>
  )
}