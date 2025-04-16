<template>
  <h1>
    {{! template-lint-disable "no-bare-strings" }}
    Page Certificat V3
  </h1>
  <p>{{@certification.fullName}} {{@certification.birthdate}}</p>

  {{#each @certification.resultCompetenceTree.areas as |area|}}
    {{#each area.resultCompetences as |resultCompetence|}}
      <p>{{resultCompetence.name}}</p>
    {{/each}}
  {{/each}}
</template>
