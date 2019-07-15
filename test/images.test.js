/* eslint-disable no-undef */
import nock from 'nock';
import 'regenerator-runtime/runtime';
import 'dotenv/config';

import { searchImages } from '../src/media';
import jsonImages from './images.json';

// increase timeout for async ops
jest.setTimeout(20000);

describe('Search from images from Flickr', () => {
  const options = 'format=json&nojsoncallback=1';
  const search = 'bicycle';

  beforeEach(() => {
    nock('https://www.flickr.com')
      .get(`/services/feeds/photos_public.gne?${options}&tags=${search}`)
      .reply(200, jsonImages);
  });

  afterEach(() => {
    nock.restore();
  });

  describe('searchImages', () => {
    test('return array of 3 images', async () => {
      const response = await searchImages({ search });
      expect(response.images.length).toEqual(3);
      expect(response.images[0]).toHaveProperty('link');
      expect(response.images[0].link).toEqual(
        'https://www.flickr.com/photos/151160468@N08/48287495237/'
      );
      expect(response.images[0].title).toEqual(
        'The Power of Pink'
      );
      expect(response.images[0].thumbnail).toEqual(
        'https://live.staticflickr.com/65535/48287495237_1eefcdbc3f_m.jpg'
      );
    });
  });
});
