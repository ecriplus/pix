import { computed } from '@ember/object';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['user-certifications-detail-area'],
  area: null,

  sortedCompetences: computed('area.competences.[]', function() {
    return this.get('area.competences').sortBy('index');
  })
});
