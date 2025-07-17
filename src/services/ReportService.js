
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/reportes'; // Ajusta la URL si es necesario

// Función para descargar el reporte general
export const descargarReporteGeneral = async () => {
  try {
    const response = await axios.get(`${API_URL}/general`, {
      responseType: 'blob', // Importante para manejar la respuesta como un archivo
    });

    // Crear una URL para el blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;

    // Extraer el nombre del archivo de las cabeceras de la respuesta
    const contentDisposition = response.headers['content-disposition'];
    let fileName = 'reporte-general.xlsx'; // Nombre por defecto
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/i);
      if (fileNameMatch.length === 2) {
        fileName = fileNameMatch[1];
      }
    }

    link.setAttribute('download', fileName);
    
    // Añadir, simular clic y remover el enlace
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);

  } catch (error) {
    console.error('Error al descargar el reporte:', error);
    // Aquí podrías mostrar una notificación al usuario
    alert('No se pudo descargar el reporte. Revise la consola para más detalles.');
  }
};
