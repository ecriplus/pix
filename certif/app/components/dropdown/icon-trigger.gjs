import PixIconButton from '@1024pix/pix-ui/components/pix-icon-button';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import Content from 'pix-certif/components/dropdown/content';

export default class IconTrigger extends Component {
  <template>
    <div id='icon-trigger' class='dropdown' ...attributes>
      <PixIconButton
        @iconName={{@icon}}
        @ariaLabel={{@ariaLabel}}
        class='{{@dropdownButtonClass}}'
        @triggerAction={{this.toggle}}
        @size='small'
        @color='dark-grey'
      />
      <Content @display={{this.display}} @close={{this.close}} class='{{@dropdownContentClass}}'>
        {{yield}}
      </Content>
    </div>
  </template>
  @tracked display = false;

  @action
  toggle(event) {
    event.stopPropagation();
    this.display = !this.display;
  }

  @action
  close() {
    this.display = false;
  }
}
