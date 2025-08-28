import OrganizationPlacesOrCreditInfo from './organization-places-or-credit-info';
import SchoolSessionManagement from './school-session-management';
import UserLoggedMenu from './user-logged-menu';

<template>
  <div class="topbar">
    <OrganizationPlacesOrCreditInfo @placesCount={{@placesCount}} />
    <SchoolSessionManagement />
    <UserLoggedMenu class="topbar__user-logged-menu" />
  </div>
</template>
