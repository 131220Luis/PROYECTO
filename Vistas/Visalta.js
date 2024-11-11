import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ImageBackground, Alert, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db, storage } from '../Control/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

const AltaAlumno = () => {
  const [numeroControl, setNumeroControl] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [sexo, setSexo] = useState('');
  const [carrera, setCarrera] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSubmit = async () => {
    // Validar campos
    if (!numeroControl || !nombre || !apellido || !correo || !carrera || !telefono || !sexo) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    let imageUrl = '';

    // Subir imagen a Firebase Storage
    if (selectedImage) {
      try {
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        const storageRef = ref(storage, `images/${Date.now()}-${nombre}`);
  
        // Subir la imagen
        await uploadBytes(storageRef, blob);
        console.log("Imagen subida exitosamente");
  
        // Obtener la URL de la imagen
        imageUrl = await getDownloadURL(storageRef);
        console.log("URL de la imagen:", imageUrl); // Log de la URL
      } catch (error) {
        console.error("Error al subir la imagen:", error);
        Alert.alert("Error", "No se pudo subir la imagen.");
        return; // Detener la función si hay un error
      }
    }

    try {
      await addDoc(collection(db, 'tblalumno'), {
        alunc: numeroControl,
        aluNombre: nombre,
        aluApellido: apellido,
        aluCorreo: correo,
        aluCarrera: carrera,
        aluTelefono: telefono,
        aluSexo: sexo,
        aluFecha: format(fechaNacimiento, 'yyyy-MM-dd'),
        imageUrl,
      });

      Alert.alert("Éxito", "Alumno registrado exitosamente");
      // Limpiar los campos
      setNumeroControl('');
      setNombre('');
      setApellido('');
      setCorreo('');
      setCarrera('');
      setTelefono('');
      setSexo('');
      setSelectedImage(null);
    } catch (error) {
      console.error("Error al registrar el alumno: ", error);
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const pickImage = async () => {
    // Solicitar permisos para acceder a la galería
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log("Permisos para la galería:", permissionResult); // Log de permisos
  
    if (permissionResult.status !== 'granted') {
      Alert.alert("Error", "Se necesitan permisos para acceder a la galería.");
      return;
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
  
    console.log("Resultado de la selección de imagen:", result); // Log del resultado
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri); // Accediendo a la URI correctamente
      console.log("Imagen seleccionada:", result.assets[0].uri); // Log del URI de la imagen
    } else {
      console.log("Selección de imagen cancelada");
    }
  };
  

  return (
    <ImageBackground 
      source={require('../Vistas/IMG/perritos.jpeg')} 
      style={styles.background} 
    >
      <View style={styles.container}> 
        <Text style={styles.title}>Registro de Alumno</Text> 
        <TextInput 
          style={styles.input} 
          placeholder="Número de Control" 
          value={numeroControl} 
          onChangeText={setNumeroControl} 
          keyboardType="numeric" 
          placeholderTextColor="white" 
        /> 
        <TextInput 
          style={styles.input} 
          placeholder="Nombre" 
          value={nombre} 
          onChangeText={setNombre} 
          placeholderTextColor="white" 
        /> 
        <TextInput 
          style={styles.input} 
          placeholder="Apellido" 
          value={apellido} 
          onChangeText={setApellido} 
          placeholderTextColor="white" 
        /> 
        <TextInput 
          style={styles.input} 
          placeholder="Correo" 
          value={correo} 
          onChangeText={setCorreo} 
          keyboardType="email-address" 
          placeholderTextColor="white" 
        /> 
        <TextInput 
          style={styles.input} 
          placeholder="Número de Teléfono" 
          value={telefono} 
          onChangeText={setTelefono} 
          keyboardType="phone-pad" 
          placeholderTextColor="white" 
        /> 

        <TouchableOpacity onPress={showDatepicker}>
          <Text style={styles.dateText}>
            Fecha de Nacimiento: {format(fechaNacimiento, 'dd/MM/yyyy')}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={fechaNacimiento}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setFechaNacimiento(selectedDate);
              }
            }}
          />
        )}

        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          <Text style={styles.imagePickerText}>Seleccionar Imagen</Text>
        </TouchableOpacity>

        {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}

        <View style={styles.radioContainer}>
          <Text style={styles.radioTitle}>Sexo:</Text>
          <TouchableOpacity style={styles.radioButton} onPress={() => setSexo('Hombre')}>
            <View style={sexo === 'Hombre' ? styles.radioChecked : styles.radioUnchecked} />
            <Text style={styles.radioText}>Hombre</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.radioButton} onPress={() => setSexo('Mujer')}>
            <View style={sexo === 'Mujer' ? styles.radioChecked : styles.radioUnchecked} />
            <Text style={styles.radioText}>Mujer</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Carrera:</Text>
          <Picker
            selectedValue={carrera}
            style={styles.picker}
            onValueChange={(itemValue) => setCarrera(itemValue)}
          >
            <Picker.Item label="Seleccionar carrera" value="" />
            <Picker.Item label="Ingeniería en Sistemas" value="Ingeniería en Sistemas" />
            <Picker.Item label="Ingeniería en Gestión" value="Ingeniería en Gestión" />
            <Picker.Item label="Licenciatura en Turismo" value="Licenciatura en Turismo" />
            <Picker.Item label="Ingeniería en Electromecánica" value="Ingeniería en Electromecánica" />
            <Picker.Item label="Arquitectura" value="Arquitectura" />
            <Picker.Item label="Licenciatura en Gastronomía" value="Licenciatura en Gastronomía" />
          </Picker>
        </View>

        <Button title="Registrar" onPress={handleSubmit} /> 
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
  container: { 
    justifyContent: 'center', 
    padding: 20, 
    borderRadius: 10,
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
    color: '#fbff00',
  },
  dateText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 15,
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  radioTitle: {
    color: 'white',
    fontSize: 18,
    marginRight: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  radioChecked: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white', 
    backgroundColor: 'white', 
    marginRight: 10,
  },
  radioUnchecked: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'white', 
    marginRight: 10,
  },
  radioText: {
    color: 'white',
  },
  dropdownContainer: {
    marginBottom: 15,
  },
  dropdownLabel: {
    color: 'white',
    fontSize: 18,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    color: 'white',
    backgroundColor: '#ccc',
    borderRadius: 5,
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
});

export default AltaAlumno;
