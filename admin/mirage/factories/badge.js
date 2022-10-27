import { Factory } from 'ember-cli-mirage';
import { belongsTo, hasMany } from '@ember-data/model';

export default Factory.extend({
  key() {
    return 'BADGE_KEY';
  },

  title() {
    return 'Titre de mon badge';
  },

  message() {
    return 'Message de mon badge';
  },

  imageUrl() {
    return 'mon_badge_image.png';
  },

  altMessage() {
    return 'Alt message de mon badge';
  },

  isCertifiable() {
    return false;
  },

  isAlwaysVisible() {
    return false;
  },

  badgeCriteria() {
    return [];
  },

  skillSets() {
    return [];
  },
});
