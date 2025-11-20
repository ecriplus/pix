import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixInput from '@1024pix/pix-ui/components/pix-input';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import trim from 'lodash/trim';

export default class CertificationsSearchForm extends Component {
  @service router;

  @tracked inputId;

  @action
  onChangeInputId(event) {
    this.inputId = event.target.value;
  }

  @action
  loadCertification(event) {
    event.preventDefault();
    const certifId = trim(this.inputId);
    this.router.transitionTo('authenticated.certifications.certification', certifId);
  }

  <template>
    <form class="page-actions" {{on "submit" this.loadCertification}}>
      <PixInput
        placeholder={{t "components.certifications.search-form.placeholder"}}
        aria-label={{t "components.certifications.search-form.ariaLabel"}}
        @type="text"
        @value={{this.inputId}}
        {{on "input" this.onChangeInputId}}
        @inlineLabel={{true}}
      >
        <:label>{{t "components.certifications.search-form.label"}}</:label>
      </PixInput>
      <PixButton @size="small" @type="submit">
        {{t "pages.certifications.actions.load.label"}}
      </PixButton>
    </form>
  </template>
}
