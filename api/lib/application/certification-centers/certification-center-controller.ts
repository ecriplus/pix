// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'usecases'.
const usecases = require('../../domain/usecases');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const certificationCenterSerializer = require('../../infrastructure/serializers/jsonapi/certification-center-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'certificat... Remove this comment to see the full error message
const certificationCenterMembershipSerializer = require('../../infrastructure/serializers/jsonapi/certification-center-membership-serializer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'divisionSe... Remove this comment to see the full error message
const divisionSerializer = require('../../infrastructure/serializers/jsonapi/division-serializer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const studentCertificationSerializer = require('../../infrastructure/serializers/jsonapi/student-certification-serializer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const sessionSummarySerializer = require('../../infrastructure/serializers/jsonapi/session-summary-serializer');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'queryParam... Remove this comment to see the full error message
const queryParamsUtils = require('../../infrastructure/utils/query-params-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'map'.
const map = require('lodash/map');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async create(request: $TSFixMe) {
    const certificationCenter = certificationCenterSerializer.deserialize(request.payload);
    const complementaryCertificationIds = map(request.payload.data.relationships?.habilitations?.data, 'id');
    const createdCertificationCenter = await usecases.createCertificationCenter({
      certificationCenter,
      complementaryCertificationIds,
    });
    return certificationCenterSerializer.serialize(createdCertificationCenter);
  },

  async update(request: $TSFixMe) {
    const certificationCenter = certificationCenterSerializer.deserialize(request.payload);
    const complementaryCertificationIds = map(request.payload.data.relationships?.habilitations?.data, 'id');
    const updatedCertificationCenter = await usecases.updateCertificationCenter({
      certificationCenter,
      complementaryCertificationIds,
    });
    return certificationCenterSerializer.serialize(updatedCertificationCenter);
  },

  getById(request: $TSFixMe) {
    const certificationCenterId = request.params.id;
    return usecases.getCertificationCenter({ id: certificationCenterId }).then(certificationCenterSerializer.serialize);
  },

  async findPaginatedFilteredCertificationCenters(request: $TSFixMe) {
    const options = queryParamsUtils.extractParameters(request.query);
    const { models: organizations, pagination } = await usecases.findPaginatedFilteredCertificationCenters({
      filter: options.filter,
      page: options.page,
    });

    return certificationCenterSerializer.serialize(organizations, pagination);
  },

  async findPaginatedSessionSummaries(request: $TSFixMe) {
    const certificationCenterId = request.params.id;
    const userId = request.auth.credentials.userId;
    const options = queryParamsUtils.extractParameters(request.query);

    const { models: sessionSummaries, meta } = await usecases.findPaginatedCertificationCenterSessionSummaries({
      userId,
      certificationCenterId,
      page: options.page,
    });

    return sessionSummarySerializer.serialize(sessionSummaries, meta);
  },

  async getStudents(request: $TSFixMe) {
    const certificationCenterId = request.params.certificationCenterId;
    const sessionId = request.params.sessionId;

    const { filter, page } = queryParamsUtils.extractParameters(request.query);
    if (filter.divisions && !Array.isArray(filter.divisions)) {
      filter.divisions = [filter.divisions];
    }

    const { data, pagination } = await usecases.findStudentsForEnrollment({
      certificationCenterId,
      sessionId,
      page,
      filter,
    });
    return studentCertificationSerializer.serialize(data, pagination);
  },

  async getDivisions(request: $TSFixMe) {
    const certificationCenterId = request.params.certificationCenterId;
    const divisions = await usecases.findDivisionsByCertificationCenter({
      certificationCenterId,
    });

    return divisionSerializer.serialize(divisions);
  },

  async findCertificationCenterMembershipsByCertificationCenter(request: $TSFixMe) {
    const certificationCenterId = request.params.certificationCenterId;
    const certificationCenterMemberships = await usecases.findCertificationCenterMembershipsByCertificationCenter({
      certificationCenterId,
    });

    return certificationCenterMembershipSerializer.serialize(certificationCenterMemberships);
  },

  async findCertificationCenterMemberships(request: $TSFixMe) {
    const certificationCenterId = request.params.certificationCenterId;
    const certificationCenterMemberships = await usecases.findCertificationCenterMembershipsByCertificationCenter({
      certificationCenterId,
    });

    return certificationCenterMembershipSerializer.serializeMembers(certificationCenterMemberships);
  },

  async createCertificationCenterMembershipByEmail(request: $TSFixMe, h: $TSFixMe) {
    const certificationCenterId = request.params.certificationCenterId;
    const { email } = request.payload;

    const certificationCenterMembership = await usecases.createCertificationCenterMembershipByEmail({
      certificationCenterId,
      email,
    });
    return h.response(certificationCenterMembershipSerializer.serialize(certificationCenterMembership)).created();
  },
};
