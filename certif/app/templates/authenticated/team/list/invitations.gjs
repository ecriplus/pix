import pageTitle from 'ember-page-title/helpers/page-title';
import InvitationsList from 'pix-certif/components/team/invitations-list';

<template>
  {{pageTitle 'Invitations'}}

  <InvitationsList
    @invitations={{@model}}
    @onCancelInvitationButtonClicked={{@controller.cancelInvitation}}
    @onResendInvitationButtonClicked={{@controller.resendInvitation}}
  />
</template>
