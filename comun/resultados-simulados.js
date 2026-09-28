/*
 * Resultados simulados construidos para el prototipo de planificación académica.
 * No provienen de una ejecución de CP-SAT ni son una fuente institucional.
 *
 * Las cátedras y franjas de esta foto pertenecen al resultado y algunas no
 * existen intencionalmente en la capa de oferta compartida DATOS_SIMULADOS.
 * Por eso el resultado no puede trazarse a la oferta que supuestamente usó.
 */
window.RESULTADOS_SIMULADOS = {
  simulado: true,
  nota: 'Resultados simulados con fines de diseño. El prototipo no ejecuta CP-SAT: estos datos no provienen de ninguna corrida real y declaran su propia foto de oferta, sin vínculo con DATOS_SIMULADOS.',
  // El período de planificación no ejecuta CP-SAT (decisión del autor del 2026-09-19), por lo que no tiene un conjunto de resultados.
  periodos: {
    '1B · 2026': [
      {
        id: 'alternativas', titulo: 'Alternativas de cursado',
        resumen: 'Estas combinaciones simuladas comparan criterios de cursado para el borrador ilustrado.',
        alternativas: [
          {
            id: 'ALT-1', titulo: 'Menos días de cursado', nota: 'Agrupa las clases en dos días dentro de esta combinación simulada.',
            asignaciones: [
              { materiaId: 'C19', catedraId: 'CAT-C19-02', docenteId: 'D09', aulaId: 'B-203', franjas: [{ dia: 'martes', desde: '10:00', hasta: '12:00' }, { dia: 'jueves', desde: '10:00', hasta: '12:00' }] },
              { materiaId: 'C20', catedraId: 'CAT-C20-02', docenteId: 'D03', aulaId: 'B-201', franjas: [{ dia: 'martes', desde: '18:00', hasta: '20:00' }, { dia: 'jueves', desde: '18:00', hasta: '20:00' }] },
              { materiaId: 'C23', catedraId: 'CAT-C23-01', docenteId: 'D04', aulaId: 'A-102', franjas: [{ dia: 'martes', desde: '08:00', hasta: '10:00' }] }
            ]
          },
          {
            id: 'ALT-2', titulo: 'Sin huecos entre clases', nota: 'Es factible: respeta cada restricción dura, pero no es óptima porque usa 4 días en lugar de 2.',
            asignaciones: [
              { materiaId: 'C19', catedraId: 'CAT-C19-02', docenteId: 'D09', aulaId: 'B-203', franjas: [{ dia: 'martes', desde: '10:00', hasta: '12:00' }, { dia: 'jueves', desde: '10:00', hasta: '12:00' }] },
              { materiaId: 'C20', catedraId: 'CAT-C20-04', docenteId: 'D08', aulaId: 'B-201', franjas: [{ dia: 'miércoles', desde: '08:00', hasta: '10:00' }, { dia: 'viernes', desde: '08:00', hasta: '10:00' }] },
              { materiaId: 'C23', catedraId: 'CAT-C23-01', docenteId: 'D04', aulaId: 'A-102', franjas: [{ dia: 'martes', desde: '08:00', hasta: '10:00' }] }
            ]
          },
          {
            id: 'ALT-3', titulo: 'Una clase por día', nota: 'Distribuye la cursada en cinco días dentro de esta combinación simulada.',
            asignaciones: [
              { materiaId: 'C19', catedraId: 'CAT-C19-01', docenteId: 'D01', aulaId: 'A-102', franjas: [{ dia: 'lunes', desde: '18:00', hasta: '20:00' }, { dia: 'miércoles', desde: '18:00', hasta: '20:00' }] },
              { materiaId: 'C20', catedraId: 'CAT-C20-02', docenteId: 'D03', aulaId: 'B-201', franjas: [{ dia: 'martes', desde: '18:00', hasta: '20:00' }, { dia: 'jueves', desde: '18:00', hasta: '20:00' }] },
              { materiaId: 'C23', catedraId: 'CAT-C23-02', docenteId: 'D07', aulaId: 'A-102', franjas: [{ dia: 'viernes', desde: '10:00', hasta: '12:00' }] }
            ]
          }
        ], explicacion: null
      },
      {
        id: 'optima', titulo: 'Solución óptima',
        resumen: 'Esta combinación simulada satisface cada restricción dura y optimiza los criterios declarados.',
        alternativas: [
          {
            id: 'ALT-1', titulo: 'Menos días de cursado', nota: 'Representa la alternativa simulada que optimiza los criterios declarados.',
            asignaciones: [
              { materiaId: 'C19', catedraId: 'CAT-C19-02', docenteId: 'D09', aulaId: 'B-203', franjas: [{ dia: 'martes', desde: '10:00', hasta: '12:00' }, { dia: 'jueves', desde: '10:00', hasta: '12:00' }] },
              { materiaId: 'C20', catedraId: 'CAT-C20-02', docenteId: 'D03', aulaId: 'B-201', franjas: [{ dia: 'martes', desde: '18:00', hasta: '20:00' }, { dia: 'jueves', desde: '18:00', hasta: '20:00' }] },
              { materiaId: 'C23', catedraId: 'CAT-C23-01', docenteId: 'D04', aulaId: 'A-102', franjas: [{ dia: 'martes', desde: '08:00', hasta: '10:00' }] }
            ]
          }
        ], explicacion: null
      },
      {
        id: 'factible', titulo: 'Solución factible',
        resumen: 'Esta combinación simulada respeta las restricciones duras, sin declararse óptima.',
        alternativas: [
          {
            id: 'ALT-2', titulo: 'Sin huecos entre clases', nota: 'Es factible: respeta cada restricción dura, pero no es óptima porque usa 4 días en lugar de 2.',
            asignaciones: [
              { materiaId: 'C19', catedraId: 'CAT-C19-02', docenteId: 'D09', aulaId: 'B-203', franjas: [{ dia: 'martes', desde: '10:00', hasta: '12:00' }, { dia: 'jueves', desde: '10:00', hasta: '12:00' }] },
              { materiaId: 'C20', catedraId: 'CAT-C20-04', docenteId: 'D08', aulaId: 'B-201', franjas: [{ dia: 'miércoles', desde: '08:00', hasta: '10:00' }, { dia: 'viernes', desde: '08:00', hasta: '10:00' }] },
              { materiaId: 'C23', catedraId: 'CAT-C23-01', docenteId: 'D04', aulaId: 'A-102', franjas: [{ dia: 'martes', desde: '08:00', hasta: '10:00' }] }
            ]
          }
        ], explicacion: null
      },
      {
        id: 'infactible', titulo: 'Infactibilidad explicada',
        resumen: 'Este desenlace simulado no presenta una combinación que satisfaga todas las restricciones declaradas.',
        alternativas: [], explicacion: { titulo: 'Por qué no hay solución', causas: ['martes y viernes están declarados como días no disponibles.', 'Las dos cátedras declaradas de C20 y las dos de C23 usan esos días, así que ninguna combinación evita la restricción.'] }
      },
      {
        id: 'indeterminado', titulo: 'Estado indeterminado por límite temporal',
        resumen: 'Esta simulación representa que el solver llegó a su límite temporal antes de poder probar que una solución fuera óptima.',
        alternativas: [
          {
            id: 'ALT-1', titulo: 'Menos días de cursado', parcial: true, nota: 'Es una solución parcial encontrada antes del límite temporal, sin garantía de optimalidad.',
            asignaciones: [
              { materiaId: 'C19', catedraId: 'CAT-C19-02', docenteId: 'D09', aulaId: 'B-203', franjas: [{ dia: 'martes', desde: '10:00', hasta: '12:00' }, { dia: 'jueves', desde: '10:00', hasta: '12:00' }] },
              { materiaId: 'C20', catedraId: 'CAT-C20-02', docenteId: 'D03', aulaId: 'B-201', franjas: [{ dia: 'martes', desde: '18:00', hasta: '20:00' }, { dia: 'jueves', desde: '18:00', hasta: '20:00' }] },
              { materiaId: 'C23', catedraId: 'CAT-C23-01', docenteId: 'D04', aulaId: 'A-102', franjas: [{ dia: 'martes', desde: '08:00', hasta: '10:00' }] }
            ]
          }
        ], explicacion: { titulo: 'Qué alcanzó a probar el motor', causas: ['El límite declarado es de 30 segundos y la búsqueda no terminó.', 'La solución parcial existe pero no está probada como óptima.'] }
      },
      {
        id: 'oferta-pendiente', titulo: 'Oferta pendiente a nivel de materia',
        resumen: 'Este desenlace simulado representa una materia marcada sin oferta publicada, por lo que no puede afirmar cátedras, horarios ni cupos.',
        alternativas: [], explicacion: { titulo: 'Qué falta', causas: ['C24 no tiene oferta publicada en 1B · 2026.', 'Sin oferta publicada no hay cátedra, horario ni cupo que validar.'] }
      }
    ]
  }
};
