import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { registrarUsuario } from '../../lib/api';

export default function RegisterScreen() {
  const router = useRouter();
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    console.log('Intentando registrar usuario...');

    if (!nombres || !apellidos || !tipoDocumento || !numeroDocumento || !email || !password) {
      Alert.alert('Campos requeridos', 'Completa todos los campos.');
      return;
    }

    const usuario = {
      dni: numeroDocumento,
      apellidos,
      nombres,
      email,
      contraseña: password,
      tipo: tipoDocumento
    };

    try {
      const response = await registrarUsuario(usuario);
      console.log('Usuario registrado:', response);
      Alert.alert('Éxito', 'Cuenta creada correctamente');
      router.replace('/(auth)/login');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('❌ Error real desde backend:', error.message);
        Alert.alert('Error al registrar', error.message);
      } else {
        console.error('❌ Error desconocido:', error);
        Alert.alert('Error desconocido', 'Ocurrió un problema inesperado.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/images/icono-alerta.png')} style={styles.icono} />
        <Text style={styles.nombreApp}>SegurNet</Text>
      </View>

      <Image source={require('../../assets/images/usuario.png')} style={styles.avatar} />
      <Text style={styles.titulo}>Crear Cuenta</Text>

      <Text style={styles.label}>Nombres:</Text>
      <TextInput style={styles.input} placeholder="Ej. Fulano" value={nombres} onChangeText={setNombres} />

      <Text style={styles.label}>Apellidos:</Text>
      <TextInput style={styles.input} placeholder="Ej. De Tal" value={apellidos} onChangeText={setApellidos} />

      <Text style={styles.label}>Tipo de Documento:</Text>
      <TextInput style={styles.input} placeholder="DNI" value={tipoDocumento} onChangeText={setTipoDocumento} />

      <Text style={styles.label}>Número de Documento:</Text>
      <TextInput style={styles.input} placeholder="Número" value={numeroDocumento} onChangeText={setNumeroDocumento} />

      <Text style={styles.label}>Correo electrónico:</Text>
      <TextInput style={styles.input} placeholder="Ingresa tu correo..." value={email} onChangeText={setEmail} keyboardType="email-address" />

      <Text style={styles.label}>Contraseña:</Text>
      <TextInput style={styles.input} placeholder="Crea una contraseña..." value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={styles.boton} onPress={handleRegister}>
        <Text style={styles.botonTexto}>Registrarse</Text>
      </TouchableOpacity>

      <Text style={styles.textoInferior}>
        ¿Ya tienes cuenta?{' '}
        <Text style={styles.enlace} onPress={() => router.push('/(auth)/login')}>
          Inicia sesión
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff' },

  logoContainer: { 
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 20 },

  icono: { width: 50, height: 50, marginRight: 8 },
  nombreApp: { fontSize: 32, fontWeight: 'bold' },
  avatar: { width: 100, height: 100, alignSelf: 'center', marginBottom: 16 },
  titulo: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  label: { fontSize: 14, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#aaa', borderRadius: 8, padding: 10, marginBottom: 12 },
  boton: { backgroundColor: '#000', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  botonTexto: { color: '#fff', fontWeight: 'bold' },
  textoInferior: { marginTop: 16, textAlign: 'center' },
  enlace: { color: '#007AFF', fontWeight: 'bold' },
});
