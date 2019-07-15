/* eslint-disable no-undef */
import nock from 'nock';
import 'regenerator-runtime/runtime';
import 'dotenv/config';

import { searchVideo } from '../src/media';
import jsonVideo from './video.json';

// increase timeout for async ops
jest.setTimeout(20000);

describe('Search from video from Youtube', () => {
  const options =
    'maxResults=1&order=relevance&safeSearch=strict&type=video&videoDuration=short';
  const search = 'sailboat';

  beforeEach(() => {
    nock('https://www.googleapis.com')
      .get(
        `/youtube/v3/search?key=${
          process.env.YOUTUBE_APIKEY
        }&part=snippet,id&q=${search}&${options}`
      )
      .reply(200, jsonVideo);
  });

  afterEach(() => {
    nock.restore();
  });

  describe('searchVideo', () => {
    test('return details of video', async () => {
      const response = await searchVideo({ search });
      expect(response.video).toHaveProperty('videoId');
      expect(response.video.videoId).toEqual('h419uWQUoow');
      expect(response.video.title).toEqual(
        'Mirror, Sailboat. (Official Music Video) ♪'
      );
      expect(response.video.thumbnail).toEqual(
        'https://i.ytimg.com/vi/h419uWQUoow/mqdefault.jpg'
      );
    });
  });
});
