import _ from 'lodash';
import axios from 'axios';
import * as yup from 'yup';
import parse from './parser';
import declareWatchedState from './view';

const validate = (fields, feedsIds) => {
  const schema = yup.string()
    .url()
    .notOneOf(feedsIds).required();
  try {
    schema.validateSync(fields, { abortEarly: false });

    return null;
  } catch (e) {
    return e.errors[0].key;
  }
};

const startApp = (i18nextInstance) => {
  const defaultState = {
    form: {
      fields: {
        url: null,
      },
      processState: 'filling',
      valid: true,
      error: null,
    },
    feeds: [],
    posts: [],
    activePostId: null,
    watchedPostsIds: new Set([]),
  };

  const form = document.querySelector('.rss-form');
  const feeds = document.querySelector('.feeds');
  const posts = document.querySelector('.posts');
  const input = document.querySelector('#url-input');

  const elements = {
    form,
    feeds,
    posts,
    input,
  };

  const addIdToPost = (id) => (post) => ({ ...post, feedId: id });

  const makeFeed = (url, parsedData) => ({
    id: url,
    title: parsedData.title,
    description: parsedData.description,
  });

  const watchedState = declareWatchedState(defaultState, elements, i18nextInstance);

  const buildUrl = (link) => {
    const url = new URL('get', 'https://hexlet-allorigins.herokuapp.com/');
    url.searchParams.set('disableCache', true);
    url.searchParams.set('url', link);
    return url.toString();
  };

  const fetchNewPosts = (stat) => {
    if (stat.feeds.length > 0) {
      const feedsUrls = stat.feeds.map(({ id }) => buildUrl(id));
      const promises = feedsUrls.map((res) => axios.get(res));
      Promise.allSettled(promises).then((responses) => {
        responses.forEach((response, index) => {
          const newFeed = parse(response.value.data.contents);
          const oldFeed = watchedState.feeds[index];
          const oldPosts = watchedState.posts.filter(({ feedId }) => feedId === oldFeed.id);
          const newPosts = _.differenceBy(newFeed.posts, oldPosts, 'link').map(addIdToPost(oldFeed.id));
          watchedState.posts = defaultState.posts.concat(newPosts);
        });
      });
    }
    setTimeout(() => fetchNewPosts(stat), 5000);
  };

  input.addEventListener('input', () => {
    watchedState.form.processState = 'filling';
  });

  posts.addEventListener('click', (event) => {
    if (event.target.dataset.id) {
      watchedState.activePostId = event.target.dataset.id;
      watchedState.watchedPostsIds.add(event.target.dataset.id);
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.form.valid = true;
    const formData = new FormData(e.target);
    const validateStatus = validate(formData.get('url').toLowerCase().trim(), watchedState.feeds.map((feed) => feed.id));
    if (validateStatus === null) {
      watchedState.form.processState = 'processing';
    } else {
      watchedState.form.error = validateStatus;
      watchedState.form.valid = false;
      watchedState.form.processState = 'filling';
      return;
    }
    axios.get(buildUrl(formData.get('url')))
      .then((response) => response.data)
      .then((data) => {
        const parsedData = parse(data.contents);
        const feed = makeFeed(formData.get('url'), parsedData);
        watchedState.feeds.push(feed);
        const feedPosts = parsedData.posts.map(addIdToPost(feed.id));
        watchedState.posts.push(...feedPosts);
        watchedState.form.processState = 'finished';
        watchedState.form.valid = true;
      }).catch((err) => {
        if (err.type === 'Parser Error') {
          watchedState.form.error = 'parseError';
          watchedState.form.processState = 'filling';
          watchedState.form.valid = false;
        } else if (err.request) {
          watchedState.form.error = 'netError';
          watchedState.form.processState = 'filling';
          watchedState.form.valid = false;
        } else {
          console.log(err.message);
        }
      });
  });

  fetchNewPosts(watchedState);
};

export default startApp;
