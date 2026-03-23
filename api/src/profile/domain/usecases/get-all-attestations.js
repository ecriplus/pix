const getAllAttestations = async function ({ attestationRepository }) {
  return attestationRepository.findAll();
};

export { getAllAttestations };
