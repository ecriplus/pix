import PixBreadcrumb from '@1024pix/pix-ui/components/pix-breadcrumb';
import Component from '@glimmer/component';

export default class Breadcrumb extends Component {
  get links() {
    return [
      {
        route: 'authenticated.certification-centers.list',
        label: 'Tous les centres de certification',
      },
      {
        label: this.args.currentPageLabel,
      },
    ];
  }

  <template><PixBreadcrumb @links={{this.links}} class="breadcrumb" /></template>
}
