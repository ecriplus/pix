import { Element } from '../Element.js';
import { Card } from './Card.js';

class Flashcards extends Element {
  constructor({ id, title, instruction, introImage, cards }) {
    super({ id, type: 'flashcards' });

    this.title = title;
    this.instruction = instruction;
    this.setIntroImage(introImage);
    this.cards = cards.map(({ id, recto, verso }) => new Card({ id, recto, verso }));
    this.isAnswerable = true;
  }

  setIntroImage(introImage) {
    this.introImage = introImage?.url?.length > 0 ? introImage : undefined;
  }
}

export { Flashcards };
