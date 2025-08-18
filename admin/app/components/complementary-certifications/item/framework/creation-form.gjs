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

  @tracked complementaryCertification = [];
  @tracked frameworks = [];
  @tracked selectedTubes = [];

  constructor() {
    super(...arguments);

    this.#onMount();
  }

  async #onMount() {
    const foundFrameworks = await this.store.findAll('framework');
    this.frameworks = foundFrameworks.map((framework) => framework);

    const routeParams = this.router.currentRoute.parent.parent.params;
    this.complementaryCertification = await this.store.peekRecord(
      'complementary-certification',
      routeParams.complementary_certification_id,
    );
  }

  @action
  onTubesSelectionChange(selectedTubes) {
    this.selectedTubes = selectedTubes.map((tube) => this.store.peekRecord('tube', tube.id));
  }

  @action
  async onSubmit() {
    const consolidatedFramework = this.store.createRecord('certification-consolidated-framework', {
      complementaryCertification: this.complementaryCertification,
      tubes: this.selectedTubes,
    });

    try {
      await consolidatedFramework.save();

      this.router.transitionTo('authenticated.complementary-certifications.item.framework');
      this.pixToast.sendSuccessNotification({
        message: this.intl.t(
          'components.complementary-certifications.item.framework.creation-form.success-notification',
        ),
      });
    } catch (error) {
      this.pixToast.sendErrorNotification({ message: error.errors?.[0].detail });
    }
  }

  <template>
    <h2 class="framework-creation-form__title">
      {{t
        "components.complementary-certifications.item.framework.creation-form.title"
        complementaryCertificationLabel=this.complementaryCertification.label
      }}
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
                {{t "components.complementary-certifications.item.framework.creation-form.submit-button"}}
              </PixButton>
            </li>
            <li>
              <PixButtonLink @route="authenticated.complementary-certifications.item.framework" @variant="secondary">
                {{t "common.actions.cancel"}}
              </PixButtonLink>
            </li>
          </ul>
        {{/if}}
      </section>
    </form>
  </template>
}
