import PixBackgroundHeader from '@1024pix/pix-ui/components/pix-background-header';
import PixBlock from '@1024pix/pix-ui/components/pix-block';
import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import UserAccountNavigation from 'mon-pix/components/user-account/user-account-navigation';
<template>
  {{pageTitle (t "pages.user-account.title")}}

  {{#if @controller.isPixAppNewLayoutEnabled}}
    <main id="main" class="main user-account global-page-container" role="main">
      <h1 class="user-account__title">{{t "pages.user-account.title"}}</h1>

      <div class="user-account__container">
        <UserAccountNavigation
          @class="user-account__navigation"
          @canSelfDeleteAccount={{@model.accountInfo.canSelfDeleteAccount}}
        />

        <section class="user-account__section">
          {{outlet}}
        </section>
      </div>
    </main>
  {{else}}
    <main id="main" class="main" role="main">
      <PixBackgroundHeader class="user-account-legacy">
        <h1 class="user-account-legacy__title">{{t "pages.user-account.title"}}</h1>

        <div class="user-account-legacy__menu-and-content">
          <UserAccountNavigation
            @class="user-account-legacy__navigation"
            @canSelfDeleteAccount={{@model.accountInfo.canSelfDeleteAccount}}
          />

          <PixBlock class="user-account-legacy__content">
            {{outlet}}
          </PixBlock>
        </div>
      </PixBackgroundHeader>
    </main>
  {{/if}}
</template>
