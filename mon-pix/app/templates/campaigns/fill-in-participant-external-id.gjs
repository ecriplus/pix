import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import FillInParticipantExternalId from 'mon-pix/components/routes/campaigns/fill-in-participant-external-id';
<template>
  {{pageTitle (t "pages.fill-in-participant-external-id.title")}}

  <FillInParticipantExternalId
    @campaign={{@model}}
    @onSubmit={{@controller.onSubmitParticipantExternalId}}
    @onCancel={{@controller.onCancel}}
  />
</template>
