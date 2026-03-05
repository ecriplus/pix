const deserialize = function (json) {
  const attributes = json.data.attributes;

  return {
    networkName: attributes['network-name'],
    organizationId: attributes['organization-id'],
  };
};

export { deserialize };
