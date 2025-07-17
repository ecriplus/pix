import PixBreadcrumb from '@1024pix/pix-ui/components/pix-breadcrumb';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

export default class Header extends Component {
  @service intl;

  get links() {
    return [
      {
        route: 'authenticated.complementary-certifications.list',
        label: this.intl.t('components.complementary-certifications.title'),
      },
      {
        label: this.args.complementaryCertificationLabel,
      },
    ];
  }

  <template>
    <header>
      <PixBreadcrumb @links={{this.links}} class="breadcrumb" />
    </header>

    <div class="complementary-certification-header">
      <h1 class="complementary-certification-header__title">
        <small>{{t "components.complementary-certifications.item.complementary-certification"}}</small>
        <span>{{@complementaryCertificationLabel}}</span>
      </h1>
    </div>
  </template>
}
