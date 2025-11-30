require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./database');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('Servicio de Reportes (Módulo 5.4) Activo');
});

app.listen(PORT, () => {
    console.log(`Servidor de Reportes corriendo en puerto ${PORT}`);
});
