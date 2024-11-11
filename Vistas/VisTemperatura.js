import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { database } from '../Control/firebase';
import { ref, get } from 'firebase/database';
import { LineChart } from 'react-native-chart-kit';

const SensorDataScreen = () => {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [temperatureData, setTemperatureData] = useState([]); // Para los datos de la gráfica
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      // Consultar los datos de la base de datos de Firebase
      const temperatureRef = ref(database, '/Raiz/temperatura');
      const humidityRef = ref(database, '/Raiz/humedad');

      get(temperatureRef).then(snapshot => {
        if (snapshot.exists()) {
          const newTemperature = snapshot.val();
          setTemperature(newTemperature);
          setTemperatureData(prevData => [...prevData, newTemperature]);
        }
      }).catch(error => {
        console.error('Error fetching temperature data:', error);
      });

      get(humidityRef).then(snapshot => {
        if (snapshot.exists()) {
          setHumidity(snapshot.val());
        }
      }).catch(error => {
        console.error('Error fetching humidity data:', error);
      });

      setLoading(false);
    };

    // Llama a fetchData inicialmente y luego cada 10 segundos
    fetchData();
    const interval = setInterval(fetchData, 10000);

    // Limpia el intervalo cuando se desmonta el componente
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Datos del Sensor</Text>
      <View style={styles.dataContainer}>
        <Text style={styles.label}>Temperatura:</Text>
        <Text style={styles.value}>{temperature ? `${temperature} °C` : 'No disponible'}</Text>
      </View>
      <View style={styles.dataContainer}>
        <Text style={styles.label}>Humedad:</Text>
        <Text style={styles.value}>{humidity ? `${humidity} %` : 'No disponible'}</Text>
      </View>

      {/* Aquí está la gráfica */}
      {temperatureData.length > 0 && (
        <LineChart
          data={{
            labels: temperatureData.map((_, index) => `T${index + 1}`),
            datasets: [
              {
                data: temperatureData,
              },
            ],
          }}
          width={300} // Puedes ajustar el tamaño
          height={200}
          yAxisLabel="°C"
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  dataContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
  value: {
    fontSize: 18,
    marginLeft: 10,
    color: '#333',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SensorDataScreen;

