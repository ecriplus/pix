import Framework from 'pix-admin/components/certification-frameworks/item/framework';

<template>
  <Framework
    @frameworkKey={{@model.frameworkKey}}
    @complementaryCertification={{@model.currentComplementaryCertification}}
  />
</template>
