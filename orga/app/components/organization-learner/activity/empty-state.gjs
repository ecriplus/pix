import PixBlock from '@1024pix/pix-ui/components/pix-block';
import { t } from 'ember-intl';
import capitalize from 'lodash/capitalize';

<template>
  <PixBlock class="empty-state" @variant="orga">
    <img src="{{this.rootURL}}/images/empty-state-activity.svg" alt="" role="none" />

    <div class="empty-state__text">
      <p>{{t
          "pages.organization-learner.activity.empty-state"
          organizationLearnerFirstName=(capitalize @firstName)
          organizationLearnerLastName=(capitalize @lastName)
        }}</p>
    </div>
  </PixBlock>
</template>
