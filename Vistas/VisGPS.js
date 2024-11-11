import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert, Button } from 'react-native';
import * as Location from 'expo-location';
import { db } from '../Control/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const VisGPS = () => {
  const [location, setLocation] = useState({ latitud: null, longitud: null });
  const [errorMsg, setErrorMsg] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const obtenerYGuardarUbicacion = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso para acceder a la ubicación fue denegado');
        return;
      }

      try {
        let loc = await Location.getCurrentPositionAsync({});
        const nuevaUbicacion = {
          latitud: loc.coords.latitude,
          longitud: loc.coords.longitude,
        };
        setLocation(nuevaUbicacion);

        const fecha = new Date();
        await addDoc(collection(db, 'ubicaciones'), {
          nombre: 'Ubicación actualizada',
          latitud: nuevaUbicacion.latitud,
          longitud: nuevaUbicacion.longitud,
          fecha,
        });
      } catch (e) {
        console.error('Error al guardar la ubicación: ', e);
        Alert.alert('Error', 'No se pudo guardar la ubicación');
      }
    };

    const intervalId = setInterval(obtenerYGuardarUbicacion, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const navegarAlMapa = () => {
    navigation.navigate('vermapa', {
      latitud: location.latitud,
      longitud: location.longitud,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.locationContainer}>
        <Text style={styles.text}>Latitud: {location.latitud ?? 'No disponible'}</Text>
        <Text style={styles.text}>Longitud: {location.longitud ?? 'No disponible'}</Text>
      </View>
      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
      <Button title="Ver en Mapa" onPress={navegarAlMapa} disabled={!location.latitud || !location.longitud} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9d997',
    padding: 20,
  },
  locationContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginVertical: 5,
    color: '#efa203',
    textAlign: 'center',
    
  },
  error: {
    fontSize: 14,
    color: 'red',
    marginVertical: 10,
    textAlign: 'center',
  },
});

export default VisGPS;
