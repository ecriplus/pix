import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';
import { DescriptionList } from 'pix-admin/components/ui/description-list';

import { localeCategories } from '../../models/training';
import StateTag from './state-tag';

export default class TrainingDetailsCard extends Component {
  @service url;
  @service featureToggles;

  get formattedDuration() {
    const days = this.args.training.duration.days ? `${this.args.training.duration.days}j ` : '';
    const hours = this.args.training.duration.hours ? `${this.args.training.duration.hours}h ` : '';
    const minutes = this.args.training.duration.minutes ? `${this.args.training.duration.minutes}min` : '';
    return `${days}${hours}${minutes}`.trim();
  }

  get formattedLocale() {
    return localeCategories[this.args.training.locale];
  }

  get formattedLocales() {
    return this.args.training.locales.map((locale) => localeCategories[locale]).join(', ');
  }

  get trainingLink() {
    return this.args.training.type === 'modulix'
      ? `${this.url.pixAppUrl}${this.args.training.link}`
      : this.args.training.link;
  }

  <template>
    <h1 class="training-details-card__title">{{@training.internalTitle}}</h1>
    <StateTag @isDisabled={{@training.isDisabled}} />
    <div class="training-details-card__content">
      <DescriptionList>

        <DescriptionList.Divider />

        <DescriptionList.Item @label={{t "pages.trainings.training.details.title"}}>
          {{@training.title}}
        </DescriptionList.Item>

        <DescriptionList.Item @label={{t "pages.trainings.training.details.publishedOn"}}>
          <a
            href={{this.trainingLink}}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="{{this.trainingLink}} (nouvelle fenêtre)"
          >
            {{this.trainingLink}}
          </a>
        </DescriptionList.Item>

        <DescriptionList.Divider />

        <DescriptionList.Item @label={{t "pages.trainings.training.details.contentType"}}>
          {{@training.type}}
        </DescriptionList.Item>

        <DescriptionList.Divider />

        <DescriptionList.Item @label={{t "pages.trainings.training.details.duration"}}>
          {{this.formattedDuration}}
        </DescriptionList.Item>

        <DescriptionList.Divider />

        {{#if this.featureToggles.featureToggles.multipleLocalesForTrainingsEnabled}}
          <DescriptionList.Item @label={{t "pages.trainings.training.details.locales" count=@training.locales.length}}>
            {{this.formattedLocales}}
          </DescriptionList.Item>
        {{else}}
          <DescriptionList.Item @label={{t "pages.trainings.training.details.localizedLanguage"}}>
            {{this.formattedLocale}}
          </DescriptionList.Item>
        {{/if}}

        <DescriptionList.Divider />

        <DescriptionList.Item @label={{t "pages.trainings.training.details.editorName"}}>
          {{@training.editorName}}
        </DescriptionList.Item>

        <DescriptionList.Item @label={{t "pages.trainings.training.details.editorLogo"}}>
          <a
            href={{@training.editorLogoUrl}}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={{t "pages.trainings.training.details.editor-logo-aria-label"}}
          >
            {{@training.editorLogoUrl}}
          </a>
        </DescriptionList.Item>

        <DescriptionList.Divider />

        <DescriptionList.Item @label={{t "pages.trainings.training.details.status"}}>
          {{if
            @training.isRecommendable
            (t "pages.trainings.training.details.status-label.enabled")
            (t "pages.trainings.training.details.status-label.disabled")
          }}
        </DescriptionList.Item>

        <DescriptionList.Divider />

      </DescriptionList>
      <div class="training-details-card__editor-logo">
        <img src={{@training.editorLogoUrl}} alt={{@training.editorName}} />
      </div>
    </div>
  </template>
}
