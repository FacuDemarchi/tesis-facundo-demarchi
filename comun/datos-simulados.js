/*
 * Datos simulados construidos para el prototipo de planificación académica.
 * No son una fuente institucional: nombres, capacidades, demanda y horarios
 * son inventados. No incluyen datos de estudiantes ni datos personales reales.
 *
 * La cobertura es deliberadamente parcial: solo se modelan ofertas de materias
 * no aprobadas. C24 se omite porque no tiene cátedra, para ejercitar el
 * estado "sin cátedra"; las demás materias no listadas también
 * representan información todavía incompleta para la interfaz.
 */
window.DATOS_SIMULADOS = {
  simulado: true,

  // Índice de materias con alguna oferta; C24 se omite intencionalmente.
  materias: {
    C19: { id: 'C19' },
    C20: { id: 'C20' },
    C23: { id: 'C23' },
    C27: { id: 'C27' },
    C29: { id: 'C29' },
    C42: { id: 'C42' },
    C43: { id: 'C43' },
    C45: { id: 'C45' }
  },

  aulas: [
    { id: 'A-101', nombre: 'Aula A-101', capacidad: 24, tipo: 'aula' },
    { id: 'A-102', nombre: 'Aula A-102', capacidad: 48, tipo: 'aula' },
    { id: 'B-201', nombre: 'Aula B-201', capacidad: 80, tipo: 'aula' },
    { id: 'B-203', nombre: 'Laboratorio B-203', capacidad: 60, tipo: 'laboratorio' },
    { id: 'C-301', nombre: 'Aula C-301', capacidad: 100, tipo: 'aula' },
    // Aulas simuladas exclusivas del período actual de CU-10. No reemplazan las aulas compartidas.
    { id: 'SIM-1B-C19-01', nombre: 'Aula simulada 1B C19-01', capacidad: 18, tipo: 'aula' },
    { id: 'SIM-1B-C20-01', nombre: 'Aula simulada 1B C20-01', capacidad: 12, tipo: 'aula' },
    { id: 'SIM-1B-C20-02', nombre: 'Aula simulada 1B C20-02', capacidad: 14, tipo: 'aula' },
    { id: 'SIM-1B-C23-01', nombre: 'Aula simulada 1B C23-01', capacidad: 18, tipo: 'aula' },
    { id: 'SIM-1B-C27-01', nombre: 'Aula simulada 1B C27-01', capacidad: 19, tipo: 'aula' },
    { id: 'SIM-1B-C29-01', nombre: 'Aula simulada 1B C29-01', capacidad: 14, tipo: 'aula' }
  ],

  docentes: [
    { id: 'D01', nombre: 'Nadia Lumeria' },
    { id: 'D02', nombre: 'Tadeo Brumel' },
    { id: 'D03', nombre: 'Iris Cobalta' },
    { id: 'D04', nombre: 'León Nivaro' },
    { id: 'D05', nombre: 'Mara Solvén' },
    { id: 'D06', nombre: 'Elio Vardán' },
    { id: 'D07', nombre: 'Vera Quimera' },
    { id: 'D08', nombre: 'Gael Tarsio' },
    { id: 'D09', nombre: 'Lina Orbelia' }
  ],

  // El bimestre se deriva de periodo: 1A/2A corresponde a A y 1B/2B a B.
  // periodo conserva la etiqueta consumida por los mockups; periodoId permite enlaces canónicos.
  catedras: [
    {
      id: 'CAT-C19-01',
      materiaId: 'C19',
      periodo: '1B · 2026',
      periodoId: '1B-2026',
      docente: 'D01',
      aulaId: 'SIM-1B-C19-01',
      cupo: 18,
      franjas: [
        { dia: 'lunes', desde: '18:00', hasta: '20:00' },
        { dia: 'miércoles', desde: '18:00', hasta: '20:00' }
      ]
    },
    // C20 conserva dos secciones llenas; los inscriptos fuera de cupo se atribuyen solo a la materia.
    {
      id: 'CAT-C20-01',
      materiaId: 'C20',
      periodo: '1B · 2026',
      periodoId: '1B-2026',
      docente: 'D02',
      aulaId: 'SIM-1B-C20-01',
      cupo: 12,
      franjas: [
        { dia: 'lunes', desde: '19:00', hasta: '21:00' }
      ]
    },
    {
      id: 'CAT-C20-02',
      materiaId: 'C20',
      periodo: '1B · 2026',
      periodoId: '1B-2026',
      docente: 'D03',
      aulaId: 'SIM-1B-C20-02',
      cupo: 14,
      franjas: [
        { dia: 'martes', desde: '18:00', hasta: '20:00' },
        { dia: 'jueves', desde: '18:00', hasta: '20:00' }
      ]
    },
    {
      id: 'CAT-C23-01',
      materiaId: 'C23',
      periodo: '1B · 2026',
      periodoId: '1B-2026',
      docente: 'D04',
      aulaId: 'SIM-1B-C23-01',
      cupo: 18,
      franjas: [
        { dia: 'martes', desde: '08:00', hasta: '10:00' }
      ]
    },
    // La única sección de C27 está completa; seis inscriptos fuera de cupo siguen sin sección asignada.
    {
      id: 'CAT-C27-01',
      materiaId: 'C27',
      periodo: '1B · 2026',
      periodoId: '1B-2026',
      docente: 'D05',
      aulaId: 'SIM-1B-C27-01',
      cupo: 19,
      franjas: [
        { dia: 'miércoles', desde: '20:00', hasta: '22:00' }
      ]
    },
    {
      id: 'CAT-C29-01',
      materiaId: 'C29',
      periodo: '1B · 2026',
      periodoId: '1B-2026',
      docente: 'D06',
      aulaId: 'SIM-1B-C29-01',
      cupo: 14,
      franjas: [
        { dia: 'jueves', desde: '10:00', hasta: '12:00' }
      ]
    },
    {
      id: 'CAT-C20-03',
      materiaId: 'C20',
      periodo: '2A · 2026',
      docente: 'D07',
      aulaId: 'B-203',
      cupo: 16,
      franjas: [
        { dia: 'lunes', desde: '08:00', hasta: '10:00' }
      ]
    },
    {
      id: 'CAT-C42-01',
      materiaId: 'C42',
      periodo: '2A · 2026',
      docente: 'D08',
      aulaId: 'C-301',
      cupo: 40,
      franjas: [
        { dia: 'lunes', desde: '14:00', hasta: '16:00' }
      ]
    },
    {
      id: 'CAT-C43-01',
      materiaId: 'C43',
      periodo: '2A · 2026',
      docente: 'D09',
      aulaId: 'A-102',
      cupo: 20,
      franjas: [
        { dia: 'miércoles', desde: '14:00', hasta: '16:00' }
      ]
    },
    {
      id: 'CAT-C45-01',
      materiaId: 'C45',
      periodo: '2A · 2026',
      docente: 'D06',
      aulaId: 'B-201',
      cupo: 35,
      franjas: [
        { dia: 'viernes', desde: '16:00', hasta: '18:00' }
      ]
    }
  ],

  franjas: [
    { dia: 'lunes', desde: '08:00', hasta: '10:00' },
    { dia: 'lunes', desde: '14:00', hasta: '16:00' },
    { dia: 'lunes', desde: '18:00', hasta: '20:00' },
    { dia: 'lunes', desde: '19:00', hasta: '21:00' },
    { dia: 'martes', desde: '08:00', hasta: '10:00' },
    { dia: 'martes', desde: '18:00', hasta: '20:00' },
    { dia: 'miércoles', desde: '14:00', hasta: '16:00' },
    { dia: 'miércoles', desde: '18:00', hasta: '20:00' },
    { dia: 'miércoles', desde: '20:00', hasta: '22:00' },
    { dia: 'jueves', desde: '10:00', hasta: '12:00' },
    { dia: 'jueves', desde: '18:00', hasta: '20:00' },
    { dia: 'viernes', desde: '16:00', hasta: '18:00' }
  ]
};
