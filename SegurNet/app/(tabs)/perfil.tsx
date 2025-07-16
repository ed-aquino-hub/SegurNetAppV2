import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function PerfilScreen() {
  const { user } = useAuth();
  const [contacto, setContacto] = useState({
    nombre: '',
    dni: '',
    telefono: '',
  });

  useEffect(() => {
    // Aquí luego se puede cargar el contacto desde la BD si se requiere
  }, []);

  return (
    
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoContainer}>
              <Image source={require('../../assets/images/icono-alerta.png')} style={styles.icono} />
              <Text style={styles.nombreApp}>SegurNet</Text>
            </View>
      <Text style={styles.titulo}>Perfil</Text>

      <TextInput style={styles.input} value={user?.nombres} editable={false} />
      <TextInput style={styles.input} value={user?.apellidos} editable={false} />
      <TextInput style={styles.input} value={user?.dni} editable={false} />
      <TextInput style={styles.input} value={user?.email} editable={false} />

      <Image
        source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/World_map_-_low_resolution.svg/1200px-World_map_-_low_resolution.svg.png' }}
        style={styles.mapa}
      />

      <Text style={styles.subtitulo}>Contacto de emergencia</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombres completos"
        value={contacto.nombre}
        onChangeText={(text) => setContacto({ ...contacto, nombre: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="DNI"
        value={contacto.dni}
        onChangeText={(text) => setContacto({ ...contacto, dni: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Número de celular"
        keyboardType="phone-pad"
        value={contacto.telefono}
        onChangeText={(text) => setContacto({ ...contacto, telefono: text })}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({

   container: { 
  flex: 1,
  padding: 32,
  justifyContent: 'center',
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
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  mapa: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    marginVertical: 15,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 5,
  },
});
