import onEscapeAction from '@1024pix/pix-ui/addon/modifiers/on-escape-action';
import trapFocus from '@1024pix/pix-ui/addon/modifiers/trap-focus';
import PixButton from '@1024pix/pix-ui/components/pix-button';
import { t } from 'ember-intl';

import TrainingCard from '../../../training/card';

<template>
  <div
    class="evaluation-shared-results-modal__overlay
      {{unless @showModal ' evaluation-shared-results-modal__overlay--hidden'}}"
    {{trapFocus @showModal}}
    {{onEscapeAction @onCloseButtonClick}}
  >
    <div
      class="evaluation-shared-results-modal"
      role="dialog"
      aria-labelledby="evaluation-shared-results-modal-title"
      aria-describedby="evaluation-shared-results-modal-trainings"
      aria-modal="true"
      ...attributes
    >
      <div class="evaluation-shared-results-modal__header">
        <PixButton @variant="tertiary" @iconAfter="close" @triggerAction={{@onCloseButtonClick}} @size="small">
          {{t "common.actions.close"}}
        </PixButton>
      </div>
      <img
        src="/images/strike.svg"
        role="presentation"
        alt=""
        width="174"
        height="137"
        class="evaluation-shared-results-modal__illustration"
      />
      <h1 id="evaluation-shared-results-modal-title" class="evaluation-shared-results-modal__title">
        {{t "pages.skill-review.tabs.trainings.shared-results-modal.title"}}
      </h1>
      <p class="evaluation-shared-results-modal__subtitle">
        {{t "pages.skill-review.tabs.trainings.shared-results-modal.subtitle"}}
      </p>
      <ul id="evaluation-shared-results-modal-trainings" class="evaluation-shared-results-modal__trainings">
        {{#each @trainings as |training|}}
          <li>
            <TrainingCard @training={{training}} />
          </li>
        {{/each}}
      </ul>

      <div class="evaluation-shared-results-modal__footer">
        <PixButton @variant="secondary" @triggerAction={{@onCloseButtonClick}}>
          {{t "pages.skill-review.tabs.trainings.shared-results-modal.return-results-action"}}
        </PixButton>
      </div>
    </div>
  </div>
</template>
