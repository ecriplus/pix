import CombinedCourseHeader from 'pix-orga/components/combined-course/header';

<template>
  <CombinedCourseHeader
    @code={{@model.code}}
    @name={{@model.name}}
    @participationsCount={{@model.combinedCourseStatistics.participationsCount}}
    @completedParticipationsCount={{@model.combinedCourseStatistics.completedParticipationsCount}}
  />
  {{outlet}}
</template>
