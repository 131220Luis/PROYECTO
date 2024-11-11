import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importar los íconos

const Menu = () => {
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current; // Menú fuera de la pantalla al inicio

  const options = [
    { label: 'Consulta', icon: 'search' },
    { label: 'Registrar alumno', icon: 'user-plus' },
    { label: 'Gráficas', icon: 'bar-chart' },
    { label: 'Mapa', icon: 'map' },
    { label: 'Docentes', icon: 'book' },
  ];

  const colors = ['#f2a810', '#f2a810', '#f2a810', '#f2a810', '#f2a810'];

  const toggleMenu = () => {
    const toValue = menuVisible ? -300 : 0; // Si está visible, lo oculta, si no, lo muestra
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setMenuVisible(!menuVisible);
  };

  const handleOptionPress = (index) => {
    toggleMenu(); // Cerrar el menú antes de navegar
    switch (index) {
      case 0:
        navigation.navigate('visconsult');
        break;
      case 1:
        navigation.navigate('visalta');
        break;;
      case 2:
        navigation.navigate('vistemperatura');
        break;
      case 3:
      navigation.navigate('visgpd');
      break;
      // Agregar más opciones según sea necesario
      default:
        break;
    }
  };

  return (
    <ImageBackground source={require('../Vistas/IMG/perritos.jpeg')} style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* Barra superior con botón de menú */}
        <View style={{ height: 60, backgroundColor: 'white', justifyContent: 'center', paddingHorizontal: 15 }}>
          <TouchableOpacity onPress={toggleMenu}>
            <Image
              source={require('../Vistas/IMG/perro.png')}  // El mismo ícono para abrir/cerrar
              style={{ width: 40, height: 40 }}
            />
          </TouchableOpacity>
        </View>

        {/* Menú lateral animado */}
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: 250,
            backgroundColor: 'white',
            transform: [{ translateX: slideAnim }],
            padding: 20,
          }}
        >
          {/* Botón para cerrar el menú en la parte superior */}
          <TouchableOpacity onPress={toggleMenu} style={{ marginBottom: 20 }}>
            <Image
              source={require('../Vistas/IMG/perro.png')}  // El mismo ícono para abrir/cerrar
              style={{ width: 40, height: 40 }}
            />
          </TouchableOpacity>

          {/* Opciones del menú */}
          {options.map((option, index) => (
            <TouchableOpacity key={index} onPress={() => handleOptionPress(index)} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name={option.icon} size={20} color={colors[index]} style={{ marginRight: 10 }} />
              <Text style={{ color: colors[index], fontSize: 18, marginVertical: 10 }}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Resto del contenido de la pantalla */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 24, color: 'white' }}>Bienvenidos estudiantes:D</Text>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Menu;
