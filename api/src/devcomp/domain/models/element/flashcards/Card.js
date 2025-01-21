class Card {
  constructor({ id, recto, verso }) {
    this.id = id;
    this.recto = this.#buildSideIgnoringEmptyImageUrl(recto);
    this.verso = this.#buildSideIgnoringEmptyImageUrl(verso);
  }

  #buildSideIgnoringEmptyImageUrl(side) {
    return side.image?.url?.length > 0 ? side : { text: side.text };
  }
}

export { Card };
