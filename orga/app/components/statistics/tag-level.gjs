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
    const parsedLevel = Number(this.args.level);

    const intlKey = 'pages.statistics.level.';
    if (parsedLevel < MAX_LEVEL.novice) return intlKey + 'novice';
    if (parsedLevel < MAX_LEVEL.independent) return intlKey + 'independent';
    if (parsedLevel < MAX_LEVEL.advanced) return intlKey + 'advanced';
    return intlKey + 'expert';
  }

  <template>
    <PixTag>{{t this.category}}</PixTag>
  </template>
}
