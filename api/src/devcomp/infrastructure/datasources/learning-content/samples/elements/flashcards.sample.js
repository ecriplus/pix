import { randomUUID } from 'node:crypto';

export function getFlashcardsSample() {
  return {
    id: randomUUID(),
    type: 'flashcards',
    title: "Introduction à l'adresse e-mail",
    instruction: '<p>...</p>',
    introImage: {
      url: 'https://example.org/image.jpeg',
    },
    cards: [
      {
        id: randomUUID(),
        recto: {
          image: {
            url: 'https://example.org/image.jpeg',
          },
          text: "A quoi sert l'arobase dans mon adresse email ?",
        },
        verso: {
          image: {
            url: 'https://example.org/image.jpeg',
          },
          text: "Parce que c'est joli",
        },
      },
      {
        id: randomUUID(),
        recto: {
          image: {
            url: '',
          },
          text: "A quoi sert l'apostrophe typographique ?",
        },
        verso: {
          image: {
            url: '',
          },
          text: "Parce que c'est joli",
        },
      },
    ],
  };
}
