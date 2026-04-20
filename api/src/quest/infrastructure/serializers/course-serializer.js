import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

const serialize = function (courseItems) {
  return new Serializer('courses', {
    attributes: ['name', 'type', 'nbTubes', 'nbModules', 'category', 'isSimplifiedAccess', 'areas', 'competences'],
  }).serialize(courseItems);
};

export { serialize };
