const datamartBuffer = {
  objectsToInsert: [],

  pushInsertable({ tableName, values }) {
    this.objectsToInsert.push({ tableName, values });

    return values;
  },

  purge() {
    this.objectsToInsert = [];
  },
};

export { datamartBuffer };
