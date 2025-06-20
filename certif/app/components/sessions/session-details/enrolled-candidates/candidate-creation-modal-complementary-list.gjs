import PixLabel from '@1024pix/pix-ui/components/pix-label';
import PixRadioButton from '@1024pix/pix-ui/components/pix-radio-button';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

import { COMPLEMENTARY_KEYS } from '../../../../models/subscription';

export default class CandidateCreationModalComplementaryList extends Component {
  @service currentUser;
  @service intl;

  fieldsetLegend = () => {
    return this.intl.t(`common.forms.certification-labels.additional-certification-old`);
  };

  firstInputLabel = () => {
    return this.intl.t('common.labels.candidate.none');
  };

  complementaryLabel = (complementaryCertificationHabilitation) => {
    const { key, label } = complementaryCertificationHabilitation;

    if (key === COMPLEMENTARY_KEYS.CLEA) {
      return this.intl.t('common.forms.certification-labels.dual-certification-clea');
    }

    return label;
  };

  <template>
    <div class='new-candidate-modal-form__field'>
      <fieldset id='complementary-certifications'>
        <legend class='label'>
          <PixLabel @requiredLabel={{t 'common.forms.required'}}>
            {{this.fieldsetLegend}}
          </PixLabel>
        </legend>
        <PixRadioButton required name='subscriptions' {{on 'change' (fn @updateComplementaryCertification null)}}>
          <:label>{{this.firstInputLabel}}</:label>
        </PixRadioButton>
        {{#each @complementaryCertificationsHabilitations as |complementaryCertificationHabilitation|}}
          <PixRadioButton
            required
            name='subscriptions'
            {{on 'change' (fn @updateComplementaryCertification complementaryCertificationHabilitation)}}
          >
            <:label>{{this.complementaryLabel complementaryCertificationHabilitation}}</:label>
          </PixRadioButton>
        {{/each}}
      </fieldset>
    </div>
  </template>
}
