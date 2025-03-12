<template>
  <div class="campaign-step">
    <img class="campaign-step__image" role="presentation" src={{@step.image.src}} width="60" height="60" />
    <h3 class="campaign-step__title">{{@step.title}}</h3>
    <p class="campaign-step__description">{{@step.description}}</p>
  </div>
</template>
