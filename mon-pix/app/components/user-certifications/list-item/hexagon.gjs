import Component from '@glimmer/component';
import { t } from 'ember-intl';
import ENV from 'mon-pix/config/environment';
import { CERTIFICATE_TYPES } from 'mon-pix/models/certificate-summary';

export default class Hexagon extends Component {
  get hasCoreScope() {
    return ['CORE', 'CLEA'].includes(this.args.framework);
  }

  get isPixPlusV3() {
    return !this.hasCoreScope && this.args.certificateType === CERTIFICATE_TYPES.CERTIFICATE;
  }

  get classNames() {
    const classes = ['certification-item__hexagon'];

    if (this.isPixPlusV3 && this.args.reachedMeshLevel != null) {
      classes.push('certification-item__hexagon--pix-plus-validated');
    }

    if (this.isPixPlusV3 && this.args.reachedMeshLevel === null) {
      classes.push('certification-item__hexagon--pix-plus-not-validated');
    }

    return classes.join(' ');
  }

  get score() {
    return this.args.isValidated ? this.args.pixScore : '-';
  }

  get badgeUrl() {
    if (!this.isPixPlusV3 || !this.args.reachedMeshLevel || this.args.reachedMeshLevel === 'ADMISSIBLE') {
      return null;
    }

    const framework = this.args.framework.toLowerCase();
    const meshLevel = this.args.reachedMeshLevel.toLowerCase();

    return `${ENV.APP.PIX_ASSETS_MANAGER_URL}/badges-certifies/v3/${framework}/${meshLevel}.svg`;
  }

  <template>
    {{#if this.badgeUrl}}
      <img src={{this.badgeUrl}} alt="" />
    {{else}}
      <div data-testid="pw-certification-card-result" class={{this.classNames}}>
        <strong class="score">{{this.score}}</strong>
        <span class="pix">{{t "common.pix"}}</span>
      </div>
    {{/if}}
  </template>
}
