import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const Mapa = ({ route }) => {
  const { latitud, longitud } = route.params;
  const [region, setRegion] = useState({
    latitude: latitud,
    longitude: longitud,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    // Actualiza la región cuando cambien latitud o longitud
    setRegion({
      latitude: latitud,
      longitude: longitud,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  }, [latitud, longitud]);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region}>
        <Marker coordinate={{ latitude: latitud, longitude: longitud }} title="Ubicación" />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default Mapa;