import Organizations from 'pix-admin/components/trainings/target-profiles/organizations';

<template>
  <Organizations
    @organizations={{@model.organizations}}
    @targetProfile={{@model.targetProfile}}
    @controller={{@controller}}
  />
</template>
