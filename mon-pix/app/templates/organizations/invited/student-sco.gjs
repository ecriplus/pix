import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import AssociateScoStudentForm from 'mon-pix/components/routes/organizations/invited/associate-sco-student-form';
<template>
  {{pageTitle (t "pages.join.title")}}

  <div class="background-banner-wrapper">
    <div class="background-banner"></div>
    <main
      class="rounded-panel rounded-panel--strong rounded-panel--over-background-banner join-restricted-campaign__container"
      role="main"
    >
      <div class="join-restricted-campaign">
        <AssociateScoStudentForm
          @organizationName={{@model.organizationToJoin.name}}
          @organizationId={{@model.organizationToJoin.id}}
          @goToConnectionPage={{@controller.goToConnectionPage}}
          @onSubmit={{@controller.reconcile}}
        />
      </div>
    </main>
  </div>
</template>
