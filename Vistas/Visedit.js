import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  ImageBackground 
} from 'react-native';

import { db, storage } from '../Control/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Picker } from '@react-native-picker/picker';


const EditarAlumno = ({ route, navigation }) => {
  const { alumnoId } = route.params; // Obtener el ID del alumno a editar
  const [alumno, setAlumno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchAlumno = async () => {
      try {
        const docRef = doc(db, 'tblalumno', alumnoId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAlumno({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No existe el alumno");
        }
      } catch (error) {
        console.error("Error al obtener el alumno:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumno();
  }, [alumnoId]);

  const handleSubmit = async () => {
    if (!alumno.aluNombre || !alumno.aluApellido || !alumno.aluCorreo || !alumno.aluCarrera || !alumno.aluTelefono || !alumno.aluSexo) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    let imageUrl = alumno.imageUrl;

    // Subir nueva imagen si ha sido seleccionada
    if (selectedImage) {
      try {
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        const storageRef = ref(storage, `images/${Date.now()}-${alumno.aluNombre}`);
        await uploadBytes(storageRef, blob);
        imageUrl = await getDownloadURL(storageRef);
      } catch (error) {
        console.error("Error al subir la imagen:", error);
        Alert.alert("Error", "No se pudo subir la imagen.");
        return;
      }
    }

    try {
      const alumnoRef = doc(db, 'tblalumno', alumnoId);
      await updateDoc(alumnoRef, {
        aluNombre: alumno.aluNombre,
        aluApellido: alumno.aluApellido,
        aluCorreo: alumno.aluCorreo,
        aluTelefono: alumno.aluTelefono,
        aluCarrera: alumno.aluCarrera,
        aluSexo: alumno.aluSexo,
        aluFecha: format(alumno.aluFecha.toDate ? alumno.aluFecha.toDate() : alumno.aluFecha, 'yyyy-MM-dd'),
        imageUrl,
      });

      Alert.alert("Éxito", "Alumno actualizado exitosamente");
      navigation.goBack();
    } catch (error) {
      console.error("Error al actualizar el alumno:", error);
      Alert.alert("Error", "No se pudo actualizar el alumno.");
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.status !== 'granted') {
      Alert.alert("Error", "Se necesitan permisos para acceder a la galería.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ImageBackground source={require('./IMG/perritos.jpeg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Editar Alumno</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={alumno.aluNombre}
          onChangeText={(text) => setAlumno({ ...alumno, aluNombre: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Apellido"
          value={alumno.aluApellido}
          onChangeText={(text) => setAlumno({ ...alumno, aluApellido: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Correo"
          value={alumno.aluCorreo}
          onChangeText={(text) => setAlumno({ ...alumno, aluCorreo: text })}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Número de Teléfono"
          value={alumno.aluTelefono}
          onChangeText={(text) => setAlumno({ ...alumno, aluTelefono: text })}
          keyboardType="phone-pad"
        />

        <TouchableOpacity onPress={showDatepicker}>
          <Text style={styles.dateText}>
            Fecha de Nacimiento: {format(alumno.aluFecha.toDate ? alumno.aluFecha.toDate() : alumno.aluFecha, 'dd/MM/yyyy')}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
          value={alumno.aluFecha && alumno.aluFecha.toDate ? alumno.aluFecha.toDate() : new Date()} // Asegura que siempre pase una Date válida
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setAlumno({ ...alumno, aluFecha: selectedDate });
            }
          }}
        />
        
        )}

        {/* Radio buttons para seleccionar el sexo */}
        <Text style={styles.label}>Sexo:</Text>
        <View style={styles.radioContainer}>
          <TouchableOpacity onPress={() => setAlumno({ ...alumno, aluSexo: 'Hombre' })} style={styles.radioButton}>
            <Text style={styles.radioText}>Hombre</Text>
            {alumno.aluSexo === 'Hombre' && <View style={styles.radioSelected} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setAlumno({ ...alumno, aluSexo: 'Mujer' })} style={styles.radioButton}>
            <Text style={styles.radioText}>Mujer</Text>
            {alumno.aluSexo === 'Mujer' && <View style={styles.radioSelected} />}
          </TouchableOpacity>
        </View>

        {/* Picker para seleccionar la carrera */}
        <Text style={styles.label}>Carrera:</Text>
        <Picker
          selectedValue={alumno.aluCarrera}
          style={styles.picker}
          onValueChange={(itemValue) => setAlumno({ ...alumno, aluCarrera: itemValue })}
        >
          <Picker.Item label="Seleccionar carrera" value="" />
          <Picker.Item label="Ingeniería en Sistemas" value="Ingeniería en Sistemas" />
          <Picker.Item label="Ingeniería en Gestión" value="Ingeniería en Gestión" />
          <Picker.Item label="Licenciatura en Turismo" value="Licenciatura en Turismo" />
          <Picker.Item label="Ingeniería en Electromecánica" value="Ingeniería en Electromecánica" />
          <Picker.Item label="Arquitectura" value="Arquitectura" />
          <Picker.Item label="Licenciatura en Gastronomía" value="Licenciatura en Gastronomía" />
        </Picker>

        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          <Text style={styles.imagePickerText}>Seleccionar Imagen</Text>
        </TouchableOpacity>

        {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}

        <Button title="Guardar Cambios" onPress={handleSubmit} />
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
    justifyContent: 'center',
    padding: 20,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    color: '#fff',
  },
  dateText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 15,
  },
  label: {
    color: 'white',
    marginBottom: 5,
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  radioText: {
    color: 'white',
    marginRight: 5,
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  imagePicker: {
    backgroundColor: '#888',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  imagePickerText: {
    color: 'white',
    textAlign: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    color: 'white',
    backgroundColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
});

export default EditarAlumno;
