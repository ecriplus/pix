import PixBlock from '@1024pix/pix-ui/components/pix-block';

<template>
  <PixBlock class="action-cards-list-item" @variant="orga">
    <div>
      <h2>{{@title}}</h2>
      <p>{{@description}}</p>
    </div>
    {{yield}}
  </PixBlock>
</template>
