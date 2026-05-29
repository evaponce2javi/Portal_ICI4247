// PRUEBA_SISTEMA_ARCHIVOS_2026
require('dotenv').config();
const express = require('express');
const cors = require('cors');

//importar rutas de autenticacion
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middlewares globales de seguridad y formato
app.use(cors()); // Implementación CORS
app.use(express.json()); // Parseo de JSON para los endpoints REST

// Ruta de comprobación de estado
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API del Portal de Transparencia operando correctamente'
    });
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas protegidas para usuarios autenticados
app.use('/api/usuario', require('./routes/userRoutes'));

// Rutas públicas para datos municipales
app.use('/api', require('./routes/publicRoutes'));

// Rutas administrativas para gestión de contratos (solo para ADMIN)
app.use('/api/admin', require('./routes/adminRoutes'));

// Configuración del puerto
const PORT = process.env.PORT || 3000;

// Inicialización del servidor
app.listen(PORT, () => {
    console.log(`Servidor inicializado en el puerto ${PORT}`);
});
