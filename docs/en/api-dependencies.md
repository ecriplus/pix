# Injecting dependencies in the API

This guide was created for the [ADR on the subject](./adr/0046-injecter-les-dependances-api.md).
To separate the different layers and ensure their testability, dependencies are injected as much as possible.
In most cases, dependencies are injected as parameters of the called function.

Depending on the layer, injection is:

- automatic, following the parameter signature;
- manual.

There are two cases where dependencies are not injected:

- use-cases (domain layer) are not injected into controllers (application layer);
- controllers (application layer) are not injected into routers (application layer), because the
  HapiJs framework does not allow it.

Below you will find examples to follow for each case.

## Dependency injections

### Injecting infrastructure (repository, services) into the use-case (domain layer)

The `attachTargetProfilesToOrganization` use-case depends on the `targetProfileShareRepository` repository.

#### Implementation

```js
module.exports = async function attachTargetProfilesToOrganization({
                                                                     organizationId,
                                                                     targetProfileIds,
                                                                     targetProfileRepository,
                                                                     targetProfileShareRepository,
                                                                   }) {
```

Declare the component and its dependencies in the [directory file](../../api/lib/domain/usecases/index.js).

Use the [automatic injection](../api/src/shared/infrastructure/utils/dependency-injection.js) of dependencies by
using JS object parameters.

#### Unit test

Test the repository call from the use-case.

```js
// given
const targetProfileShareRepository = {
  addTargetProfilesToOrganization: sinon.stub(),
};
targetProfileShareRepository.addTargetProfilesToOrganization.resolves();

// when
await attachTargetProfilesToOrganization({
  organizationId,
  targetProfileIds,
  targetProfileRepository,
  targetProfileShareRepository,
});

// then
expect(targetProfileShareRepository.addTargetProfilesToOrganization).to.have.been.calledWithExactly({
  organizationId,
  targetProfileIdList: uniqTargetProfileIds,
});
```

### Injecting services into the application and infrastructure layers

The `findPaginatedTrainings` controller depends on the `extractParameters` service.

#### Implementation

```js
  async
findPaginatedTrainings(request, h, dependencies = { queryParamsUtils, trainingSummarySerializer })
{
  const { page } = dependencies.queryParamsUtils.extractParameters(request.query);
```

#### Unit test

Test the service call from the controller.

```js
// given
const queryParamsUtils = {
  extractParameters: sinon.stub().returns(useCaseParameters),
};

// when
const response = await targetProfileController.findPaginatedTrainings(
  {
    params: {
      id: targetProfileId,
      page: { size: 2, number: 1 },
    },
  },
  hFake,
  { trainingSummarySerializer, queryParamsUtils }
);

// then
expect(queryParamsUtils.extractParameters).to.have.been.calledOnce;
```

## Importing dependencies

### Importing the use-case (domain layer) from the controller (application layer)

The `attachTargetProfilesToOrganization` use-case is called by the `account-recovery-controller` controller.

#### Implementation

Import the use-case from the directory file.
Call the use-case without its dependencies.

```js
const usecases = require('../../domain/usecases/index.js');

module.exports = {
  async sendEmailForAccountRecovery(request, h) {
    const studentInformation = await studentInformationForAccountRecoverySerializer.deserialize(request.payload);
    await usecases.sendEmailForAccountRecovery({ studentInformation });
```

#### Unit test

Test the use-case call from the controller.

```js
// given
sinon.stub(usecases, 'sendEmailForAccountRecovery').resolves();

// when
const response = await accountRecoveryController.sendEmailForAccountRecovery(request, hFake);

// then
expect(usecases.sendEmailForAccountRecovery).calledWith({ studentInformation });
```

### Importing the controller from the router

The `admin-member` router calls the `adminMemberController` controller.
Since the HapiJs HTTP server does not allow dependency injection, the controller is exported in a wrapper.

#### Implementation

Controller

```js
const adminMemberController = {
  findAll,
  getCurrentAdminMember,
  updateAdminMember,
  deactivateAdminMember,
  saveAdminMember,
};
export { adminMemberController };
```

Router

```js
  method: 'GET',
  path
:
'/api/admin/admin-members/me',
  config
:
{
  handler: adminMemberController.getCurrentAdminMember,
```

#### Unit test

Test the controller call from the router.

```js
// given
sinon.stub(adminMemberController, 'getCurrentAdminMember').returns(adminMember);

// when
const { statusCode } = await httpTestServer.request('GET', '/api/admin/admin-members/me');

// then
expect(adminMemberController.getCurrentAdminMember).to.have.been.called;
```
