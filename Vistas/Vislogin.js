import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { auth } from '../Control/firebase'; // Asegúrate de que la ruta sea correcta
import { signInWithEmailAndPassword } from 'firebase/auth'; // Importa la función de inicio de sesión

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Ingreso exitoso', `Bienvenido, ${userCredential.user.email}`);
      // Aquí puedes navegar a otra pantalla o hacer otra acción
      navigation.navigate('Menu');
    } catch (error) {
      Alert.alert('Uyyy, correo o contraseña incorrectos ', error.message);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text>Correo electronico:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Ingresa tu correo"
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderWidth: 1, borderColor: 'gray', marginBottom: 12, padding: 8 }}
      />
      <Text>Contraseña:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Ingresa tu contraseña"
        secureTextEntry
        style={{ borderWidth: 1, borderColor: 'gray', marginBottom: 12, padding: 8 }}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default Login;
