import { t } from 'ember-intl';

import FooterLinks from '../footer-links';

<template>
  <footer aria-label={{t "navigation.footer.aria-label"}}>
    <FooterLinks @size="extra-small" />
  </footer>
</template>
