class QAB {
  constructor({ id, type, instruction, cards, feedback }) {
    this.id = id;
    this.type = type;
    this.instruction = instruction;
    this.isAnswerable = true;
    this.cards = cards;
    this.feedback = feedback;
  }
}

export { QAB };
