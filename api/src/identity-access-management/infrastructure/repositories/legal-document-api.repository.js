import * as legalDocumentApi from '../../../legal-documents/application/api/legal-documents-api.js';

const acceptPixOrgaTos = async ({ userId, dependencies = { legalDocumentApi } }) => {
  return dependencies.legalDocumentApi.acceptLegalDocumentByUserId({ userId, service: 'pix-orga', type: 'TOS' });
};

const acceptPixAppTos = async ({ userId, dependencies = { legalDocumentApi } }) => {
  return dependencies.legalDocumentApi.acceptLegalDocumentByUserId({ userId, service: 'pix-app', type: 'TOS' });
};

const legalDocumentApiRepository = { acceptPixAppTos, acceptPixOrgaTos };

export { legalDocumentApiRepository };
