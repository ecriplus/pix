import PixNotificationAlert from '@1024pix/pix-ui/components/pix-notification-alert';
import t from 'ember-intl/helpers/t';
import LocaleSwitcher from 'mon-pix/components/locale-switcher';

<template>
  <div class="language">
    <LocaleSwitcher
      @label={{t "pages.user-account.language.lang"}}
      @defaultValue={{@model.lang}}
      @onChange={{@controller.onLanguageChange}}
    />

    {{#if @controller.shouldDisplayLanguageUpdatedMessage}}
      <PixNotificationAlert class="language__notification" @type="success" @withIcon={{true}}>
        {{t "pages.user-account.language.update-successful"}}
      </PixNotificationAlert>
    {{/if}}
  </div>
</template>
