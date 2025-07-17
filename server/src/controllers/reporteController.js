const AppDataSource = require('../config/database.js');
const Estudiante = require('../entities/Estudiante');
const Ejercicio = require('../entities/Ejercicio');
const ProgresoEstudiante = require('../entities/ProgresoEstudiante');
const RecompensaDesbloqueada = require('../entities/RecompensaDesbloqueada');
const Recompensa = require('../entities/Recompensa');
const exceljs = require('exceljs');

// Función principal para exportar el reporte general
const exportarReporteGeneral = async (req, res) => {
  try {
    const workbook = new exceljs.Workbook();
    workbook.creator = 'TuAplicacion';
    workbook.created = new Date();

    // Crear cada hoja del reporte
    await crearHojaEstudiantes(workbook);
    await crearHojaEjercicios(workbook);
    await crearHojaSeguimiento(workbook);
    await crearHojaRecompensas(workbook);
    await crearHojaRendimientoPorGrado(workbook);
    await crearHojaRendimientoPorOperacion(workbook);

    // Configurar la respuesta para descargar el archivo
    const fechaActual = new Date().toISOString().slice(0, 10);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=reporte-general-${fechaActual}.xlsx`
    );

    // Enviar el libro de Excel como respuesta
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Error al generar el reporte:', error);
    res.status(500).json({ message: 'Error al generar el reporte', error: error.message });
  }
};

// --- Funciones Auxiliares para cada Hoja ---

async function crearHojaEstudiantes(workbook) {
  const sheet = workbook.addWorksheet('Estudiantes');
  sheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Nombre', key: 'nombre', width: 30 },
    { header: 'Usuario', key: 'usuario', width: 20 },
    { header: 'Código Alumno', key: 'codigo_alumno', width: 20 },
    { header: 'Grado', key: 'grado', width: 15 },
    { header: 'Puntos Recompensa', key: 'puntos_recompensa', width: 20 },
    { header: 'Estado', key: 'estado', width: 15 },
    { header: 'Fecha Creación', key: 'fecha_creacion', width: 25 },
  ];

  const estudiantes = await AppDataSource.getRepository(Estudiante).find();
  const estudiantesFormateados = estudiantes.map(e => ({
    id: e.id,
    nombre: e.nombre,
    usuario: e.usuario,
    codigo_alumno: e.codigo_alumno,
    grado: e.grado,
    puntos_recompensa: e.puntos_recompensa,
    estado: e.esta_activo ? 'Activo' : 'Inactivo',
    fecha_creacion: e.fecha_creacion,
  }));
  sheet.addRows(estudiantesFormateados);
}

async function crearHojaEjercicios(workbook) {
  const sheet = workbook.addWorksheet('Catálogo de Ejercicios');
  sheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Grado', key: 'grado', width: 10 },
    { header: 'Tipo Operación', key: 'tipo_operacion', width: 20 },
    { header: 'Pregunta', key: 'pregunta', width: 50 },
    { header: 'Respuesta Correcta', key: 'respuesta_correcta', width: 20 },
    { header: 'Fecha Creación', key: 'fecha_creacion', width: 25 },
  ];
  const ejercicios = await AppDataSource.getRepository(Ejercicio).find();
  const ejerciciosFormateados = ejercicios.map(e => ({
    id: e.id,
    grado: e.grado,
    tipo_operacion: e.tipo_operacion,
    pregunta: e.pregunta,
    respuesta_correcta: e.respuesta_correcta,
    fecha_creacion: e.fecha_creacion,
  }));
  sheet.addRows(ejerciciosFormateados);
}

async function crearHojaSeguimiento(workbook) {
  const sheet = workbook.addWorksheet('Seguimiento de Estudiantes');
  sheet.columns = [
    { header: 'Fecha', key: 'fecha_intento', width: 20 },
    { header: 'Estudiante', key: 'nombre_estudiante', width: 30 },
    { header: 'Ejercicio (Problema)', key: 'pregunta', width: 40 },
    { header: 'Respuesta Enviada', key: 'respuesta_enviada', width: 25 },
    { header: 'Fue Correcta', key: 'es_correcta_texto', width: 15 },
  ];
  const progresos = await AppDataSource.getRepository(ProgresoEstudiante).find({
    relations: ['estudiante', 'ejercicio'],
    order: { fecha_intento: 'DESC' }
  });
  const progresosFormateados = progresos.map(p => ({
    fecha_intento: p.fecha_intento,
    nombre_estudiante: p.estudiante ? p.estudiante.nombre : '',
    pregunta: p.ejercicio ? p.ejercicio.pregunta : '',
    respuesta_enviada: p.respuesta_enviada,
    es_correcta_texto: p.es_correcta ? 'Sí' : 'No',
  }));
  sheet.addRows(progresosFormateados);
}

async function crearHojaRecompensas(workbook) {
  const sheet = workbook.addWorksheet('Recompensas Obtenidas');
  sheet.columns = [
    { header: 'Fecha de Desbloqueo', key: 'fecha_desbloqueo', width: 25 },
    { header: 'Estudiante', key: 'nombre_estudiante', width: 30 },
    { header: 'Recompensa', key: 'nombre_recompensa', width: 30 },
  ];
  const recompensasDesbloqueadas = await AppDataSource.getRepository(RecompensaDesbloqueada).find({
    relations: ['estudiante', 'recompensa'],
    order: { fecha_desbloqueo: 'DESC' }
  });
  const recompensasFormateadas = recompensasDesbloqueadas.map(rd => ({
    fecha_desbloqueo: rd.fecha_desbloqueo,
    nombre_estudiante: rd.estudiante ? rd.estudiante.nombre : '',
    nombre_recompensa: rd.recompensa ? rd.recompensa.nombre : '',
  }));
  sheet.addRows(recompensasFormateadas);
}

async function crearHojaRendimientoPorGrado(workbook) {
  const sheet = workbook.addWorksheet('Rendimiento por Grado');
  sheet.columns = [
    { header: 'Grado', key: 'grado', width: 15 },
    { header: 'Total Ejercicios', key: 'total_ejercicios', width: 20 },
    { header: 'Correctos', key: 'correctos', width: 15 },
    { header: 'Incorrectos', key: 'incorrectos', width: 15 },
    { header: '% Rendimiento', key: 'rendimiento', width: 20 },
  ];
  // Obtener todos los progresos con relaciones
  const progresos = await AppDataSource.getRepository(ProgresoEstudiante).find({
    relations: ['estudiante'],
  });
  // Agrupar por grado
  const agrupado = {};
  progresos.forEach(p => {
    const grado = p.estudiante ? p.estudiante.grado : 'Sin grado';
    if (!agrupado[grado]) {
      agrupado[grado] = { total: 0, correctos: 0, incorrectos: 0 };
    }
    agrupado[grado].total++;
    if (p.es_correcta) agrupado[grado].correctos++;
    else agrupado[grado].incorrectos++;
  });
  const rows = Object.entries(agrupado).map(([grado, datos]) => ({
    grado,
    total_ejercicios: datos.total,
    correctos: datos.correctos,
    incorrectos: datos.incorrectos,
    rendimiento: datos.total > 0 ? ((datos.correctos * 100) / datos.total).toFixed(2) + '%' : '0.00%'
  }));
  sheet.addRows(rows);
}

async function crearHojaRendimientoPorOperacion(workbook) {
  const sheet = workbook.addWorksheet('Rendimiento por Operación');
  sheet.columns = [
    { header: 'Tipo de Operación', key: 'tipo_operacion', width: 25 },
    { header: 'Total Ejercicios', key: 'total_ejercicios', width: 20 },
    { header: 'Correctos', key: 'correctos', width: 15 },
    { header: 'Incorrectos', key: 'incorrectos', width: 15 },
    { header: '% Rendimiento', key: 'rendimiento', width: 20 },
  ];
  // Obtener todos los progresos con relaciones
  const progresos = await AppDataSource.getRepository(ProgresoEstudiante).find({
    relations: ['ejercicio'],
  });
  // Agrupar por tipo_operacion
  const agrupado = {};
  progresos.forEach(p => {
    const tipo = p.ejercicio ? p.ejercicio.tipo_operacion : 'Sin tipo';
    if (!agrupado[tipo]) {
      agrupado[tipo] = { total: 0, correctos: 0, incorrectos: 0 };
    }
    agrupado[tipo].total++;
    if (p.es_correcta) agrupado[tipo].correctos++;
    else agrupado[tipo].incorrectos++;
  });
  const rows = Object.entries(agrupado).map(([tipo_operacion, datos]) => ({
    tipo_operacion,
    total_ejercicios: datos.total,
    correctos: datos.correctos,
    incorrectos: datos.incorrectos,
    rendimiento: datos.total > 0 ? ((datos.correctos * 100) / datos.total).toFixed(2) + '%' : '0.00%'
  }));
  sheet.addRows(rows);
}

module.exports = {
  exportarReporteGeneral,
};