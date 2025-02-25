import PixIcon from '@1024pix/pix-ui/components/pix-icon';

<template>
  {{! template-lint-disable require-input-label }}
  <div class="input search-input" ...attributes>
    <PixIcon @name="search" />
    <input
      id={{@inputName}}
      name={{@inputName}}
      placeholder={{@placeholder}}
      aria-label={{@label}}
      value={{@value}}
      oninput={{@onSearch}}
      class="search-input__invisible-field"
    />
  </div>
</template>
