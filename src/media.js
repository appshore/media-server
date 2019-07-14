import got from 'got';

/**
 * Search images from flickr
 * @param {*} search
 */
const searchImages = async ({ search }) => {
  const url = 'https://www.flickr.com/services/feeds/photos_public.gne';
  const options = 'format=json&nojsoncallback=1';

  try {
    const {
      body: { items }
    } = await got(`${url}?${options}&tags=${search}`, { json: true });

    if (items) {
      return {
        images: items.slice(0, 3).map(item => {
          const {
            title,
            link,
            media: { m: thumbnail }
          } = item;
          return {
            link,
            title,
            thumbnail
          };
        })
      };
    }
    return { status: 'fail', message: 'No image' };
  } catch (err) {
    return { status: 'error', message: 'Error images provider' };
  }
};

/**
 * Search videos from youtube
 * @param {*} search
 */
const searchVideo = async ({ search }) => {
  const url = 'https://www.googleapis.com/youtube/v3/search';
  const options =
    'maxResults=1&order=relevance&safeSearch=strict&type=video&videoDuration=short';

  try {
    const {
      body: { items }
    } = await got(
      `${url}?key=${
        process.env.YOUTUBE_APIKEY
      }&part=snippet,id&q=${search}&${options}`,
      {
        json: true
      }
    );

    if (items) {
      return {
        video: items.map(item => {
          const {
            id: { videoId },
            snippet: {
              title,
              thumbnails: {
                medium: { url: thumbnail }
              }
            }
          } = item;
          return {
            videoId,
            title,
            thumbnail
          };
        })
      };
    }
    return { status: 'fail', message: 'No video' };
  } catch (err) {
    return { status: 'error', message: 'Error video provider' };
  }
};

/**
 * Retrieve media (images and video) according input search
 * @param {*} search
 */
const getMedia = async ({ search }) => {
  // run searches concurrently
  const result = await Promise.all([searchImages({ search }), searchVideo({ search })]);
  return {
    ...result[0],
    ...result[1]
  };
};

export default getMedia;
