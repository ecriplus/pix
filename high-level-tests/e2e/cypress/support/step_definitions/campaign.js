const { When, Then } = require("@badeball/cypress-cucumber-preprocessor");

When(`je vais sur la page d'accès à une campagne`, () => {
  cy.visitMonPix(`/campagnes`);
});

When(
  `je vais sur la campagne {string} avec l'identifiant {string}`,
  (campaignCode, participantExternalId) => {
    cy.visitMonPix(
      `/campagnes/${campaignCode}?participantExternalId=${participantExternalId}`,
    );
  },
);

When(`j'ouvre le sujet {string}`, (tubeName) => {
  cy.contains(tubeName)
    .closest("tr")
    .within(() => {
      cy.get("button").click();
    });
});

Then(`je vois la page (d')(de ){string} de la campagne`, (page) => {
  cy.url().should("include", page);
});

When(
  `je saisis la date de naissance {int}-{int}-{int}`,
  (dayOfBirth, monthOfBirth, yearOfBirth) => {
    cy.get("input#dayOfBirth").type(dayOfBirth);
    cy.get("input#monthOfBirth").type(monthOfBirth);
    cy.get("input#yearOfBirth").type(yearOfBirth);
  },
);

Then(`je vois {int} campagne\(s\)`, (campaignsCount) => {
  cy.findAllByRole("row").should("have.lengthOf", campaignsCount + 1);
});

Then(`je vois {int} tutoriel\(s\)`, (tutorialsCount) => {
  cy.findByRole("table", {
    name: "Tableau des sujets à travailler, certains présentent des colonnes supplémentaires indiquant le nombre de tutoriels existant en lien avec le sujet et un accès à ces tutoriels",
  }).within(() => {
    cy.findAllByRole("listitem").should("have.lengthOf", tutorialsCount);
  });
});

When(`je recherche une campagne avec le nom {string}`, (campaignSearchName) => {
  cy.get("input#name").type(campaignSearchName);
});

Then(`je vois le détail de la campagne {string}`, (campaignName) => {
  cy.findByRole("heading", { level: 1 }).contains(campaignName);
});

Then(`je vois {int} participants`, (numberOfParticipants) => {
  cy.findByRole("table", { name: "Liste des participants" }).within(() => {
    cy.findAllByRole("row").should("have.lengthOf", numberOfParticipants + 1);
  });
});

Then(`je vois {int} profils`, (numberOfProfiles) => {
  if (numberOfProfiles === 0) {
    cy.contains(
      "Aucun participant pour l’instant ! Envoyez-leur le lien suivant pour rejoindre votre campagne.",
    );
  } else {
    cy.findAllByRole("row").should("have.lengthOf", numberOfProfiles + 1);
  }
});

When(
  `je vois {int} résultats par compétence`,
  (numberOfResultsByCompetence) => {
    if (numberOfResultsByCompetence === 0) {
      cy.findByText("En attente de résultats");
    } else {
      cy.findAllByRole("row").should(
        "have.lengthOf",
        numberOfResultsByCompetence + 1,
      );
    }
  },
);

When(
  `je vois l'onglet de détails des résultats avec {int} compétences`,
  (numberOfResultsByCompetence) => {
    cy.get("[role='tabpanel'][tabindex='0']").within(() => {
      cy.get("tr").should("have.lengthOf", numberOfResultsByCompetence);
      cy.contains("Détails des résultats");
    });
  },
);

When(
  `je vois la formation recommandée ayant le titre {string}`,
  (trainingName) => {
    cy.get(".training-card-content__title").should("contain", trainingName);
  },
);

Then(`je vois la moyenne des résultats à {int}%`, (averageResult) => {
  cy.contains("Résultat moyen")
    .parent()
    .parent()
    .within(() => {
      cy.contains(`${averageResult} %`);
    });
});

Then(`je vois {int}% de réussite aux questions`, (globalResult) => {
  cy.contains("de réussite aux questions")
    .parent()
    .within(() => {
      cy.contains(`${globalResult}%`);
    });
});

Then(`je vois que j'ai partagé mon profil`, () => {
  cy.contains("Merci, votre profil a bien été envoyé !");
});

Then(`je vois que j'ai envoyé les résultats`, () => {
  cy.contains("Vos résultats ont été envoyés le");
});

Then(`je vois {int} sujets`, (tubeCount) => {
  cy.findByRole("table", {
    name: "Tableau des sujets à travailler, certains présentent des colonnes supplémentaires indiquant le nombre de tutoriels existant en lien avec le sujet et un accès à ces tutoriels",
  }).within(() => {
    cy.findAllByRole("row").should("have.lengthOf", tubeCount + 1);
  });
});

Then(
  `je vois que le sujet {string} est {string}`,
  (tubeName, recommendationLevel) => {
    cy.contains(tubeName)
      .closest("tr")
      .get(`[aria-label="${recommendationLevel}"]`);
  },
);

When('je clique sur le bouton "Associer"', () => {
  cy.contains("button", "Associer").click();
});

Then(`je vois la modale de contenus formatifs`, () => {
  cy.contains("Résultats partagés");
});
