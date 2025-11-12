import CombinedCourseHeader from 'pix-orga/components/combined-course/header';
import CombinedCourseParticipations from 'pix-orga/components/combined-course/participations';

<template>
  <CombinedCourseHeader
    @code={{@model.combinedCourse.code}}
    @name={{@model.combinedCourse.name}}
    @campaignIds={{@model.combinedCourse.campaignIds}}
    @participationsCount={{@model.combinedCourse.combinedCourseStatistics.participationsCount}}
    @completedParticipationsCount={{@model.combinedCourse.combinedCourseStatistics.completedParticipationsCount}}
  />
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
