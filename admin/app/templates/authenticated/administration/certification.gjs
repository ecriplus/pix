import Certification from 'pix-admin/components/administration/certification/index';
<template>
  <Certification
    @certificationVersion={{@model.certificationVersion}}
    @scoBlockedAccessDates={{@model.scoBlockedAccessDates}}
  />
</template>
