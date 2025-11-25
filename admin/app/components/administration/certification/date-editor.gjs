import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixInput from '@1024pix/pix-ui/components/pix-input';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';

export default class DateEditor extends Component {
  @tracked isEditing = false;
  @tracked dateInput;

  get formattedDate() {
    return this.args.date?.reopeningDate?.toLocaleDateString('fr-FR');
  }

  @action
  toggleEdit() {
    this.isEditing = !this.isEditing;

    if (!this.isEditing) {
      this.dateInput = null;
    }
  }

  @action
  updateInput(event) {
    this.dateInput = event.target.value;
  }

  @action
  async save(event) {
    event.preventDefault();
    await this.args.onSave(this.dateInput);
    this.toggleEdit();
  }

  <template>
    <div class="sco-blocked-access-date-configuration__section">
      {{#if this.isEditing}}
        <form class="sco-blocked-access-date-configuration__form" {{on "submit" this.save}}>
          <PixInput type="date" @value={{this.dateInput}} {{on "change" this.updateInput}}>
            <:label><span class="pix-body-l">{{@label}}</span></:label>
          </PixInput>
          <PixButton @variant="secondary" @type="submit">
            {{t "pages.administration.certification.sco-blocked-access-date.save-button"}}
          </PixButton>
          <PixButton @variant="tertiary" @type="reset" @triggerAction={{this.toggleEdit}}>
            {{t "pages.administration.certification.sco-blocked-access-date.cancel-button"}}
          </PixButton>
        </form>
      {{else}}
        <span class="pix-body-l">{{@label}}
          {{this.formattedDate}}
          {{t "pages.administration.certification.sco-blocked-access-date.hour"}}</span>
        <PixButton @variant="secondary" @triggerAction={{this.toggleEdit}}>
          {{t "pages.administration.certification.sco-blocked-access-date.modify-button"}}
        </PixButton>
      {{/if}}
    </div>
  </template>
}
