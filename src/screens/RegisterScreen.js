import { Alert, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { registerAccount } from '../store';

export default function RegisterScreen({ navigation }) {
  const icons = ['eye', 'eye-off'];
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentIcon, setCurrentIcon] = useState(icons[0]);
  const hasErrorEmail = () => email.length > 0 && !email.includes('@');
  const hasErrorPassword = () => password.length > 0 && password.length < 6;
  const hasErrorRePassword = () =>
    rePassword.length > 0 && rePassword.length < 6;

  useEffect(() => {
    setCurrentIcon(showPassword ? icons[1] : icons[0]);
  }, [showPassword, icons]);

  const handleRegister = () => {
    if (!name || !phone || !address || !email || !password) {
      Alert.alert("Lỗi", "Vui lòng điền vào tất cả các trường.");
      return;
    }

    const userData = {
      fullName: name,
      phone: phone,
      address: address,
      email: email,
      password: password,
      role: 'customer',
      status: 'active',
    };

    registerAccount(userData);
    navigation.goBack();
  };


  const handleIconPress = () => {
    setShowPassword(prevIsSecure => !prevIsSecure);
  };

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: 'white' }}>
      <Text
        style={{
          fontSize: 40,
          fontWeight: 'bold',
          color: 'pink',
          alignSelf: 'center',
          marginTop: 50,
          marginBottom: 10,
        }}>
        Register
      </Text>
      <TextInput label="Name" value={name} onChangeText={setName} />
      <HelperText></HelperText>
      <TextInput label="Phone" value={phone} onChangeText={setPhone} />
      <HelperText></HelperText>
      <TextInput label="Address" value={address} onChangeText={setAddress} />
      <HelperText></HelperText>
      <TextInput label="Email" value={email} onChangeText={setEmail} />
      <HelperText type="error" visible={hasErrorEmail()}>
        Error Email
      </HelperText>
      <TextInput
        label="Password "
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        right={<TextInput.Icon icon={currentIcon} onPress={handleIconPress} />}
      />
      <HelperText type="error" visible={hasErrorPassword()}>
        Error Password
      </HelperText>
      <TextInput
        label="Re Password "
        value={rePassword}
        onChangeText={setRePassword}
        secureTextEntry={!showPassword}
        right={<TextInput.Icon icon={currentIcon} onPress={handleIconPress} />}
      />
      <HelperText type="error" visible={hasErrorRePassword()}>
        Error Password
      </HelperText>
      <Button mode="contained" buttonColor="blue" onPress={handleRegister}>
        Register
      </Button>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>Have a account</Text>
        <Button onPress={() => navigation.goBack()}>
          login account
        </Button>
      </View>
    </View>
  );
}
