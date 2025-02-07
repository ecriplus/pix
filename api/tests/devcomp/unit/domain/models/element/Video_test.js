import { Video } from '../../../../../../src/devcomp/domain/models/element/Video.js';
import { expect } from '../../../../../test-helper.js';

describe('Unit | Devcomp | Domain | Models | Element | Video', function () {
  describe('#constructor', function () {
    it('should create a video and keep attributes', function () {
      // when
      const image = new Video({
        id: 'id',
        title: 'title',
        url: 'url',
        subtitles: 'subtitles',
        transcription: 'transcription',
      });

      // then
      expect(image.id).to.equal('id');
      expect(image.type).to.equal('video');
      expect(image.title).to.equal('title');
      expect(image.url).to.equal('url');
      expect(image.subtitles).to.equal('subtitles');
      expect(image.transcription).to.equal('transcription');
    });
  });

  describe('An video without id', function () {
    it('should throw an error', function () {
      expect(() => new Video({})).to.throw('The id is required for an element');
    });
  });

  describe('An video without a title', function () {
    it('should throw an error', function () {
      expect(() => new Video({ id: 'id' })).to.throw('The title is required for a video');
    });
  });

  describe('An image without a url', function () {
    it('should throw an error', function () {
      expect(() => new Video({ id: 'id', title: 'title' })).to.throw('The URL is required for a video');
    });
  });

  describe('A video without subtitles', function () {
    it('should throw an error', function () {
      expect(() => new Video({ id: 'id', title: 'title', url: 'url' })).to.throw(
        'The subtitles are required for a video',
      );
    });
  });

  describe('A video without a transcription', function () {
    it('should throw an error', function () {
      expect(() => new Video({ id: 'id', title: 'title', url: 'url', subtitles: 'subtitles' })).to.throw(
        'The transcription is required for a video',
      );
    });
  });
});
