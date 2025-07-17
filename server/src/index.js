const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const AppDataSource = require('./config/database');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const estudianteRoutes = require('./routes/estudianteRoutes');
const ejercicioRoutes = require('./routes/ejercicioRoutes');
const progresoEstudianteRoutes = require('./routes/progresoEstudianteRoutes');
const recompensaRoutes = require('./routes/recompensaRoutes');
const logroRoutes = require('./routes/logroRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Configurar rutas
app.use('/api/auth', authRoutes);
app.use('/api/estudiantes', estudianteRoutes);
app.use('/api/ejercicios', ejercicioRoutes);
app.use('/api/progreso-estudiantes', progresoEstudianteRoutes);
app.use('/api/recompensas', recompensaRoutes);
app.use('/api/logros', logroRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const PORT = process.env.PORT || 3000;

AppDataSource.initialize().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => console.log(error));