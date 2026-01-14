import { service } from '@ember/service';
import Component from '@glimmer/component';

import Details from './details';

export default class CombinedCourseBlueprint extends Component {
  @service intl;
  <template><Details @model={{@model}} /></template>
}
