import PixBlock from '@1024pix/pix-ui/components/pix-block';
import PixTag from '@1024pix/pix-ui/components/pix-tag';
import { LinkTo } from '@ember/routing';
import { DescriptionList } from 'pix-admin/components/ui/description-list';

<template>
  <PixBlock @variant="admin">
    <h2 class="certification-information-card__title certification-information-card__title--state">
      État
      {{#if @certification.isPublished}}
        <PixTag @color="success">Publiée</PixTag>
      {{else}}
        <PixTag @color="info">Non publiée</PixTag>
      {{/if}}
    </h2>

    <DescriptionList>
      <DescriptionList.Divider />

      <DescriptionList.Item @label="Session">
        <LinkTo @route="authenticated.sessions.session" @model={{@session.id}}>
          {{@session.id}}
        </LinkTo>
      </DescriptionList.Item>

      <DescriptionList.Divider />

      <DescriptionList.Item @label="Statut">
        {{@certification.statusLabelAndValue.label}}
      </DescriptionList.Item>

      <DescriptionList.Divider />

      <DescriptionList.Item @label="Créée le">
        {{@certification.creationDate}}
      </DescriptionList.Item>

      <DescriptionList.Divider />

      <DescriptionList.Item @label="Terminée le">
        {{@certification.completionDate}}
      </DescriptionList.Item>

      <DescriptionList.Divider />

      <DescriptionList.Item @label="Score">
        {{@certification.pixScore}}
        Pix
      </DescriptionList.Item>

      <DescriptionList.Divider />
    </DescriptionList>
  </PixBlock>
</template>
