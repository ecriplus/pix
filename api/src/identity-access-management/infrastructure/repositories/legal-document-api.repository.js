import * as legalDocumentApi from '../../../legal-documents/application/api/legal-documents-api.js';

const acceptPixOrgaTos = async ({ userId, dependencies = { legalDocumentApi } }) => {
  return dependencies.legalDocumentApi.acceptLegalDocumentByUserId({ userId, service: 'pix-orga', type: 'TOS' });
};

const legalDocumentApiRepository = { acceptPixOrgaTos };

export { legalDocumentApiRepository };
