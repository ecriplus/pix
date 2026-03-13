import { LinkTo } from '@ember/routing';
import t from 'ember-intl/helpers/t';
import CopyButton from 'pix-admin/components/ui/copy-button';
import { DescriptionList } from 'pix-admin/components/ui/description-list';

<template>
  <DescriptionList>
    <DescriptionList.Item @label={{t "components.networks.information-view.head-organization"}}>
      {{@network.headOrganization.name}}
    </DescriptionList.Item>

    <DescriptionList.Divider />

    <DescriptionList.Item
      @label={{t "components.networks.information-view.head-organization-id"}}
      @labelClass="network__information-view__head-organization-id__label"
      @valueClass="network__information-view__head-organization-id"
    >
      <LinkTo @route="authenticated.organizations.get" @model={{@network.headOrganization.id}}>
        {{@network.headOrganization.id}}
      </LinkTo>
      <CopyButton
        @id="copy-head-organization-id"
        @value={{@network.headOrganization.id}}
        @tooltip={{t "components.networks.copy-id"}}
        @label={{t "components.networks.copy-id"}}
      />
    </DescriptionList.Item>

    <DescriptionList.Divider />
  </DescriptionList>
</template>
