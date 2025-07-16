const express = require('express');
const router = express.Router();
const connection = require('../db/conexion');

router.post('/', (req, res) => {
  const { usuario_id, tipo, fecha, ubicacion } = req.body;

  if (!usuario_id || !tipo || !fecha || !ubicacion) {
    return res.status(400).json({ mensaje: 'Datos incompletos' });
  }

  const queryEmergencia =
    'INSERT INTO emergencia (tipo, fecha, ubicacion, usuario_id) VALUES (?, ?, ?, ?)';
  connection.query(
    queryEmergencia,
    [tipo, fecha, ubicacion, usuario_id],
    (err, result) => {
      if (err) {
        console.error('❌ Error al registrar emergencia:', err);
        return res.status(500).json({ mensaje: 'Error del servidor' });
      }

      const emergencia_id = result.insertId;
      const queryHistorial =
        'INSERT INTO historial (usuario_id, emergencia_id) VALUES (?, ?)';
      connection.query(
        queryHistorial,
        [usuario_id, emergencia_id],
        (err) => {
          if (err) {
            console.error('❌ Error al guardar historial:', err);
            return res.status(500).json({ mensaje: 'Error del servidor' });
          }

          return res
            .status(201)
            .json({ mensaje: 'Emergencia e historial registrados correctamente' });
        }
      );
    }
  );
});

router.get('/:usuario_id', (req, res) => {
  const { usuario_id } = req.params;

  const query = `
    SELECT h.historial_id, e.fecha, e.tipo, e.ubicacion
    FROM Historial h
    INNER JOIN Emergencia e ON h.emergencia_id = e.emergencia_id
    WHERE h.usuario_id = ? ORDER BY e.fecha DESC
  `;

  connection.query(query, [usuario_id], (err, results) => {
    if (err) {
      console.error('❌ Error al obtener historial:', err);
      return res.status(500).json({ mensaje: 'Error del servidor' });
    }

    res.json(results);
  });
});

module.exports = router;
