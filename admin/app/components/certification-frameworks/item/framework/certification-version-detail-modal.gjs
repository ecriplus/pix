import PixModal from '@1024pix/pix-ui/components/pix-modal';
import { t } from 'ember-intl';
import formatDate from 'ember-intl/helpers/format-date';

<template>
  <PixModal
    @title={{t "components.complementary-certifications.item.framework.version-detail-modal.title" id=@version.id}}
    @showModal={{true}}
    @onCloseButtonClick={{@onClose}}
  >
    <:content>
      <dl>
        <dt>{{t "components.complementary-certifications.item.framework.version-detail-modal.start-date"}}</dt>
        <dd>{{if @version.startDate (formatDate @version.startDate) "-"}}</dd>

        <dt>{{t "components.complementary-certifications.item.framework.version-detail-modal.expiration-date"}}</dt>
        <dd>{{if @version.expirationDate (formatDate @version.expirationDate) "-"}}</dd>
      </dl>
    </:content>
  </PixModal>
</template>
