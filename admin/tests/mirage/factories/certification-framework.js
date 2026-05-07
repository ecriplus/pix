import { Factory } from 'miragejs';

export default Factory.extend({
  name() {
    return this.id;
  },

  activeVersionStartDate() {
    return new Date('2024-01-01');
  },
});
