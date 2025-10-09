import Component from '@glimmer/component';
import { t } from 'ember-intl';

export default class QabCard extends Component {
  static MAX_HEIGHT = 190;

  get isError() {
    return this.args.status === 'error';
  }

  get isSuccess() {
    return this.args.status === 'success';
  }

  get hasDimensions() {
    return this.args.card.image.information.width > 0 && this.args.card.image.information.height > 0;
  }

  get hasImage() {
    return this.args.card.image?.url?.length > 0;
  }

  get userPrefersReducedMotion() {
    const userPrefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    return userPrefersReducedMotion.matches;
  }

  get height() {
    if (this.args.card.image.information && this.hasDimensions) {
      return QabCard.MAX_HEIGHT;
    }
    return null;
  }

  get width() {
    if (this.args.card.image.information && this.hasDimensions) {
      return Math.round(
        (QabCard.MAX_HEIGHT * this.args.card.image.information.width) / this.args.card.image.information.height,
      );
    }
    return null;
  }

  <template>
    <div
      class="qab-card
        {{if @isRemoved 'qab-card--removed'}}
        {{if this.userPrefersReducedMotion 'qab-card--without-transition'}}
        {{if this.isSuccess 'qab-card--success'}}
        {{if this.isError 'qab-card--error'}}"
    >
      {{#if this.isSuccess}}
        <p role="status" class="sr-only"> {{t "pages.modulix.qab.correct-answer"}} </p>
      {{/if}}
      {{#if this.isError}}
        <p role="status" class="sr-only"> {{t "pages.modulix.qab.incorrect-answer"}} </p>
      {{/if}}
      <div class="qab-card__container">
        <div class="qab-card-container-content {{if this.hasImage 'qab-card-container-content--with-image'}}">
          {{#if this.hasImage}}
            <img
              class="qab-card-container-content__image"
              src={{@card.image.url}}
              alt={{@card.image.altText}}
              height={{this.height}}
              width={{this.width}}
            />
          {{/if}}
          <p class="qab-card-container-content__text">{{@card.text}}</p>
        </div>
      </div>
    </div>
  </template>
}
