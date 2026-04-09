import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixIconButton from '@1024pix/pix-ui/components/pix-icon-button';
import PixSelect from '@1024pix/pix-ui/components/pix-select';
import PixTooltip from '@1024pix/pix-ui/components/pix-tooltip';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';

export default class PixPlusEduV3Results extends Component {
  @service intl;
  @service pixToast;

  @tracked displayJurySelect = false;
  @tracked selectedJuryLevel = this.initialJuryLevel;

  get initialJuryLevel() {
    return this.args.certification.reachedResultKey.split('.').at(-1);
  }

  get hasExternalJuryResult() {
    return this.args.certification.reachedResultKey.includes('0');
  }

  get externalJuryResult() {
    if (this.hasExternalJuryResult) {
      return this.intl.t('components.certifications.edu-results.v3.waiting');
    }
    return this.intl.t(`common.certification.meshLevels.${this.args.certification.reachedResultKey}`);
  }

  get externalJuryResultOptions() {
    return ['UNSET', 'ADVANCED', 'EXPERT'].map((optionKey) => ({
      value: optionKey,
      label: this.intl.t(`components.certifications.edu-results.v3.external-jury-select-options.${optionKey}`),
    }));
  }

  @action
  changeJurySelect(value) {
    this.selectedJuryLevel = value;
  }

  @action
  toggleJurySelect() {
    this.displayJurySelect = !this.displayJurySelect;
  }

  @action
  async updateExternalJuryResult(event) {
    event.preventDefault();
    try {
      await this.args.certification.save({
        adapterOptions: {
          updateEduExternalJuryResult: true,
          eduV3ExternalJuryResult: this.selectedJuryLevel,
        },
      });
      this.pixToast.sendSuccessNotification({
        message: this.intl.t('components.certifications.edu-results.v3.success'),
      });
      this.toggleJurySelect();
    } catch (responseError) {
      const errorMessage =
        responseError?.errors?.[0]?.detail ??
        this.intl.t('components.certifications.edu-results.v3.error');
      this.pixToast.sendErrorNotification({ message: errorMessage });
    }
  }

  @action
  handleFormReset() {
    this.selectedJuryLevel = this.initialJuryLevel;
    this.toggleJurySelect();
  }

  <template>
    <div class="certification-information-pix-edu">
      <h2 class="certification-information__title">{{t "components.certifications.edu-results.v3.title"}}</h2>
      <div class="certification-information-pix-edu__container">
        <div class="certification-information-pix-edu__card">
          <h3 class="title">{{t "components.certifications.edu-results.v3.internal-jury"}}</h3>
          <p class="level">{{t "components.certifications.edu-results.v3.admissible"}}</p>
        </div>
        <div class="certification-information-pix-edu__card">
          <h3 class="title">{{t "components.certifications.edu-results.v3.external-jury"}}</h3>
          {{#if this.displayJurySelect}}
            <form
              {{on "submit" this.updateExternalJuryResult}}
              {{on "reset" this.handleFormReset}}
              class="certification-information-pix-edu__jury-level-editor"
            >
              <PixSelect
                @screenReaderOnly={{true}}
                @options={{this.externalJuryResultOptions}}
                @value={{this.selectedJuryLevel}}
                @hideDefaultOption={{true}}
                @onChange={{this.changeJurySelect}}
                @placeholder={{t "components.certifications.edu-results.v3.waiting"}}
              >
                <:label>{{t "components.certifications.edu-results.v3.select"}}</:label>
              </PixSelect>
              <div class="actions">
                <PixButton @variant="secondary" @size="small" type="reset">
                  Annuler
                </PixButton>
                <PixButton @type="submit" @size="small" @aria-label="Modifier le niveau du jury">
                  Enregistrer
                </PixButton>
              </div>
            </form>
          {{else}}
            <div class="certification-information-pix-edu__jury-level">
              <p class="level">
                {{this.externalJuryResult}}
              </p>
              <PixTooltip>
                <:triggerElement>
                  <PixIconButton
                    @size="xsmall"
                    @ariaLabel="Modifier le volet jury"
                    @triggerAction={{this.toggleJurySelect}}
                    @iconName="edit"
                  />
                </:triggerElement>

                <:tooltip>
                  {{t "common.actions.edit"}}
                </:tooltip>
              </PixTooltip>
            </div>
          {{/if}}
        </div>
      </div>
    </div>
  </template>
}
