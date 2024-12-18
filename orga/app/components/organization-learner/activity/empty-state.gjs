import { t } from 'ember-intl';
import capitalize from 'lodash/capitalize';

<template>
  <section class="panel empty-state">
    <img src="{{this.rootURL}}/images/empty-state-activity.svg" alt="" role="none" />

    <div class="empty-state__text">
      <p>{{t
          "pages.organization-learner.activity.empty-state"
          organizationLearnerFirstName=(capitalize @firstName)
          organizationLearnerLastName=(capitalize @lastName)
        }}</p>
    </div>
  </section>
</template>
