import PixCheckbox from '@1024pix/pix-ui/components/pix-checkbox';
import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

export default class Tube extends Component {
  get checked() {
    return this.args.isTubeSelected(this.args.tube);
  }

  @action
  toggleTube(event) {
    if (event.target.checked) {
      this.args.selectTube(this.args.tube);
    } else {
      this.args.unselectTube(this.args.tube);
    }
  }

  <template>
    <td>
      <PixCheckbox @id="tube-{{@tube.id}}" {{on "click" this.toggleTube}} @checked={{this.checked}}>
        <:label>
          {{@tube.practicalTitle}}
          :
          {{@tube.practicalDescription}}
        </:label>
      </PixCheckbox>
    </td>
    <td class="table__column--center">
      <div
        aria-label="{{if
          @tube.isMobileCompliant
          (t 'pages.preselect-target-profile.table.is-responsive')
          (t 'pages.preselect-target-profile.table.not-responsive')
        }}"
      >
        <PixIcon
          @name="{{if @tube.isMobileCompliant 'mobile' 'mobileOff'}}"
          class="{{if @tube.isMobileCompliant 'is-responsive' 'not-responsive'}}"
        />
      </div>
    </td>
    <td class="table__column--center">
      <div
        aria-label="{{if
          @tube.isTabletCompliant
          (t 'pages.preselect-target-profile.table.is-responsive')
          (t 'pages.preselect-target-profile.table.not-responsive')
        }}"
      >
        <PixIcon
          @name="{{if @tube.isMobileCompliant 'tablet' 'tabletOff'}}"
          class="{{if @tube.isMobileCompliant 'is-responsive' 'not-responsive'}}"
        />
      </div>
    </td>
  </template>
}
