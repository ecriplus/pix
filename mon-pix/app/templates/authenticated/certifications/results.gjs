import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import CertificationEnder from 'mon-pix/components/certifications/certification-ender';
<template>
  {{pageTitle (t "pages.certification-results.title")}}

  <CertificationEnder
    @certificationNumber={{@model.id}}
    @isEndedBySupervisor={{@controller.isEndedBySupervisor}}
    @hasBeenEndedDueToFinalization={{@controller.hasBeenEndedDueToFinalization}}
  />
</template>
