import PixCard from '@1024pix/pix-ui/components/pix-card';
import PixTag from '@1024pix/pix-ui/components/pix-tag';
import Component from '@glimmer/component';
import { t } from 'ember-intl';
import { eq } from 'ember-truth-helpers';

export default class CourseCard extends Component {
  get courseInfo() {
    switch (this.args.course.type) {
      case 'blueprint': {
        return {
          color: 'green',
          label: 'pages.catalogue.card.tag.blueprint',
          image: 'https://assets.pix.org/sites/orga/parcours-apprenant.png',
        };
      }
      default: {
        return {
          color: 'blue',
          label: 'pages.catalogue.card.tag.target-profile',
          image: 'https://assets.pix.org/sites/orga/profile-cible.png',
        };
      }
    }
  }

  get category() {
    return `pages.campaign-creation.tags.${this.args.course.category}`;
  }

  <template>
    <PixCard
      variant="orga"
      @title={{@course.name}}
      @subtitle={{if @course.category (t this.category)}}
      @image={{this.courseInfo.image}}
    >
      <:tag>
        <PixTag @color={{this.courseInfo.color}} class="course-card__tag">{{t this.courseInfo.label}}</PixTag>
      </:tag>
      <:footer>
        {{#if (eq @course.type "targetProfile")}}
          {{t "pages.catalogue.card.tubes-count" count=@course.nbTubes}}
        {{else}}
          {{t "pages.catalogue.card.modules-count" count=@course.nbModules}}
        {{/if}}
        {{#if @course.isSimplifiedAccess}}
          <p class="course-card__footer">{{t "pages.catalogue.card.simplified-access"}}</p>
        {{/if}}
      </:footer>
    </PixCard>
  </template>
}
