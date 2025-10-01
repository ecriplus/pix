import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixCheckbox from '@1024pix/pix-ui/components/pix-checkbox';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import { eq } from 'ember-truth-helpers';

import didInsert from '../../modifiers/modifier-did-insert';
import StepFive from './step-five';
import StepFour from './step-four';
import StepOne from './step-one';
import StepThree from './step-three';
import StepTwo from './step-two';

const PIX_PLUS_DURATIONS = {
  DROIT: 45,
  PRO_SANTE: 45,
  EDU: 90,
};

const PIX_STANDARD_DURATION = 105;

export default class Steps extends Component {
  @service intl;
  @tracked pageId = 1;
  @tracked pageCount = 5;
  @tracked isConfirmationCheckboxChecked = false;
  @service router;

  _setupPaging(numberOfPages, currentPageId) {
    const classOfPages = new Array(numberOfPages);
    classOfPages[currentPageId - 1] = 'active';
    return classOfPages;
  }

  _isPixPlus() {
    const complementaryKey = this.args.candidate?.complementaryCertificationKey;
    if (complementaryKey && complementaryKey !== 'CLEA') {
      return true;
    }
    return false;
  }

  get certificationName() {
    const complementaryKey = this.args.candidate?.complementaryCertificationKey;
    if (this._isPixPlus()) {
      return this.intl.t(`pages.complementary-certification-names.${complementaryKey}`);
    }
    return 'Pix';
  }

  get certificationInstructionStep1Paragraph1() {
    if (this._isPixPlus()) {
      return this.intl.t('pages.certification-instructions.steps.1.paragraphs.pix-plus-1', {
        certificationName: this.certificationName,
        htmlSafe: true,
      });
    }
    return this.intl.t('pages.certification-instructions.steps.1.paragraphs.1', {
      certificationName: this.certificationName,
      htmlSafe: true,
    });
  }

  get title() {
    return this.intl.t(`pages.certification-instructions.steps.${this.pageId}.title`, {
      certificationName: this.certificationName,
    });
  }

  get paging() {
    return this._setupPaging(this.pageCount, this.pageId);
  }

  get showPreviousButton() {
    return this.pageId > 1;
  }

  get isNextButtonDisabled() {
    return !this.isConfirmationCheckboxChecked && this.pageId === this.pageCount;
  }

  get nextButtonAriaLabel() {
    const translationKey = this.pageId === this.pageCount ? 'last-page.aria-label' : 'aria-label';
    return this.intl.t(`pages.certification-instructions.buttons.continuous.${translationKey}`);
  }

  get vocalStepIdentifier() {
    return this.intl.t(`pages.certification-instructions.vocal-step-identifier`, {
      pageId: this.pageId,
      pageCount: this.pageCount,
    });
  }

  get certificationDurationInMinutes() {
    const complementaryKey = this.args.candidate?.complementaryCertificationKey;

    if (!complementaryKey || complementaryKey === 'CLEA') {
      return PIX_STANDARD_DURATION;
    }

    switch (complementaryKey) {
      case 'DROIT':
        return PIX_PLUS_DURATIONS.DROIT;
      case 'PRO_SANTE':
        return PIX_PLUS_DURATIONS.PRO_SANTE;
      case 'EDU_1ER_DEGRE':
      case 'EDU_2ND_DEGRE':
      case 'EDU_CPE':
        return PIX_PLUS_DURATIONS.EDU;
      default:
        return PIX_STANDARD_DURATION;
    }
  }

  get durationLegend() {
    const minutes = this.certificationDurationInMinutes;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
      return `${minutes} min`;
    }
    if (remainingMinutes === 0) {
      return `${hours} H`;
    }
    return `${hours} H ${remainingMinutes.toString().padStart(2, '0')} min`;
  }

  get durationText() {
    const minutes = this.certificationDurationInMinutes;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
      return `${minutes}min`;
    }
    if (remainingMinutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h${remainingMinutes.toString().padStart(2, '0')}`;
  }

  focus(element) {
    element.focus();
  }

  @action
  previousStep() {
    this.pageId = this.pageId - 1;
    this.isConfirmationCheckboxChecked = false;
  }

  @action
  async nextStep() {
    if (this.pageId < this.pageCount) {
      this.pageId = this.pageId + 1;
    }

    if (this.isConfirmationCheckboxChecked) {
      await this.submit();

      this.router.transitionTo('authenticated.certifications.start', this.args.candidate.id);
    }
  }

  @action
  onChange(event) {
    this.isConfirmationCheckboxChecked = !!event.target.checked;
  }

  @action
  async submit() {
    await this.args.candidate.save({
      adapterOptions: {
        hasSeenCertificationInstructions: true,
      },
    });
  }

  <template>
    <h2 {{didInsert this.focus}} tabindex="0" class="instructions-step__title">{{this.title}}
      <span class="screen-reader-only">{{this.vocalStepIdentifier}}</span>
    </h2>

    {{#if (eq this.pageId 1)}}
      <StepOne
        @certificationName={{this.certificationName}}
        @step1Paragraph1={{this.certificationInstructionStep1Paragraph1}}
      />
    {{/if}}
    {{#if (eq this.pageId 2)}}
      <StepTwo @durationLegend={{this.durationLegend}} @durationText={{this.durationText}} />
    {{/if}}
    {{#if (eq this.pageId 3)}}
      <StepThree />
    {{/if}}
    {{#if (eq this.pageId 4)}}
      <StepFour />
    {{/if}}
    {{#if (eq this.pageId 5)}}
      <StepFive @certificationName={{this.certificationName}} />
      <PixCheckbox {{on "change" this.onChange}}>
        <:label>{{t "pages.certification-instructions.steps.5.checkbox-label"}}</:label>
      </PixCheckbox>
    {{/if}}

    <footer class="instructions-footer">
      <div class="instructions-footer-dots">
        {{#each this.paging as |page-class|}}
          <img
            class="instructions-footer-dots__dot {{page-class}}"
            src="/images/illustrations/certification-instructions-steps/ellipse.svg"
            alt=""
          />
        {{/each}}
      </div>
      <div class="instructions-footer__buttons">
        {{#if this.showPreviousButton}}
          <PixButton
            @size="large"
            @variant="secondary"
            @triggerAction={{this.previousStep}}
            aria-label={{t "pages.certification-instructions.buttons.previous.aria-label"}}
          >
            {{t "pages.certification-instructions.buttons.previous.label"}}
          </PixButton>
        {{/if}}
        <PixButton
          @size="large"
          @triggerAction={{this.nextStep}}
          @isDisabled={{this.isNextButtonDisabled}}
          aria-label={{this.nextButtonAriaLabel}}
        >
          {{t "pages.certification-instructions.buttons.continuous.label"}}
        </PixButton>
      </div>
    </footer>
  </template>
}
