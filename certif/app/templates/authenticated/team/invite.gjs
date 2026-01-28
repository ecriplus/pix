import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import InviteForm from 'pix-certif/components/team/invite-form';

<template>
  {{pageTitle (t 'pages.team-invite.title')}}

  <div class='team-invite-page'>
    <h1 class='page-title'>
      {{t 'pages.team-invite.title'}}
    </h1>

    <p>
      {{t 'pages.team-invite.email-requirement'}}<br />
      {{t 'pages.team-invite.several-email-requirement'}}
    </p>

    <p>
      {{t 'pages.team-invite.invited-members'}}
    </p>

    <InviteForm
      @email={{@model.email}}
      @isLoading={{@controller.isLoading}}
      @onSubmit={{@controller.createCertificationCenterInvitation}}
      @onCancel={{@controller.cancel}}
      @onUpdateEmail={{@controller.updateEmail}}
      class='team-invite-page__form'
    />
  </div>
</template>
