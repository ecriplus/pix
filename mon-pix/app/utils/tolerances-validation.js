import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

function normalizeAndRemoveAccents(value) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s/g, '');
}

function removeSpecialCharacters(value) {
  return value
    .toString()
    .replace(/[^a-zA-Z0-9 ]+/g, '')
    .replace('/ {2,}/', ' ')
    .replace(/\s\s+/g, ' ');
}

const tolerances = {
  t1: normalizeAndRemoveAccents,
  t2: removeSpecialCharacters,
};

function applyTolerances(string, enabledTolerances) {
  let result = string.toString();
  if (isEmpty(enabledTolerances)) {
    return result;
  }
  enabledTolerances.sort().forEach((tolerance) => {
    const toleranceFunction = get(tolerances, tolerance);
    result = toleranceFunction ? toleranceFunction(result) : result;
  });
  return result;
}

export { applyTolerances, normalizeAndRemoveAccents, removeSpecialCharacters };
