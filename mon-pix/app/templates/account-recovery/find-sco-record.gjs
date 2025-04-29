import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import BackupEmailConfirmationForm from 'mon-pix/components/account-recovery/backup-email-confirmation-form';
import ConfirmationEmailSent from 'mon-pix/components/account-recovery/confirmation-email-sent';
import ConfirmationStep from 'mon-pix/components/account-recovery/confirmation-step';
import RecoveryErrors from 'mon-pix/components/account-recovery/recovery-errors';
import StudentInformationForm from 'mon-pix/components/account-recovery/student-information-form';
import PixLogo from 'mon-pix/components/pix-logo';
<template>
  {{pageTitle (t "pages.account-recovery.find-sco-record.title")}}

  <div class="account-recovery">
    <div class="account-recovery__content">
      <PixLogo />
      <div class="account-recovery__content--image">
        <img alt src="/images/illustrations/account-recovery/{{@controller.templateImg}}.svg" />
      </div>

      <div class="account-recovery__content--step">
        {{#if @controller.showStudentInformationForm}}
          <StudentInformationForm
            @submitStudentInformation={{@controller.submitStudentInformation}}
            @showAccountNotFoundError={{@controller.showAccountNotFoundError}}
          />
        {{/if}}

        {{#if @controller.showErrors}}
          <RecoveryErrors
            @title={{@controller.accountRecoveryError.title}}
            @message={{@controller.accountRecoveryError.message}}
            @showBackToHomeButton={{@controller.accountRecoveryError.showBackToHomeButton}}
          />
        {{/if}}

        {{#if @controller.showConfirmationStep}}
          <ConfirmationStep
            @studentInformationForAccountRecovery={{@controller.studentInformationForAccountRecovery}}
            @cancelAccountRecovery={{@controller.cancelAccountRecovery}}
            @continueAccountRecoveryBackupEmailConfirmation={{@controller.continueAccountRecoveryBackupEmailConfirmation}}
          />
        {{/if}}

        {{#if @controller.showBackupEmailConfirmationForm}}
          <BackupEmailConfirmationForm
            @sendEmail={{@controller.sendEmail}}
            @resetErrors={{@controller.resetErrors}}
            @firstName={{@controller.studentInformationForAccountRecovery.firstName}}
            @existingEmail={{@controller.studentInformationForAccountRecovery.email}}
            @cancelAccountRecovery={{@controller.cancelAccountRecovery}}
            @showAlreadyRegisteredEmailError={{@controller.showAlreadyRegisteredEmailError}}
            @isLoading={{@controller.isLoading}}
          />
        {{/if}}

        {{#if @controller.showConfirmationEmailSent}}
          <ConfirmationEmailSent />
        {{/if}}
      </div>
    </div>
  </div>
</template>
