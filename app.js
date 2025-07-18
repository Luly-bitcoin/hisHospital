import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import admisionRoutes from './routes/admision.routes.js';
import indexRoutes from './routes/index.routes.js';
import camasRoutes from './routes/camas.routes.js';
import pacientesRoutes from './routes/paciente.routes.js';
import internacionesRoutes from './routes/internaciones.routes.js';
import emergenciasRoutes from './routes/emergencias.routes.js';
import turnosRoutes from './routes/turnos.routes.js';
import medicosRoutes from './routes/medicos.routes.js';

dotenv.config();
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRoutes);
app.use('/admision', admisionRoutes);
app.use('/camas', camasRoutes);
app.use('/pacientes', pacientesRoutes);
app.use('/internaciones', internacionesRoutes);
app.use('/emergencias', emergenciasRoutes);
app.use('/turnos', turnosRoutes);
app.use('/medicos', medicosRoutes);

app.get('/admision', (req, res) =>{
    res.render('agregar-paciente');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
