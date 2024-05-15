import {View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, HelperText, Text, TextInput} from 'react-native-paper';
import {login, useMyContextController} from '../store';

export default function LoginScreen({navigation}) {
  const [email, setEmail] = useState('lethanhcongv6@gmail.com');
  const [password, setPassword] = useState('12345678');
  const [showPassword, setShowPassword] = useState(false);
  const [controller, dispatch] = useMyContextController();
  const {userLogin} = controller;
  const hasErrorEmail = () => email.length > 0 && !email.includes('@');
  const hasErrorPassword = () => password.length > 0 && password.length < 6;

  useEffect(() => {
    if (userLogin != null) {
      if (userLogin.role === 'admin') navigation.replace('AdminRoute');
      else navigation.replace('CustomerRoute');
    }
  }, [userLogin]);
  
  const handleLogin = () => {
    login(dispatch, email, password);
  };

  return (
    <View style={{flex: 1, padding: 10, backgroundColor: 'white'}}>
      <Text
        style={{
          fontSize: 40,
          fontWeight: 'bold',
          color: 'pink',
          alignSelf: 'center',
          marginTop: 50,
          marginBottom: 10,
        }}>
        Login
      </Text>
      <TextInput label="Email" value={email} onChangeText={setEmail} />
      <HelperText type="error" visible={hasErrorEmail()}>
        Error Email
      </HelperText>
      <TextInput
        label="Password "
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
      />
      <HelperText type="error" visible={hasErrorPassword()}>
        Error Password
      </HelperText>
      <Button mode="contained" buttonColor="blue" onPress={handleLogin}>
        Login
      </Button>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>Don't have a account</Text>
        <Button onPress={() => navigation.navigate("Register")}>create new account</Button>
      </View>
    </View>
  );
}
