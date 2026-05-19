
# Errors


## Context

### Server-side, in Pix API

The different types of errors:
* Business errors, in the `domain` layer of the Clean architecture.
* Application errors, in the `application` layer of the Clean architecture.
  These errors are intended to be returned to clients/users in a dedicated HTTP response.

Business errors can be mapped to application errors
to be returned to clients/users. But this is not mandatory.

### Client-side, in the front-ends

There is only one type of error and no mapping.


## Practices to follow

### What to favour

* Adding a `code` property and processing it client-side by `code` takes
  priority over the `status` property. Status codes should
  be reserved for the HTTP/network layers outside the application.
* Adding a `meta` property to include additional information when necessary
* A name ending with `Error` to standardise

### What to avoid

* Do not put translated text in an error.

* Do not put a `code` argument in error constructors;
  instead, create dedicated error classes each carrying a unique `code`.

  The goal is to standardise and unify error `code` values so that
  they can be handled efficiently and as consistently as possible in
  the front-ends, without having to manage as many `code` cases as there are use-cases
  in the back-end.

  Indeed, allowing a `code` to be specified in the constructor
  would suggest that, rather than inheriting the class's `code`, changing the
  `code` of an error at instantiation is good practice. However, when
  back-end errors are propagated to the front-ends, the class type is lost and
  only the `code` is preserved.

* Do not misuse HTTP status codes to discriminate between errors.

* Do not put information in `meta` that would leak
  security-sensitive information about the applications (error stacktraces
  indicating file paths on the container that could enable attacks,
  container IPs, information about found or not-found users,
  etc.).


Good:
```javascript
class AuthenticationKeyExpiredError extends DomainError {
  constructor() {
    super('This authentication key has expired.', 'EXPIRED_AUTHENTICATION_KEY');
  }
}
```

Good:
```javascript
class TagNotFoundError extends DomainError {
  constructor(meta) {
    super('Tag does not exist', 'TAG_NOT_FOUND');
    if (meta) this.meta = meta;
  }
}
```

Not good:
```javascript
class UncancellableCertificationCenterInvitation extends DomainError {
  constructor(
    message = "The invitation to this certification centre cannot be cancelled.",
    code = 'UNCANCELLABLE_CERTIFICATION_CENTER_INVITATION_CODE',
  ) {
    super(message, code);
  }
}
```

Good:

* Use `400`, `401`, `403`, `404` errors with an optional error `code`
  enabling specific handling

Not good:

* Using
  `PreconditionFailedError` (status `412`) or
  `UnprocessableEntityError` (status `422`)
  which are HTTP status codes designed specifically for HTTP and cannot
  be used in a REST context
  cf. https://en.wikipedia.org/wiki/List_of_HTTP_status_codes



## References (ADR, other docs, PRs, etc.)

* [ADR Error management in the API for clients (third-party applications, UIs, etc.) and references](https://github.com/1024pix/pix/blob/dev/docs/adr/0044-gestion-erreurs-i18n-reference.md)
* [List of HTTP status codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)
