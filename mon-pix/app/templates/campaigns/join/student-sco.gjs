import LoginOrRegister from 'mon-pix/components/routes/login-or-register';
<template>
  <div class="student-sco">
    <LoginOrRegister
      @organizationName={{@model.organizationName}}
      @campaignCode={{@model.code}}
      @organizationId={{@model.organizationId}}
      @displayRegisterForm={{@controller.displayRegisterForm}}
      @toggleFormsVisibility={{@controller.toggleFormsVisibility}}
      @addGarAuthenticationMethodToUser={{@controller.addGarAuthenticationMethodToUser}}
    />
  </div>
</template>
