import Component from '@glimmer/component';
import { t } from 'ember-intl';

import { localeCategories } from '../../models/training';
import StateTag from './state-tag';

export default class TrainingDetailsCard extends Component {
  get formattedDuration() {
    const days = this.args.training.duration.days ? `${this.args.training.duration.days}j ` : '';
    const hours = this.args.training.duration.hours ? `${this.args.training.duration.hours}h ` : '';
    const minutes = this.args.training.duration.minutes ? `${this.args.training.duration.minutes}min` : '';
    return `${days}${hours}${minutes}`.trim();
  }

  get formattedLocale() {
    return localeCategories[this.args.training.locale];
  }

  <template>
    {{! template-lint-disable no-redundant-role }}
    <article class="training-details-card" role="article">
      <div class="training-details-card__content">
        <h1 class="training-details-card__title">{{@training.internalTitle}}</h1>
        <StateTag @isDisabled={{@training.isDisabled}} />
        <dl class="training-details-card__details">
          <dt class="training-details-card__details-label">{{t "pages.trainings.training.details.title"}}</dt>
          <dd class="training-details-card__details-value">{{@training.title}}</dd>
          <dt class="training-details-card__details-label">{{t "pages.trainings.training.details.publishedOn"}}</dt>
          <dd class="training-details-card__details-value">
            <a
              href={{@training.link}}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="{{@training.link}} (nouvelle fenêtre)"
            >
              {{@training.link}}
            </a>
          </dd>
          <dt class="training-details-card__details-label">{{t "pages.trainings.training.details.contentType"}}</dt>
          <dd class="training-details-card__details-value">{{@training.type}}</dd>
          <dt class="training-details-card__details-label">{{t "pages.trainings.training.details.duration"}}</dt>
          <dd class="training-details-card__details-value">{{this.formattedDuration}}</dd>
          <dt class="training-details-card__details-label">{{t
              "pages.trainings.training.details.localizedLanguage"
            }}</dt>
          <dd class="training-details-card__details-value">{{this.formattedLocale}}</dd>
          <dt class="training-details-card__details-label">{{t "pages.trainings.training.details.editorName"}}</dt>
          <dd class="training-details-card__details-value">{{@training.editorName}}</dd>
          <dt class="training-details-card__details-label">{{t "pages.trainings.training.details.editorLogo"}}</dt>
          <dd class="training-details-card__details-value">{{@training.editorLogoUrl}}</dd>
          <dt class="training-details-card__details-label">{{t "pages.trainings.training.details.status"}}</dt>
          <dd class="training-details-card__details-value">{{if
              @training.isRecommendable
              (t "pages.trainings.training.details.status-label.enabled")
              (t "pages.trainings.training.details.status-label.disabled")
            }}</dd>
        </dl>
      </div>
      <img class="training-details-card__editor-logo" src={{@training.editorLogoUrl}} alt={{@training.editorName}} />
    </article>
  </template>
}
