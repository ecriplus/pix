import CertificationScoringConfiguration from './certification-scoring-configuration';
import CertificationVersionChallengesConfiguration from './certification-version-challenges-configuration';
import CompetenceScoringConfiguration from './competence-scoring-configuration';
import ScoWhitelistConfiguration from './sco-whitelist-configuration';
import ScoBlockedAccessDates from './sco-blocked-access-dates';

<template>
  <ScoBlockedAccessDates @model={{@scoBlockedAccessDates}}/>
  <ScoWhitelistConfiguration />
  <CertificationScoringConfiguration />
  <CompetenceScoringConfiguration />
  <CertificationVersionChallengesConfiguration @model={{@certificationVersion}} />
</template>
