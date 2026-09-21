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
      metricas: ['total', 'alumnosInscriptos', 'alumnosInscriptosFueraDeCupo'],
      demanda: [
        {
          materiaId: 'C19',
          materia: 'Algoritmos y estructura de Datos II',
          total: 23,
          alumnosInscriptos: 18,
          alumnosInscriptosFueraDeCupo: 5,
          causas: ['18 alumnos inscriptos fueron absorbidos por el cupo asignado.', '5 alumnos inscriptos no pudieron ser absorbidos por el cupo asignado.']
        },
        {
          materiaId: 'C20',
          materia: 'Taller de algoritmos y estructura de Datos II',
          total: 34,
          alumnosInscriptos: 26,
          alumnosInscriptosFueraDeCupo: 8,
          causas: ['26 alumnos inscriptos fueron absorbidos por el cupo asignado.', '8 alumnos inscriptos no pudieron ser absorbidos por el cupo asignado.']
        },
        {
          materiaId: 'C23',
          materia: 'Ética y Deontología Profesional',
          total: 18,
          alumnosInscriptos: 18,
          alumnosInscriptosFueraDeCupo: 0,
          causas: ['Los 18 alumnos inscriptos fueron absorbidos por el cupo asignado.']
        },
        {
          materiaId: 'C27',
          materia: 'Herramientas matemáticas V – Estadística II',
          total: 25,
          alumnosInscriptos: 19,
          alumnosInscriptosFueraDeCupo: 6,
          causas: ['19 alumnos inscriptos fueron absorbidos por el cupo asignado.', '6 alumnos inscriptos no pudieron ser absorbidos por el cupo asignado.']
        },
        {
          materiaId: 'C29',
          materia: 'Seminario de práctica de Analista en Software',
          total: 14,
          alumnosInscriptos: 14,
          alumnosInscriptosFueraDeCupo: 0,
          causas: ['Los 14 alumnos inscriptos fueron absorbidos por el cupo asignado.']
        }
      ]
    },
    {
      id: '2A-2026',
      etiqueta: '2A · 2026',
      tipo: 'Período siguiente',
      metricas: ['total', 'demandaFutura'],
      demanda: [
        {
          materiaId: 'C20',
          materia: 'Taller de algoritmos y estructura de Datos II',
          total: 7,
          demandaFutura: 7,
          causas: ['7 estudiantes manifestaron demanda futura para 2A · 2026.']
        },
        {
          materiaId: 'C25',
          materia: 'Análisis y diseño de Software',
          total: 15,
          demandaFutura: 15,
          causas: ['15 estudiantes manifestaron demanda futura para 2A · 2026.']
        },
        {
          materiaId: 'C42',
          materia: 'Emprendimientos universitarios',
          total: 9,
          demandaFutura: 9,
          causas: ['9 estudiantes manifestaron demanda futura para 2A · 2026.']
        },
        {
          materiaId: 'C43',
          materia: 'Métodos Formales',
          total: 5,
          demandaFutura: 5,
          causas: ['5 estudiantes manifestaron demanda futura para 2A · 2026.']
        }
      ]
    }
  ]
};
