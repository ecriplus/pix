# Use-case

## Definition

A use-case:
 - is a function
 - [uses the RORO pattern](https://medium.freecodecamp.org/elegant-patterns-in-modern-javascript-roro-be01e7669cbd)
 - only requires elements from the domain
 - receives its external dependencies as parameters passed to the function

```javascript
// BAD
const myRepository = require('../../../infrastructure/repositories/myRepository');

// GOOD
const myService = require(../../../domain/services/myService);

module.exports = function myUseCase({ param1, param2, param3, repo1, repo2 }) {
  ...
};
```

## Controllers

A controller cannot call __2__ use-cases sequentially.
