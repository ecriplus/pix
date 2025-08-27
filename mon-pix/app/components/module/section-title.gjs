import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';

const SECTION_TITLE_ICONS = {
  'question-yourself': 'doorOpen',
  'explore-to-understand': 'signpost',
  'retain-the-essentials': 'lightBulb',
  practise: 'think',
  'go-further': 'mountain',
};

export default class ModuleSectionTitle extends Component {
  @service intl;

  @action
  sectionTitle(type) {
    return this.intl.t(`pages.modulix.section.${type}`);
  }

  @action
  sectionTitleIcon(type) {
    return SECTION_TITLE_ICONS[type];
  }

  <template>
    <div class="module-preview-passage-content-section">
      <PixIcon @name={{this.sectionTitleIcon @sectionType}} @ariaHidden={{true}} />
      <h2>{{this.sectionTitle @sectionType}}</h2>
    </div>
  </template>
}
