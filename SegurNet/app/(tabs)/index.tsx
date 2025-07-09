import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { registrarHistorial } from '../../lib/api';

const EMERGENCIA_NUMERO = '+51904100430';

export default function EmergencyScreen() {
  const { user } = useAuth(); 
  const [location, setLocation] = useState<Location.LocationObject | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'No se puede obtener la ubicación');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

const enviarEmergencia = async (tipoEmergencia: string) => {
  if (!location) {
    Alert.alert('Error', 'Ubicación no disponible');
    return;
  }

  if (!user || !user.usuario_id) {
    Alert.alert('Error', 'Datos del usuario no disponibles');
    return;
  }

  const ubicacionTexto = `Lat: ${location.coords.latitude}, Lon: ${location.coords.longitude}`;
  const fechaHora = new Date().toLocaleString();
  const mensaje = `¡Ayuda! Soy ${user.nombres} ${user.apellidos} (DNI: ${user.dni}) y necesito asistencia. Estoy en ${ubicacionTexto}. Fecha y hora: ${fechaHora}`;

  try {
    // ✅ Enviar datos completos al backend
    await registrarHistorial(user.usuario_id, tipoEmergencia, ubicacionTexto);

    // Redirigir a WhatsApp
    const url = `https://wa.me/${EMERGENCIA_NUMERO}?text=${encodeURIComponent(mensaje)}`;
    await Linking.openURL(url);

    // Realizar llamada telefónica
    const telURL = `tel:${EMERGENCIA_NUMERO}`;
    await Linking.openURL(telURL);
  } catch (error) {
    console.error('Error en emergencia:', error);
    Alert.alert('Error', 'No se pudo procesar la emergencia');
  }
};



return (
  <View style={styles.container}>
    <Text style={styles.titulo}>Emergencias</Text>

    <TouchableOpacity
      style={[styles.boton, { backgroundColor: '#e74c3c' }]}
      onPress={() => enviarEmergencia('Policía')}
    >
      <Ionicons name="alert-circle" size={32} color="white" />
      <Text style={styles.textoBoton}>Policía</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.boton, { backgroundColor: '#f39c12' }]}
      onPress={() => enviarEmergencia('Bomberos')}
    >
      <Ionicons name="flame" size={32} color="white" />
      <Text style={styles.textoBoton}>Bomberos</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.boton, { backgroundColor: '#3498db' }]}
      onPress={() => enviarEmergencia('Ambulancia')}
    >
      <Ionicons name="medkit" size={32} color="white" />
      <Text style={styles.textoBoton}>Ambulancia</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.boton, { backgroundColor: '#27ae60' }]}
      onPress={() => enviarEmergencia('Contacto de Emergencia')}
    >
      <Ionicons name="call" size={32} color="white" />
      <Text style={styles.textoBoton}>Contacto Emergencia</Text>
    </TouchableOpacity>
  </View>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  boton: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'center',
  },
  textoBoton: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
});
