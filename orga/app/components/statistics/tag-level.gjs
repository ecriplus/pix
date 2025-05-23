import PixTag from '@1024pix/pix-ui/components/pix-tag';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

const MAX_LEVEL = {
  novice: 3,
  independent: 5,
  advanced: 7,
};

export default class TagLevel extends Component {
  get category() {
    const parsedLevel = Math.ceil(parseFloat(this.args.level));
    if (parsedLevel < MAX_LEVEL.novice) return 'pages.statistics.level.novice';
    if (parsedLevel < MAX_LEVEL.independent) return 'pages.statistics.level.independent';
    if (parsedLevel < MAX_LEVEL.advanced) return 'pages.statistics.level.advanced';
    return 'pages.statistics.level.expert';
  }

  <template>
    <PixTag>{{t this.category}}</PixTag>
  </template>
}
