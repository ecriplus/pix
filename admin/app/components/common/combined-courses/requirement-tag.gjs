import PixTag from '@1024pix/pix-ui/components/pix-tag';
import { action } from '@ember/object';
import { LinkTo } from '@ember/routing';
import Component from '@glimmer/component';
import { t } from 'ember-intl';
import { eq } from 'ember-truth-helpers';

const getItemColor = (type) => (type === 'evaluation' ? 'purple' : 'blue');
const getItemType = (type) =>
  type === 'evaluation'
    ? 'components.combined-course-blueprints.items.targetProfile'
    : 'components.combined-course-blueprints.items.module';

export default class RequirementTag extends Component {
  @action
  onRemove() {
    this.args.onRemove?.({ type: this.args.requirement.type, value: this.args.requirement.value });
  }

  get displayRemoveButton() {
    return this.args.onRemove;
  }

  <template>
    <PixTag
      @color={{getItemColor @requirement.type}}
      @displayRemoveButton={{this.displayRemoveButton}}
      @onRemove={{this.onRemove}}
    >
      {{#if (eq @requirement.type "evaluation")}}
        <LinkTo
          @route="authenticated.target-profiles.target-profile.details"
          @model={{@requirement.value}}
          target="_blank"
          rel="noopener noreferrer"
        >
          {{t (getItemType @requirement.type)}}
          -
          {{@requirement.value}}
          -
          {{@requirement.label}}</LinkTo>
      {{else}}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://app.recette.pix.fr/modules/{{@requirement.shortId}}/slug/details"
        >
          {{t (getItemType @requirement.type)}}
          -
          {{@requirement.shortId}}
          -
          {{@requirement.label}}
        </a>
      {{/if}}
    </PixTag>
  </template>
}
