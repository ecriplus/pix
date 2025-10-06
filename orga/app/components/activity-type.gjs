import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import { service } from '@ember/service';
import Component from '@glimmer/component';

export default class ActivityType extends Component {
  @service intl;

  get iconConfig() {
    const { type } = this.args;
    switch (type) {
      case 'ASSESSMENT':
        return { icon: 'speed', class: 'activity-type__icon--assessment' };
      case 'PROFILES_COLLECTION':
        return { icon: 'profileShare', class: 'activity-type__icon--profile-collection' };
      case 'EXAM':
        return { icon: 'school', class: 'activity-type__icon--exam' };
      case 'COMBINED_COURSE':
        return { icon: 'studyLesson', class: 'activity-type__icon--combined-course' };
      default:
        return { icon: 'close', class: '' };
    }
  }

  get pictoCssClass() {
    const classes = ['activity-type__icon'];

    classes.push(this.iconConfig.class);

    if (this.args.big) {
      classes.push(classes[0] + '--big');
    }
    return classes.join(' ');
  }

  get pictoAriaHidden() {
    return !this.args.hideLabel;
  }

  get pictoTitle() {
    return this.args.hideLabel ? this.label : null;
  }

  get label() {
    const informationLabels = {
      ASSESSMENT: 'components.activity-type.information.ASSESSMENT',
      PROFILES_COLLECTION: 'components.activity-type.information.PROFILES_COLLECTION',
      EXAM: 'components.activity-type.information.EXAM',
      COMBINED_COURSE: 'components.activity-type.information.COMBINED_COURSE',
    };

    const explanationLabels = {
      ASSESSMENT: 'components.activity-type.explanation.ASSESSMENT',
      PROFILES_COLLECTION: 'components.activity-type.explanation.PROFILES_COLLECTION',
      EXAM: 'components.activity-type.explanation.EXAM',
      COMBINED_COURSE: 'components.activity-type.explanation.COMBINED_COURSE',
    };

    const { type, displayInformationLabel } = this.args;

    return this.intl.t(displayInformationLabel ? informationLabels[type] : explanationLabels[type]);
  }

  <template>
    <span class="activity-type">
      <PixIcon
        class={{this.pictoCssClass}}
        @name={{this.iconConfig.icon}}
        @ariaHidden={{this.pictoAriaHidden}}
        @title={{this.pictoTitle}}
        ...attributes
      />
      {{#unless @hideLabel}}
        <span class="activity-type__label">{{this.label}}</span>
      {{/unless}}
    </span>
  </template>
}
