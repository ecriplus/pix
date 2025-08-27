export const ITEM_TYPE = {
  CAMPAIGN: 'CAMPAIGN',
  MODULE: 'MODULE',
  FORMATION: 'FORMATION',
};

export class CombinedCourseItem {
  constructor({ id, title, reference, type, redirection, isCompleted }) {
    this.id = id;
    this.title = title;
    this.reference = reference;
    this.redirection = redirection;
    this.type = type;
    this.isCompleted = isCompleted;
  }
}
