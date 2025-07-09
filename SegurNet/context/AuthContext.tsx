import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Usuario {
  usuario_id: number;
  nombres: string;
  apellidos: string;
  email: string;
  dni: string;
  tipo: string;
}

interface AuthContextProps {
  user: Usuario | null;
  login: (datos: Usuario) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null);

  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const data = await AsyncStorage.getItem('usuario');
        if (data) {
          setUser(JSON.parse(data));
        }
      } catch (error) {
        console.error('Error cargando usuario:', error);
      }
    };
    cargarUsuario();
  }, []);

  const login = async (datos: Usuario) => {
    try {
      await AsyncStorage.setItem('usuario', JSON.stringify(datos));
      setUser(datos);
    } catch (error) {
      console.error('Error guardando usuario:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('usuario');
      setUser(null);
    } catch (error) {
      console.error('Error cerrando sesión:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
