import PixIconButton from '@1024pix/pix-ui/components/pix-icon-button';
import { action } from '@ember/object';
import { LinkTo } from '@ember/routing';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import dayjsFormat from 'ember-dayjs/helpers/dayjs-format';
import t from 'ember-intl/helpers/t';
import not from 'ember-truth-helpers/helpers/not';

const status = {
  VALIDATED: 'validated',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected',
};

export default class CertificationsListItem extends Component {
  <template>
    {{! template-lint-disable link-href-attributes }}
    <div
      class="certifications-list-item
        {{if this.isPublished 'certifications-list-item__published-item' 'certifications-list-item__unpublished-item'}}
        {{if this.isClickable 'certifications-list-item__clickable' 'certifications-list-item__not-clickable'}}"
    >

      {{#if this.isNotPublished}}
        <div class="certifications-list-item__row-presentation">
          <div class="certifications-list-item__cell">
            {{dayjsFormat @certification.date "DD/MM/YYYY"}}
          </div>

          <div class="certifications-list-item__cell-double-width">
            <img src="/images/icons/sablier.svg" alt data-test-id="certifications-list-item__hourglass-img" />
            {{t "pages.certifications-list.statuses.not-published.title"}}
          </div>
          <div class="certifications-list-item__cell-pix-score"></div>

          <div class="certifications-list-item__cell-certification-center">
            {{@certification.certificationCenter}}
          </div>

          <div class="certifications-list-item__cell-detail">
          </div>
        </div>
      {{else if this.isRejected}}

        <div class="certifications-list-item__row-presentation">

          <div class="certifications-list-item__cell">
            {{dayjsFormat @certification.date "DD/MM/YYYY"}}
          </div>

          <div class="certifications-list-item__cell-double-width">
            <img src="/images/icons/icon-croix.svg" alt data-test-id="certifications-list-item__cross-img" />
            {{t "pages.certifications-list.statuses.fail.title"}}
          </div>
          <div class="certifications-list-item__cell-pix-score"></div>

          <div class="certifications-list-item__cell-certification-center">
            {{@certification.certificationCenter}}
          </div>

          <div class="certifications-list-item__cell-detail">
            {{#if this.shouldDisplayComment}}
              <PixIconButton
                @ariaLabel={{t "pages.certifications-list.statuses.fail.action"}}
                @iconName={{if this.isOpen "chevronTop" "chevronBottom"}}
                @triggerAction={{this.toggleCertificationDetails}}
              />
            {{/if}}
          </div>
        </div>

        {{#if this.shouldDisplayComment}}
          <div
            aria-hidden="{{not this.isOpen}}"
            class="certifications-list-item__row-comment
              {{if this.isOpen ' certifications-list-item__row-comment--open'}}"
          >
            <div class="certifications-list-item__row-comment-cell">
              {{@certification.commentForCandidate}}
            </div>
          </div>
        {{/if}}

      {{else if this.isValidated}}
        <LinkTo
          @route="authenticated.user-certifications.get"
          @model={{@certification.id}}
          class="certifications-list-item__row-presentation"
        >
          <div class="certifications-list-item__cell">
            {{dayjsFormat @certification.date "DD/MM/YYYY"}}
          </div>

          <div class="certifications-list-item__cell-double-width">
            <img src="/images/icons/icon-check-vert.svg" alt data-test-id="certifications-list-item__green-check-img" />
            {{t "pages.certifications-list.statuses.success.title"}}
          </div>
          <div class="certifications-list-item__cell-pix-score">
            <div class="certifications-list-item__pix-score">
              <span>{{@certification.pixScore}}</span>
            </div>
          </div>

          <div class="certifications-list-item__cell-certification-center">
            {{@certification.certificationCenter}}
          </div>

          <div class="certifications-list-item__cell-detail">
            <a>{{t "pages.certifications-list.statuses.success.action"}}</a>
          </div>
        </LinkTo>
      {{else if this.isCancelled}}
        <div class="certifications-list-item__row-presentation">

          <div class="certifications-list-item__cell">
            {{dayjsFormat @certification.date "DD/MM/YYYY"}}
          </div>

          <div class="certifications-list-item__cell-double-width">
            <img src="/images/icons/icon-croix.svg" alt data-test-id="certifications-list-item__cross-img" />
            {{t "pages.certifications-list.statuses.cancelled.title"}}
          </div>
          <div class="certifications-list-item__cell-pix-score"></div>

          <div class="certifications-list-item__cell-certification-center">
            {{@certification.certificationCenter}}
          </div>

          <div class="certifications-list-item__cell-detail">
            {{#if this.shouldDisplayComment}}
              <PixIconButton
                class="certifications-list-item__icon"
                @ariaLabel={{t "pages.certifications-list.statuses.fail.action"}}
                @iconName={{if this.isOpen "chevronTop" "chevronBottom"}}
                @triggerAction={{this.toggleCertificationDetails}}
              />
            {{/if}}
          </div>
        </div>

        {{#if this.shouldDisplayComment}}
          <div
            aria-hidden="{{not this.isOpen}}"
            class="certifications-list-item__row-comment
              {{if this.isOpen ' certifications-list-item__row-comment--open'}}"
          >
            <div class="certifications-list-item__row-comment-cell">
              {{@certification.commentForCandidate}}
            </div>
          </div>
        {{/if}}
      {{/if}}

    </div>
  </template>
  @tracked
  isOpen = false;

  get certification() {
    return this.args.certification;
  }

  get isRejected() {
    return this.certification.status === status.REJECTED;
  }

  get isValidated() {
    return this.certification.status === status.VALIDATED;
  }

  get isNotPublished() {
    return !this.isPublished;
  }

  get isPublished() {
    return this.certification?.isPublished;
  }

  get isPublishedAndValidated() {
    return this.isPublished && this.isValidated;
  }

  get isCancelled() {
    return this.certification?.status === status.CANCELLED;
  }

  get shouldDisplayComment() {
    return this.isPublished && (this.isRejected || this.isCancelled) && this.certification?.commentForCandidate;
  }

  get isClickable() {
    return this.shouldDisplayComment || this.isPublishedAndValidated;
  }

  @action
  toggleCertificationDetails() {
    this.isOpen = !this.isOpen;
  }
}
