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
    <header class="page-header">
      <PixBreadcrumb @links={{this.links}} />
    </header>
  </template>
}
