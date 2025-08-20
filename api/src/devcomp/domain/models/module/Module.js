import { assertIsArray, assertNotNullOrUndefined } from '../../../../shared/domain/models/asserts.js';

class Module {
  constructor({ id, slug, title, isBeta, sections, details, version }) {
    assertNotNullOrUndefined(id, 'The id is required for a module');
    assertNotNullOrUndefined(slug, 'The slug is required for a module');
    assertNotNullOrUndefined(title, 'The title is required for a module');
    assertNotNullOrUndefined(isBeta, 'isBeta value is required for a module');
    assertIsArray(sections, 'A list of sections is required for a module');
    assertNotNullOrUndefined(details, 'The details are required for a module');

    this.id = id;
    this.slug = slug;
    this.title = title;
    this.isBeta = isBeta;
    this.sections = sections;
    this.details = details;
    this.version = version;
  }

  setRedirectionUrl(url) {
    this.redirectionUrl = url;
  }
}

export { Module };
