import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { loginUsuario } from '../../lib/api';
import { useAuth } from '../../context/AuthContext'; 

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth(); 
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleLogin = async () => {
    if (!email || !contrasena) {
      Alert.alert('Campos requeridos', 'Completa todos los campos.');
      return;
    }

    try {
      console.log('📡 Enviando credenciales al backend...');
      const response = await loginUsuario({ email, contraseña: contrasena });

      if (response?.usuario) {
        console.log('✅ Usuario autenticado:', response.usuario);
        await login(response.usuario);
        Alert.alert('Bienvenido', 'Inicio de sesión exitoso');
        router.replace('../(tabs)/');
      } else {
        Alert.alert('Error', response?.mensaje || 'Credenciales incorrectas');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('❌ Error desde backend:', error.message);
        Alert.alert('Error al iniciar sesión', error.message);
      } else {
        console.error('❌ Error desconocido:', error);
        Alert.alert('Error desconocido', 'Ha ocurrido un error inesperado.');
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
      <Text style={styles.titulo}>Iniciar Sesión</Text>

      <Text style={styles.label}>Correo electrónico:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu correo..."
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Contraseña:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa tu contraseña..."
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
      />

      <TouchableOpacity style={styles.boton} onPress={handleLogin}>
        <Text style={styles.botonTexto}>Ingresar</Text>
      </TouchableOpacity>

      <Text style={styles.textoInferior}>
        ¿No tienes cuenta?{' '}
        <Text style={styles.enlace} onPress={() => router.push('/(auth)/register')}>
          Regístrate aquí
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  logoContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  icono: { width: 30, height: 30, marginRight: 8 },
  nombreApp: { fontSize: 22, fontWeight: 'bold' },
  avatar: { width: 100, height: 100, alignSelf: 'center', marginBottom: 16 },
  titulo: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  label: { fontSize: 14, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#aaa', borderRadius: 8, padding: 10, marginBottom: 12 },
  boton: { backgroundColor: '#000', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  botonTexto: { color: '#fff', fontWeight: 'bold' },
  textoInferior: { marginTop: 16, textAlign: 'center' },
  enlace: { color: '#007AFF', fontWeight: 'bold' },
});
