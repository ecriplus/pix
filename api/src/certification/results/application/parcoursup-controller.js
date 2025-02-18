import { usecases } from '../domain/usecases/index.js';

const getCertificationResultForParcoursup = async function (request) {
  const { ine, organizationUai, lastName, firstName, birthdate, verificationCode } = request.payload;

  return usecases.getCertificationResultForParcoursup({
    ine,
    organizationUai,
    lastName,
    firstName,
    birthdate,
    verificationCode,
  });
};

export const parcoursupController = {
  getCertificationResultForParcoursup,
};
