import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, Linking } from 'react-native';
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

 const enviarEmergencia = async (emergencia_id: number) => {
  if (!location || !user) {
    Alert.alert('Error', 'Faltan datos de ubicación o usuario');
    return;
  }

  const fechaHora = new Date().toISOString().split("T")[0]; // Formato YYYY-MM-DD
  const ubicacion = `Lat: ${location.coords.latitude}, Lon: ${location.coords.longitude}`;

  const tipos: Record<number, string> = {
    1: "Policía",
    2: "Bomberos",
    3: "Ambulancia",
    4: "Contacto Emergencia"
  };

  const tipoEmergencia = tipos[emergencia_id];
  const mensaje = `¡Ayuda! Soy ${user.nombres} ${user.apellidos} (DNI: ${user.dni}) y necesito asistencia. Estoy en ${ubicacion}. Fecha: ${fechaHora}`;

  try {
    await registrarHistorial({
      usuario_id: user.usuario_id,
      tipo: tipoEmergencia,
      fecha: fechaHora,
      ubicacion
    });

    const url = `https://wa.me/${EMERGENCIA_NUMERO}?text=${encodeURIComponent(mensaje)}`;
    await Linking.openURL(url);

    const telURL = `tel:${EMERGENCIA_NUMERO}`;
    await Linking.openURL(telURL);
  } catch (error) {
    console.error('Error en emergencia:', error);
    Alert.alert('Error', 'No se pudo procesar la emergencia');
  }
};

  return (
    
    <View style={styles.container}>
  
      <View style={styles.logoContainer}>
                    <Image source={require('../../assets/images/icono-alerta.png')} style={styles.icono} />
                    <Text style={styles.nombreApp}>SegurNet</Text>
                  </View>
      <Text style={styles.subtitulo}>Presiona un icono para contactar el servicio de emergencia que requieras</Text>

      <View style={styles.grid}>
        <TouchableOpacity style={styles.card} onPress={() => enviarEmergencia(1)}>
          <Ionicons name="shield" size={60} color="#2c3e50" />
          <Text style={styles.textoCard}>Policía</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => enviarEmergencia(2)}>
          <Ionicons name="flame" size={60} color="#e74c3c" />
          <Text style={styles.textoCard}>Bomberos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => enviarEmergencia(3)}>
          <Ionicons name="medkit" size={60} color="#3498db" />
          <Text style={styles.textoCard}>Ambulancia</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => enviarEmergencia(4)}>
          <Ionicons name="call" size={60} color="#27ae60" />
          <Text style={styles.textoCard}>Contacto Emergencia</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
   container: { 
    flex: 1,
    padding: 45,
    justifyContent: 'flex-start',
    backgroundColor: '#fff' },

  logoContainer: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20 },

  icono: { width: 50, height: 50, marginRight: 8 },
  nombreApp: { fontSize: 40, fontWeight: 'bold' },

  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    width: '70%',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
    margin: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textoCard: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
});
