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
      codigo: '1B',
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
          atribucionFueraDeCupo: 'No asignados todavía a una sección.',
          secciones: [
            { catedraId: 'CAT-C19-01', aulaId: 'SIM-1B-C19-01', aulaNombre: 'Aula simulada 1B C19-01', cupo: 18, alumnosInscriptosAsignados: 18 }
          ],
          causas: ['Escenario simulado: 18 alumnos inscriptos fueron asignados a la sección CAT-C19-01.', '5 alumnos inscriptos fuera de cupo siguen sin asignación a una sección.']
        },
        {
          materiaId: 'C20',
          materia: 'Taller de algoritmos y estructura de Datos II',
          total: 34,
          alumnosInscriptos: 26,
          alumnosInscriptosFueraDeCupo: 8,
          atribucionFueraDeCupo: 'No asignados todavía a una sección.',
          secciones: [
            { catedraId: 'CAT-C20-01', aulaId: 'SIM-1B-C20-01', aulaNombre: 'Aula simulada 1B C20-01', cupo: 12, alumnosInscriptosAsignados: 12 },
            { catedraId: 'CAT-C20-02', aulaId: 'SIM-1B-C20-02', aulaNombre: 'Aula simulada 1B C20-02', cupo: 14, alumnosInscriptosAsignados: 14 }
          ],
          causas: ['Escenario simulado: 26 alumnos inscriptos fueron asignados entre las secciones CAT-C20-01 y CAT-C20-02.', '8 alumnos inscriptos fuera de cupo siguen sin asignación a una sección.']
        },
        {
          materiaId: 'C23',
          materia: 'Ética y Deontología Profesional',
          total: 18,
          alumnosInscriptos: 18,
          alumnosInscriptosFueraDeCupo: 0,
          atribucionFueraDeCupo: 'Sin alumnos fuera de cupo.',
          secciones: [
            { catedraId: 'CAT-C23-01', aulaId: 'SIM-1B-C23-01', aulaNombre: 'Aula simulada 1B C23-01', cupo: 18, alumnosInscriptosAsignados: 18 }
          ],
          causas: ['Escenario simulado: los 18 alumnos inscriptos fueron asignados a la sección CAT-C23-01.']
        },
        {
          materiaId: 'C27',
          materia: 'Herramientas matemáticas V – Estadística II',
          total: 25,
          alumnosInscriptos: 19,
          alumnosInscriptosFueraDeCupo: 6,
          atribucionFueraDeCupo: 'No asignados todavía a una sección.',
          secciones: [
            { catedraId: 'CAT-C27-01', aulaId: 'SIM-1B-C27-01', aulaNombre: 'Aula simulada 1B C27-01', cupo: 19, alumnosInscriptosAsignados: 19 }
          ],
          causas: ['Escenario simulado: 19 alumnos inscriptos fueron asignados a la sección CAT-C27-01.', '6 alumnos inscriptos fuera de cupo siguen sin asignación a una sección.']
        },
        {
          materiaId: 'C29',
          materia: 'Seminario de práctica de Analista en Software',
          total: 14,
          alumnosInscriptos: 14,
          alumnosInscriptosFueraDeCupo: 0,
          atribucionFueraDeCupo: 'Sin alumnos fuera de cupo.',
          secciones: [
            { catedraId: 'CAT-C29-01', aulaId: 'SIM-1B-C29-01', aulaNombre: 'Aula simulada 1B C29-01', cupo: 14, alumnosInscriptosAsignados: 14 }
          ],
          causas: ['Escenario simulado: los 14 alumnos inscriptos fueron asignados a la sección CAT-C29-01.']
        }
      ]
    },
    {
      id: '2A-2026',
      codigo: '2A',
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
