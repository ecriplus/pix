import PixTable from '@1024pix/pix-ui/components/pix-table';
import { t } from 'ember-intl';

import ListItem from './list-item';

<template>
  <PixTable
    @variant="admin"
    @caption={{t "components.organizations.children-list.table-name"}}
    @data={{@childOrganizations}}
  >
    <:columns as |childOrganization context|>
      <ListItem
        @childOrganization={{childOrganization}}
        @context={{context}}
        @onRefreshOrganizationChildren={{@onRefreshOrganizationChildren}}
      />
    </:columns>
  </PixTable>
</template>
