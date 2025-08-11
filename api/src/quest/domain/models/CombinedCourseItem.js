export const ITEM_TYPE = {
  CAMPAIGN: 'CAMPAIGN',
  MODULE: 'MODULE',
};

export class CombinedCourseItem {
  constructor({ id, title, reference, type, redirection }) {
    this.id = id;
    this.title = title;
    this.reference = reference;
    this.redirection = redirection;
    this.type = type;
  }
}
