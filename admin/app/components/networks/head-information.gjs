import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import NetworkEditForm from './edit-form';
import NetworkTitleView from './title-view';

export default class NetworkHeadInformation extends Component {
  @tracked isEditMode = false;

  @action
  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
  }

  <template>
    <div class="network__head-information">
      {{#if this.isEditMode}}
        <NetworkEditForm @network={{@network}} @hideForm={{this.toggleEditMode}} />
      {{else}}
        <NetworkTitleView @network={{@network}} @onEdit={{this.toggleEditMode}} />
      {{/if}}
    </div>
  </template>
}
