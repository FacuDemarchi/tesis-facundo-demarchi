/*
 * Deterministic, read-only optimizer for the current institutional-demand period.
 * It deliberately enumerates every compatible assignment; no solver or input mutation is used.
 */
(function attachGlobalClassroomOptimizer(global) {
  'use strict';

  function fail(message) {
    throw new Error(`Global classroom optimizer: ${message}`);
  }

  function compareText(left, right) {
    return left < right ? -1 : left > right ? 1 : 0;
  }

  function slotsOverlap(first, second) {
    return first.dia === second.dia && first.desde < second.hasta && second.desde < first.hasta;
  }

  function validateSlot(slot, context) {
    if (!slot || typeof slot.dia !== 'string' || !slot.dia.trim() || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(slot.desde)
      || !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(slot.hasta) || slot.desde >= slot.hasta) {
      fail(`invalid schedule slot for ${context}.`);
    }
  }

  function freeze(value) {
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      Object.keys(value).forEach(key => freeze(value[key]));
      Object.freeze(value);
    }
    return value;
  }

  function scoreAssignment(sections, assignments, subjectDemand) {
    const freeSeatsBySubject = new Map();
    let changedRoomCount = 0;
    let unusedCapacity = 0;

    sections.forEach((section, index) => {
      const room = assignments[index];
      const freeSeats = room.capacidad - section.alumnosInscriptosAsignados;
      freeSeatsBySubject.set(section.materiaId, (freeSeatsBySubject.get(section.materiaId) || 0) + freeSeats);
      changedRoomCount += room.id === section.currentRoom.id ? 0 : 1;
      unusedCapacity += freeSeats;
    });

    let residualStudents = 0;
    const subjectScores = new Map();
    subjectDemand.forEach((outsideCapacityStudents, materiaId) => {
      const freeSeats = freeSeatsBySubject.get(materiaId) || 0;
      const incorporableStudents = Math.min(outsideCapacityStudents, freeSeats);
      const residual = outsideCapacityStudents - incorporableStudents;
      residualStudents += residual;
      subjectScores.set(materiaId, { freeSeats, incorporableStudents, residualStudents: residual });
    });

    const canonicalRoomIds = assignments.map(room => room.id);
    return {
      residualStudents,
      changedRoomCount,
      unusedCapacity,
      canonicalRoomIds,
      subjectScores
    };
  }

  function compareScores(left, right) {
    if (!right) return -1;
    if (left.residualStudents !== right.residualStudents) return left.residualStudents - right.residualStudents;
    if (left.changedRoomCount !== right.changedRoomCount) return left.changedRoomCount - right.changedRoomCount;
    if (left.unusedCapacity !== right.unusedCapacity) return left.unusedCapacity - right.unusedCapacity;
    for (let index = 0; index < left.canonicalRoomIds.length; index += 1) {
      const comparison = compareText(left.canonicalRoomIds[index], right.canonicalRoomIds[index]);
      if (comparison) return comparison;
    }
    return 0;
  }

  function publicScore(score) {
    return {
      residualStudents: score.residualStudents,
      changedRoomCount: score.changedRoomCount,
      unusedCapacity: score.unusedCapacity,
      canonicalRoomIds: [...score.canonicalRoomIds]
    };
  }

  function demandItemsFrom(snapshot) {
    if (Array.isArray(snapshot)) return snapshot;
    if (snapshot && Array.isArray(snapshot.demanda)) return snapshot.demanda;
    fail('institutional demand snapshot must be a demand array or an object with demanda.');
  }

  function prepareProblem(period, demandSnapshot, sharedData) {
    if (!period || typeof period.etiqueta !== 'string' || !period.etiqueta) {
      fail('period must include a non-empty etiqueta.');
    }
    if (!sharedData || !Array.isArray(sharedData.aulas) || !Array.isArray(sharedData.catedras)) {
      fail('shared data must include aulas and catedras arrays.');
    }

    const roomsById = new Map();
    sharedData.aulas.forEach(room => {
      if (!room || typeof room.id !== 'string' || !room.id || typeof room.nombre !== 'string'
        || typeof room.tipo !== 'string' || !room.tipo || !Number.isInteger(room.capacidad) || room.capacidad < 0) {
        fail('shared data contains an invalid classroom.');
      }
      if (roomsById.has(room.id)) fail(`duplicate classroom id ${room.id}.`);
      roomsById.set(room.id, room);
    });

    const offersById = new Map();
    const currentOffers = sharedData.catedras.filter(offer => offer && offer.periodo === period.etiqueta);
    currentOffers.forEach(offer => {
      if (typeof offer.id !== 'string' || !offer.id || offersById.has(offer.id) || typeof offer.materiaId !== 'string'
        || typeof offer.docente !== 'string' || !Array.isArray(offer.franjas) || !offer.franjas.length) {
        fail('shared data contains an invalid or duplicate current-period section.');
      }
      offer.franjas.forEach(slot => validateSlot(slot, offer.id));
      offersById.set(offer.id, offer);
    });

    const subjectDemand = new Map();
    const sections = [];
    const seenSectionIds = new Set();
    demandItemsFrom(demandSnapshot).forEach(item => {
      if (!item || typeof item.materiaId !== 'string' || !item.materiaId || !Number.isInteger(item.alumnosInscriptosFueraDeCupo)
        || item.alumnosInscriptosFueraDeCupo < 0 || !Array.isArray(item.secciones)) {
        fail('institutional demand snapshot contains an invalid subject record.');
      }
      if (subjectDemand.has(item.materiaId)) fail(`duplicate demand subject ${item.materiaId}.`);
      subjectDemand.set(item.materiaId, item.alumnosInscriptosFueraDeCupo);

      item.secciones.forEach(section => {
        if (!section || typeof section.catedraId !== 'string' || !section.catedraId || typeof section.aulaId !== 'string'
          || !Number.isInteger(section.alumnosInscriptosAsignados) || section.alumnosInscriptosAsignados < 0) {
          fail(`invalid section record for ${item.materiaId}.`);
        }
        if (seenSectionIds.has(section.catedraId)) fail(`duplicate demand section ${section.catedraId}.`);
        seenSectionIds.add(section.catedraId);
        const offer = offersById.get(section.catedraId);
        const currentRoom = roomsById.get(section.aulaId);
        if (!offer) fail(`missing current-period section join for ${section.catedraId}.`);
        if (!currentRoom) fail(`missing current classroom join for ${section.catedraId}.`);
        if (offer.materiaId !== item.materiaId || offer.aulaId !== section.aulaId) {
          fail(`inconsistent subject or classroom join for ${section.catedraId}.`);
        }
        if (currentRoom.capacidad < section.alumnosInscriptosAsignados) {
          fail(`current classroom is too small for ${section.catedraId}.`);
        }
        sections.push({
          catedraId: section.catedraId,
          materiaId: item.materiaId,
          materia: typeof item.materia === 'string' ? item.materia : item.materiaId,
          alumnosInscriptosAsignados: section.alumnosInscriptosAsignados,
          currentRoom,
          docenteId: offer.docente,
          franjas: offer.franjas
        });
      });
    });

    if (!sections.length) fail('the demand snapshot has no current-period sections to assign.');
    if (currentOffers.length !== sections.length || currentOffers.some(offer => !seenSectionIds.has(offer.id))) {
      fail('current-period section joins do not match the institutional demand snapshot.');
    }

    sections.sort((left, right) => compareText(left.catedraId, right.catedraId));
    const rooms = [...roomsById.values()].sort((left, right) => compareText(left.id, right.id));
    const candidates = sections.map(section => {
      const compatible = rooms.filter(room => room.tipo === section.currentRoom.tipo
        && room.capacidad >= section.alumnosInscriptosAsignados);
      if (!compatible.length) fail(`no compatible classroom can hold ${section.catedraId}.`);
      return compatible;
    });

    return { sections, candidates, subjectDemand };
  }

  function optimizeGlobalClassrooms(period, demandSnapshot, sharedData) {
    const problem = prepareProblem(period, demandSnapshot, sharedData);
    const { sections, candidates, subjectDemand } = problem;
    const assignments = new Array(sections.length);
    const searchOrder = sections.map((section, index) => index)
      .sort((left, right) => candidates[left].length - candidates[right].length
        || compareText(sections[left].catedraId, sections[right].catedraId));
    let best = null;

    function conflicts(sectionIndex, room) {
      const section = sections[sectionIndex];
      return assignments.some((assignedRoom, otherIndex) => assignedRoom && assignedRoom.id === room.id
        && sections[otherIndex].franjas.some(first => section.franjas.some(second => slotsOverlap(first, second))));
    }

    function residualLowerBound() {
      const potentialFreeSeats = new Map();
      sections.forEach((section, index) => {
        const assignedRoom = assignments[index];
        const freeSeats = assignedRoom
          ? assignedRoom.capacidad - section.alumnosInscriptosAsignados
          : Math.max(...candidates[index].map(room => room.capacidad - section.alumnosInscriptosAsignados));
        potentialFreeSeats.set(section.materiaId, (potentialFreeSeats.get(section.materiaId) || 0) + freeSeats);
      });
      return [...subjectDemand.entries()].reduce((sum, [materiaId, outsideCapacityStudents]) => (
        sum + Math.max(0, outsideCapacityStudents - (potentialFreeSeats.get(materiaId) || 0))
      ), 0);
    }

    function canImprove(partialMoves, partialUnused) {
      if (!best) return true;
      const minimumResidual = residualLowerBound();
      if (minimumResidual > best.score.residualStudents) return false;
      if (minimumResidual < best.score.residualStudents) return true;
      if (partialMoves > best.score.changedRoomCount) return false;
      if (partialMoves === best.score.changedRoomCount && partialUnused > best.score.unusedCapacity) return false;
      return true;
    }

    function search(depth, partialMoves, partialUnused) {
      if (!canImprove(partialMoves, partialUnused)) return;
      if (depth === searchOrder.length) {
        const score = scoreAssignment(sections, assignments, subjectDemand);
        if (!best || compareScores(score, best.score) < 0) {
          best = { assignments: [...assignments], score };
        }
        return;
      }

      const sectionIndex = searchOrder[depth];
      const section = sections[sectionIndex];
      candidates[sectionIndex].forEach(room => {
        if (conflicts(sectionIndex, room)) return;
        assignments[sectionIndex] = room;
        search(
          depth + 1,
          partialMoves + (room.id === section.currentRoom.id ? 0 : 1),
          partialUnused + room.capacidad - section.alumnosInscriptosAsignados
        );
        assignments[sectionIndex] = undefined;
      });
    }

    search(0, 0, 0);
    if (!best) fail('no feasible assignment exists for all current-period sections.');

    const baselineAssignments = sections.map(section => section.currentRoom);
    for (let index = 0; index < sections.length; index += 1) {
      if (baselineAssignments.some((room, otherIndex) => otherIndex !== index && room.id === baselineAssignments[index].id
        && sections[otherIndex].franjas.some(first => sections[index].franjas.some(second => slotsOverlap(first, second))))) {
        fail('the current assignment contains an overlapping classroom conflict.');
      }
    }
    const baselineScore = scoreAssignment(sections, baselineAssignments, subjectDemand);
    const subjectResults = [];
    const sectionsBySubject = new Map();

    sections.forEach((section, index) => {
      const proposedRoom = best.assignments[index];
      const subjectScore = best.score.subjectScores.get(section.materiaId);
      const result = {
        catedraId: section.catedraId,
        materiaId: section.materiaId,
        docenteId: section.docenteId,
        franjas: section.franjas.map(slot => ({ dia: slot.dia, desde: slot.desde, hasta: slot.hasta })),
        alumnosInscriptosAsignados: section.alumnosInscriptosAsignados,
        currentRoom: { id: section.currentRoom.id, nombre: section.currentRoom.nombre, capacidad: section.currentRoom.capacidad, tipo: section.currentRoom.tipo },
        proposedRoom: { id: proposedRoom.id, nombre: proposedRoom.nombre, capacidad: proposedRoom.capacidad, tipo: proposedRoom.tipo },
        changedRoom: proposedRoom.id !== section.currentRoom.id,
        freeSeatsBeforeOutsideDemand: proposedRoom.capacidad - section.alumnosInscriptosAsignados,
        subjectFreeSeatsBeforeOutsideDemand: subjectScore.freeSeats
      };
      if (!sectionsBySubject.has(section.materiaId)) sectionsBySubject.set(section.materiaId, []);
      sectionsBySubject.get(section.materiaId).push(result);
    });

    subjectDemand.forEach((outsideCapacityStudents, materiaId) => {
      const subjectScore = best.score.subjectScores.get(materiaId);
      const subjectSections = sectionsBySubject.get(materiaId) || [];
      let remainingOutsideCapacityStudents = outsideCapacityStudents;
      subjectSections.forEach(section => {
        section.incorporableStudents = Math.min(remainingOutsideCapacityStudents, section.freeSeatsBeforeOutsideDemand);
        remainingOutsideCapacityStudents -= section.incorporableStudents;
        section.remainingOutsideCapacityStudents = remainingOutsideCapacityStudents;
        section.residualStudents = remainingOutsideCapacityStudents;
      });
      if (remainingOutsideCapacityStudents !== subjectScore.residualStudents) {
        fail(`section allocation does not conserve outside-capacity demand for ${materiaId}.`);
      }
      subjectResults.push({
        materiaId,
        materia: subjectSections[0] ? sections.find(section => section.materiaId === materiaId).materia : materiaId,
        outsideCapacityStudents,
        freeSeatsBeforeOutsideDemand: subjectScore.freeSeats,
        incorporableStudents: subjectScore.incorporableStudents,
        residualStudents: subjectScore.residualStudents,
        sections: subjectSections
      });
    });
    subjectResults.sort((left, right) => compareText(left.materiaId, right.materiaId));

    const totalOutsideCapacityStudents = [...subjectDemand.values()].reduce((sum, value) => sum + value, 0);
    const summary = {
      totalOutsideCapacityStudents,
      incorporableStudents: totalOutsideCapacityStudents - best.score.residualStudents,
      residualStudents: best.score.residualStudents,
      changedRoomCount: best.score.changedRoomCount,
      unusedCapacity: best.score.unusedCapacity,
      sectionCount: sections.length,
      canonicalCatedraIds: sections.map(section => section.catedraId),
      score: publicScore(best.score),
      currentBaseline: publicScore(baselineScore)
    };

    return freeze({
      period: { id: period.id, etiqueta: period.etiqueta, tipo: period.tipo },
      summary,
      subjects: subjectResults,
      sections: subjectResults.flatMap(subject => subject.sections)
    });
  }

  global.CU10_GLOBAL_CLASSROOM_OPTIMIZER = Object.freeze({
    optimizeGlobalClassrooms,
    slotsOverlap,
    compareScores
  });
}(window));
