import ParticipationDetail from 'pix-orga/components/combined-course/participation-detail';

<template>
  <ParticipationDetail
    @combinedCourse={{@model.combinedCourse}}
    @participation={{@model.participation}}
    @itemsBySteps={{@model.itemsBySteps}}
  />
</template>
