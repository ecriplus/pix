import LoginOrRegister from 'mon-pix/components/routes/login-or-register';
<template>
  <div class="student-sco">
    <LoginOrRegister
      @organizationName={{@model.organizationToJoin.name}}
      @redirectionUrl={{@model.redirectionUrl}}
      @organizationId={{@model.organizationToJoin.id}}
      @displayRegisterForm={{@controller.displayRegisterForm}}
      @toggleFormsVisibility={{@controller.toggleFormsVisibility}}
      @addGarAuthenticationMethodToUser={{@controller.addGarAuthenticationMethodToUser}}
    />
  </div>
</template>
