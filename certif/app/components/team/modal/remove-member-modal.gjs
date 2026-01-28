import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixModal from '@1024pix/pix-ui/components/pix-modal';
import t from 'ember-intl/helpers/t';

<template>
  <PixModal
    @title='{{t "pages.team.members.remove-membership-modal.title"}}'
    @showModal={{@isOpen}}
    @onCloseButtonClick={{@onClose}}
  >
    <:content>
      <p>
        {{t
          'pages.team.members.remove-membership-modal.message'
          memberFirstName=@firstName
          memberLastName=@lastName
          htmlSafe=true
        }}
      </p>
    </:content>
    <:footer>
      <PixButton @triggerAction={{@onClose}} @variant='secondary' @isBorderVisible={{true}}>
        {{t 'common.actions.cancel'}}
      </PixButton>
      <PixButton @triggerAction={{@onSubmit}} @variant='error'>
        {{t 'pages.team.members.remove-membership-modal.actions.remove'}}
      </PixButton>
    </:footer>
  </PixModal>
</template>
