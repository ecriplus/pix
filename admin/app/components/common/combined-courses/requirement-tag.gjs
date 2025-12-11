import PixTag from '@1024pix/pix-ui/components/pix-tag';
import { t } from 'ember-intl';

const getItemColor = (type) => (type === 'evaluation' ? 'purple' : 'blue');
const getItemType = (type) =>
  type === 'evaluation'
    ? 'components.combined-course-blueprints.items.targetProfile'
    : 'components.combined-course-blueprints.items.module';

<template>
  <PixTag @color={{getItemColor @type}}>
    {{t (getItemType @type)}}
    -
    {{@value}}
  </PixTag>
</template>
