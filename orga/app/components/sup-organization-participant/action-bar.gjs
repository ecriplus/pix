import PixButton from '@1024pix/pix-ui/components/pix-button';
import { t } from 'ember-intl';

import ActionBar from '../ui/action-bar';
<template>
  <ActionBar>
    <:information>
      {{t "pages.sup-organization-participants.action-bar.information" count=@count}}
    </:information>
    <:actions>
      <PixButton @triggerAction={{@openDeletionModal}} type="button" @variant="error">
        {{t "pages.sup-organization-participants.action-bar.delete-button"}}
      </PixButton>
    </:actions>
  </ActionBar>
</template>
