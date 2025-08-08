import PixTag from '@1024pix/pix-ui/components/pix-tag';

import CertificationInfoField from '../../info-field';

<template>
  <div class="certification-informations__card">
    <h2 class="certification-informations__card__title certification-informations__card__title--state">
      État
      {{#if @certification.isPublished}}
        <PixTag @color="success">Publiée</PixTag>
      {{/if}}
    </h2>
    <CertificationInfoField
      @value={{@session.id}}
      @edition={{false}}
      @label="Session :"
      @linkRoute="authenticated.sessions.session"
    />
    <CertificationInfoField @value={{@certification.statusLabelAndValue.label}} @edition={{false}} @label="Statut :" />
    <CertificationInfoField @value={{@certification.creationDate}} @edition={{false}} @label="Créée le :" />
    <CertificationInfoField @value={{@certification.completionDate}} @edition={{false}} @label="Terminée le :" />
    <CertificationInfoField @value={{@certification.publishedText}} @edition={{false}} @label="Publiée :" />
  </div>
</template>
