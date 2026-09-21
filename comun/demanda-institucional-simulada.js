/*
 * Aggregated simulated demand for the institutional CU-10 mockup.
 * The records contain no student, personal, or institutional source data.
 */
window.DEMANDA_INSTITUCIONAL_SIMULADA = {
  simulado: true,
  actorProvisional: 'Operador institucional',
  periodos: [
    {
      id: '1B-2026',
      etiqueta: '1B · 2026',
      tipo: 'Período actual',
      demanda: [
        {
          materiaId: 'C19',
          materia: 'Algoritmos y estructura de Datos II',
          total: 30,
          elegibleActual: 18,
          condicionalSiguiente: 7,
          planificadaSinCupo: 5,
          causas: ['Demanda proyectada para la oferta publicada.']
        },
        {
          materiaId: 'C20',
          materia: 'Taller de algoritmos y estructura de Datos II',
          total: 42,
          elegibleActual: 26,
          condicionalSiguiente: 8,
          planificadaSinCupo: 8,
          causas: [
            'La demanda total supera la capacidad de referencia del aula A-101 (24 lugares).',
            'La oferta alternativa publicada deja 8 planificaciones sin cupo asignable.'
          ]
        },
        {
          materiaId: 'C23',
          materia: 'Ética y Deontología Profesional',
          total: 24,
          elegibleActual: 18,
          condicionalSiguiente: 6,
          planificadaSinCupo: 0,
          causas: ['La oferta publicada cubre la demanda simulada del período.']
        },
        {
          materiaId: 'C27',
          materia: 'Herramientas matemáticas V – Estadística II',
          total: 28,
          elegibleActual: 19,
          condicionalSiguiente: 3,
          planificadaSinCupo: 6,
          causas: [
            'La cátedra publicada no tiene cupos disponibles.',
            '6 planificaciones quedan sin cupo en el escenario simulado.'
          ]
        },
        {
          materiaId: 'C29',
          materia: 'Seminario de práctica de Analista en Software',
          total: 19,
          elegibleActual: 14,
          condicionalSiguiente: 5,
          planificadaSinCupo: 0,
          causas: ['La capacidad simulada disponible cubre la demanda prevista.']
        }
      ]
    },
    {
      id: '2A-2026',
      etiqueta: '2A · 2026',
      tipo: 'Período siguiente',
      demanda: [
        {
          materiaId: 'C20',
          materia: 'Taller de algoritmos y estructura de Datos II',
          total: 25,
          elegibleActual: 15,
          condicionalSiguiente: 7,
          planificadaSinCupo: 3,
          causas: ['La capacidad simulada deja 3 planificaciones sin cupo asignable.']
        },
        {
          materiaId: 'C25',
          materia: 'Análisis y diseño de Software',
          total: 21,
          elegibleActual: 0,
          condicionalSiguiente: 15,
          planificadaSinCupo: 6,
          causas: ['No hay oferta publicada para absorber las planificaciones del período.']
        },
        {
          materiaId: 'C42',
          materia: 'Emprendimientos universitarios',
          total: 37,
          elegibleActual: 28,
          condicionalSiguiente: 9,
          planificadaSinCupo: 0,
          causas: ['La oferta simulada cubre la demanda prevista.']
        },
        {
          materiaId: 'C43',
          materia: 'Métodos Formales',
          total: 22,
          elegibleActual: 17,
          condicionalSiguiente: 5,
          planificadaSinCupo: 0,
          causas: ['La oferta simulada cubre la demanda prevista.']
        }
      ]
    }
  ]
};
