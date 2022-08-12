// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'values'.
const { isObject, values } = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'FileValida... Remove this comment to see the full error message
const { FileValidationError, SiecleXmlImportError } = require('../../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fs'.
const fs = require('fs');
const fsPromises = fs.promises;
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const Path = require('path');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const os = require('os');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { Buffer } = require('buffer');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const StreamZip = require('node-stream-zip');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const FileType = require('file-type');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'iconv'.
const iconv = require('iconv-lite');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const sax = require('sax');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const xmlEncoding = require('xml-buffer-tostring').xmlEncoding;
/*
  https://github.com/1024pix/pix/pull/3470#discussion_r707319744
  Démonstration et explication sur https://regex101.com/r/Z0V2s7/5
  On cherche 0 ou plusieurs fois un nom de répertoire (ne commençant pas par un point, se terminant par /),
  puis un nom de fichier ne commençant pas par un point et se terminant par .xml.
 */
const VALID_FILE_NAME_REGEX = /^([^.][^/]*\/)*[^./][^/]*\.xml$/;
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../../logger');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ERRORS'.
const ERRORS = {
  INVALID_FILE: 'INVALID_FILE',
  ENCODING_NOT_SUPPORTED: 'ENCODING_NOT_SUPPORTED',
};
const DEFAULT_FILE_ENCODING = 'UTF-8';
const ZIP = 'application/zip';

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SiecleFile... Remove this comment to see the full error message
class SiecleFileStreamer {
  directory: $TSFixMe;
  encoding: $TSFixMe;
  path: $TSFixMe;
  static async create(path: $TSFixMe) {
    let filePath = path;
    let directory = undefined;
    if (await _isFileZipped(path)) {
      directory = await _createTempDir();
      filePath = await _unzipFile(directory, path);
    }
    const encoding = await _detectEncoding(filePath);
    const stream = new SiecleFileStreamer(filePath, encoding, directory);
    return stream;
  }

  constructor(path: $TSFixMe, encoding: $TSFixMe, directory: $TSFixMe) {
    this.path = path;
    this.encoding = encoding;
    this.directory = directory;
  }

  async perform(callback: $TSFixMe) {
    await this._callbackAsPromise(callback);
  }

  async _callbackAsPromise(callback: $TSFixMe) {
    return new Promise((resolve, reject) => {
      const saxStream = _getSaxStream(this.path, this.encoding, reject);
      callback(saxStream, resolve, reject);
    });
  }

  async close() {
    if (this.directory) {
      await fsPromises.rmdir(this.directory, { recursive: true });
    }
  }
}

async function _isFileZipped(path: $TSFixMe) {
  const fileType = await FileType.fromFile(path);
  return isObject(fileType) && fileType.mime === ZIP;
}
function _createTempDir() {
  const tmpDir = os.tmpdir();
  const directory = Path.join(tmpDir, 'import-siecle-');
  return fsPromises.mkdtemp(directory);
}
async function _unzipFile(directory: $TSFixMe, path: $TSFixMe) {
  const extractedFileName = Path.join(directory, 'organization-learners.xml');
  const zip = new StreamZip.async({ file: path });
  const fileName = await _getFileToExtractName(zip);
  try {
    await zip.extract(fileName, extractedFileName);
  } catch (error) {
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    throw new FileValidationError((ERRORS as $TSFixMe).INVALID_FILE);
  }
  await zip.close();
  return extractedFileName;
}

async function _getFileToExtractName(zipStream: $TSFixMe) {
  const entries = await zipStream.entries();
  const fileNames = values(entries).map((entry: $TSFixMe) => entry.name);
  const validFiles = fileNames.filter((name: $TSFixMe) => VALID_FILE_NAME_REGEX.test(name));
  if (validFiles.length != 1) {
    zipStream.close();
    logger.error({ ERROR: (ERRORS as $TSFixMe).INVALID_FILE, entries });
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    throw new FileValidationError((ERRORS as $TSFixMe).INVALID_FILE);
  }
  return validFiles[0];
}

async function _detectEncoding(path: $TSFixMe) {
  const firstLine = await _readFirstLine(path);
  return xmlEncoding(Buffer.from(firstLine)) || DEFAULT_FILE_ENCODING;
}

async function _readFirstLine(path: $TSFixMe) {
  const buffer = Buffer.alloc(128);

  try {
    const file = await fsPromises.open(path);
    await file.read(buffer, 0, 128, 0);
    file.close();
  } catch (err) {
    logger.error(err);
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    throw new FileValidationError((ERRORS as $TSFixMe).INVALID_FILE);
  }

  return buffer;
}

function _getSaxStream(path: $TSFixMe, encoding: $TSFixMe, reject: $TSFixMe) {
  let inputStream;
  try {
    inputStream = fs.createReadStream(path);
  } catch (error) {
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    reject(new FileValidationError((ERRORS as $TSFixMe).INVALID_FILE));
  }

  inputStream.on('error', (err: $TSFixMe) => {
    logger.error(err);
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    return reject(new FileValidationError((ERRORS as $TSFixMe).INVALID_FILE));
  });

  const decodeStream = getDecodingStream(encoding);
  decodeStream.on('error', (err: $TSFixMe) => {
    logger.error(err);
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    return reject(new FileValidationError((ERRORS as $TSFixMe).ENCODING_NOT_SUPPORTED));
  });

  const saxParser = sax.createStream(true);
  saxParser.on('error', (err: $TSFixMe) => {
    logger.error(err);
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    reject(new FileValidationError((ERRORS as $TSFixMe).INVALID_FILE));
  });

  return inputStream.pipe(decodeStream).pipe(saxParser);
}

function getDecodingStream(encoding: $TSFixMe) {
  try {
    return iconv.decodeStream(encoding);
  } catch (err) {
    logger.error(err);
    // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
    throw new SiecleXmlImportError((ERRORS as $TSFixMe).ENCODING_NOT_SUPPORTED);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = SiecleFileStreamer;
