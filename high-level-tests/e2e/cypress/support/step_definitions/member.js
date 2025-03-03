const { When, Then } = require("@badeball/cypress-cucumber-preprocessor");

When(`je saisis l'URL de l'invitation`, () => {
  const urn = `/rejoindre?invitationId=1&code=ABCDEFGHI5`;
  cy.visitOrga(urn);
});

Then(`je suis redirigé vers la page pour rejoindre l'organisation`, () => {
  cy.get(".login-or-register-panel__invitation").should(
    "contain",
    "Vous êtes invité(e) à rejoindre l'organisation"
  );
});

Then(`je vois {int} invitation\(s\) en attente`, (numberOfInvitations) => {
  cy.contains(`Invitations (${numberOfInvitations})`).click();
  cy.findAllByRole('row').should(
    "have.lengthOf",
    numberOfInvitations + 1
  );
});

Then(`je vois {int} membre\(s\)`, (numberOfMembers) => {
  cy.contains(`Membres (${numberOfMembers})`).click();
  cy.findAllByRole('row').should("have.lengthOf", numberOfMembers + 1);
});

When(`j'invite {string} à rejoindre l'organisation`, (emailAddresses) => {
  cy.contains("Inviter un membre").click();
  cy.contains("Adresse(s) e-mail")
    .parent()
    .within(() => cy.get("textarea").type(emailAddresses));
  cy.get("button").contains("Inviter").click();
  cy.get("button").contains("Valider").click();
});
