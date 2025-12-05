class CsvColumn {
  constructor({
    name,
    property,
    isRequired = false,
    isInteger = false,
    isDate = false,
    checkEncoding = false,
    acceptedValues = null,
    transformValues = null,
  }) {
    this.name = name;
    this.property = property;
    this.isRequired = isRequired;
    this.isInteger = isInteger;
    this.isDate = isDate;
    this.checkEncoding = checkEncoding;
    this.acceptedValues = acceptedValues;
    this.transformValues = transformValues;
  }
}

export { CsvColumn };
