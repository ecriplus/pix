# Translations

## Context

Coupling and complexity: translation files are designed to handle
text and not application logic (especially URL application logic).
When URL application logic changes, we must avoid modifying all
translation files (the more locales there are, the more
difficult this task would become).

Dynamicity: sometimes URLs need to be dynamic (in particular
with query params that change depending on the situation, etc.).
To create these dynamic URLs it may be necessary to build them
based on different things only available at runtime
(the locale, the domain, etc.).

Separation of concerns and security: Translators should not have
to manage either URLs or HTML. They may not be familiar with these
technical concepts and can easily make mistakes leading to regressions
or security risks. Translators may want to translate HTML snippets or URLs…

## Translation process

Translations are separated by locale in dedicated files.

Teams populate the translation files using Deepl during the development
of the associated features.

When a PR is validated, all translation keys must be populated.

## Practices to follow

Prefer:

* locale-based processing rather than language-based processing
* generic handling of all locales rather than a condition for
  each locale
* self-contained and independent sentences and paragraphs

Avoid:

* putting HTML in translation files

Do not:

* put URLs in translation files

### For front-ends

Use the `urlService` available in all front-ends (Pix App, Pix Orga, Pix
Certif, Pix Admin).

Example: https://github.com/1024pix/pix/pull/10974

### For Pix API

There are far fewer translation needs in Pix API, but they do
exist for sending emails.

Note that the file
[`api/src/shared/infrastructure/utils/url-builder.js`](https://github.com/1024pix/pix/blob/dev/api/src/shared/infrastructure/utils/url-builder.js)
is available but no existing recommended solution exists yet.

## References (ADR, other docs, PRs, etc.)

* [ADR Logic and strategy for managing regional parameters and languages (locales & languages)](https://github.com/1024pix/pix/blob/dev/docs/adr/0040-locales-languages.md)
