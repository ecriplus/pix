import Component from '@glimmer/component';
import { t } from 'ember-intl';
import { CERTIFICATE_TYPES } from 'mon-pix/models/certificate-summary';

export default class Hexagon extends Component {
  get hasCoreScope() {
    return ['CORE', 'CLEA'].includes(this.args.framework);
  }

  get isPixPlusV3() {
    return !this.hasCoreScope && this.args.certificateType === CERTIFICATE_TYPES.CERTIFICATE;
  }

  get isSmall() {
    return this.args.size === 'small';
  }

  get hexagonClassNames() {
    const classes = ['certification-result-hexagon'];

    if (this.isPixPlusV3 && this.args.reachedMeshLevel != null) {
      classes.push('certification-result-hexagon--pix-plus-validated');
    }

    if (this.isPixPlusV3 && this.args.reachedMeshLevel === null) {
      classes.push('certification-result-hexagon--pix-plus-not-validated');
    }

    if (this.isSmall) {
      classes.push('certification-result-hexagon--small');
    }

    return classes.join(' ');
  }

  get badgeClassNames() {
    const classes = ['certification-result-badge'];

    if (this.isSmall) {
      classes.push('certification-result-badge--small');
    }

    return classes.join(' ');
  }

  get score() {
    return this.args.isValidated ? this.args.pixScore : '-';
  }

  <template>
    {{#if @badgeUrl}}
      <img data-testid="pw-certification-card-badge" class={{this.badgeClassNames}} src={{@badgeUrl}} alt="" />
    {{else}}
      <div data-testid="pw-certification-card-result" class={{this.hexagonClassNames}}>
        <strong class="score">{{this.score}}</strong>
        <span class="pix">{{t "common.pix"}}</span>
      </div>
    {{/if}}
  </template>
}
