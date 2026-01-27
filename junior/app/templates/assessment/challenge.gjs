import Challenge from 'junior/components/challenge/challenge';
<template>
  <Challenge
    @challenge={{@model.challenge}}
    @assessment={{@model.assessment}}
    @activity={{@model.activity}}
    @oralization={{@model.oralization}}
  />
</template>
