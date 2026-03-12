import PixTable from '@1024pix/pix-ui/components/pix-table';
import PixTableColumn from '@1024pix/pix-ui/components/pix-table-column';

<template>
  {{#if @networks}}
    <PixTable @variant="admin" @caption="Liste des réseaux. Contient le nom et l'ID." @data={{@networks}}>
      <:columns as |network context|>
        <PixTableColumn @context={{context}}>
          <:header>
            ID
          </:header>
          <:cell>
            {{network.id}}
          </:cell>
        </PixTableColumn>
        <PixTableColumn @context={{context}} class="break-word">
          <:header>
            Nom
          </:header>
          <:cell>
            {{network.name}}
          </:cell>
        </PixTableColumn>
      </:columns>
    </PixTable>
  {{else}}
    <div class="table__empty">Aucun résultat</div>
  {{/if}}
</template>
