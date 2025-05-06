import PixNotificationAlert from '@1024pix/pix-ui/components/pix-notification-alert';
import t from 'ember-intl/helpers/t';
import LanguageSwitcher from 'mon-pix/components/language-switcher';
<template>
  <div class="language">
    <LanguageSwitcher
      @label="{{t 'pages.user-account.language.lang'}}"
      @selectedLanguage={{@model.lang}}
      @onLanguageChange={{@controller.onLanguageChange}}
    />

    {{#if @controller.shouldDisplayLanguageUpdatedMessage}}
      <PixNotificationAlert class="language__notification" @type="success" @withIcon={{true}}>
        {{t "pages.user-account.language.update-successful"}}
      </PixNotificationAlert>
    {{/if}}
  </div>
</template>
