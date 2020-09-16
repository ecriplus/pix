const usecases = require('../../domain/usecases');
const schoolingRegistrationSerializer = require('../../infrastructure/serializers/jsonapi/schooling-registration-user-association-serializer');

module.exports = {
  async reconcileAutomatically(request) {
    const authenticatedUserId = request.auth.credentials.userId;
    const payload = request.payload.data.attributes;
    const campaignCode = payload['campaign-code'];
    const schoolingRegistration = await usecases.reconcileUserToOrganization({ userId: authenticatedUserId, campaignCode });
    return schoolingRegistrationSerializer.serialize(schoolingRegistration);
  },

  async reconcileManually(request) {
    const authenticatedUserId = request.auth.credentials.userId;
    const payload = request.payload.data.attributes;
    const campaignCode = payload['campaign-code'];

    const reconciliationInfo = {
      id: authenticatedUserId,
      firstName: payload['first-name'],
      lastName: payload['last-name'],
      birthdate: payload['birthdate'],
      studentNumber: payload['student-number'],
    };

    const schoolingRegistration = await usecases.reconcileUserToSchoolingRegistrationData({ campaignCode, reconciliationInfo });

    return schoolingRegistrationSerializer.serialize(schoolingRegistration);
  },

  async registerSupernumeraryHigherEducationRegistration(request, h) {
    const userId = request.auth.credentials.userId;
    const payload = request.payload.data.attributes;

    const campaignCode = payload['campaign-code'];

    const userInfo = {
      userId,
      studentNumber: payload['student-number'],
      firstName: payload['first-name'],
      lastName: payload['last-name'],
      birthdate: payload['birthdate'],
    };

    await usecases.registerSupernumeraryHigherEducationRegistration({ campaignCode, userInfo });

    return h.response(null).code(204);
  },

  findAssociation(request) {
    const authenticatedUserId = request.auth.credentials.userId;
    const requestedUserId = parseInt(request.query.userId);
    const campaignCode = request.query.campaignCode;

    return usecases.findAssociationBetweenUserAndSchoolingRegistration({ authenticatedUserId, requestedUserId, campaignCode })
      .then(schoolingRegistrationSerializer.serialize);
  },

  async generateUsername(request, h) {
    const payload = request.payload.data.attributes;
    const { 'campaign-code': campaignCode } = payload;

    const studentInformation = {
      firstName: payload['first-name'],
      lastName: payload['last-name'],
      birthdate: payload['birthdate'],
    };

    const username = await usecases.generateUsername({ campaignCode, studentInformation });

    // we don't persist this ressource, we simulate response by adding the generated username
    const schoolingRegistrationWithUsernameResponse = {
      data: {
        attributes: {
          'last-name': payload['last-name'],
          'first-name': payload['first-name'],
          birthdate: payload['birthdate'],
          'campaign-code': campaignCode,
          username,
        },
        type: 'schooling-registration-user-associations',
      },
    };
    return h.response(schoolingRegistrationWithUsernameResponse).code(200);
  },

  async dissociate(request, h) {
    const payload = request.payload.data.attributes;
    const { userId } = request.auth.credentials;
    await usecases.dissociateUserFromSchoolingRegistration({ userId, schoolingRegistrationId: payload['schooling-registration-id'] });
    return h.response().code(204);
  },

  async updateStudentNumber(request, h) {
    const payload = request.payload.data.attributes;
    const { userId } = request.auth.credentials;
    const organizationId =  request.params.id;

    const student = {
      id: request.params.studentId,
      studentNumber: payload['student-number'],
    };

    await usecases.updateStudentNumber({ userId, student, organizationId });
    return h.response().code(204);
  },
};
