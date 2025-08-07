import PixButton from "@1024pix/pix-ui/components/pix-button";
<template>
  <h2 class="page-section__title">Filtrer par organisations du profil cible {{@model.targetProfile.internalName}}</h2>

  <ul class="edit-training-trigger__actions">
    <li>
      <PixButton @variant="secondary" @size="small" @triggerAction={{this.onCancel}}>
        Annuler
      </PixButton>
    </li>
    <li>
      <PixButton @variant="success" @size="small" @type="submit" @isLoading={{this.submitting}}>
        Enregistrer
      </PixButton>
    </li>
  </ul>
</template>
