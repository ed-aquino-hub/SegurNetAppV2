const express = require('express');
const cors = require('cors');
const app = express();
const usuarioRoutes = require('./routes/usuario');
const historialRoutes = require('./routes/historial');
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.use('/api/historial', historialRoutes);
app.use('/api/usuarios', usuarioRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
