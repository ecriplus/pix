import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import { t } from 'ember-intl';
import ModuleObjectives from 'mon-pix/components/module/instruction/objectives';
import ModuleBetaBanner from 'mon-pix/components/module/layout/beta-banner';

<template>
  {{#if @module.isBeta}}
    <ModuleBetaBanner />
  {{/if}}

  <main class="module-recap">
    <div class="module-recap__header">
      <PixIcon @name="checkCircle" @plainIcon={{true}} @ariaHidden={{true}} class="module-recap-header__icon" />
    </div>
    <h1 class="module-recap__title">{{t "pages.modulix.recap.title"}}</h1>

    <div class="module-recap__objectives">
      <p class="module-recap-objectives__subtitle">{{t "pages.modulix.recap.subtitle" htmlSafe=true}}</p>
      <ModuleObjectives @objectives={{@module.details.objectives}} />
    </div>
    {{#if @module.isBeta}}
      <div class="module-recap__link-form">
        <PixButtonLink
          @size="large"
          target="_blank"
          @href="https://form-eu.123formbuilder.com/82940/votre-avis-sur-les-modules-de-formation-pix?2850087={{@passage.id}}"
        >
          {{t "pages.modulix.recap.goToForm"}}
        </PixButtonLink>
      </div>
    {{/if}}
    <div class="module-recap__link-details">
      <PixButtonLink @size="large" @route="authenticated.user-dashboard" @variant="secondary">
        {{t "pages.modulix.recap.goToHomepage"}}
      </PixButtonLink>
    </div>
  </main>
</template>
