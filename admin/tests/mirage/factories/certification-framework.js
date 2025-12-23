import { Factory } from 'miragejs';

export default Factory.extend({
  name() {
    const nameMap = {
      CORE: 'Pix',
      DROIT: 'Pix+ Droit',
      EDU_1ER_DEGRE: 'Pix+ Edu 1er degré',
      EDU_2ND_DEGRE: 'Pix+ Edu 2nd degré',
      EDU_CPE: 'Pix+ Edu CPE',
      PRO_SANTE: 'Pix+ Pro Santé',
      CLEA: 'CléA Numérique',
    };
    return nameMap[this.id] || 'Pix';
  },

  activeVersionStartDate() {
    return new Date('2024-01-01');
  },
});
