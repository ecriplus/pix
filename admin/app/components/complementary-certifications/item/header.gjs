import PixBreadcrumb from '@1024pix/pix-ui/components/pix-breadcrumb';
import Component from '@glimmer/component';

export default class Header extends Component {
  get links() {
    return [
      {
        route: 'authenticated.complementary-certifications.list',
        label: 'Toutes les certifications complémentaires',
      },
      {
        label: this.args.complementaryCertificationLabel,
      },
    ];
  }

  <template>
    <header>
      <PixBreadcrumb @links={{this.links}} />
    </header>

    <div class="complementary-certification-header">
      <h1 class="complementary-certification-header__title">
        <small>Certification complémentaire</small>
        <span>{{@complementaryCertificationLabel}}</span>
      </h1>
    </div>
  </template>
}
