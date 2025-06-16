import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import { t } from 'ember-intl';

<template>
  <PixButtonLink
    class="framework__creation-button"
    @route="authenticated.complementary-certifications.item.framework.new"
  >
    {{t "components.complementary-certifications.item.framework.create-button"}}
  </PixButtonLink>
</template>
