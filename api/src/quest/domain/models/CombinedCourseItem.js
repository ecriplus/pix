export const ITEM_TYPE = {
  CAMPAIGN: 'CAMPAIGN',
  MODULE: 'MODULE',
};

export class CombinedCourseItem {
  constructor({ id, title, reference, type }) {
    this.id = id;
    this.title = title;
    this.reference = reference;
    this.type = type;
  }
}
