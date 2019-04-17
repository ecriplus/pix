import Controller from '@ember/controller';
import { computed } from '@ember/object';
import areaColors from 'mon-pix/static-data/area-colors';

const NUMBER_OF_PIX_BY_LEVEL = 8;
const MAX_DISPLAYED_PERCENTAGE = 95;

export default Controller.extend({
  maxLevel: 5,

  areaColor: computed('model', function() {
    const codeString = this.get('model.area.code').toString();
    const foundArea = areaColors.find((color) => color.area === codeString);

    return foundArea.color;
  }),

  percentageAheadOfNextLevel: computed('model', function() {
    const percentage = this.get('model.remainingPixToNextLevel') / NUMBER_OF_PIX_BY_LEVEL * 100;

    return Math.min(MAX_DISPLAYED_PERCENTAGE, percentage);
  }),

  earnedPixText: computed('model', function() {
    const earnedPix = this.get('model.earnedPix');

    return `pix gagné${earnedPix > 1 ? 's' : ''}`;
  })
});
