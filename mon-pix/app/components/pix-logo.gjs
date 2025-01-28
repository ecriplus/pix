import { LinkTo } from '@ember/routing';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

export default class PixLogo extends Component {
  get logoSrc() {
    return this.args.color === 'white' ? '/images/pix-logo-blanc.svg' : '/images/pix-logo.svg';
  }

  <template>
    <LinkTo @route="authenticated" class="pix-logo">
      <img class="pix-logo__image" src={{this.logoSrc}} alt={{t "navigation.homepage"}} />
    </LinkTo>
  </template>
}
