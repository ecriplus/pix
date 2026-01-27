import MembersList from 'pix-certif/components/members-list';
<template>
  <MembersList
    @members={{@model.members}}
    @hasCleaHabilitation={{@model.hasCleaHabilitation}}
    @onLeaveCertificationCenter={{@controller.leaveCertificationCenter}}
    @onRemoveMember={{@controller.removeMember}}
  />
</template>
