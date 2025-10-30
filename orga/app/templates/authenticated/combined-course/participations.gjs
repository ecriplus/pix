import CombinedCourseParticipations from 'pix-orga/components/combined-course/participations';

<template>
  <CombinedCourseParticipations
    @participations={{@model}}
    @onFilter={{@controller.triggerFiltering}}
    @statusFilter={{@controller.statuses}}
    @fullNameFilter={{@controller.fullName}}
    @clearFilters={{@controller.clearFilters}}
  />
</template>
