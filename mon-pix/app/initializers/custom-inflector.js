import Inflector from 'ember-inflector';

export function initialize() {
  const inflector = Inflector.inflector;

  inflector.irregular('organization-to-join', 'organizations-to-join');
}

export default {
  name: 'custom-inflector-rules',
  initialize,
};
