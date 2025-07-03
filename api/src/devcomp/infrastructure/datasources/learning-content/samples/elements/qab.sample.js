import { randomUUID } from 'node:crypto';

export function getQabSample() {
  return {
    id: randomUUID(),
    type: 'qab',
    instruction:
      '<p><strong>Maintenant, entraînez-vous sur des exemples concrets !</strong> </p> <p> Pour chaque exemple, choisissez si l’affirmation est <strong>vraie</strong> ou <strong>fausse</strong>.</p>',
    cards: [
      {
        id: randomUUID(),
        image: {
          url: 'https://assets.pix.org/modules/bac-a-sable/boules-de-petanque.jpg',
          altText: 'Plusieurs boules de pétanques',
        },
        text: 'Les boules de pétanques sont creuses ?',
        proposalA: 'Vrai',
        proposalB: 'Faux',
        solution: 'A',
      },
      {
        id: randomUUID(),
        text: 'Les chiens ne transpirent pas.',
        proposalA: 'Vrai',
        proposalB: 'Faux',
        solution: 'B',
      },
      {
        id: randomUUID(),
        image: {
          url: 'https://example.net/',
          altText: '',
        },
        text: 'Les dauphins sont des poissons.',
        proposalA: 'Vrai',
        proposalB: 'Faux',
        solution: 'B',
      },
    ],
  };
}
