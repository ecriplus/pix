import PixIconButton from '@1024pix/pix-ui/components/pix-icon-button';
<template>
  <PixIconButton
    aria-label={{@ariaLabel}}
    @iconName="{{if @isOpen 'chevronTop' 'chevronBottom'}}"
    aria-expanded="{{@isOpen}}"
    @triggerAction={{@onClick}}
    @withBackground={{false}}
    @size="small"
    @color="dark-grey"
  />
</template>
