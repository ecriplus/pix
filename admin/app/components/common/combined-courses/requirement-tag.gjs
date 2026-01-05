import PixTag from '@1024pix/pix-ui/components/pix-tag';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

const getItemColor = (type) => (type === 'evaluation' ? 'purple' : 'blue');
const getItemType = (type) =>
  type === 'evaluation'
    ? 'components.combined-course-blueprints.items.targetProfile'
    : 'components.combined-course-blueprints.items.module';

export default class RequirementTag extends Component {
  @action
  onRemove() {
    this.args.onRemove?.({ type: this.args.type, value: this.args.value });
  }

  get displayRemoveButton() {
    return this.args.onRemove;
  }

  <template>
    <PixTag @color={{getItemColor @type}} @displayRemoveButton={{this.displayRemoveButton}} @onRemove={{this.onRemove}}>
      {{t (getItemType @type)}}
      -
      {{@value}}
    </PixTag>
  </template>
}
