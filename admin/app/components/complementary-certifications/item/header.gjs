import PixBreadcrumb from '@1024pix/pix-ui/components/pix-breadcrumb';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

export default class Header extends Component {
  @service intl;

  get links() {
    return [
      {
        route: 'authenticated.certification-frameworks',
        label: this.intl.t('components.layout.sidebar.certification-frameworks'),
      },
      {
        label: this.args.complementaryCertification.label,
      },
    ];
  }

  <template>
    <header>
      <PixBreadcrumb @links={{this.links}} class="breadcrumb" />
    </header>

    <div class="complementary-certification-header">
      <h1 class="complementary-certification-header__title">
        <small>
          {{#if @complementaryCertification.hasComplementaryReferential}}
            {{t "components.complementary-certifications.item.certification-framework"}}
          {{else}}
            {{t "components.complementary-certifications.item.target-profile"}}
          {{/if}}
        </small>
        <span>{{@complementaryCertification.label}}</span>
      </h1>
    </div>
  </template>
}
