import { getScreen, visit } from '@1024pix/ember-testing-library';
import { settled } from '@ember/test-helpers';

// Lorsqu'on souhaite tester un transitionTo, on doit utiliser un try/catch en attendant l'évolution attendue dans Ember :
// https://github.com/emberjs/ember-test-helpers/issues/332
export async function unabortedVisit(url) {
  try {
    await visit(url);
  } catch (error) {
    if (!_isEmberTransitionAborted(error)) {
      throw error;
    }

    await settled();
  }
  return getScreen();
}

function _isEmberTransitionAborted(error) {
  return error.message == 'TransitionAborted';
}
