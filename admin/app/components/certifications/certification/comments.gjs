import PixBlock from '@1024pix/pix-ui/components/pix-block';
import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixTextarea from '@1024pix/pix-ui/components/pix-textarea';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import { DescriptionList } from 'pix-admin/components/ui/description-list';

export default class Comments extends Component {
  @tracked isEditingJuryComment = false;
  @tracked commentByJury;

  @action
  editJuryComment() {
    this.isEditingJuryComment = true;
  }

  @action
  async saveJuryComment() {
    const hasBeenSaved = await this.args.onJuryCommentSave(this.commentByJury);
    if (hasBeenSaved) {
      this.cancelJuryCommentEdition();
    }
  }

  @action
  onJuryCommentChange(event) {
    this.commentByJury = event.target.value;
  }

  @action
  cancelJuryCommentEdition() {
    this.isEditingJuryComment = false;
  }

  <template>
    <PixBlock @variant="admin">
      <h2 class="certification-information__title">Commentaires jury</h2>
      <DescriptionList>
        <DescriptionList.Divider />

        <DescriptionList.Item @label="Pour le candidat">
          {{@certification.commentForCandidate}}
        </DescriptionList.Item>

        <DescriptionList.Divider />

        <DescriptionList.Item @label="Pour l'organisation">
          {{@certification.commentForOrganization}}
        </DescriptionList.Item>

        <DescriptionList.Divider />

        <DescriptionList.Item @label="Identifiant jury">
          {{@certification.juryId}}
        </DescriptionList.Item>

        <DescriptionList.Divider />

        {{#if this.isEditingJuryComment}}
          <DescriptionList.ItemWithHTMLElement>
            <:label>
              <label for="certification-commentByJury">Notes internes Jury Pix</label>
            </:label>
            <:value>
              <PixTextarea
                id="certification-commentByJury"
                @value={{@certification.commentByJury}}
                {{on "input" this.onJuryCommentChange}}
              />
            </:value>
          </DescriptionList.ItemWithHTMLElement>
        {{else}}
          <DescriptionList.Item @label="Notes internes Jury Pix">
            {{if @certification.commentByJury @certification.commentByJury " - "}}
          </DescriptionList.Item>
        {{/if}}

        <DescriptionList.Divider />
      </DescriptionList>

      {{#if this.isEditingJuryComment}}
        <ul class="certification-information-comments__action-buttons">
          <li>
            <PixButton @size="small" @variant="secondary" @triggerAction={{this.cancelJuryCommentEdition}}>
              {{t "common.actions.cancel"}}
            </PixButton>
          </li>
          <li>
            <PixButton @size="small" @triggerAction={{this.saveJuryComment}}>
              {{t "common.actions.save"}}
            </PixButton>
          </li>
        </ul>
      {{else}}
        <PixButton @size="small" @triggerAction={{this.editJuryComment}}>
          Modifier le commentaire jury
        </PixButton>
      {{/if}}
    </PixBlock>
  </template>
}
