import { Element } from '../Element.js';
import { Card } from './Card.js';

class Flashcards extends Element {
  constructor({ id, title, instruction, introImage, cards }) {
    super({ id, type: 'flashcards' });

    this.title = title;
    this.instruction = instruction;
    this.introImage = introImage;
    this.cards = cards.map(({ id, recto, verso }) => new Card({ id, recto, verso }));
  }
}

export { Flashcards };
