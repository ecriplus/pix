// eslint-disable-next-line ember/no-classic-components
import Component from '@ember/component';
import { action } from '@ember/object';

// eslint-disable-next-line ember/no-classic-classes, ember/require-tagless-components
export default Component.extend({
  onToggleAllSelection: action(function () {
    this.toggleAllSelection();
  }),
});
