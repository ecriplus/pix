import { LinkTo } from '@ember/routing';

<template>
  <LinkTo @route={{@item.route}} @model={{@item.reference}}>
    <div class="combined-course-item">
      <div class="combined-course-item__title">{{@item.title}}</div>
    </div>
  </LinkTo>
</template>
