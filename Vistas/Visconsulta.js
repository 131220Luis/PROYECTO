import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import { db } from '../Control/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const ConsultaAlumnos = ({ navigation }) => {
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tblalumno'));
        const alumnosList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAlumnos(alumnosList);
      } catch (error) {
        console.error("Error al obtener los alumnos: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumnos();
  }, []);

  const handleEliminar = async (id) => {
    try {
      await deleteDoc(doc(db, 'tblalumno', id));
      setAlumnos(prevAlumnos => prevAlumnos.filter(alumno => alumno.id !== id));
      Alert.alert('Eliminado', 'El alumno ha sido eliminado correctamente.');
    } catch (error) {
      console.error('Error al eliminar el alumno: ', error);
      Alert.alert('Error', 'Hubo un problema al eliminar el alumno.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('./IMG/perritos.jpeg')} 
      style={styles.background} 
    >
      <View style={styles.container}>
        <Text style={styles.title}>Alumnos Registrados</Text>
        <FlatList
          data={alumnos}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.alumnoContainer}>
              {/* Mostrar la imagen del alumno */}
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
              ) : (
                <Image source={require('./IMG/perro.png')} style={styles.image} />
              )}
              <View style={styles.textContainer}>
                <Text style={styles.alumnoText}>Nombre: {item.aluNombre} {item.aluApellido}</Text>
                <Text style={styles.alumnoText}>Número de Control: {item.alunc}</Text>
                <Text style={styles.alumnoText}>Correo: {item.aluCorreo}</Text>
                <Text style={styles.alumnoText}>Carrera: {item.aluCarrera}</Text>
              
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.editButton} 
                  onPress={() => navigation.navigate('viseditar', { alumnoId: item.id })}
                >
                  <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteButton} 
                  onPress={() => handleEliminar(item.id)}
                >
                  <Text style={styles.deleteButtonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: 'white',
  },
  alumnoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 15,
    flex: 1,
  },
  alumnoText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  editButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    width: 80,
  },
  editButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 5,
    width: 80,
  },
  deleteButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ConsultaAlumnos;

