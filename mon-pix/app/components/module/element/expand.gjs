import { htmlUnsafe } from '../../../helpers/html-unsafe';

<template>
  <details>
    <summary>{{@expand.title}}</summary>
    {{htmlUnsafe @expand.content}}
  </details>
</template>
