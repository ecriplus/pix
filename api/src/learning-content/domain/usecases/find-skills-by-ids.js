export function findSkillsByIds({ ids, sharedSkillRepository }) {
  return sharedSkillRepository.findByRecordIds(ids);
}
