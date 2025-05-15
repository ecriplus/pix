import htmlUnsafe from 'mon-pix/helpers/html-unsafe';

<template>
  <button
    class="proposal-button {{if @isSelected 'proposal-button--selected'}}"
    type="submit"
    name={{@proposal.content}}
    value={{@proposal.id}}
    disabled={{@isDisabled}}
  >
    {{htmlUnsafe @proposal.content}}
  </button>
</template>
