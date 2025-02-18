import { Competence } from '../../../../../../../src/certification/results/domain/read-models/parcoursup/Competence.js';

export const buildCompetence = function ({ code, name, areaName, level }) {
  return new Competence({ code, name, areaName, level });
};
