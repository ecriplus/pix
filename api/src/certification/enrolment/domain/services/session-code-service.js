import { config } from '../../../../../src/shared/config.js';

function sample(array) {
  const len = array == null ? 0 : array.length;
  return len ? array[Math.floor(Math.random() * len)] : undefined;
}

function _randomLetter() {
  const letters = config.availableCharacterForCode.letters.split('');
  return sample(letters);
}

function _randomNumberCharacter() {
  const numberCharacter = config.availableCharacterForCode.numbers.split('');
  return sample(numberCharacter);
}

function _generateSessionCode() {
  const code =
    '' +
    _randomLetter() +
    _randomLetter() +
    _randomLetter() +
    _randomLetter() +
    _randomNumberCharacter() +
    _randomNumberCharacter();
  return code;
}

const getNewSessionCode = function () {
  return _generateSessionCode();
};

export { getNewSessionCode };
