import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './Vistas/Vislogin';
import MenuScreen from './Vistas/Vismenu';
import visalta from './Vistas/Visalta';
import visconsult from './Vistas/Visconsulta';
import viseditar from './Vistas/Visedit';
import vistemperatura from './Vistas/VisTemperatura';
import visgpd from './Vistas/VisGPS';
import vermapa from './Vistas/VisMapa';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="visalta" component={visalta} />
        <Stack.Screen name="visconsult" component={visconsult} />
        <Stack.Screen name="viseditar" component={viseditar} />
        <Stack.Screen name="vistemperatura" component={vistemperatura} />
        <Stack.Screen name="visgpd" component={visgpd} />
        <Stack.Screen name="vermapa" component={vermapa} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

