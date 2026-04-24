import Sessions from 'pix-certif/components/sessions/index';

<template>
  <Sessions
    @sessionSummaries={{@model.sessionSummaries}}
    @sessionId={{@controller.sessionId}}
    @status={{@controller.status}}
  />
</template>
