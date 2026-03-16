import t from 'ember-intl/helpers/t';
import CopyButton from 'pix-admin/components/ui/copy-button';

<template>
  <div class="network__head-information">
    <div class="network__title-section">
      <h1 class="network__name">{{@network.name}}</h1>
      <div class="network__id">
        <p>ID : <span>{{@network.id}}</span></p>
        <CopyButton
          @id="copy-network-id"
          @value={{@network.id}}
          @tooltip={{t "components.networks.copy-id"}}
          @label={{t "components.networks.copy-id"}}
        />
      </div>
    </div>
  </div>
</template>
