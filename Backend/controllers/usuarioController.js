
const db = require('../db/conexion');
const connection = require('../db/conexion');

exports.registrarUsuario = (req, res) => {
  const { dni, apellidos, nombres, email, contraseña, tipo } = req.body;

  const query = 'INSERT INTO Usuario (dni, apellidos, nombres, email, contraseña, tipo) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [dni, apellidos, nombres, email, contraseña, tipo];

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('❌ Error real al registrar en MySQL:', err);
      return res.status(500).json({ mensaje: 'Error en el registro' });
    }

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
  });
};


exports.loginUsuario = (req, res) => {
  const { email, contraseña } = req.body;

  const query = 'SELECT * FROM Usuario WHERE email = ? AND contraseña = ?';
  connection.query(query, [email, contraseña], (err, results) => {
    if (err) {
      console.error('Error en login:', err);
      return res.status(500).json({ mensaje: 'Error del servidor' });
    }

    if (results.length > 0) {
      return res.status(200).json({ mensaje: 'Inicio de sesión exitoso', usuario: results[0] });
    } else {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }
  });
};

