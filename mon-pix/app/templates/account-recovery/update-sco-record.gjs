import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import RecoveryErrors from 'mon-pix/components/account-recovery/recovery-errors';
import UpdateScoRecordForm from 'mon-pix/components/account-recovery/update-sco-record-form';
import PixLogo from 'mon-pix/components/pix-logo';
<template>
  {{pageTitle (t "pages.account-recovery.find-sco-record.title")}}

  <div class="account-recovery">
    <div class="account-recovery__content">
      <PixLogo />
      <div class="account-recovery__content--image">
        <img alt src="/images/illustrations/account-recovery/illustration.svg" />
      </div>

      <div class="account-recovery__content--step">
        <div class="account-recovery__content--step--content">
          {{#if @controller.errorMessage}}
            <RecoveryErrors
              @title={{t "pages.account-recovery.errors.title"}}
              @message={{@controller.errorMessage}}
              @showRenewLink={{@controller.showRenewLink}}
              @showBackToHomeButton={{@controller.showBackToHomeButton}}
            />
          {{else}}
            <UpdateScoRecordForm
              @firstName={{@model.firstName}}
              @email={{@model.email}}
              @updateRecord={{@controller.updateRecord}}
              @isLoading={{@controller.isLoading}}
            />
          {{/if}}
        </div>
      </div>
    </div>
  </div>
</template>
