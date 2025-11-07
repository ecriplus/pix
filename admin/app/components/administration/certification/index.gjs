import CertificationScoringConfiguration from './certification-scoring-configuration';
import CertificationVersionChallengesConfiguration from './certification-version-challenges-configuration';
import CompetenceScoringConfiguration from './competence-scoring-configuration';
import ScoWhitelistConfiguration from './sco-whitelist-configuration';

<template>
  <ScoWhitelistConfiguration />
  <CertificationScoringConfiguration />
  <CompetenceScoringConfiguration />
  <CertificationVersionChallengesConfiguration @model={{@model}} />
</template>
