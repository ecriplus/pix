# API

## Naming conventions

Classes start with an uppercase letter.
Modules and variables start with a lowercase letter.
Unless there is an exception, prefer alphabetical order when sorting a series of declarations, requires, etc.

```javascript
// BAD
const sessionRepository = require(...);
const assessmentRepository = require(...);
const certificationRepository = require(...);

// GOOD
const assessmentRepository = require(...);
const certificationRepository = require(...);
const sessionRepository = require(...);
```

Examples:

```javascript
const User = require(...);
const userRepository = ...
const userName = ...
```

A domain entity does not contain a prefix.

```javascript
const User = require('../../User');

const myUser = new User({});
```

## Route declaration

Add tags and notes when declaring API routes.

```javascript
server.route([
    {
      method: 'GET',
      path: '/api/sessions',
      config: {
        handler: sessionController.find,
        tags: ['api', 'sessions'],
        notes: [
          '- **This route is restricted to authenticated users with the Pix Master role**\n' +
          '- It allows viewing the list of all sessions (returns an array with n elements)',
        ]
      }
    }
  ]
);
```

## Configuration

### Environment options

Any API configuration option likely to depend on a particular environment (production, integration, development or test), whether functional or technical, MUST be defined in the `/api/src/shared/config.js` file.

```javascript
config.config.jsexports = (function() {

  const config = {
    
    // some options…
    
    someCategory: {
      optionA: 'valueA',
      optionB: 'valueB',
    },

    // yet other options…
    
  };
  
  return config;
})();


```

Access to an environment variable MUST NOT be performed outside of the `/api/lib/settings.config` files.

```javascript
// BAD

/* lib/plugins.js */
if (process.env.LOG_ENABLED === 'true') {
  consoleReporters.push('stdout');
}
```

```javascript
// GOOD

/* src/shared/config.js */
module.exports = (function() {
  const config = {
    logging: {
      enabled: (process.env.LOG_ENABLED === 'true'),
    },  
  };
  return config;
})();

/* lib/plugins.js */
const settings = require('./settings');
if (settings.logging.enabled) {
  consoleReporters.push('stdout');
}
```

Every environment variable MUST be defined on the relevant wiki page.

### Overriding an option per environment

Overriding an option for a dedicated environment MUST be done by modifying the value rather than instantiating a new object associated with the category, in order to enable the "default value" mechanism and avoid unnecessary code duplication.

Given the following default configuration:

```javascript
const config = {
  someCategory: {
    optionA: 'valueA',
    optionB: 'valueB',
    optionC: 'valueC',
  },
};
```


```javascript
// BAD

if (process.env.NODE_ENV === 'test') {
  config.someCategory = {
    optionA: 'test_valueA',
    optionB: 'test_valueB',
    optionC: 'test_valueC',
  };
}
```

```javascript
// GOOD

if (process.env.NODE_ENV === 'test') {
  config.someCategory.optionA = 'test_valueA';
  config.someCategory.optionB = 'test_valueB';
  config.someCategory.optionC = 'test_valueC';
}
```
  
### Enabling / disabling features

For features that can be enabled/disabled, activation MUST be managed via a boolean `enabled` option.

```javascript
// BAD

mailing: {
  enabled: !!process.env.MAILING_ENABLED,
}
```

```javascript
// GOOD

mailing: {
  enabled: (process.env.MAILING_ENABLED === 'true'),
}
```

### Categorising options

Every option SHOULD be placed in a specific category to help understand its purpose, usage or execution context.

```javascript
// BAD

const config = {
  passwordValidationPattern: '^(?=.*\\p{L})(?=.*\\d).{8,}$',
};
```

```javascript
// GOOD

const config = {
  account: {
    passwordValidationPattern: '^(?=.*\\p{L})(?=.*\\d).{8,}$',
  },
};
```


## Tests

### ♻️ Unit tests

A unit test must pass without a database.


## Feature Toggles

### 🗺️ Problem

We want to be able to deploy a feature to production (e.g. "Certification v2"),
while retaining the ability to disable it without generating a new version of
the application during the first few weeks.

For features that take a long time to develop, we sometimes also need to
ship part of the code to production without the associated feature being
visible to the user.

### 🥚 Solution

Add environment variables whose name is clearly identified
as a _feature toggle_ using the `FT_` prefix:

- `FT_ACTIVATE_CERTIFICATION_V2 = true`

In their formulation, env variables use an affirmative form:

- `FT_USE_ONLY_V1_CERTIFICATION` rather than `FT_DONT_USE_V2_CERTIFICATION`.

Their default value is preferably `false` (=> forgetting to add it
preserves the current behaviour of the application).

⚠️: it is important to remove these toggles as soon as possible, once the feature
is well established in production (see Martin Fowler's reference below).
_Feature toggles_ are not configurations we want to keep
for long; they are temporary switches.

Having a clearly identified prefix makes it possible to distinguish between
durable configuration environment variables and temporary toggle
environment variables.

⚠️: this _feature toggle_ solution should remain a last resort when we
cannot finely slice a feature. It should not become a reflex.
We only do it when we have found no better solution.

### 📖 Additional information

To test while avoiding unmanageable combinations during tests (feature A
enabled with feature B disabled, etc.), Martin Fowler
proposes testing only two cases:

1. Test with all the toggles that will actually be enabled at the
   next release
1. Test with all toggles enabled

For example, if:

- I add the toggle `FT_ACTIVATE_CERTIFICATION_V2`,
- And this toggle will be disabled at the next production deployment

Then:

1. I test with `FT_ACTIVATE_CERTIFICATION_V2=false` (and the other FTs as in production)
1. I test with `FT_ACTIVATE_CERTIFICATION_V2=true` (and all other FTs also enabled)

### References

- https://martinfowler.com/bliki/FeatureToggle.html
- https://martinfowler.com/articles/feature-toggles.html
- See an example of addition in PR #534, and removal in PR #563.
