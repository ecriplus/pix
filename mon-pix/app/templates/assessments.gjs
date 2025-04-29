import pageTitle from 'ember-page-title/helpers/page-title';
import Assessments from 'mon-pix/components/assessments/assessments';
<template>
  {{pageTitle @model.title}}

  <Assessments @assessment={{@model}}>
    {{outlet}}
  </Assessments>
</template>
