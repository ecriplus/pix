import { QABCard } from './QABCard.js';

class QAB {
  constructor({ id, type, instruction, cards }) {
    this.id = id;
    this.type = type;
    this.instruction = instruction;
    this.cards = cards.map((card) => new QABCard(card));
  }
}

export { QAB };
