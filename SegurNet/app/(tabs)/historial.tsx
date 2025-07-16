import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';

interface HistorialItem {
  historial_id: number;
  fecha: string;
  tipo: string;
  ubicacion: string;
}

export default function HistorialScreen() {
  const { user } = useAuth();
  const [historial, setHistorial] = useState<HistorialItem[]>([]);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const res = await fetch(`http://192.168.1.45:3000/api/historial/${user?.usuario_id}`);
        const data = await res.json();
        setHistorial(data);
      } catch (error) {
        console.error('Error cargando historial:', error);
      }
    };

    if (user) fetchHistorial();
  }, [user]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Historial</Text>

      <View style={styles.tableHeader}>
        <Text style={[styles.cell, styles.headerCell]}>#</Text>
        <Text style={[styles.cell, styles.headerCell]}>Fecha</Text>
        <Text style={[styles.cell, styles.headerCell]}>Tipo</Text>
        <Text style={[styles.cell, styles.headerCell]}>Ubicación</Text>
      </View>

      {historial.map((item, index) => (
        <View key={item.historial_id} style={styles.tableRow}>
          <Text style={styles.cell}>{index + 1}</Text>
          <Text style={styles.cell}>{item.fecha}</Text>
          <Text style={styles.cell}>{item.tipo}</Text>
          <Text style={styles.cell}>{item.ubicacion}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
  flex: 1,
  padding: 24,
  justifyContent: 'center',
  backgroundColor: '#fff' },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e74c3c',
    paddingVertical: 8,
    borderRadius: 5,
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  headerCell: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
