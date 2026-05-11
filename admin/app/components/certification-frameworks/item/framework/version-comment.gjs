import PixBlock from '@1024pix/pix-ui/components/pix-block';
import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixTextarea from '@1024pix/pix-ui/components/pix-textarea';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';

const MAX_COMMENT_LENGTH = 200;

export default class VersionComment extends Component {
  @tracked comment = this.args.version.comment ?? '';

  @action
  async saveComment() {
    const hasBeenSaved = true; //await this.args.onCommentSave(this.comment);
    if (hasBeenSaved) {
      this.args.version.comment = this.comment;
    }
  }

  @action
  onCommentChange(event) {
    this.comment = event.target.value;
  }

  <template>
    <h2 class="certification-version-detail-modal__subtitle">{{t
        "components.complementary-certifications.item.framework.version-detail-modal.comment"
      }}</h2>
    <PixBlock class="certification-version-detail-modal__comment">
      <PixTextarea
        id="version-comment"
        @value={{this.comment}}
        @maxlength={{MAX_COMMENT_LENGTH}}
        {{on "input" this.onCommentChange}}
      />
      <div class="version-comment__actions">
        <PixButton @size="small" @variant="secondary" @triggerAction={{this.saveComment}}>
          {{t "common.actions.save"}}
        </PixButton>
      </div>
    </PixBlock>
  </template>
}
