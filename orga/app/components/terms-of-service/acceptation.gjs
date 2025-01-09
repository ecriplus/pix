import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

export default class Acceptation extends Component {
  @service url;

  get legalDocumentUrl() {
    const { legalDocumentPath } = this.args;
    return this.url.getLegalDocumentUrl(legalDocumentPath);
  }

  get isUpdateRequested() {
    return this.args.legalDocumentStatus === 'update-requested';
  }

  <template>
    {{#if this.isUpdateRequested}}
      <h1>{{t "components.terms-of-service.title.update-requested"}}</h1>
      <p>{{t "components.terms-of-service.message.update-requested"}}</p>
    {{else}}
      <h1>{{t "components.terms-of-service.title.requested"}}</h1>
      <p>{{t "components.terms-of-service.message.requested"}}</p>
    {{/if}}

    <a href={{this.legalDocumentUrl}} target="_blank" rel="noopener noreferrer">
      {{t "components.terms-of-service.actions.document-link"}}
    </a>

    <div>
      <PixButtonLink @route="logout" @variant="secondary">
        {{t "components.terms-of-service.actions.reject"}}
      </PixButtonLink>
      <PixButton @type="submit" @triggerAction={{@onSubmit}}>
        {{t "components.terms-of-service.actions.accept"}}
      </PixButton>
    </div>
  </template>
}
