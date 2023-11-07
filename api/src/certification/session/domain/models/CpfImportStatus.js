class CpfImportStatus {
  // Awaiting for Pix batch to generate the CPF file on OVH
  static PENDING = 'PENDING';

  // Pix generated the CPF file on OVH and can now be uploaded on CPF
  static READY_TO_SEND = 'READY_TO_SEND';

  // Pix technical error --> CPF rejected the file, it must be regenerated by Pix
  static ERROR = 'ERROR';

  // End of CPF process --> CPF recognized the user ("PassagesOK")
  static SUCCESS = 'SUCCESS';

  // End of CPF process --> CPF did not recognized the user ("PassagesKO")
  static REJECTED = 'REJECTED';
}

export { CpfImportStatus };
