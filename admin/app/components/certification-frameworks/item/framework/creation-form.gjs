import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';

import TubesSelection from '../../../common/tubes-selection';

export default class CreationForm extends Component {
  @service intl;
  @service pixToast;
  @service router;
  @service store;

  @tracked frameworks = [];
  @tracked selectedTubes = [];

  constructor() {
    super(...arguments);

    this.#onMount();
  }

  get scope() {
    return this.router.currentRoute.parent.parent.params.certification_framework_key;
  }

  get frameworkLabel() {
    return this.store.peekRecord('certification-framework', this.scope)?.name;
  }

  async #onMount() {
    const foundFrameworks = await this.store.findAll('framework');
    this.frameworks = foundFrameworks.map((framework) => framework);
  }

  @action
  onTubesSelectionChange(selectedTubes) {
    this.selectedTubes = selectedTubes.map((tube) => this.store.peekRecord('tube', tube.id));
  }

  @action
  async onSubmit() {
    const consolidatedFramework = this.store.createRecord('certification-consolidated-framework', {
      scope: this.scope,
      tubes: this.selectedTubes,
    });

    try {
      await consolidatedFramework.save();

      this.router.transitionTo('authenticated.certification-frameworks.item.framework');
      this.pixToast.sendSuccessNotification({
        message: this.intl.t('components.certification-frameworks.item.framework.creation-form.success-notification'),
      });
    } catch (error) {
      this.pixToast.sendErrorNotification({ message: error.errors?.[0].detail });
    }
  }

  <template>
    <h2 class="framework-creation-form__title">
      {{t "components.certification-frameworks.item.framework.creation-form.title"}}
    </h2>

    <form>
      <section>
        {{#if this.frameworks.length}}
          <TubesSelection
            @frameworks={{this.frameworks}}
            @onChange={{this.onTubesSelectionChange}}
            @displaySkillDifficultyAvailability={{true}}
            @displaySkillDifficultySelection={{false}}
            @displayDeviceCompatibility={{true}}
            @displayJsonImportButton={{true}}
          />
          <ul class="framework-creation-form__buttons">
            <li>
              <PixButton @triggerAction={{this.onSubmit}} @isDisabled={{if this.selectedTubes.length false true}}>
                {{t "components.certification-frameworks.item.framework.creation-form.submit-button"}}
              </PixButton>
            </li>
            <li>
              <PixButtonLink @route="authenticated.certification-frameworks.item.framework" @variant="secondary">
                {{t "common.actions.cancel"}}
              </PixButtonLink>
            </li>
          </ul>
        {{/if}}
      </section>
    </form>
  </template>
}
