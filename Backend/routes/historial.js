const express = require('express');
const router = express.Router();
const connection = require('../db/conexion');

router.post('/', (req, res) => {
  const { usuario_id, tipoEmergencia, ubicacion } = req.body;

  if (!usuario_id || !tipoEmergencia || !ubicacion) {
    return res.status(400).json({ mensaje: 'Datos incompletos' });
  }

  const fecha = new Date();
  const insertEmergencia = 'INSERT INTO Emergencia (tipo, fecha, ubicacion, usuario_id) VALUES (?, ?, ?, ?)';

  connection.query(insertEmergencia, [tipoEmergencia, fecha, ubicacion, usuario_id], (err, result) => {
    if (err) {
      console.error('❌ Error al registrar emergencia:', err);
      return res.status(500).json({ mensaje: 'Error al registrar emergencia' });
    }

    const emergencia_id = result.insertId;
    const insertHistorial = 'INSERT INTO Historial (usuario_id, emergencia_id) VALUES (?, ?)';

    connection.query(insertHistorial, [usuario_id, emergencia_id], (err2) => {
      if (err2) {
        console.error('❌ Error al guardar historial:', err2);
        return res.status(500).json({ mensaje: 'Error al guardar historial' });
      }

      return res.status(201).json({ mensaje: 'Historial registrado correctamente' });
    });
  });
});


module.exports = router;
