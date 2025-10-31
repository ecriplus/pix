import CombinedCourseParticipations from 'pix-orga/components/combined-course/participations';

<template>
  <CombinedCourseParticipations
    @hasCampaigns={{@model.combinedCourse.hasCampaigns}}
    @hasModules={{@model.combinedCourse.hasModules}}
    @participations={{@model.combinedCourseParticipations}}
    @onFilter={{@controller.triggerFiltering}}
    @statusFilter={{@controller.statuses}}
    @fullNameFilter={{@controller.fullName}}
    @clearFilters={{@controller.clearFilters}}
  />
</template>
