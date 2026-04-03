import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixIconButton from '@1024pix/pix-ui/components/pix-icon-button';
import PixSelect from '@1024pix/pix-ui/components/pix-select';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class PixPlusEduV3Results extends Component {
  @tracked displayJurySelect = false;
  @tracked selectedJuryLevel = this.args.certification.externalJuryResultKey;

  @action
  changeJurySelect(value) {
    console.log(value);
    this.selectedJuryLevel = value;
  }

  @action
  toggleJurySelect() {
    console.log('la ?');
    this.displayJurySelect = !this.displayJurySelect;
  }

  @action
  updateExternalJuryResult(event) {
    console.log('call update external jury result', this.selectedJuryLevel);
    event.preventDefault();
  }

  <template>
    <div class="certification-information-pix-edu">
      <h2 class="certification-information__title">Résultats de la certification complémentaire Pix+ Edu</h2>
      <div class="certification-information-pix-edu__container">
        <div class="certification-information-pix-edu__card">
          <h3>Volet Pix</h3>
          <p>
            {{@certification.result}}
          </p>
        </div>
        <div class="certification-information-pix-edu__card">
          <h3>Volet jury externe</h3>
          {{#if this.displayJurySelect}}
            <form
              {{on "submit" this.updateExternalJuryResult}}
              {{on "reset" this.toggleJurySelect}}
              class="certification-information-pix-edu__jury-level-editor"
            >
              <PixSelect
                @screenReaderOnly={{true}}
                @options={{@certification.externalJuryResultOptions}}
                @value={{this.selectedJuryLevel}}
                @hideDefaultOption={{true}}
                @onChange={{this.changeJurySelect}}
                @placeholder="Choisir un niveau"
              >
                <:label>Sélectionner un niveau</:label>
              </PixSelect>
              <div>
                <PixButton @variant="secondary" @size="small" @type="reset">
                  Annuler
                </PixButton>
                <PixButton @type="submit" @size="small" @aria-label="Modifier le niveau du jury">
                  Enregistrer
                </PixButton>
              </div>
            </form>
          {{else}}
            <div class="certification-information-pix-edu__jury-level">
              <p>
                {{@certification.externalJuryResult}}
              </p>
              <PixIconButton
                @ariaLabel="Modifier le volet jury"
                @triggerAction={{this.toggleJurySelect}}
                @iconName="edit"
              />
            </div>
          {{/if}}
        </div>
      </div>
    </div>
  </template>
}
