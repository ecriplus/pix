## Introduction
This document gathers observed and consensus practices, in order to facilitate development and in particular code reviews.
Its goal is not to impose a practice, but to capitalise on good practices.

Favour in this document:
- the motivation behind choices
- the use of examples

## General

### Vocabulary ###
Here:
* **object** does not refer to object-oriented programming
* **component** does not refer to an Ember component.

They are synonyms for what is being tested (see: [SUT](https://en.wikipedia.org/wiki/System_under_test))

Objects used to test in isolation are called test doubles (see: [test double](https://martinfowler.com/bliki/TestDouble.html)).
They include mocks, stubs, spies, fakes, and dummies.
 
### Test types ###

| Test type     | Abbr | What is verified |
| ------------- |------| -----------------|
| unit          | UT   | the behaviour of a code unit (function or method) in isolation (e.g. no DB call) |
| integration   | IT   | the result of the interaction of N code units (components) in a configuration close to production (e.g. DB, Redis, Nock) |
| acceptance    | AT   | the functioning of an application (e.g. Pix App, Pix API) limiting doubles to what we do not control (e.g. Airtable) |
| end-to-end    | E2E  | the functioning of the platform (traversing all front and back layers) |

Integration, acceptance and end-to-end tests verify the interaction of components at increasingly high levels, the last one being the complete Information System.

The advantages/disadvantages of each test type and their distribution are described by the [test pyramid](https://martinfowler.com/bliki/TestPyramid.html)
 
### Test boundaries ###
Do not test dependencies outside the relevant Git repository (e.g. from the pix repository, do not test pix-ui or mocha).
These libraries or frameworks are chosen in such a way that we can trust them; they are tested in their own repository.
However, test the integration of these dependencies in the code, in particular wrappers.

## Back - API

### Test type by object ###

| Container      | Object                 | Test type      |
| ---------------|------------------------|----------------|
| application    | route                  | integration    |
|                | controller             | unit           |
|________________|________________________|________________|
| domain         | events                 | unit           |
|                | models                 | unit           |
|                | read-model             | unit           |
|                | service                | unit           |
|                | use-case               | unit ?         |
|                | use-case               | integration ?  |
|                | validator              | integration    |
|________________|________________________|________________|
| infrastructure | repository             | integration    |
|                | serializer             | unit           |
|                | _wrapper_              | integration    |
|                | others                 | unit           |

_wrapper_: any component that wraps a dependency or an API
* SendinblueProvider.js
* airtable.js
* RedisClient.js



Example:
```javascript
it('should add a row in the table "organizations"', async () => {
      // given
      const nbOrganizationsBeforeCreation = await BookshelfOrganization.count();

      // when
      await organizationRepository.create(domainBuilder.buildOrganization());

      // then
      const nbOrganizationsAfterCreation = await BookshelfOrganization.count();
      expect(nbOrganizationsAfterCreation).to.equal(nbOrganizationsBeforeCreation + 1);
    });
```

### Unit
Example:
* use-case [here](https://github.com/1024pix/pix/blob/dev/api/tests/unit/domain/usecases/update-expired-password.usecase.test.js)
* component with a service, not stubbed [here](https://github.com/1024pix/pix/blob/1a582f93335925e122a6ef83b06644ea44477aa0/api/tests/unit/domain/models/CampaignTubeRecommendation_test.js)

### Integration
Using Bookshelf, Knex, Nock to make assertions is allowed.
Example:
* between HAPI and route configuration [here](https://github.com/1024pix/pix/blob/dev/api/tests/integration/application/passwords/index_test.js)

### Acceptance
Example:
* on the application: [here](https://github.com/1024pix/pix/blob/dev/api/tests/acceptance/application/password-controller_test.js)

## Front

### General
In line with [Ember recommendations](https://guides.emberjs.com/release/testing/test-types/)

### Test type by component ###

| Object        | Test type      |
| ------------- |----------------|
| route         | unit           |
| route         | acceptance     |
| controller    | unit           |
| component     | integration    |
|               | (rendering)    |
| model         | unit           |
| serializer    | unit           |
| adapter       | unit           |
| helper        | unit           |
| authenticator | unit           |

### Tracked properties
They are unit-tested, regardless of their nature (component, controller, route)

## End-to-end
Reason: avoid manual, lengthy and repetitive non-regression tests
