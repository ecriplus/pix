import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import UserAccountNavigation from 'mon-pix/components/user-account/user-account-navigation';
<template>
  {{pageTitle (t "pages.user-account.title")}}
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
</template>
